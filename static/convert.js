var convertButton = document.getElementById("convertButton");

convertButton.addEventListener("click", function () {
	if (blob == null) {
		return;
	}

	var url = URL.createObjectURL(blob);

	var a = document.createElement("a");
	document.body.appendChild(a);
	a.style = "display: none";
	a.href = url;
	a.download = "sample.wav";
	a.click();
	window.URL.revokeObjectURL(url);
});
