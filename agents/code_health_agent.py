from typing import Dict, Any
from .base_agent import BaseAgent
from tools import TestRunnerTool, LinterTool, GitHubTool, SlackTool, LogMonitorTool

class CodeHealthAgent(BaseAgent):
    """Agent for monitoring code health"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {
            'test_runner': TestRunnerTool(self.config),
            'linter': LinterTool(self.config),
            'github': GitHubTool(self.config),
            'slack': SlackTool(self.config),
            'log_monitor': LogMonitorTool(self.config)
        }

    async def handle_push(self, push_data: Dict[str, Any]) -> None:
        """Handle GitHub push webhook"""
        try:
            # Run tests
            test_results = await self.tools['test_runner'].run_tests()
            
            # Run linter
            lint_results = await self.tools['linter'].run_linter()

            if not test_results['success'] or not lint_results['success']:
                # Create GitHub issue
                await self.tools['github'].create_issue(
                    title="CI Checks Failed",
                    body=f"Test Results: {test_results}\nLint Results: {lint_results}"
                )
                
                # Send Slack notification
                await self.tools['slack'].send_notification(
                    "CI checks failed! Check GitHub for details."
                )
        except Exception as e:
            await self.handle_error(e)

    async def run(self) -> None:
        """Hourly health check"""
        try:
            # Monitor logs
            logs = await self.tools['log_monitor'].get_recent_logs()
            if logs:
                await self.tools['github'].create_issue(
                    title="New Log Issues Detected",
                    body=f"Log Issues: {logs}"
                )
        except Exception as e:
            await self.handle_error(e) 