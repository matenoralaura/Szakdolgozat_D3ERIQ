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
    url = "http://localhost:25565/api/question"

    json_result = requests.post(url=url,
                                headers=headers,
                                json=data).text
  
    # print(json.loads(json_result)[0]['answer'])
    return json.loads(json_result)['answer']
