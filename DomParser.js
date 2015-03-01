define(function () {
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
        var rules = generator.startSyntax();
        var oldName;
        var definitions;
        $output.children('.rule').each(function(){
            var $rule = $(this);
            var name = $rule.find('.name').text().trim();
            if(name != oldName){
                if(oldName){
                    var rule = generator.generateRule(definitions);
                    rules = generator.addRule(rules, rule);
                }
                oldName = name;
                definitions = generator.startRule(name);
            }
            var definition = parseDefinition($rule, generator);
            definitions = generator.addDefinition(definitions, definition);
        });
        rules = generator.addRule(rules, generator.generateRule(definitions));
        return generator.generateSyntax(rules);
    }
    return {
        parseToken: parseToken,
        parseDefinition: parseDefinition,
        parse: parse,
    };
})