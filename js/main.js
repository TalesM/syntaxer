requirejs.onError = function (err) {
    console.error(err);
};
window.onerror = function (err) {
    console.error(err);
};

require(['js/config.js'], 
function (config) {
    require.config(config);
    require(['ui/syntax', 'ui/export', 'util/templates', 'ui/semantics', 'ui/tests', 'text!templ/model.syntax'], 
    function (syntaxUi,    exportUi,    templates ,       semantics,      tests,      modelSyntax) {
    });
});
