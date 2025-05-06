from typing import Dict, Any, List
from .base_agent import BaseAgent
from tools import TwitterTool, InstagramTool, YouTubeTool, TikTokTool, CRMTool, AnalyticsAPITool

class SocialPostingAgent(BaseAgent):
    """Agent for demographic-aware social media posting"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {
            'twitter': TwitterTool(self.config),
            'instagram': InstagramTool(self.config),
            'youtube': YouTubeTool(self.config),
            'tiktok': TikTokTool(self.config),
            'crm': CRMTool(self.config),
            'analytics': AnalyticsAPITool(self.config)
        }

    async def post_content(self, content: Dict[str, Any], product_id: str = None) -> Dict[str, str]:
        """Post content to specified platforms with demographic targeting"""
        try:
            # Get demographic data if product_id is provided
            demographic_data = await self._get_demographic_data(product_id) if product_id else {}
            results = {}
            
            for platform in content.keys():
                # Optimize content for platform demographics
                optimized_content = await self._optimize_for_demographics(
                    platform,
                    content[platform],
                    demographic_data
                )
                
                if platform == 'twitter':
                    post_id = await self._post_to_twitter(optimized_content)
                    results['twitter'] = post_id
                elif platform == 'instagram':
                    post_id = await self._post_to_instagram(optimized_content)
                    results['instagram'] = post_id
                elif platform == 'tiktok':
                    post_id = await self._post_to_tiktok(optimized_content)
                    results['tiktok'] = post_id
                elif platform == 'youtube':
                    post_id = await self._post_to_youtube(optimized_content)
                    results['youtube'] = post_id

            self.logger.info(f"Posted demographic-optimized content to: {list(results.keys())}")
            return results

        except Exception as e:
            await self.handle_error(e)
            return {}

    async def _get_demographic_data(self, product_id: str) -> Dict[str, Any]:
        """Get demographic data for product"""
        try:
            # Get customer segments from CRM
            customer_data = await self.tools['crm'].get_all_customers()
            product_customers = [c for c in customer_data if product_id in c.get('purchases', [])]
            
            # Get platform analytics
            analytics = await self.tools['analytics'].get_daily_metrics()
            
            return {
                'age_groups': self._analyze_age_groups(product_customers),
                'locations': self._analyze_locations(product_customers),
                'interests': self._analyze_interests(product_customers),
                'platform_engagement': analytics.get('platform_engagement', {})
            }
        except Exception as e:
            self.logger.error(f"Error getting demographic data: {str(e)}")
            return {}

    async def _optimize_for_demographics(
        self,
        platform: str,
        content: Dict[str, Any],
        demographics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Optimize content for platform and demographics"""
        optimized = content.copy()
        
        if platform == 'tiktok':
            # Optimize for younger demographics (Gen Z)
            optimized['description'] = self._adapt_tone_for_genz(content['description'])
            optimized['hashtags'] = self._get_trending_hashtags(demographics['interests'])
            
        elif platform == 'instagram':
            # Optimize for millennials and visual content
            optimized['caption'] = self._adapt_caption_for_millennials(
                content['caption'],
                demographics['interests']
            )
            if demographics['locations']:
                optimized['location_tag'] = demographics['locations'][0]
                
        elif platform == 'twitter':
            # Optimize for professional/tech audience
            optimized['content'] = self._adapt_for_professional_audience(
                content['content'],
                demographics['interests']
            )
            
        elif platform == 'youtube':
            # Optimize for longer-form content
            optimized['title'] = self._optimize_title_for_seo(content['title'])
            optimized['description'] = self._enhance_description_with_keywords(
                content['description'],
                demographics['interests']
            )

        return optimized

    def _adapt_tone_for_genz(self, text: str) -> str:
        """Adapt content tone for Gen Z audience"""
        # Implementation would use NLP to adjust language style
        return text

    def _adapt_caption_for_millennials(self, caption: str, interests: List[str]) -> str:
        """Adapt caption for millennial audience"""
        # Implementation would incorporate relevant interests and trends
        return caption

    def _adapt_for_professional_audience(self, content: str, interests: List[str]) -> str:
        """Adapt content for professional audience"""
        # Implementation would adjust tone for business/professional context
        return content

    async def _post_to_twitter(self, content: Dict[str, Any]) -> str:
        return await self.tools['twitter'].post_tweet(
            content['content'],
            content.get('media_urls'),
            content.get('thread', False)
        )

    async def _post_to_instagram(self, content: Dict[str, Any]) -> str:
        return await self.tools['instagram'].post_content(content)

    async def _post_to_tiktok(self, content: Dict[str, Any]) -> str:
        return await self.tools['tiktok'].post_video(
            content['video_path'],
            content['description']
        )

    async def _post_to_youtube(self, content: Dict[str, Any]) -> str:
        return await self.tools['youtube'].upload_video(
            content['video_path'],
            content['title'],
            content['description']
        )

    async def run(self) -> None:
        """Regular check for scheduled posts"""
        try:
            # Implementation for scheduled posting would go here
            pass
        except Exception as e:
            await self.handle_error(e) 