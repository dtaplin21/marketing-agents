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
    CodeHealthAgent
)

# Initialize agents at module level for webhook access
order_aggregation_agent = None
code_health_agent = None

async def setup_scheduler():
    global order_aggregation_agent, code_health_agent
    
    # Load config
    with open('config.yaml', 'r') as f:
        config = yaml.safe_load(f)

    # Initialize agents
    order_aggregation_agent = OrderAggregationAgent(config=config)
    code_health_agent = CodeHealthAgent(config=config)

    # Initialize scheduler
    scheduler = AsyncIOScheduler()

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

    # Configure jobs
    scheduler.add_job(
        'agents.market_research:MarketResearchAgent.run',
        CronTrigger(hour=8),  # daily @ 08:00
        id='market_research'
    )

    scheduler.add_job(
        'agents.audience_segmentation:AudienceSegmentationAgent.run',
        CronTrigger(hour=0, minute=30),  # daily @ 00:30
        id='audience_segmentation'
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