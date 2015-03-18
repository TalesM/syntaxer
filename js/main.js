requirejs.onError = function (err) {
    console.error(err);
};
window.onerror = function (err) {
    console.error(err);
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
