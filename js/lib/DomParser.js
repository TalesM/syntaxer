define(function () {
    'use strict'
    var tokens = {};
	function parseToken ($token, generator) {
        var text = $token.text().trim();
        if($token.is('.production')){
            return generator.productionToken(text);
        }
        if($token.is('.semantic')){
            return generator.semanticToken(text);
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
        $definition.children('.rule').each(function(){
            var $rule = $(this);
            var name = $rule.find('.name').text().trim();
            if(name != oldName){
                if(oldName && definitions){
                    var rule = generator.generateProduction(definitions);
                    rules = generator.addProduction(rules, rule);
                }
                oldName = name;
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
        rules = generator.addWhitespace(rules, generator.regexToken($definition.find('#jWhitespace').val())); 
        return generator.generate(rules);
    }
    return {
        parseToken: parseToken,
        parseDefinition: parseDefinition,
        parse: parse,
    };
})