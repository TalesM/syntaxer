define(function () {
    'use strict'
    var tokens = {};
	function parseToken ($token, generator) {
        var text = $token.text().trim();
        if($token.is('.production')){
            return generator.productionToken(text);
        }
        if($token.is('.semantic')){
            var type = ($token.is('.push'))?('push'):(($token.is('.pop'))?'pop':'call');
            var obj = $token.find('.obj').text();
            var action = $token.find('.action').text();
            var parameter = $token.find('.parameter').text();
            return generator.semanticToken(type, obj, action, parameter);
        }
        if($token.is('.regex')){
            return generator.regexToken(text);
        }
        if($token.is('.terminal')){
            var token = text.toLowerCase();
            tokens[token] = tokens[token]||false;
            return generator.terminalToken(token);
        }
    }

    function parseDefinition ($definition, generator) {
        var tokens = generator.startDefinition();
        $definition.find('.def-item').each(function(){
            var token = parseToken($(this), generator);
            tokens = generator.addToken(tokens, token);
        });
        return generator.generateDefinition(tokens);
    }

    function parse ($definition, generator) {
        tokens = {};
        var rules = generator.start();
        var oldName;
        var definitions;
        $definition.find('.rule').each(function(){
            var $rule = $(this);
            var name = $rule.find('.name').text().trim();
            if(name != oldName){
                if(oldName && definitions){
                    var rule = generator.generateProduction(definitions);
                    rules = generator.addProduction(rules, rule);
                }
                oldName = name;
                if(name === '<whitespace>'){
                    var token = parseToken($rule.find('.regex'), generator);
                    definitions = undefined;
                    var ruleName = name.toLowerCase();
                    tokens[ruleName] = true;
                    rules = generator.addWhitespace(rules, token);
                    return;
                }
                if(name === name.toUpperCase()){
                    var token = parseToken($rule.find('.regex'), generator);
                    definitions = undefined;
                    var ruleName = name.toLowerCase();
                    tokens[ruleName] = true;
                    rules = generator.addTerminal(rules, ruleName, token);
                    return;
                }
                definitions = generator.startProduction(name);
            }
            var definition = parseDefinition($rule, generator);
            definitions = generator.addDefinition(definitions, definition);
        });
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
        parseToken: parseToken,
        parseDefinition: parseDefinition,
        parse: parse,
    };
})