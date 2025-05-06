from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
import yaml
import asyncio
from aiohttp import web
import logging

from agents import (
    MarketResearchAgent,
    AudienceSegmentationAgent,
    ContentCreationAgent,
    SocialPostingAgent,
    OrderAggregationAgent,
    AnalyticsOptimizationAgent,
    CustomerSupportAgent,
    CodeHealthAgent,
    CostTrackingAgent
)

# Initialize agents at module level for webhook access
order_aggregation_agent = None
code_health_agent = None
cost_tracking_agent = None

async def setup_scheduler():
    global order_aggregation_agent, code_health_agent, cost_tracking_agent
    
    # Load config
    with open('config.yaml', 'r') as f:
        config = yaml.safe_load(f)

    # Initialize agents
    order_aggregation_agent = OrderAggregationAgent(config=config)
    code_health_agent = CodeHealthAgent(config=config)
    cost_tracking_agent = CostTrackingAgent(config=config)

    # Initialize scheduler
    scheduler = AsyncIOScheduler()

    # Schedule bi-weekly scraping jobs (alternate weeks for different data types)
    scheduler.add_job(
        MarketResearchAgent(config).run,
        CronTrigger(day='1,15', hour=3),  # Run 1st and 15th of each month at 3 AM
        name='market_research'
    )

    scheduler.add_job(
        AudienceSegmentationAgent(config).run,
        CronTrigger(day='8,22', hour=3),  # Run 8th and 22nd of each month at 3 AM
        name='audience_segmentation'
    )

    # Schedule daily cost tracking
    scheduler.add_job(
        cost_tracking_agent.run,
        CronTrigger(hour=0),  # Run at midnight
        name='cost_tracking'
    )

    # Schedule Order Aggregation Agent
    scheduler.add_job(
        order_aggregation_agent.run,
        IntervalTrigger(minutes=5),
        name='order_aggregation'
    )

    # Schedule Code Health Agent
    scheduler.add_job(
        code_health_agent.run,
        IntervalTrigger(hours=1),
        name='code_health'
    )

    return scheduler

async def webhook_handler(request):
    """Handle incoming webhooks"""
    data = await request.json()
    
    if 'github' in request.path:
        await code_health_agent.handle_push(data)
    elif 'orders' in request.path:
        await order_aggregation_agent.handle_order(data)
    
    return web.Response(text="Webhook received")

async def main():
    # Setup logging
    logging.basicConfig(level=logging.INFO)

    # Initialize scheduler
    scheduler = await setup_scheduler()
    scheduler.start()

    # Setup webhook server
    app = web.Application()
    app.router.add_post('/webhook/github', webhook_handler)
    app.router.add_post('/webhook/orders', webhook_handler)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, 'localhost', 8080)
    await site.start()

    try:
        await asyncio.get_event_loop().create_future()  # run forever
    except (KeyboardInterrupt, SystemExit):
        await runner.cleanup()

if __name__ == "__main__":
    asyncio.run(main()) 