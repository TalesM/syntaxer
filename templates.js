define(['utility', 'text!templ/syntax.html', 'text!templ/edit.html', 'text!templ/Tokenizer.txt', 'domReady!'],
function(utility,   templOutput,              templEdit,              templTokenizer,             doc) {
    'use strict'
    $.Mustache.add('templ-output', templOutput);
    $.Mustache.add('templ-edit', templEdit);
    utility.resizeTextArea($('#templ-tokenizer').val(templTokenizer));

});