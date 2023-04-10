#!/usr/bin/env python
# encoding: utf-8
import json
import requests

def make_question_with_query(query):
    # with code
    print(query)
    data = {
    "query":query,
    "size": 1,
    "elastic": "milqa_w_lemma_w_official_context",
    "model_type": "ZTamas/hubert-qa-milqa"
    }
    headers = {"Content-Type": "application/json"}
    url = "https://chatbot-rgai3.inf.u-szeged.hu/qa/api/"
    # url = "http://localhost:5000/qa/api/"

    json_result = requests.post(url=url,
                                headers=headers,
                                json=data).text
  
    print(json.loads(json_result)[0]['answer'])
    return json.loads(json_result)[0]['answer']



# print(json.loads(json_result))

# with curl (CLI)
# curl -X POST https://chatbot-rgai3.inf.u-szeged.hu/qa/api/ -H 'Content-Type: application/json' -d @./rest_api_example_files/data.json