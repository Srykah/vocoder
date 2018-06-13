// Initialize recorder
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
navigator.getUserMedia({audio:true}, function (e) {
	
	// creates the audio context
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	context = new AudioContext();

	// creates an audio node from the microphone incoming stream
	mediaStream = context.createMediaStreamSource(e);

	// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
	// bufferSize: the onaudioprocess event is called when the buffer is full
	var bufferSize = 2048;
	if (context.createScriptProcessor) {
		recorder = context.createScriptProcessor(bufferSize, channelCount, channelCount);
	} else {
		recorder = context.createJavaScriptNode(bufferSize, channelCount, channelCount);
	}

	recorder.onaudioprocess = function (e) {
		leftChannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
		rightChannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
		recordingLength += bufferSize;
	}
},
function (e) {
	console.error(e);
});
