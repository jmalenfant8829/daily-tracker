from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World: ' + os.getenv('TEST_ENV_VAR', 'default')

if __name__ == '__main__':
    app.run()