define(['text!syntax.html', 'text!edit.html', 'domReady!'],
function(templOutput, 	     templEdit) {
	'use strict'
    $.Mustache.add('templ-output', templOutput);
    $.Mustache.add('templ-edit', templEdit);
});