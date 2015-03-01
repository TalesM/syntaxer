define(['DomParser', 'JsonGenerator', 'domReady!'],
function(domParser,   JsonGenerator, doc) {
	$('.generate-semantics').click(function(event) {
		// alert('Hello');
		var objectNotation = domParser.parse($('#output'), new JsonGenerator());
		$('#tokenizer-output').val(JSON.stringify(objectNotation));
	});
}); 