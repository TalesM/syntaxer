define(['util/utility', 'text!templ/syntax.html', 'text!templ/edit.html', 'text!templ/semantic.html', 'text!templ/Tokenizer.js', 'text!templ/Parser.js', 'domReady!'],
function(utility,        templOutput,              templEdit,              templSemantic,              templTokenizer,            templParser,            doc) {
    'use strict'
    $.Mustache.add('templ-output', templOutput);
    $.Mustache.add('templ-edit', templEdit);
    utility.resizeTextArea($('#jTemplTokenizer').val(templTokenizer));
    utility.resizeTextArea($('#jTemplParser').val(templParser));

});