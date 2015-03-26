define({
    baseUrl: 'js/ext',
    paths: {
        templ: '../../templ/',
        lib: '../lib/',
        ui: '../ui/',
        util: '../util/',
        jquery: 'jquery-2.1.3.min',
        Mustache: 'mustache.min',
    },
    shim: {
        'jquery.mustache': {
            deps: ['Mustache'], //TODO: PUT jquery here
            exports: 'jQuery.fn.mustache',
            init: function(Mustache) {
                this.Mustache = Mustache;
            },
        },
    },
});
