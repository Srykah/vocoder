function displayState(stateName) {
	if (stateName == "init")
		displayInit();
	else if (stateName == "record")
		displayRecord();
	else if (stateName == "menu")
		displayMenu();
	else if (stateName == "upload")
		displayUpload();
	else if (stateName == "convert")
		displayConvert();
	else if (stateName == "result")
		displayResult();
	else
		console.log("state doesn't exist");
}

function displayNothing() {
	recordButton.style.display = "none";
	stopButton.style.display = "none";
    audioSource.style.display = "none";
	audioSource.pause();
    dismissButton.style.display = "none";
    menuForm.style.display = "none";
    convertButton.style.display = "none";
    uploadingMessage.style.display = "none";
    convertingMessage.style.display = "none";
    audioResult.style.display = "none";
	audioResult.pause();
    downloadButton.style.display = "none";
}

function displayInit() {
	displayNothing();
	recordButton.style.display = "inline-block";
}

function displayRecord() {
	displayNothing();
	stopButton.style.display = "inline-block";
}

function displayMenu() {
	displayNothing();
	audioSource.style.display = "inline-block";
	dismissButton.style.display = "inline-block";
	menuForm.style.display = "inline-block";
	convertButton.style.display = "inline-block";
}

function displayUpload() {
	displayNothing();
	uploadingMessage.style.display = "inline-block";
}

function displayConvert() {
	displayNothing();
	convertingMessage.style.display = "inline-block";
}

function displayResult() {
	displayMenu();
	convertingMessage.style.display = "inline-block";
	downloadButton.style.display = "inline-block";
}