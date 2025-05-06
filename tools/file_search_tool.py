from typing import Dict, Any, List
import os
import json
import logging

class FileSearchTool:
    """Tool for searching files in the system"""
    def __init__(self):
        pass

    def __init__(self, config: Dict[str, Any]):
        self.data_dir = config.get('data_directory', 'data')
        self.logger = logging.getLogger(__name__)

    async def save_research_data(self, data: List[Dict[str, Any]]) -> None:
        """Save research data to file"""
        try:
            os.makedirs(self.data_dir, exist_ok=True)
            filepath = os.path.join(self.data_dir, 'research_data.json')
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            self.logger.error(f"Error saving research data: {str(e)}")
            raise

    async def load_research_data(self) -> List[Dict[str, Any]]:
        """Load research data from file"""
        try:
            filepath = os.path.join(self.data_dir, 'research_data.json')
            if os.path.exists(filepath):
                with open(filepath, 'r') as f:
                    return json.load(f)
            return []
        except Exception as e:
            self.logger.error(f"Error loading research data: {str(e)}")
            raise 