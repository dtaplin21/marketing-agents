from typing import Dict, Any
from .base import Agent

class ContentCreationAgent(Agent):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(
            name="content_creation",
            tools=["responses_api_tool"],
            config=config
        )
        self.responses_api = None

    async def _execute(self) -> None:
        """Generate social media content"""
        try:
            platforms = {
                'twitter': {'max_length': 280, 'type': 'thread'},
                'instagram': {'max_length': 2200, 'type': 'caption'},
                'tiktok': {'max_length': 150, 'type': 'script'}
            }
            
            content = {}
            for platform, specs in platforms.items():
                content[platform] = await self.responses_api.generate_post(
                    platform=platform,
                    max_length=specs['max_length'],
                    content_type=specs['type']
                )
            
            # Save generated content for review
            await self.store_content_for_approval(content)
            
        except Exception as e:
            self.logger.error(f"Error in content creation: {str(e)}")
            raise 