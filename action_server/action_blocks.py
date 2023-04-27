from utils import load_responses
import qa as qa

RESPONSES = load_responses()

class RuleBlocks:

    def __init__(self, tracker, dispatcher):
        self.tracker = tracker
        self.text = tracker.latest_message['text']
        self.dispatcher = dispatcher

class ActionBlocks:

    def __init__(self, tracker, dispatcher):
        self.tracker = tracker
        self.text = tracker.latest_message['text']
        self.dispatcher = dispatcher
        
    def do_bot_ask_for_review(self):
        self.dispatcher.utter_message(
            template="utter_feedback"
        )
        
    def do_bot_question(self):
        self.dispatcher.utter_message(qa.make_question_with_query(self.text))
        
    def do_bot_write_a_feedback(self):
        self.dispatcher.utter_message("Rendben! A lenti chatboxban megírhatod a véleményed.")
        
    def do_bot_cancel_feedback(self):
        self.dispatcher.utter_message(
            template="utter_question",
        )
        
    def do_bot_send_feedback(self):
        self.dispatcher.utter_message("Köszönjük a visszajelzést!")
    
    def do_bot_affirm(self):
        self.dispatcher.utter_message(
            template="utter_affirm",
        )

