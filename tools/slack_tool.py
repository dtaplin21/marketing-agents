from typing import Dict, Any
import aiohttp
import logging

class SlackTool:
    """Tool for Slack interactions"""
    def __init__(self):
        pass

    def __init__(self, config: Dict[str, Any]):
        self.webhook_url = config.get('slack_webhook_url')
        self.logger = logging.getLogger(__name__)

    async def send_notification(self, message: str, channel: str = None) -> bool:
        """Send Slack notification"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    'text': message,
                    'channel': channel
                }
                async with session.post(self.webhook_url, json=payload) as response:
                    return response.status == 200
        except Exception as e:
            self.logger.error(f"Error sending Slack notification: {str(e)}")
            return False 