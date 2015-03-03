define(['util/utility', 'lib/DomParser', 'lib/JsonGenerator', 'domReady!'],
function(utility,        domParser,       JsonGenerator,       doc) {
    $('.generate-semantics').click(function(event) {
        console.log('test');
        // alert('Hello');
        var objectNotation = domParser.parse($('#output'), new JsonGenerator());
        var tokens = objectNotation.terminals;
        var view = {
            ignored: $('#param-whitespace').val(),
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
        console.log('test');
        var output = Mustache.render($('#templ-tokenizer').val(), view);
        utility.resizeTextArea($('#tokenizer-output').val(output));
    });
}); 