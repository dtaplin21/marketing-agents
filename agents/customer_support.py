from typing import Dict, Any
from .base import Agent

class CustomerSupportAgent(Agent):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(
            name="customer_support",
            tools=["email_tool", "chat_tool"],
            config=config
        )
        self.email = None
        self.chat = None

    async def _execute(self) -> None:
        """Process customer support requests"""
        try:
            # Get new messages
            email_messages = await self.email.get_unread_messages()
            chat_messages = await self.chat.get_pending_messages()
            
            for message in [*email_messages, *chat_messages]:
                # Classify message
                intent = await self.classify_intent(message)
                
                if await self.is_automated_response_suitable(intent):
                    await self.send_automated_response(message, intent)
                else:
                    await self.create_support_ticket(message)
                    await self.escalate_to_human(message)
                    
        except Exception as e:
            self.logger.error(f"Error in customer support: {str(e)}")
            raise 