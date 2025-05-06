from typing import Dict, Any, List
from .base_agent import BaseAgent
from tools import TwitterTool, InstagramTool, YouTubeTool, TikTokTool

class SocialPostingAgent(BaseAgent):
    """Agent for social media posting"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {
            'twitter': TwitterTool(self.config),
            'instagram': InstagramTool(self.config),
            'youtube': YouTubeTool(self.config),
            'tiktok': TikTokTool(self.config)
        }

    async def post_content(self, content: Dict[str, Any]) -> Dict[str, str]:
        """Post content to specified platforms"""
        try:
            results = {}
            
            # Process each platform specified in content
            if 'twitter' in content:
                tweet_data = content['twitter']
                post_id = await self.tools['twitter'].post_tweet(
                    tweet_data['content'],
                    tweet_data.get('media_urls'),
                    tweet_data.get('thread', False)
                )
                results['twitter'] = post_id

            if 'instagram' in content:
                insta_data = content['instagram']
                post_id = await self.tools['instagram'].post_content(insta_data)
                results['instagram'] = post_id

            if 'tiktok' in content:
                tiktok_data = content['tiktok']
                video_id = await self.tools['tiktok'].post_video(
                    tiktok_data['video_path'],
                    tiktok_data['description']
                )
                results['tiktok'] = video_id

            if 'youtube' in content:
                youtube_data = content['youtube']
                video_id = await self.tools['youtube'].upload_video(
                    youtube_data['video_path'],
                    youtube_data['title'],
                    youtube_data['description']
                )
                results['youtube'] = video_id

            self.logger.info(f"Posted content to platforms: {list(results.keys())}")
            return results

        except Exception as e:
            await self.handle_error(e)
            return {}

    async def run(self) -> None:
        """Regular check for scheduled posts"""
        try:
            # Implementation for scheduled posting would go here
            pass
        except Exception as e:
            await self.handle_error(e) 