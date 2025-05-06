from typing import Dict, Any, List
from datetime import datetime, timedelta
from .base_agent import BaseAgent
import json
import os

class CostTrackingAgent(BaseAgent):
    """Agent for tracking API and scraping costs"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {}

    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.cost_file = 'data/api_costs.json'
        self.cost_limits = config.get('cost_limits', {
            'monthly_max': 1000,
            'daily_max': 50
        })
        self.api_costs = {
            'web_search': {
                'cost_per_query': 0.01,
                'daily_quota': 1000
            },
            'social_media': {
                'twitter': {'cost_per_request': 0.005},
                'instagram': {'cost_per_request': 0.008},
                'tiktok': {'cost_per_request': 0.01},
                'youtube': {'cost_per_request': 0.015}
            },
            'analytics': {
                'cost_per_report': 0.05
            },
            'crm': {
                'cost_per_operation': 0.002
            },
            'market_research': {
                'cost_per_analysis': 0.1
            }
        }
        os.makedirs('data', exist_ok=True)

    async def check_budget_available(self, service: str, operation: str, quantity: int = 1) -> bool:
        """Check if budget is available for operation"""
        try:
            costs = self._load_costs()
            today = datetime.now().strftime('%Y-%m-%d')
            month = datetime.now().strftime('%Y-%m')

            # Calculate estimated cost
            estimated_cost = self._calculate_operation_cost(service, operation, quantity)
            
            # Get current totals
            daily_total = self._get_daily_total(costs, today)
            monthly_total = self._get_monthly_total(costs, month)

            # Check if operation would exceed limits
            if (daily_total + estimated_cost > self.cost_limits['daily_max'] or
                monthly_total + estimated_cost > self.cost_limits['monthly_max']):
                self.logger.warning(f"Operation would exceed budget limits: {service}.{operation}")
                return False

            return True

        except Exception as e:
            self.logger.error(f"Error checking budget: {str(e)}")
            return False

    def _calculate_operation_cost(self, service: str, operation: str, quantity: int = 1) -> float:
        """Calculate cost for an operation"""
        if service in self.api_costs:
            if service == 'social_media':
                return self.api_costs[service].get(operation, {}).get('cost_per_request', 0) * quantity
            else:
                cost_key = next(iter(self.api_costs[service].keys()))
                return self.api_costs[service][cost_key] * quantity
        return 0

    async def log_cost(self, service: str, operation: str, quantity: int = 1) -> None:
        """Log cost of an API operation"""
        try:
            costs = self._load_costs()
            today = datetime.now().strftime('%Y-%m-%d')
            
            cost = self._calculate_operation_cost(service, operation, quantity)
            
            if today not in costs:
                costs[today] = {}
            if service not in costs[today]:
                costs[today][service] = {}
            if operation not in costs[today][service]:
                costs[today][service][operation] = 0
                
            costs[today][service][operation] += cost
            
            self._save_costs(costs)
            await self._check_cost_limits(costs)
            
            # Log detailed cost information
            self.logger.info(
                f"Cost logged - Service: {service}, Operation: {operation}, "
                f"Quantity: {quantity}, Cost: ${cost:.2f}"
            )
            
        except Exception as e:
            self.logger.error(f"Error logging cost: {str(e)}")

    def _get_daily_total(self, costs: Dict[str, Any], date: str) -> float:
        """Calculate total costs for a specific date"""
        if date not in costs:
            return 0
        return sum(
            sum(op_cost for op_cost in ops.values())
            for service_ops in costs[date].values()
            for ops in service_ops.values()
        )

    def _get_monthly_total(self, costs: Dict[str, Any], month: str) -> float:
        """Calculate total costs for a specific month"""
        return sum(
            self._get_daily_total(costs, date)
            for date in costs
            if date.startswith(month)
        )

    async def get_cost_forecast(self, days: int = 30) -> Dict[str, Any]:
        """Get cost forecast based on current usage patterns"""
        try:
            costs = self._load_costs()
            current_month = datetime.now().strftime('%Y-%m')
            
            # Calculate daily averages by service
            daily_averages = {}
            for date, day_costs in costs.items():
                if date.startswith(current_month):
                    for service, service_costs in day_costs.items():
                        if service not in daily_averages:
                            daily_averages[service] = 0
                        daily_averages[service] += sum(
                            sum(ops.values())
                            for ops in service_costs.values()
                        )

            # Calculate forecast
            days_in_month = datetime.now().day
            for service in daily_averages:
                daily_averages[service] /= days_in_month

            forecast = {
                service: avg * days
                for service, avg in daily_averages.items()
            }
            
            return {
                'forecast_total': sum(forecast.values()),
                'by_service': forecast,
                'days': days
            }
            
        except Exception as e:
            self.logger.error(f"Error generating forecast: {str(e)}")
            return {}

    async def get_cost_summary(self, days: int = 30) -> Dict[str, Any]:
        """Get cost summary for specified period"""
        try:
            costs = self._load_costs()
            start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
            
            relevant_costs = {
                date: data for date, data in costs.items()
                if date >= start_date
            }
            
            return {
                'total': self._calculate_total(relevant_costs),
                'by_service': self._group_by_service(relevant_costs),
                'by_operation': self._group_by_operation(relevant_costs)
            }
            
        except Exception as e:
            self.logger.error(f"Error getting cost summary: {str(e)}")
            return {}

    def _load_costs(self) -> Dict[str, Any]:
        """Load costs from file"""
        if os.path.exists(self.cost_file):
            with open(self.cost_file, 'r') as f:
                return json.load(f)
        return {}

    def _save_costs(self, costs: Dict[str, Any]) -> None:
        """Save costs to file"""
        with open(self.cost_file, 'w') as f:
            json.dump(costs, f, indent=2)

    async def _check_cost_limits(self, costs: Dict[str, Any]) -> None:
        """Check if costs are approaching limits"""
        today = datetime.now().strftime('%Y-%m-%d')
        month = datetime.now().strftime('%Y-%m')
        
        # Calculate daily total
        daily_total = sum(
            sum(op_cost for op_cost in ops.values())
            for service_ops in costs.get(today, {}).values()
            for ops in service_ops.values()
        )
        
        # Calculate monthly total
        monthly_total = sum(
            sum(sum(op_cost for op_cost in ops.values())
                for service_ops in day_data.values()
                for ops in service_ops.values())
            for date, day_data in costs.items()
            if date.startswith(month)
        )
        
        # Check limits and log warnings
        if daily_total > self.cost_limits['daily_max'] * 0.8:
            self.logger.warning(f"Daily costs ({daily_total}) approaching limit ({self.cost_limits['daily_max']})")
            
        if monthly_total > self.cost_limits['monthly_max'] * 0.8:
            self.logger.warning(f"Monthly costs ({monthly_total}) approaching limit ({self.cost_limits['monthly_max']})")

    async def run(self) -> None:
        """Daily cost report and forecast"""
        try:
            summary = await self.get_cost_summary(days=30)
            forecast = await self.get_cost_forecast(days=30)
            
            self.logger.info(f"Monthly cost summary: {summary}")
            self.logger.info(f"Cost forecast: {forecast}")
            
            # Alert if forecast exceeds limits
            if forecast['forecast_total'] > self.cost_limits['monthly_max']:
                self.logger.warning(
                    f"Forecasted costs (${forecast['forecast_total']:.2f}) "
                    f"exceed monthly limit (${self.cost_limits['monthly_max']:.2f})"
                )
                
        except Exception as e:
            await self.handle_error(e) 