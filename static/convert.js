convertButton.addEventListener("click", function () {
	if (blob == null) {
		return;
	}

	convertButton.disabled = true;
	dismissButton.disabled = true;
	uploadingMessage.style.display = "inline-block";
	audioTag.style.display = "none";
	audioTag.pause();
	downloadButton.style.display = "none";
	
	var invertRadio = document.getElementById("invert");
	var ts_samRadio = document.getElementById("ts_sam");
	var ps_samRadio = document.getElementById("ps_sam");
	var ts_svRadio = document.getElementById("ts_sv");
	var ps_svRadio = document.getElementById("ps_sv");
	var ts_avRadio = document.getElementById("ts_av");
	var ps_avRadio = document.getElementById("ps_av");
	var ratioInput = document.getElementById("ratio");
	
	var formData = new FormData();
	var route = '';
	
	formData.append("audio", blob, "audio.wav");
	formData.append("ratio", parseFloat(ratioInput.value))
	
	if (invertRadio.checked)
		route = '/invert';
	else if (ts_samRadio.checked)
		route = '/ts_sam';
	else if (ps_samRadio.checked)
		route = '/ps_sam';
	else if (ts_svRadio.checked)
		route = '/ts_sv';
	else if (ps_svRadio.checked)
		route = '/ps_sv';
	else if (ts_avRadio.checked)
		route = '/ts_av';
	else if (ps_avRadio.checked)
		route = '/ps_av';
		
	var xhr = new XMLHttpRequest();
	xhr.open('POST', route, true);
	xhr.onload = function(e) {
		uploadingMessage.style.display = "none";
		dismissButton.disabled = false;
		if (xhr.status == 200) {
			audiofile = xhr.responseText;
			convertingMessage.style.display = "inline-block";
			var interval = setInterval(function() {
				var req = new XMLHttpRequest();
				req.open('GET', '/isReady/' + audiofile, true);
				req.onload = function(e) {
					if (req.status == 200) {
						convertButton.disabled = false;
						waitingMessage.style.display = "none";
						audioTag.style.display = "inline-block";
						audioTag.src = "/static/" + audiofile;
						audioTag.load();
						downloadButton.style.display = "inline-block";
						clearInterval(interval);
					}
					else if (req.status == 204) {
						// not ready to download yet
					}
					else {
						alert("Error " + xhr.status + " occurred when checking progress.");
					}
				};
				req.send();
			}, 1000);
		} else {
			alert("Error " + xhr.status + " occurred when trying to upload your file.");
			convertButton.disabled = false;
		}
	};
	xhr.send(formData);
});
