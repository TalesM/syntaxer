function Tokenizer (input) {
    function advance(length){
        input = input.slice(length);
    }

    this.parse = function() {
        var match;
        while(match = input.match(/^{{{ignored}}}/)){
            advance(match[0].length);
            input = input.slice(match[0].length);
        }
        {{#regexTokens}}
        if(match = input.match(/^{{{regex}}}/)){
            advance(match[0].length);
            return {
                type: '{{{token}}}',
                data: match[1],
            };
        }
        {{/regexTokens}}
        {{#extraTokens}}
        if(input.indexOf('{{{token}}}') === 0){
            advance('{{{token}}}'.length);
            return {
                type: '{{{token}}}',
            };
        }
        {{/extraTokens}}
        if(!input.length){
            return null;
        }
        var c = input[0];
        advance(1);
        throw {
            message: 'UnknownToken',
            token: c,
        }
    };
}