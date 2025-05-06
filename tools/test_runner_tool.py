from typing import Dict, Any
import asyncio
import subprocess
import logging

class TestRunnerTool:
    """Tool for running tests"""
    def __init__(self, config: Dict[str, Any]):
        self.test_config = config.get('test', {})
        self.logger = logging.getLogger(__name__)

    async def run_tests(self, test_path: str = None) -> Dict[str, Any]:
        """Run test suite"""
        try:
            cmd = ['pytest']
            if test_path:
                cmd.append(test_path)
                
            process = await asyncio.create_subprocess_shell(
                ' '.join(cmd),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            return {
                'success': process.returncode == 0,
                'output': stdout.decode(),
                'errors': stderr.decode()
            }
        except Exception as e:
            self.logger.error(f"Error running tests: {str(e)}")
            return {
                'success': False,
                'output': '',
                'errors': str(e)
            } 