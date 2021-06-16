from tracker_api import app

@app.route('/')
def hello_world():
    return 'Hello World: '