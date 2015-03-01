define(function() {
    'use strict'
    function parseToken (token, generator) {
        if(token[0] !== token[0].toUpperCase()){
            return generator.productionToken(token, token)
        } 
        if(token[0]=== '{' 
           && token[token.length-1]==='}'){
            return generator.semanticToken(token.slice(1, -1), token);
        }
        if(token[0]=== '/' && token[token.length-1]==='/'){
            return generator.regexToken(token.slice(1, -1), token);
        }
        return generator.terminalToken(token.toLowerCase(), token);
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
        var lines = text.split('\n');
        var oldRuleName = '';
        var rules = generator.startSyntax();
        var definitions;
        rules = lines.filter(function(cline){
            if(!cline || cline[0]==='#'){
                return false;
            }
            var pos = cline.indexOf('::=');
            if(pos === -1 || cline.indexOf('::=', pos+1) !== -1){
                return false;
            }
            return true;
        }).reduce(function(rules, rule){
            var line = rule.split('::=');
            var ruleName = line[0].trim();
            var newRule = ruleName && ruleName !== oldRuleName;
            if(newRule){
                if(oldRuleName){
                    var rule = generator.generateRule(definitions);
                    rules = generator.addRule(rules, rule);
                }
                oldRuleName = ruleName;
                definitions = generator.startRule(ruleName);
            } 
            var definition = parseDefinition(line[1].trim(), generator);
            definitions = generator.addDefinition(definitions, definition);
            return rules;
        }, rules);
        rules = generator.addRule(rules, generator.generateRule(definitions));
        return generator.generateSyntax(rules);
    }
    return {
        parse:              parse,
        parseDefinition:    parseDefinition,
        parseToken:         parseToken
    };
});