from typing import Dict, Any, List
from .base_agent import BaseAgent
from tools import WebSearchTool, FileSearchTool

class MarketResearchAgent(BaseAgent):
    """Agent for market research tasks"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {
            'web_search': WebSearchTool(self.config),
            'file_search': FileSearchTool(self.config)
        }

    async def run(self) -> None:
        try:
            # Search competitor data
            competitors = await self.tools['web_search'].search(
                "competitor analysis beauty products pricing"
            )

            # Save research data
            await self.tools['file_search'].save_research_data(competitors)
            
            self.logger.info("Market research completed successfully")
        except Exception as e:
            await self.handle_error(e) 