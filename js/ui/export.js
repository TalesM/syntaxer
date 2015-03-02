define(['lib/DomParser', 'lib/JsonGenerator', 'domReady!'], 
function(domParser,       JsonGenerator ,      doc) {
	'use strict'
	$('.export-json').click(function(event) {
        'use strict'
        /* Act on the event */
        var result = domParser.parse($(output), new JsonGenerator());
        this.href = 'data:,'+JSON.stringify(result);
        //return false;
    });
});