#!/usr/bin/env python
# encoding: utf-8
import json
import requests
import yaml
from random import choice, randint

def loadQA():
    # with code
    with open("action_server/data.json", "r") as f:
        data = json.load(f)
    headers = {"Content-Type": "application/json"}
    url = "https://chatbot-rgai3.inf.u-szeged.hu/qa/api/"
    # url = "http://localhost:5000/qa/api/"

    json_result = requests.post(url=url,
                                headers=headers,
                                json=data).text

    print(json.loads(json_result))

    # with curl (CLI)
    # curl -X POST https://chatbot-rgai3.inf.u-szeged.hu/qa/api/ -H 'Content-Type: application/json' -d @./rest_api_example_files/data.json


def load_responses():
    with open("response_templates.yml", encoding="utf8") as f:
        d = yaml.load(f, yaml.FullLoader)

    return d
