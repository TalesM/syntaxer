define(['util/utility', 'jquery.mustache', 'text!templ/definition.html', 'text!templ/syntax.html', 'text!templ/edit.html', 'text!templ/Tokenizer.js', 'text!templ/Parser.js', 'domReady!'],
function(utility,        jqueryMustache ,   templDefinition,              templOutput,              templEdit,              templTokenizer,            templParser,            doc) {
    'use strict'
    $.Mustache.add('definition', templDefinition);
    $.Mustache.add('syntax', templOutput);
    $.Mustache.add('templ-edit', templEdit);
    utility.resizeTextArea($('#jTemplTokenizer').val(templTokenizer));
    utility.resizeTextArea($('#jTemplParser').val(templParser));

});