recordButton.addEventListener("click", function () {
	if (context && recorder && mediaStream)
	{
		// we connect the recorder
		mediaStream.connect(recorder);
		recorder.connect(context.destination);
		
		// we make the record button invisible, and the stop button visible
		recordButton.style.display = "none";
		stopButton.style.display = "inline-block";
	}
});
