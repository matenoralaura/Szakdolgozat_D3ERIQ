from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
from action_blocks import ActionBlocks

class ValidateUserFeedbackForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_userfeedback_form"

    def validate_userfeedback(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `userfeedback` value."""
        
        return {"userfeedback": slot_value}
    
class ActionQuestion(Action):

    def name(self) -> Text:
        return "action_question"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            )-> List[Dict[Text, Any]]:
        
        action_blocks = ActionBlocks(tracker, dispatcher)
    
        action_blocks.do_bot_question()

        return []
    
class ActionGreet(Action):

    def name(self) -> Text:
        return "action_greet"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:        
        action_blocks = ActionBlocks(tracker, dispatcher)
    
        action_blocks.do_bot_affirm()

        return []
    
class ActionBegin(Action):

    def name(self) -> Text:
        return "action_begin"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:        
        action_blocks = ActionBlocks(tracker, dispatcher)
    
        action_blocks.do_bot_affirm()

        return []
    
class ActionConfirmFeedback(Action):

    def name(self) -> Text:
        return "action_confirm_feedback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:
        
        action_blocks = ActionBlocks(tracker, dispatcher)
    
        action_blocks.do_bot_ask_for_review()
        

        return []
    
class ActionWriteFeedback(Action):

    def name(self) -> Text:
        return "action_feedback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:
        
            action_blocks = ActionBlocks(tracker, dispatcher)
            
            action_blocks.do_bot_write_a_feedback()
            
            return []
        
    
class ActionCancelFeedback(Action):

    def name(self) -> Text:
        return "action_cancel_feedback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:
        
        action_blocks = ActionBlocks(tracker, dispatcher)
        
        action_blocks.do_bot_cancel_feedback()

        return []
        
        
class ActionSendFeedback(Action):

    def name(self) -> Text:
        return "action_send_feedback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:
        
        action_blocks = ActionBlocks(tracker, dispatcher)
        
        action_blocks.do_bot_send_feedback()
    
        return []
        

