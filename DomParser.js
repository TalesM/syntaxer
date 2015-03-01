define(function () {
    'use strict'
	function parseToken ($token, generator) {
        var text = $token.text().trim();
        if($token.is('.production')){
            return generator.productionToken(text);
        }
        if($token.is('.semantic')){
            return generator.semanticToken(text);
        }
        if($token.is('.regex')){
            return generator.regexToken(text.slice(1, -1));
        }
        if($token.is('.terminal')){
            return generator.terminalToken(text.toLowerCase());
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

    function parse ($output, generator) {
        var rules = generator.start();
        var oldName;
        var definitions;
        $output.children('.rule').each(function(){
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
                    rules = generator.addTerminal(rules, name.toLowerCase(), token);
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
        return generator.generate(rules);
    }
    return {
        parseToken: parseToken,
        parseDefinition: parseDefinition,
        parse: parse,
    };
})