from typing import Dict, Any, List
from .base_agent import BaseAgent
from tools import ShopifyTool, WooCommerceTool

class OrderAggregationAgent(BaseAgent):
    """Agent for aggregating orders from multiple platforms"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {
            'shopify': ShopifyTool(self.config),
            'woocommerce': WooCommerceTool(self.config)
        }

    async def run(self) -> None:
        try:
            # Fetch orders from all platforms
            shopify_orders = await self.tools['shopify'].get_orders()
            woo_orders = await self.tools['woocommerce'].get_orders()

            # Normalize and combine orders
            all_orders = await self._normalize_orders(shopify_orders, woo_orders)
            
            self.logger.info(f"Aggregated {len(all_orders)} orders")
            
        except Exception as e:
            await self.handle_error(e)

    async def handle_order(self, order_data: Dict[str, Any]) -> None:
        """Handle incoming order webhook"""
        try:
            # Process incoming order
            normalized_order = await self._normalize_orders([order_data])
            self.logger.info(f"Processed new order: {normalized_order}")
        except Exception as e:
            await self.handle_error(e)

    async def _normalize_orders(self, *order_lists) -> List[Dict[str, Any]]:
        """Normalize orders from different platforms"""
        normalized = []
        for orders in order_lists:
            for order in orders:
                normalized.append({
                    'order_id': order.get('id'),
                    'platform': order.get('platform'),
                    'amount': order.get('total'),
                    'customer': order.get('customer'),
                    'items': order.get('line_items', [])
                })
        return normalized 