recordButton.addEventListener("click", function () {
	if (context && recorder && mediaStream)
	{
		// we connect the recorder
		mediaStream.connect(recorder);
		recorder.connect(context.destination);
		
		// we display the record state
		displayState("record");
	}
});
