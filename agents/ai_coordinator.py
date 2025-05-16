import sys
import json
from typing import Dict, List, Any
from order_aggregation_agent import OrderAggregationAgent

class AICoordinator:
    def __init__(self):
        self.order_agent = OrderAggregationAgent()
        self.platform_capabilities = {
            'twitter': ['content analysis', 'engagement tracking', 'trend detection'],
            'facebook': ['audience insights', 'ad performance', 'content scheduling'],
            'instagram': ['visual content analysis', 'hashtag optimization', 'engagement metrics'],
            'website': ['traffic analysis', 'user behavior', 'conversion tracking'],
            'ecommerce': ['sales analysis', 'inventory optimization', 'customer behavior']
        }

    def analyze_query(self, query: str, platforms: List[str]) -> Dict[str, Any]:
        """Coordinate analysis across all connected platforms and agents"""
        results = {
            "recommendation": "",
            "actions": [],
            "platforms": platforms,
            "timeline": ""
        }

        # Process with Order Aggregation Agent if e-commerce is connected
        if 'ecommerce' in platforms:
            order_results = self.order_agent.process_query(query)
            results["actions"].extend([
                f"Order Analysis: {pattern}" 
                for pattern in order_results.get("patterns", [])
            ])
            results["recommendation"] = order_results.get("summary", "")

        # Add platform-specific recommendations
        for platform in platforms:
            if platform in self.platform_capabilities:
                capabilities = self.platform_capabilities[platform]
                results["actions"].extend([
                    f"Utilize {platform}'s {capability}" 
                    for capability in capabilities
                ])

        results["timeline"] = self._generate_timeline(len(platforms))
        return results

    def _generate_timeline(self, platform_count: int) -> str:
        base_time = 24  # Base time in hours
        total_time = base_time * (1 + (platform_count * 0.5))
        return f"Implementation estimated in {int(total_time)} hours"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        sys.exit(1)

    input_data = json.loads(sys.argv[1])
    coordinator = AICoordinator()
    result = coordinator.analyze_query(input_data['query'], input_data['platforms'])
    print(json.dumps(result)) 