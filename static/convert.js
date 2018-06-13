convertButton.addEventListener("click", function () {
	if (blob == null) {
		return;
	}

	var invertRadio = document.getElementById("invert");
	var ts_natRadio = document.getElementById("ts_nat");
	var ts_vocRadio = document.getElementById("ts_voc");
	var ps_natRadio = document.getElementById("ps_nat");
	var ps_vocRadio = document.getElementById("ps_voc");
	var ratioInput = document.getElementById("ratio");
	
	var formData = new FormData();
	var route = '';
	
	formData.append("audio", blob, "audio.wav");
	formData.append("ratio", parseFloat(ratioInput.value))
	
	if (invertRadio.checked)
		route = '/invert';
	else if (ts_natRadio.checked)
		route = '/ts_nat';
	else if (ts_vocRadio.checked)
		route = '/ts_voc';
	else if (ps_natRadio.checked)
		route = '/ps_nat';
	else if (ps_vocRadio.checked)
		route = '/ps_voc';
		
	var xhr = new XMLHttpRequest();
	xhr.open('POST', route, true);
	xhr.onload = function(e) {
		if (xhr.status == 200) {
			audiofile = xhr.responseText;
			convertButton.style.display = "none";
			waitingMessage.style.display = "inline-block";
			var interval = setInterval(function() {
				var req = new XMLHttpRequest();
				req.open('GET', '/isReady/' + audiofile, true);
				req.onload = function(e) {
					if (req.status == 200) {
						waitingMessage.style.display = "none";
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
		}
	};
	xhr.send(formData);
});
