from flask import Flask
from flask_restful import Api, Resource, reqparse
import pandas as pd
from pathlib import Path
import os
import requests
import json

app = Flask(__name__)
api = Api(app)

class APPL(Resource):
    def get(self):
        
        if (Path("appl.json").exists()==False):
            reply = requests.get("https://api.twelvedata.com/time_series?symbol=AAPL&interval=1day&outputsize=5000&apikey=2567314b3b4b41328b4083fec69d0f89")
            # reply = requests.get("https://www.breakingbadapi.com/api/characters/1")
            print("download")
            file = open("appl.json","w")
            file.write(reply.text)
            file.close()
        
        # data = data.to_dict('records')
        # return {'data' : data}, 200

        with open ("appl.json", "r") as myfile:
            string = myfile.readlines()
            string = "".join(str(x) for x in string)
            return json.loads(string)



# Add URL endpoints
api.add_resource(APPL, '/APPL')

if __name__ == '__main__':
    app.run()