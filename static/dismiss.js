dismissButton.addEventListener("click", function () {
	// reset the sound
	resetSound();
	
	// we hide the play and dismiss buttons, the menu and the convert button,
	// and show the record button
	playButton.style.display = "none";
	dismissButton.style.display = "none";
	menuForm.style.display = "none";
	convertButton.style.display = "none";
	recordButton.style.display = "inline-block";
});
