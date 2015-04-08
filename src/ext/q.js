define(function() {
	var currentName = '';
	var currentTest;
	return {
	load: function(name, parentRequire, onload, config) {
		if(!name){
			if(!currentName){
				onload.error(new Error('q! Called outside a test.'));
				return;
			}
			if(!currentTest){
				onload.error(new Error('q! Called twice.'));
				return;
			}
			QUnit.test( currentName, function( assert ) {
				onload(assert);
				var q = currentTest; 
				currentTest = undefined;
				return q;
			});
			return;
		}
		if(currentName){
			onload.error(new Error('Can not start a test while already running one'));
			return;
		}
		currentName = name;
		currentTest = new Promise(function(resolve, reject) {
			parentRequire([name], function(result) {
				currentName = '';
				onload();
				resolve(result);
			});
		});
	},
}

});