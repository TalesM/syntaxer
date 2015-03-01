define(function () {

    function JsonGenerator () {
        //Tokens
        this.productionToken = function (token) {
            return {
                item: token,
                actions: [],
            };
        }

        this.semanticToken = function (token) {
            var matches = token.match(/(?:(begin|end)\-)?([\w\d_]+)?(?:-([\w\d_-]+))?(\[(\$|[\w\d_]+)\])?/);
            if(!matches){
                throw new Error('Wrong Format:'+token);
            }
            return {
                type:   matches[1]||'call',
                object: matches[2],
                action: matches[3]||null,
                param:  (matches[4]?(matches[5]=='$'?true:matches[5]):(false))
            };
        }

        this.regexToken = function (token) {
            return token;
        }

        this.terminalToken = function (token) {
            return {
                item: token,
                actions: [],
            };
        }

        //Definitions
        this.startDefinition = function () {
            return [];
        }

        var first = true;
        var initialization = [];
        this.addToken = function (tokens, token) {
            if(token.type){
                if(tokens.length){
                    var last = tokens[tokens.length-1]; 
                    last.actions.push(token);
                } else if(first){
                    initialization.push(token);
                } else {
                    throw new Error('invalid semantic location');
                }
            } else {
                tokens.push(token);
            }
            return tokens;
        }

        this.generateDefinition = function (tokens) {
            return tokens;
        }

        //Rules
        var productionName;
        this.startProduction = function (ruleName) {
            productionName = ruleName;
            return [];
        }
        this.addDefinition = function (definitions, definition) {
            definitions.push(definition);
            return definitions;
        }

        this.generateProduction = function (definitions) {
            return [productionName, definitions];
        }

        //Syntax
        this.start = function() {
            return {
                productions : {},
                terminals : {},

            };
        };
        this.addProduction = function (rules, rule) {
            var name = rule[0];
            var definitions = rule[1];
            rules.productions[name] = definitions;
            if(first){
                first = false;
                rules.start = name;
                rules.initialization = initialization;
            }
            return rules;
        }
        this.addTerminal = function(rules, terminalName, terminalRegex) {
            rules.terminals[terminalName.toUpperCase()] = terminalRegex;
            return rules;
        };
        this.generate = function(rules) {
            return rules;
        }
    }
    return JsonGenerator;
});