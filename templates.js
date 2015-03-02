define(['utility', 'text!syntax.html', 'text!edit.html', 'text!Tokenizer.m', 'domReady!'],
function(utility,   templOutput,        templEdit,        templTokenizer) {
    'use strict'
    $.Mustache.add('templ-output', templOutput);
    $.Mustache.add('templ-edit', templEdit);
    utility.resizeTextArea($('#templ-tokenizer').val(templTokenizer));

});