convertButton.addEventListener("click", function () {
	if (blob == null) {
		return;
	}

	// display upload state
	displayState("upload");
	
	// create form data to send
	var formData = new FormData();
	
	formData.append("audio", blob, "audio.wav");
	formData.append("ratio", parseFloat(ratioInput.value))
	
	// get route from checked radio button
	var route = '';
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
		
	// create request
	var xhr = new XMLHttpRequest();
	xhr.open('POST', route, true);
	xhr.onload = function(e) { // upload ended
		if (xhr.status == 200) { // if upload successful
			// retrieve audio filename
			audiofile = xhr.responseText;
			// display convert state
			displayState("convert");
			// set recurrent event to check if the result is ready
			var interval = setInterval(function() {
				var req = new XMLHttpRequest();
				req.open('GET', '/isReady/' + audiofile, true);
				req.onload = function(e) {
					if (req.status == 200) { // if element is ready
						// display result state
						displayState("result");
						// refresh audioResult
						audioResult.src = "/static/" + audiofile;
						audioResult.load();
						// delete recurrent event
						clearInterval(interval);
					}
					else if (req.status == 204) {
						// not ready to download yet
					}
					else { // other code : not supposed to happen
						alert("Error " + xhr.status + " occurred when checking progress.");
					}
				};
				req.send();
			}, 1000);
		} else { // if upload unsuccessful
			alert("Error " + xhr.status + " occurred when trying to upload your file.");
			dismissButton.click();
		}
	};
	xhr.send(formData);
});
