downloadButton.addEventListener("click", function () {
	var a = document.createElement("a");
	a.download = "audio.wav";
	a.href = "/static/" + audiofile;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	delete link;
});