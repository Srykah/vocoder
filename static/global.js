var leftchannel = [];
var rightchannel = [];
var recorder = null;
var recordingLength = 0;
var volume = null;
var mediaStream = null;
var sampleRate = 44100;
var context = null;
var blob = null;

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
	var leftBuffer = flattenArray(leftchannel, recordingLength);
	var rightBuffer = flattenArray(rightchannel, recordingLength);
	// we interleave both channels together
	// [left[0],right[0],left[1],right[1],...]
	var interleaved = interleave(leftBuffer, rightBuffer);

	// we create our wav file
	var buffer = new ArrayBuffer(44 + interleaved.length * 2);
	var view = new DataView(buffer);

	// RIFF chunk descriptor
	writeUTFBytes(view, 0, 'RIFF');
	view.setUint32(4, 44 + interleaved.length * 2, true);
	writeUTFBytes(view, 8, 'WAVE');
	// FMT sub-chunk
	writeUTFBytes(view, 12, 'fmt ');
	view.setUint32(16, 16, true); // chunkSize
	view.setUint16(20, 1, true); // wFormatTag
	view.setUint16(22, 2, true); // wChannels: stereo (2 channels)
	view.setUint32(24, sampleRate, true); // dwSamplesPerSec
	view.setUint32(28, sampleRate * 4, true); // dwAvgBytesPerSec
	view.setUint16(32, 4, true); // wBlockAlign
	view.setUint16(34, 16, true); // wBitsPerSample
	// data sub-chunk
	writeUTFBytes(view, 36, 'data');
	view.setUint32(40, interleaved.length * 2, true);

	// write the PCM samples
	var index = 44;
	var volume = 1;
	for (var i = 0; i < interleaved.length; i++) {
		view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
		index += 2;
	}

	// our final blob
	return new Blob([view], { type: 'audio/wav' });
}
