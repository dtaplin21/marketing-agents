from typing import Dict, Any
from .base import Agent

class CodeHealthAgent(Agent):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(
            name="code_health",
            tools=["test_runner_tool", "linter_tool", "github_tool", 
                  "slack_tool", "log_monitor_tool"],
            config=config
        )
        self.tools = {}

    async def _execute(self) -> None:
        """Monitor code health"""
        try:
            # Check logs for errors
            logs = await self.tools["log_monitor_tool"].get_recent_logs()
            issues = await self.analyze_logs(logs)
            
            if issues:
                await self.create_github_issues(issues)
                await self.send_slack_alerts(issues)
            
        except Exception as e:
            self.logger.error(f"Error in code health monitoring: {str(e)}")
            raise

    async def handle_push(self, push_data: Dict[str, Any]) -> None:
        """Handle GitHub push events"""
        try:
            # Run tests
            test_results = await self.tools["test_runner_tool"].run_tests()
            
            # Run linter
            lint_results = await self.tools["linter_tool"].run_linter()
            
            if not test_results.success or not lint_results.success:
                await self.create_issue_pr(test_results, lint_results)
                await self.send_slack_notification("CI checks failed")
                
        except Exception as e:
            self.logger.error(f"Error handling push: {str(e)}")
            raise 