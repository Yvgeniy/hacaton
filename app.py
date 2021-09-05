from flask import Flask, make_response
import json
from excel_v5 import Polygon_date

app = Flask(__name__)


@app.route('/getFires/<date>')
def hello_world(date):  # put application's code here
    fires = []

    cord = []
    df = Polygon_date(date)

    for index, row in df.iterrows():
        fire = {}
        fire["id"] = row['id']
        fire["polygon"] = row['polygon']
        fire["ignition_day"] = row['ignition_day']
        fire["num_days"] = row['num_days']
        fire["fire_area"] = row['fire_area']
        fire["increase"] = row['increase']
        fires.append(fire)

    print(fires)
        # fire["id"] = 23424
    # cord.append([64.6654, 82.7583])
    # cord.append([65.2244, 100.073])
    # cord.append([57.8378, 87.3287])
    # fire["cord"] = Polygon_date(date)["polygon"].tolist()
    # print(fire)
    # fires.append(fire)
    jSon = json.dumps(fires)
    res = make_response(jSon)
    res.headers['Content-Type'] = 'application/json'
    res.headers['Access-Control-Allow-Origin'] = '*'

    return res



@app.route('/getFiresProg/<date>')
def predict(date):
    fires = []
    df = Polygon_date(date)
    for index, row in df.iterrows():
        fire = {}
        fire["id"] = row['id']
        fire["polygon"] = row['polygon']
        fire["ignition_day"] = row['ignition_day']
        fire["num_days"] = row['num_days']
        fire["fire_area"] = row['fire_area']
        fire["increase"] = row['increase']
        fires.append(fire)
    jSon = json.dumps(fires)
    res = make_response(jSon)
    res.headers['Content-Type'] = 'application/json'
    res.headers['Access-Control-Allow-Origin'] = '*'

    return res


if __name__ == '__main__':
    app.run()
