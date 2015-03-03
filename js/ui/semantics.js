define(['util/utility', 'lib/DomParser', 'lib/JsonGenerator', 'domReady!'],
function(utility,        domParser,       JsonGenerator,       doc) {
    'use strict'
    $('.jGenerateTokenizer').click(function(event) {
        console.log('Generating Tokenizer');
        // alert('Hello');
        var objectNotation = domParser.parse($('#output'), new JsonGenerator());
        var tokens = objectNotation.terminals;
        var view = {
            ignored: $('#jParamWhitespace').val(),
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
        utility.resizeTextArea($('#jTokenizerOutput').val(output));
    });

    $('.jGenerateParser').click(function() {
        console.log('Generating Parser');
        var objectNotation = domParser.parse($('#output'), new JsonGenerator());
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
        utility.resizeTextArea($('#jParserOutput').val(output));
    });
}); 