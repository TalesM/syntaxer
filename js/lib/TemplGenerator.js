define(function function_name () {
    'use strict';
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
        this.semanticToken = function (token) {
            return {
                link: '#func-'+token,
                classes: 'semantic',
                item: token,
            };
        };
        this.regexToken = function(token) {
            return {
                classes: 'regex',
                item: token,
            };
        };
        this.terminalToken = function(token) {
            foundTokens[token] = (foundTokens[token]||0)+1;
            return {
                link: '#rule-'+token,
                classes: 'terminal',
                item: token.toUpperCase(),
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

        this.startProduction = function(name) {
            return {
                ruleName: name,
                ruleId: name,
                classes: 'production',
                definitions: [],
            };
        };
        this.addDefinition = function(definitions, definition) {
            definitions.definitions.push({
                newRule: !definitions.definitions.length,
                ruleDef: definition,
            });
            return definitions;
        };
        this.generateProduction = function(definitions) {
            return definitions;
        }

        //Syntax
        this.start = function() {
            return {
                productions: [],
                terminals: [],
                whitespace: null,
            };
        };
        this.addProduction = function (rules, production) {
            rules.productions.push(production);
            return rules;
        }
        this.addTerminal = function(rules, terminalName, terminalRegex) {
            if(!terminalRegex){
                return rules;
            }
            rules.terminals.push({
                ruleName: terminalName.toUpperCase(),
                ruleId: terminalName,
                newRule: true,
                ruleDef: [terminalRegex],
                classes: 'terminal',
            });
            return rules;
        };
        this.addWhitespace = function(rules, terminalRegex) {
            rules.whitespace = {
                ruleName: '<whitespace>',
                ruleId: '_whitespace_',
                newRule: true,
                ruleDef: [terminalRegex],
                classes: 'terminal',
            };
            return rules;
        };
        this.generate = function(rules) {
            var even = true;
            function evenizator (val) {
                val.even = even;
                even = !even;
            }
            rules.productions.forEach(evenizator);
            rules.terminals.forEach(evenizator);
            evenizator(rules.whitespace);
            return rules;
        }
    };
    return TemplGenerator;
});