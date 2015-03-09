define(['lib/DomParser', 'lib/JsonGenerator','util/utility', 'domReady!'],
function(domParser,       JsonGenerator,      utility,  doc) {
	'use strict'
	var $logs = $('#jLogs');
	function log () {
		var text = '';
		for (var i = 0; i < arguments.length; i++) {
			text += arguments[i]
		};
		utility.resizeTextArea($logs.val($logs.val()+text+'\n'));
	}

	/**
	 * Analyzes a string and return a list of tokens.
	 * @param  {string} str      tokens.
	 * @param  {object} analyzer the analyzer.
	 * @return {array}           the tokens as string
	 * @throws {Error} If it can't analyse.
	 */
	function analyzeTokens(str, analyzer) {
		var whitespace = new RegExp('^'+analyzer.whitespace);
		var regexes = [], strings = [];
		var terminals = analyzer.terminals;
		for(var tokenName in terminals){
			if(terminals[tokenName] === true){
				strings.push(tokenName);
			} else {
				regexes.push([tokenName, new RegExp('^'+terminals[tokenName])]);
			}
		}
		var tokens = [];
		while(str){
			var m;
			if(m = str.match(whitespace)){
				str = str.slice(m[0].length);
				continue
			}
			if(regexes.some(function(repr) {
				var m = str.match(repr[1])
				if(m){
					if(m[1]){
						tokens.push([repr[0], m[1]]);
					}else {
						tokens.push([repr[0]]);
					}
					str = str.slice(m[0].length);
					return true;
				}
				return false;
			})){
				continue;
			}
			if(strings.some(function(token) {
				if(str.indexOf(token)===0){
					str = str.slice(token.length);
					tokens.push([token]);
					return true;
				}
				return false;
			})){
				continue;
			}
			throw Error('Invalid Token at: "'+str+'"');
		}
		return tokens;
	}

	function verifySyntax (tokens, analyzer) {
		var state = analyzer.start;
		var productions = analyzer.productions;
		var ast;
		function doAnalysis (tokens, state) {
			var production = productions[state];
			if(!production){
				console.log(state);
				throw new Error('production named "'+state+'" not found');
			}
			PRODLOOP:
			for (var i = 0; i < production.length; i++) {
				var definition = production[i];
				var localTokens = tokens;
				var localAst = {};
				for (var j = 0; j < definition.length; j++) {
					var item = definition[j];
					var token = localTokens[0];
					if(!token){
						continue PRODLOOP;
					}
					if(item.terminal){
						if(item.item !== token[0]){
							continue PRODLOOP;
						}
						if(token.length > 1){
							localAst[item.item] = token[1];
						}
						localTokens = localTokens.slice(1);
					}else {
						var choosen = doAnalysis(localTokens, item.item);
						if(!choosen){
							continue PRODLOOP;
						}
						localAst[item.item] = ast;
						localTokens = localTokens.slice(choosen);
					}
				}
				ast = localAst;
				return tokens.length - localTokens.length;
			}
			return null;
		};
		return doAnalysis(tokens, state) === tokens.length?ast:null;
	}

	$('#jVerifyTokens').click(function() {
		log('Verifying Tokens...');
		var tokens = $('#jTestText').val();
		var analyzer = domParser.parse($('#output'), new JsonGenerator());
		try {
			var toks = analyzeTokens(tokens, analyzer);
			log('Passed');
			console.info(toks);
		} catch(error){
			log('Invalid');
			console.error(error);
		}
	});
	$('#jGenerateTokens').click(function() {
		log('Compiling Tokens...');
		var tokens = $('#jTestText').val();
		var analyzer = domParser.parse($('#output'), new JsonGenerator());
		try {
			var toks = analyzeTokens(tokens, analyzer);
			log('Passed');
			utility.resizeTextArea($('#jTestTokens').val( JSON.stringify(toks) ));
		} catch(error){
			log('Invalid');
			utility.resizeTextArea($('#jTestTokens').val('Error: '+error.toString()));
		}
	});

	$('#jVerifySyntax').click(function() {
		log('Verifying Syntax-only...');
		var tokens = JSON.parse($('#jTestTokens').val());
		var analyzer = domParser.parse($('#output'), new JsonGenerator());
		try {
			if(verifySyntax(tokens, analyzer)){
				log('Passed');
			} else {
				log('Rejected');
			}
		} catch(error){
			log('Error');
			console.error(error);
		}
	});

	$('#jGenerateAST').click(function() {
		log('Generating AST...');
		var tokens = JSON.parse($('#jTestTokens').val());
		var analyzer = domParser.parse($('#output'), new JsonGenerator());
		try {
			var ast = verifySyntax(tokens, analyzer);
			if(ast){
				log('Passed');
				console.log(ast);
				$('#jTestAST').val(JSON.stringify(ast));
			} else {
				log('Rejected');
			}
		} catch(error){
			log('Error');
			console.error(error);
		}
	});
});