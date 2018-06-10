from flask import Flask
#from flask import request
from flask import render_template

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

#@app.route('/invert', methods=['POST'])
#def invert():
#    f = request.files['audio.wav']

app.run(host="0.0.0.0", port=80)