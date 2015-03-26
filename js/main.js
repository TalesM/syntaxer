requirejs.onError = function (err) {
    console.error(err);
};
window.onerror = function (err) {
    console.error(err);
};

require(['js/config.js'], 
function (config) {
    require.config(config);
    require(['util/templates', 'ui/syntax', 'ui/export', 'ui/semantics', 'ui/tests'], 
    function (templates ,       syntaxUi,    exportUi,    semantics,      tests    ) {
    });
});
