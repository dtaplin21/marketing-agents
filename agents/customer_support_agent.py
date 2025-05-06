from typing import Dict, Any, List
from .base_agent import BaseAgent
from tools import EmailTool, ChatTool

class CustomerSupportAgent(BaseAgent):
    """Agent for handling customer support across channels"""
    def _initialize_tools(self) -> Dict[str, Any]:
        return {
            'email': EmailTool(self.config),
            'chat': ChatTool(self.config)
        }

    async def run(self) -> None:
        try:
            # Check for new messages across channels
            email_messages = await self.tools['email'].get_unread_messages()
            chat_messages = await self.tools['chat'].get_pending_messages()
            
            # Process messages
            for message in email_messages:
                await self._process_email(message)
            
            for message in chat_messages:
                await self._process_chat(message)
                
            self.logger.info(f"Processed {len(email_messages)} emails and {len(chat_messages)} chats")
            
        except Exception as e:
            await self.handle_error(e)

    async def _process_email(self, message: Dict[str, Any]) -> None:
        """Process email message"""
        response = await self._generate_response(message['content'])
        await self.tools['email'].send_email(
            to=message['from'],
            subject=f"Re: {message['subject']}",
            body=response
        )

    async def _process_chat(self, message: Dict[str, Any]) -> None:
        """Process chat message"""
        response = await self._generate_response(message['content'])
        await self.tools['chat'].send_message(
            user_id=message['user_id'],
            message=response
        )

    async def _generate_response(self, content: str) -> str:
        """Generate appropriate response based on message content"""
        # Implementation would use NLP/ML to categorize and generate responses
        if 'order status' in content.lower():
            return "Your order is being processed. For specific details, please provide your order number."
        elif 'return' in content.lower():
            return "Our return policy allows returns within 30 days. Would you like me to guide you through the process?"
        else:
            return "Thank you for your message. How can I assist you today?" 