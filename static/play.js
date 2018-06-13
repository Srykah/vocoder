playButton.addEventListener("click", function () {
	if (blob == null) {
		return;
	}

	var url = window.URL.createObjectURL(blob);
	var audio = new Audio(url);
	audio.play();
	audio.onended = function(e) {
		window.URL.revokeObjectURL(url);
	};
});
