import os
from multiprocessing import Process
from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
import random

from vocoder import *

UPLOAD_FOLDER = 'temp'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def getRandomFilename():
    return str(random.randint(0, 1e12)) + ".wav"

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/invert', methods=['POST'])
def invert():
    # check if the post request has the file part
    audio = request.files.get('audio', None)
    ratio = request.form.get('ratio', None)
    if (ratio == None):
        return "Error", 400
    if (audio == None):
        return "Error", 204
    randomFN = getRandomFilename()
    save_filename = os.path.join(app.config['UPLOAD_FOLDER'], randomFN)
    audio.save(save_filename)
    p = Process(target=inverser, args=(save_filename,))
    p.daemon = True
    p.start()
    return randomFN, 200

@app.route('/ts_nat', methods=['POST'])
def ts_nat():
    # check if the post request has the file part
    audio = request.files.get('audio', None)
    ratio = request.form.get('ratio', None)
    if (ratio == None):
        return "Error", 400
    if (audio == None):
        return "Error", 204
    randomFN = getRandomFilename()
    save_filename = os.path.join(app.config['UPLOAD_FOLDER'], randomFN)
    audio.save(save_filename)
    p = Process(target=jouerLentementMal, args=(save_filename, float(ratio),))
    p.daemon = True
    p.start()
    return randomFN, 200

@app.route('/ts_voc', methods=['POST'])
def ts_voc():
    # check if the post request has the file part
    audio = request.files.get('audio', None)
    ratio = request.form.get('ratio', None)
    if (ratio == None):
        return "Error", 400
    if (audio == None):
        return "Error", 204
    randomFN = getRandomFilename()
    save_filename = os.path.join(app.config['UPLOAD_FOLDER'], randomFN)
    audio.save(save_filename)
    p = Process(target=jouerLentementBien, args=(save_filename, float(ratio),))
    p.daemon = True
    p.start()
    return randomFN, 200



@app.route('/ps_nat', methods=['POST'])
def ps_nat():
    # check if the post request has the file part
    audio = request.files.get('audio', None)
    ratio = request.form.get('ratio', None)
    if (ratio == None):
        return "Error", 400
    if (audio == None):
        return "Error", 204
    randomFN = getRandomFilename()
    save_filename = os.path.join(app.config['UPLOAD_FOLDER'], randomFN)
    audio.save(save_filename)
    p = Process(target=jouerLentementMal, args=(save_filename, 1.0 / float(ratio),))
    p.daemon = True
    p.start()
    return randomFN, 200


@app.route('/ps_voc', methods=['POST'])
def ps_voc():
    # check if the post request has the file part
    audio = request.files.get('audio', None)
    ratio = request.form.get('ratio', None)
    if (ratio == None):
        return "Error", 400
    if (audio == None):
        return "Error", 204
    randomFN = getRandomFilename()
    save_filename = os.path.join(app.config['UPLOAD_FOLDER'], randomFN)
    audio.save(save_filename)
    p = Process(target=augmenterFreqBien, args=(save_filename, float(ratio),))
    p.daemon = True
    p.start()
    return randomFN, 200

@app.route('/ts_nm', methods=['POST'])
def ts_nm():
    # check if the post request has the file part
    audio = request.files.get('audio', None)
    ratio = request.form.get('ratio', None)
    if (ratio == None):
        return "Error", 400
    if (audio == None):
        return "Error", 204
    randomFN = getRandomFilename()
    save_filename = os.path.join(app.config['UPLOAD_FOLDER'], randomFN)
    audio.save(save_filename)
    p = Process(target=jouerLentementTresBien, args=(save_filename, float(ratio),))
    p.daemon = True
    p.start()
    return randomFN, 200

@app.route('/ps_nm', methods=['POST'])
def ps_nm():
    # check if the post request has the file part
    audio = request.files.get('audio', None)
    ratio = request.form.get('ratio', None)
    if (ratio == None):
        return "Error", 400
    if (audio == None):
        return "Error", 204
    randomFN = getRandomFilename()
    save_filename = os.path.join(app.config['UPLOAD_FOLDER'], randomFN)
    audio.save(save_filename)
    p = Process(target=augmenterFreqTresBien, args=(save_filename, float(ratio),))
    p.daemon = True
    p.start()
    return randomFN, 200

@app.route('/isReady/<filename>')
def isReady(filename):
    filename = os.path.join("static", filename)
    return '', (200 if os.path.isfile(filename) else 204)

app.run(host="0.0.0.0", port=80)