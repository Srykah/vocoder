stopButton.addEventListener("click", function () {
	// stop recording
	recorder.disconnect(context.destination);
	mediaStream.disconnect(recorder);

	// create WAV
	blob = createWAV(leftChannel, rightChannel, recordingLength);
	
	// show the play and dismiss buttons, the menu and the convert button,
	// and hide the stop button
	stopButton.style.display = "none";
	playButton.style.display = "inline-block";
	dismissButton.style.display = "inline-block";
	menuForm.style.display = "block";
	convertButton.style.display = "inline-block";
});
