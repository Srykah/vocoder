var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var audioSource = document.getElementById("audioSource");
var dismissButton = document.getElementById("dismissButton");
var menuDiv = document.getElementById("menuDiv");
var invertRadio = document.getElementById("invert");
var ts_samRadio = document.getElementById("ts_sam");
var ps_samRadio = document.getElementById("ps_sam");
var ts_svRadio = document.getElementById("ts_sv");
var ps_svRadio = document.getElementById("ps_sv");
var ts_avRadio = document.getElementById("ts_av");
var ps_avRadio = document.getElementById("ps_av");
var ratioInput = document.getElementById("ratio");
var convertDiv = document.getElementById("convertDiv");
var convertButton = document.getElementById("convertButton");
var resultDiv = document.getElementById("resultDiv");
var uploadingMessage = document.getElementById("uploadingMessage");
var convertingMessage = document.getElementById("convertingMessage");
var audioResult = document.getElementById("audioResult");
var downloadButton = document.getElementById("downloadButton");

var context = null;
var recorder = null;
var mediaStream = null;
var sourceURL = null;

var leftChannel = [];
var rightChannel = [];
var recordingLength = 0;
var blob = null;
var audiofile = null;

var sampleRate = 44100;
var channelCount = 2;
var bytesPerSample = 2;

function flattenArray(channelBuffer, recordingLength) {
	var result = new Float32Array(recordingLength);
	var offset = 0;
	for (var i = 0; i < channelBuffer.length; i++) {
		var buffer = channelBuffer[i];
		result.set(buffer, offset);
		offset += buffer.length;
	}
	return result;
}

function interleave(leftChannel, rightChannel) {
	var length = leftChannel.length + rightChannel.length;
	var result = new Float32Array(length);

	var inputIndex = 0;

	for (var index = 0; index < length;) {
		result[index++] = leftChannel[inputIndex];
		result[index++] = rightChannel[inputIndex];
		inputIndex++;
	}
	return result;
}

function writeUTFBytes(view, offset, string) {
	for (var i = 0; i < string.length; i++) {
		view.setUint8(offset + i, string.charCodeAt(i));
	}
}

function createWAV(leftChannel, rightChannel, recordingLength) {
	// we flat the left and right channels down
	// Float32Array[] => Float32Array
	var leftBuffer = flattenArray(leftChannel, recordingLength);
	var rightBuffer = flattenArray(rightChannel, recordingLength);
	// we interleave both channels together
	// [left[0],right[0],left[1],right[1],...]
	var interleaved = interleave(leftBuffer, rightBuffer);

	// we create our wav file
	var headerSize = 44;
	var dataSize = interleaved.length * bytesPerSample;
	var buffer = new ArrayBuffer(headerSize + dataSize);
	var view = new DataView(buffer);

	// RIFF chunk descriptor
	writeUTFBytes(view, 0, 'RIFF');
	view.setUint32(4, headerSize + dataSize - 8, true); // we have to substract 8 because reasons
	writeUTFBytes(view, 8, 'WAVE');
	// FMT sub-chunk
	writeUTFBytes(view, 12, 'fmt ');
	view.setUint32(16, 16, true); // FMT sub-chunk size : pretty much always 16
	view.setUint16(20, 1, true); // wFormatTag, 1 = PCM
	view.setUint16(22, channelCount, true); // wChannels: stereo (2 channels)
	view.setUint32(24, sampleRate, true); // dwSamplesPerSec
	view.setUint32(28, sampleRate * bytesPerSample * channelCount, true); // dwAvgBytesPerSec
	view.setUint16(32, bytesPerSample * channelCount, true); // wBlockAlign
	view.setUint16(34, bytesPerSample * 8, true); // wBitsPerSample
	// data sub-chunk
	writeUTFBytes(view, 36, 'data');
	view.setUint32(40, dataSize, true); // data sub-chunk size

	// write the PCM samples
	var index = 44;
	for (var i = 0; i < interleaved.length; i++) {
		var sample = interleaved[i];
		if (sample >= 1.0)
			sample = 1.0;
		else if (sample <= -1.0)
			sample = -1.0;
		view.setInt16(index, sample * (1 << (bytesPerSample * 8 - 1) - 1), true);
		index += bytesPerSample;
	}

	// our final blob
	return new Blob([view], { type: 'audio/wav' });
}

function resetSound() {
	leftChannel = [];
	rightChannel = [];
	recordingLength = 0;
	blob = null;
}
