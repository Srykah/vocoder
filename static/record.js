var recordButton = document.getElementById("recordButton");

recordButton.addEventListener("click", function () {
	// Initialize recorder
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia(
	{
		audio: true
	},
	function (e) {
		console.log("user consent");

		// creates the audio context
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();

		// creates an audio node from the microphone incoming stream
		mediaStream = context.createMediaStreamSource(e);

		// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
		// bufferSize: the onaudioprocess event is called when the buffer is full
		var bufferSize = 2048;
		var numberOfInputChannels = 2;
		var numberOfOutputChannels = 2;
		if (context.createScriptProcessor) {
			recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
		} else {
			recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
		}

		recorder.onaudioprocess = function (e) {
			leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
			rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
			recordingLength += bufferSize;
		}

		// we connect the recorder
		mediaStream.connect(recorder);
		recorder.connect(context.destination);
	},
		function (e) {
			console.error(e);
		});
});
