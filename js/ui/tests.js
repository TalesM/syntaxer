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
		var whitespace = new RegExp(analyzer.whitespace);
		var regexes = [], strings = [];
		var terminals = analyzer.terminals;
		for(var tokenName in terminals){
			if(terminals[tokenName] === true){
				strings.push(tokenName);
			} else {
				regexes.push([tokenName, new RegExp(terminals[tokenName])]);
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

	$('#jVerifyTokens').click(function() {
		log('Verifying Tokens...');
		var tokens = $('#jInputTokens').val();
		var analyzer = domParser.parse($('#output'), new JsonGenerator());
		try {
			analyzeTokens(tokens, analyzer);
			log('Passed');
		} catch(error){
			log('Invalid');
			console.error(error);
		}
	});
});