define(['util/utility', 'text!templ/syntax.html', 'text!templ/edit.html', 'text!templ/Tokenizer.js', 'domReady!'],
function(utility,        templOutput,              templEdit,              templTokenizer,            doc) {
    'use strict'
    $.Mustache.add('templ-output', templOutput);
    $.Mustache.add('templ-edit', templEdit);
    utility.resizeTextArea($('#jTemplTokenizer').val(templTokenizer));

});