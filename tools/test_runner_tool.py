from typing import Dict, Any
import asyncio
import subprocess
import logging

class TestRunnerTool:
    def __init__(self, config: Dict[str, Any]):
        self.test_command = config.get('test_command', 'pytest')
        self.logger = logging.getLogger(__name__)
        
    async def run_tests(self) -> Dict[str, Any]:
        """Run test suite"""
        process = await asyncio.create_subprocess_shell(
            self.test_command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        
        return {
            'success': process.returncode == 0,
            'output': stdout.decode(),
            'errors': stderr.decode()
        } 