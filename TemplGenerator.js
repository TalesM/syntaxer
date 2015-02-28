define(function function_name () {
	function TemplGenerator (foundTokens) {
        this.foundTokens = function () {
            return foundTokens;
        }
        //token
        this.productionToken = function (token) {
            return {
                link: '#rule-'+token,
                classes: 'production',
                item: token,
            };
        };
        this.semanticToken = function (processedToken, token) {
            return {
                link: '#func-'+processedToken,
                classes: 'semantic',
                item: processedToken,
            };
        };
        this.regexToken = function(_, token) {
            return {
                classes: 'regex',
                item: token,
            };
        };
        this.terminalToken = function(_, token) {
            foundTokens[token] = (foundTokens[token]||0)+1;
            return {
                link: '#rule-'+token,
                classes: 'terminal',
                item: token,
            };
        };

        //definition
        this.startDefinition = function() {
            return [];
        };
        this.addToken = function (tokens, token) {
            tokens.push(token);
            return tokens;
        };
        this.generateDefinition = function (tokens) {
            return tokens;
        };

        var even = true;
        var ruleName;
        this.startRule = function(name) {
            ruleName = name;
            return [];
        };
        this.addDefinition = function(definitions, definition) {
            definitions.push({
                ruleName:ruleName,
                even: even,
                newRule: !definitions.length,
                ruleDef: definition,
            });
            return definitions;
        };
        this.generateRule = function(definitions) {
            even = !even;
            return definitions;
        }

        //Syntax
        this.startSyntax = function() {
            return [];
        };
        this.addRule = function (rules, rule) {
            return rules.concat(rule);
        }
        this.generateSyntax = function(rules) {
            return rules;
        }
    };
    return TemplGenerator;
});