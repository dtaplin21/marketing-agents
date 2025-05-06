from typing import Dict, Any, List
from datetime import datetime
from .base import Agent

class OrderAggregationAgent(Agent):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(
            name="order_aggregation",
            tools=["shopify_tool", "woocommerce_tool"],
            config=config
        )
        self.shopify = None
        self.woocommerce = None
        self.db = None  # Database connection will be initialized in setup

    async def _execute(self) -> None:
        """Poll and normalize orders from different platforms"""
        try:
            # Get last sync timestamp for each platform
            last_shopify_sync = await self.get_last_sync('shopify')
            last_woo_sync = await self.get_last_sync('woocommerce')

            # Fetch new orders since last sync
            shopify_orders = await self.shopify.get_orders(since=last_shopify_sync)
            woo_orders = await self.woocommerce.get_orders(since=last_woo_sync)

            # Process orders
            if shopify_orders or woo_orders:
                normalized_orders = await self.normalize_orders(
                    ('shopify', shopify_orders),
                    ('woocommerce', woo_orders)
                )
                await self.store_orders(normalized_orders)

            # Update sync timestamps
            await self.update_sync_timestamps()

        except Exception as e:
            self.logger.error(f"Error in order aggregation: {str(e)}")
            raise

    async def handle_order(self, order_data: Dict[str, Any]) -> None:
        """Handle webhook order notifications"""
        try:
            platform = order_data.get('platform')
            if not platform:
                raise ValueError("Order platform not specified")

            normalized_order = await self.normalize_orders(
                (platform, [order_data])
            )
            await self.store_orders(normalized_order)
            
            # Trigger any necessary notifications or workflows
            await self.process_order_workflows(normalized_order)

        except Exception as e:
            self.logger.error(f"Error handling order webhook: {str(e)}")
            raise

    async def normalize_orders(self, *platform_orders: tuple) -> List[Dict[str, Any]]:
        """
        Normalize orders from different platforms into standard format
        Args:
            platform_orders: Tuples of (platform_name, orders_list)
        """
        normalized = []
        
        for platform, orders in platform_orders:
            for order in orders:
                normalized_order = {
                    'order_id': f"{platform}_{order.get('id')}",
                    'platform': platform,
                    'external_id': order.get('id'),
                    'status': order.get('status'),
                    'created_at': order.get('created_at'),
                    'updated_at': order.get('updated_at'),
                    'currency': order.get('currency', 'USD'),
                    'customer': {
                        'id': order.get('customer', {}).get('id'),
                        'email': order.get('customer', {}).get('email'),
                        'name': order.get('customer', {}).get('name'),
                    },
                    'billing_address': order.get('billing_address'),
                    'shipping_address': order.get('shipping_address'),
                    'items': [
                        {
                            'product_id': item.get('product_id'),
                            'variant_id': item.get('variant_id'),
                            'quantity': item.get('quantity'),
                            'price': item.get('price'),
                            'sku': item.get('sku')
                        }
                        for item in order.get('items', [])
                    ],
                    'subtotal': order.get('subtotal'),
                    'shipping_cost': order.get('shipping_cost'),
                    'tax': order.get('tax'),
                    'total': order.get('total'),
                    'notes': order.get('notes'),
                    'tags': order.get('tags', []),
                    'metadata': order.get('metadata', {})
                }
                normalized.append(normalized_order)
        
        return normalized

    async def store_orders(self, orders: List[Dict[str, Any]]) -> None:
        """Store normalized orders in database"""
        try:
            for order in orders:
                # Check if order already exists
                existing_order = await self.db.orders.find_one({
                    'order_id': order['order_id']
                })

                if existing_order:
                    # Update existing order
                    await self.db.orders.update_one(
                        {'order_id': order['order_id']},
                        {'$set': order}
                    )
                else:
                    # Insert new order
                    await self.db.orders.insert_one(order)

        except Exception as e:
            self.logger.error(f"Error storing orders: {str(e)}")
            raise

    async def get_last_sync(self, platform: str) -> datetime:
        """Get last sync timestamp for platform"""
        sync_record = await self.db.sync_timestamps.find_one({'platform': platform})
        return sync_record['last_sync'] if sync_record else datetime.min

    async def update_sync_timestamps(self) -> None:
        """Update sync timestamps for all platforms"""
        now = datetime.utcnow()
        for platform in ['shopify', 'woocommerce']:
            await self.db.sync_timestamps.update_one(
                {'platform': platform},
                {'$set': {'last_sync': now}},
                upsert=True
            )

    async def process_order_workflows(self, orders: List[Dict[str, Any]]) -> None:
        """Process any workflows triggered by new orders"""
        for order in orders:
            # Check for high-value orders
            if order['total'] > self.config.get('high_value_threshold', 1000):
                await self.notify_high_value_order(order)

            # Check for international orders
            if order['shipping_address']['country'] != self.config.get('home_country', 'US'):
                await self.process_international_order(order)

            # Update inventory
            await self.update_inventory(order)

    async def notify_high_value_order(self, order: Dict[str, Any]) -> None:
        """Send notifications for high-value orders"""
        notification = {
            'type': 'high_value_order',
            'order_id': order['order_id'],
            'total': order['total'],
            'customer': order['customer']
        }
        await self.send_notification(notification)

    async def process_international_order(self, order: Dict[str, Any]) -> None:
        """Handle special processing for international orders"""
        # Add international shipping documentation
        # Update shipping estimates
        # Add customs information
        pass

    async def update_inventory(self, order: Dict[str, Any]) -> None:
        """Update inventory levels based on order"""
        for item in order['items']:
            await self.db.inventory.update_one(
                {'sku': item['sku']},
                {'$inc': {'quantity': -item['quantity']}}
            ) 