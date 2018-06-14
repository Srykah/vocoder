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
	dismissButton.disabled = true;
    menuDiv.style.display = "none";
	invertRadio.disabled = true;
	ts_samRadio.disabled = true;
	ps_samRadio.disabled = true;
	ts_svRadio.disabled = true;
	ps_svRadio.disabled = true;
	ts_avRadio.disabled = true;
	ps_avRadio.disabled = true;
	ratioInput.disabled = true;
	convertDiv.style.display = "none";
    convertButton.style.display = "none";
	convertButton.disabled = true;
    resultDiv.style.display = "none";
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
	audioSource.style.display = "inline";
	dismissButton.style.display = "inline-block";
	dismissButton.disabled = false;
	menuDiv.style.display = "block";
	invertRadio.disabled = false;
	ts_samRadio.disabled = false;
	ps_samRadio.disabled = false;
	ts_svRadio.disabled = false;
	ps_svRadio.disabled = false;
	ts_avRadio.disabled = false;
	ps_avRadio.disabled = false;
	ratioInput.disabled = false;
	convertDiv.style.display = "block";
	convertButton.style.display = "inline-block";
	convertButton.disabled = false;
}

function displayUpload() {
	displayNothing();
	audioSource.style.display = "inline";
	dismissButton.style.display = "inline-block";
	menuDiv.style.display = "block";
	convertDiv.style.display = "block";
	convertButton.style.display = "inline-block";
	resultDiv.style.display = "block";
	uploadingMessage.style.display = "block";
}

function displayConvert() {
	displayNothing();
	audioSource.style.display = "inline";
	dismissButton.style.display = "inline-block";
	menuDiv.style.display = "block";
	convertDiv.style.display = "block";
	convertButton.style.display = "inline-block";
	resultDiv.style.display = "block";
	convertingMessage.style.display = "block";
}

function displayResult() {
	displayMenu();
	resultDiv.style.display = "block";
	audioResult.style.display = "inline";
	downloadButton.style.display = "inline-block";
}