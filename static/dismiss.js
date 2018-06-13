dismissButton.addEventListener("click", function () {
	// reset the sound
	resetSound();
	
	// we hide everything, and show the record button
	playButton.style.display = "none";
	dismissButton.style.display = "none";
	menuForm.style.display = "none";
	convertButton.style.display = "none";
	waitingMessage.style.display = "none";
	downloadButton.style.display = "none";
	recordButton.style.display = "inline-block";
});
