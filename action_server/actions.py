from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.events import FollowupAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
from utils import load_responses
from action_blocks import ActionBlocks

RESPONSES = load_responses()

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
    
# class ValidateYesOrCancelForm(FormValidationAction):
#     def name(self) -> Text:
#         return "validate_yes_or_cancel_form"

#     def validate_yes_or_cancel(
#         self,
#         slot_value: Any,
#         dispatcher: CollectingDispatcher,
#         tracker: Tracker,
#         domain: DomainDict,
#     ) -> Dict[Text, Any]:
#         """Validate `yes_or_cancel` value."""
        
#         return {"yes_or_cancel": slot_value}
    
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
    
class ActionBegin(Action):

    def name(self) -> Text:
        return "action_begin"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:        
        action_blocks = ActionBlocks(tracker, dispatcher)
    
        action_blocks.do_bot_affirm()

        return []
    
class ActionWriteFeedback(Action):

    def name(self) -> Text:
        return "action_write_feedback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:
        
        action_blocks = ActionBlocks(tracker, dispatcher)
    
        action_blocks.do_bot_ask_for_review()
        

        return []
    
class ActionActuallyWriteFeedback(Action):

    def name(self) -> Text:
        return "action_feedback"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]
            ) -> List[Dict[Text, Any]]:
        
            action_blocks = ActionBlocks(tracker, dispatcher)
            
            action_blocks.do_bot_write_a_feedback()
            
            return []
        
        # if tracker.get_slot('yes_or_cancel') == "Igen":
        
        #     action_blocks = ActionBlocks(tracker, dispatcher)
            
        #     action_blocks.do_bot_write_a_feedback()
            
        #     return []
        
        # elif tracker.get_slot('yes_or_cancel') == "Mégsem":
            
        #     action_blocks = ActionBlocks(tracker, dispatcher)
    
        #     action_blocks.do_bot_cancel_feedback()

        #     return [FollowupAction("action_listen")]
        
    
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
        

