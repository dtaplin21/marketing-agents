from typing import Dict, Any
from .base_agent import BaseAgent
from tools import CRMTool

class AudienceSegmentationAgent(BaseAgent):
    """Agent for customer segmentation"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {
            'crm': CRMTool(self.config)
        }

    async def run(self) -> None:
        try:
            # Get customer data
            customers = await self.tools['crm'].get_all_customers()

            # Segment customers
            segments = await self.tools['crm'].segment_customers(
                customers,
                criteria=['purchase_history', 'demographics', 'engagement']
            )

            # Update segments in CRM
            await self.tools['crm'].update_customer_segments(segments)
            
            self.logger.info("Customer segmentation completed successfully")
        except Exception as e:
            await self.handle_error(e) 