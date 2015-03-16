requirejs.onError = function (err) {
    /* 
        err has the same info as the errback callback:
        err.requireType & err.requireModules
    */
    console.error(err);
    // Be sure to rethrow if you don't want to
    // blindly swallow exceptions here!!!
};
require.config({
    baseUrl: 'js/ext',
    paths: {
        templ: '../../templ/',
        lib: '../lib/',
        ui: '../ui/',
        util: '../util/',
    }
});
require(['ui/syntax', 'ui/export', 'util/templates', 'ui/semantics', 'ui/tests', 'text!templ/model.syntax'], 
function (syntaxUi,    exportUi,    templates ,       semantics,      tests,      modelSyntax) {
    'use strict'
});