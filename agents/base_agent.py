from typing import Dict, Any, List
import logging
import asyncio
from abc import ABC, abstractmethod

class BaseAgent(ABC):
    """Base class for all agents"""
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(self.__class__.__name__)
        self.tools = self._initialize_tools()

    @abstractmethod
    def _initialize_tools(self) -> Dict[str, Any]:
        """Initialize required tools for the agent"""
        pass

    @abstractmethod
    async def run(self) -> None:
        """Main execution method"""
        pass

    async def handle_error(self, error: Exception) -> None:
        """Handle agent errors"""
        self.logger.error(f"Error in {self.__class__.__name__}: {str(error)}") 