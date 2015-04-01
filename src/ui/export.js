define(['jquery', 'mustache', 'util/utility', 'lib/DomParser', 'lib/JsonGenerator', 'text!templ/Tokenizer.js', 'text!templ/Parser.js', 'domReady!'], 
function($,        Mustache ,  utility,        domParser,       JsonGenerator ,      templTokenizer,            templParser,            doc) {
	'use strict'
    utility.resizeTextArea($('#jTemplTokenizer').val(templTokenizer));
    utility.resizeTextArea($('#jTemplParser').val(templParser));
	$('.jGenerateJson').click(function(event) {
        var result = domParser.parse($('#definition'), new JsonGenerator());
        this.href = 'data:,'+encodeURIComponent(JSON.stringify(result));
    });
    $('.jGenerateTokenizer').click(function(event) {
        console.log('Generating Tokenizer');
        // alert('Hello');
        var objectNotation = domParser.parse($('#definition'), new JsonGenerator());
        var tokens = objectNotation.terminals;
        var view = {
            ignored: objectNotation.whitespace,
            regexTokens: [],
            extraTokens: [],
        };
        Object.keys(tokens).map(function(token) {
            var definition = tokens[token];
            if(definition===true){
                view.extraTokens.push({
                    token: token,
                });
            } else {
                view.regexTokens.push({
                    token: token,
                    regex: definition,
                });
            }
        });
        var output = Mustache.render($('#jTemplTokenizer').val(), view);
        this.href = 'data:application/javascript,'+encodeURIComponent(output);
    });

    $('.jGenerateParser').click(function() {
        console.log('Generating Parser');
        var objectNotation = domParser.parse($('#definition'), new JsonGenerator());
        var productions = objectNotation.productions;
        var view = {
            productions: [],
        };
        Object.keys(productions).map(function(name) {
            var definitions = productions[name];
            view.productions.push({
                name: name,
                definitions: definitions,
            });
        });
        var output = Mustache.render($('#jTemplParser').val(), view);
        this.href = 'data:application/javascript,'+encodeURIComponent(output);
    });
});