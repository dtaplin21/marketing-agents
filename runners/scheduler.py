from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
import yaml
import asyncio
from aiohttp import web
import logging

from agents.market_research import MarketResearchAgent
from agents.audience_segmentation import AudienceSegmentationAgent
# ... import other agents

async def setup_scheduler():
    # Load config
    with open('config.yaml', 'r') as f:
        config = yaml.safe_load(f)

    # Initialize scheduler
    scheduler = AsyncIOScheduler()

    # Schedule Market Research Agent
    market_research = MarketResearchAgent(config=config)
    scheduler.add_job(
        market_research.run,
        CronTrigger(hour=8),
        name='market_research'
    )

    # Schedule Audience Segmentation Agent
    audience_segmentation = AudienceSegmentationAgent(config=config)
    scheduler.add_job(
        audience_segmentation.run,
        CronTrigger(hour=0, minute=30),
        name='audience_segmentation'
    )

    # Schedule Order Aggregation Agent
    order_aggregation = OrderAggregationAgent(config=config)
    scheduler.add_job(
        order_aggregation.run,
        IntervalTrigger(minutes=5),
        name='order_aggregation'
    )

    # ... schedule other agents

    return scheduler

async def webhook_handler(request):
    """Handle incoming webhooks for GitHub pushes and order notifications"""
    data = await request.json()
    if 'github' in request.path:
        # Handle GitHub webhook
        asyncio.create_task(code_health_agent.handle_push(data))
    elif 'orders' in request.path:
        # Handle order webhook
        asyncio.create_task(order_aggregation_agent.handle_order(data))
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