define(function() {
    'use strict'
    var tokens = {};
    function parseToken (token, generator) {
        if(token[0] !== token[0].toUpperCase()){
            return generator.productionToken(token)
        } 
        var m = token.match(/^\{(\+\+|\-\-)?(\w+)(?:\.(\w+))?(?:\(($|\w*)\))?\}$/) ;
        if(m){
            if(m[1]=== '++'){
                return generator.semanticToken('push', m[2], undefined, m[4]||false);
            } 
            if(m[1]=== '--'){
                return generator.semanticToken('pop', m[2]);
            }
            return generator.semanticToken('call', m[2], m[3], m[4]||false);
        }
        if(token[0]=== '/' && token[token.length-1]==='/'){
            return generator.regexToken(token.slice(1, -1));
        }
        tokens[token] = tokens[token]||false;
        return generator.terminalToken(token.toLowerCase());
    }

    function parseDefinition(definition, generator) {
    	var tokenList = generator.startDefinition();
        tokenList = definition.split(' ').map(function(ruleItem){
            return ruleItem.trim();
        }).filter(function(ruleItem){
            return ruleItem.length;
        }).reduce(function(tokenList, token) {
            return generator.addToken(tokenList, parseToken(token, generator));
        }, tokenList);
        return generator.generateDefinition(tokenList);
    }

    function parse (text, generator) {
        tokens = {};
        var lines = text.split('\n');
        var oldRuleName = '';
        var rules = generator.start();
        var definitions;
        rules = lines.filter(function(cline){
            if(!cline || cline[0]==='#'){
                return false;
            }
            return true;
        }).reduce(function(rules, rule){
            var line = rule.match(/^\s*([\w\d]*)\s*(\:\:\=|\<\-\-)\s*(.*)/);
            if(!line){
                console.error('Can not decode rule: "'+rule+'"');
                return rules;
            }
            var ruleName = line[1];
            var ruleDef = line[3].trim();
            var separator = line[2];
            var newRule = ruleName && ruleName !== oldRuleName;
            if(newRule){
                if(oldRuleName && definitions){
                    var rule = generator.generateProduction(definitions);
                    rules = generator.addProduction(rules, rule);
                }
                oldRuleName = ruleName;
                if(ruleName === ruleName.toUpperCase() ){
                    if(separator !== '<--'){
                        console.log('Expected "<--"" instead of "'+separator+'at: '+rule);
                    }
                    var token = parseToken(ruleDef, generator);
                    definitions = undefined;
                    return generator.addTerminal(rules, ruleName.toLowerCase(), token);
                }else{
                    definitions = generator.startProduction(ruleName);
                }
            } else if(ruleName === '' && separator === '<--'){
                definitions = undefined;
                var token = parseToken(ruleDef, generator);
                return generator.addWhitespace(rules, token);
            }
            if(separator !== '::='){
                console.log('Expected "::="" instead of "'+separator+'" at: '+rule);
            }
            var definition = parseDefinition(ruleDef, generator);
            definitions = generator.addDefinition(definitions, definition);
            return rules;
        }, rules);
        if(definitions){
            rules = generator.addProduction(rules, generator.generateProduction(definitions));
        }
        Object.keys(tokens).forEach(function(token) {
            if(!tokens[token]){
                rules = generator.addTerminal(rules, token);
            }
        });
        return generator.generate(rules);
    }
    return {
        parse:              parse,
        parseDefinition:    parseDefinition,
        parseToken:         parseToken
    };
});