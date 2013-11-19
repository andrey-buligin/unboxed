'use strict';

require.config({
	baseUrl: "./",
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone-amd/backbone',
        underscore: '../bower_components/underscore-amd/underscore',
        hbs: '../bower_components/require-handlebars-plugin/hbs',
        json2 : '../bower_components/require-handlebars-plugin/hbs/json2',
        i18nprecompile: '../bower_components/require-handlebars-plugin/hbs/i18nprecompile',
        handlebars: '../bower_components/require-handlebars-plugin/Handlebars',
    },
    hbs : {
        templateExtension : 'html',
        disableI18n: true
    },
});

//setting up global config
window.APP_CONFIG = {
	apiUrl: 'https://api.github.com'
};

require(['scripts/app'], function(app) {
	console.log('app started', app);
});