define(function () {
     function TextGenerator (foundTokens, spaces) {
        //Attrib
        var freeSpace;
        this.spaces = function (val) {
            spaces = val;
            freeSpace = '';
            for (var i = 0; i < spaces; i++) {
                freeSpace += ' ';
            };
        }
        this.spaces(spaces||15)

        //Tokens
        this.productionToken = function (token) {
            return token;
        }

        this.semanticToken = function (token) {
            return '{'+token+'}';
        }

        this.regexToken = function (token) {
            return '/'+token+'/';
        }

        this.terminalToken = function (token) {
            token = token.toUpperCase();
            if(foundTokens[token]){
                --foundTokens[token];
            }
            return token;
        }

        //Definitions
        this.startDefinition = function () {
            return '';
        }

        this.addToken = function (tokens, token) {
            return tokens + token + ' ';
        }

        this.generateDefinition = function (tokens) {
            return tokens;
        }

        //Rules
        var first = false;
        this.startRule = function (ruleName) {
            var relSpace = Math.max(0, spaces - ruleName.length)
            for (var i = 0; i < relSpace; i++) {
                ruleName += ' ';
            };
            first = true;
            return ruleName;
        }
        this.addDefinition = function (definitions, definition) {
            if(first){
                first = false;
                return definitions + '::= '+ definition + '\n';
            }
            return definitions + freeSpace + '::= '+ definition + '\n';
        }

        this.generateRule = function (definitions) {
            return definitions;
        }

        //Syntax
        this.startSyntax = function() {
            return '';
        };
        this.addRule = function (rules, rule) {
            return rules + rule;
        }
        this.generateSyntax = function(rules) {
            return rules.slice(0, -1);
        }

    }
    return TextGenerator;
});