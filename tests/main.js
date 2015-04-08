requirejs.onError = function (err) {
    console.error(err);
};
window.onerror = function (err) {
    console.error(err);
};

require(['src/config.js'], 
function (config) {
    require.config(config);
    require(['q!tests/tests'], function (main) {});
});
