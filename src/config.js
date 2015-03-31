define({
    baseUrl: 'src/ext',
    paths: {
        templ: '../../templ/',
        lib: '../lib/',
        ui: '../ui/',
        util: '../util/',
        jquery: 'jquery-2.1.3.min',
        mustache: 'mustache.min',
    },
    shim: {
        'jquery.mustache': {
            deps: ['mustache'], //TODO: PUT jquery here
            exports: 'jQuery.fn.Mustache',
            init: function(mustache) {
                this.Mustache = mustache;
            },
        },
    },
});
