stopButton.addEventListener("click", function () {
	// stop recording
	recorder.disconnect(context.destination);
	mediaStream.disconnect(recorder);

	// create WAV
	blob = createWAV(leftChannel, rightChannel, recordingLength);
	sourceURL = window.URL.createObjectURL(blob);
	audioSource.src = sourceURL;
	audioSource.load();
	
	// display menu state
	displayState("menu");
});
