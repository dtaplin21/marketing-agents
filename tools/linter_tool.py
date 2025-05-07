from typing import Dict, Any
import asyncio
import subprocess
import logging

class LinterTool:
    """Tool for code linting operations"""
    def __init__(self, config):                       # ← Changed: added config param
        self.config = config                          # ← Added: store config for future use
        self.logger = logging.getLogger(__name__)     # ← Added: logger for error reporting
        # You can access linter-specific settings via self.config.linter if available

    async def run_linter(self) -> Dict[str, Any]:
        """Run code linter"""
        try:
            cmd = 'flake8'
            # ← Added: optionally use custom config path from self.config
            # if hasattr(self.config, 'linter_config_path'):
            #     cmd += f" --config {self.config.linter_config_path}"

            process = await asyncio.create_subprocess_shell(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            return {
                'success': process.returncode == 0,
                'violations': stdout.decode(),
                'errors': stderr.decode()
            }
        except Exception as e:
            self.logger.error(f"Error running linter: {e}")  # ← Changed: use logger instead of missing logger
            raise

# from typing import Dict, Any
# import asyncio
# import subprocess
# import logging

# class LinterTool:
#     """Tool for code linting operations"""
#     def __init__(self, config):
#         pass

#     async def run_linter(self) -> Dict[str, Any]:
#         """Run code linter"""
#         try:
#             process = await asyncio.create_subprocess_shell(
#                 'flake8',
#                 stdout=subprocess.PIPE,
#                 stderr=subprocess.PIPE
#             )
#             stdout, stderr = await process.communicate()

#             return {
#                 'success': process.returncode == 0,
#                 'violations': stdout.decode(),
#                 'errors': stderr.decode()
#             }
#         except Exception as e:
#             self.logger.error(f"Error running linter: {str(e)}")
#             raise 