define({
    baseUrl: 'src/ext',
    paths: {
        templ: '../../templ/',
        tests: '../../tests/',
        lib: '../lib/',
        ui: '../ui/',
        util: '../util/',
        jquery: 'jquery-2.1.3.min',
        mustache: 'mustache.min',
        QUnit: 'qunit-1.18.0',
    },
    stache: {
        // extension: '.stache', // default = '.html'
        path: 'templ/' // default = ''
    },
    stubModules: ['text', 'stache'],
    include: ['ui/main'],
});
