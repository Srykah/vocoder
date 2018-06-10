var stopButton = document.getElementById("stopButton");

stopButton.addEventListener("click", function () {

	// stop recording
	recorder.disconnect(context.destination);
	mediaStream.disconnect(recorder);

	blob = createWAV(leftChannel, rightChannel, recordingLength);
});
