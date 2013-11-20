require([
    'jquery',
    'backbone',
    'hbs!templates/usernameForm',
    'hbs!templates/repoDetails'
], function ($, Backbone, formTmpl, repoDetails) {

    'use strict';

    // Repositories
    var RepoModel = Backbone.Model.extend({}),

        ReposCollection = Backbone.Collection.extend({
            model: RepoModel,
            url: function(){
                return window.APP_CONFIG.apiUrl + '/users/' + this.userName + '/repos';
            },
            getCommonLanguage: function(){
                var mostPopularLanguage = null,
                    langsCount = {}, maxCount = 0,
                    langs = _.compact(this.pluck("language"));

                if (langs.length) {
                    langsCount = _.countBy(langs, function(lang){
                        return lang;
                    });

                    _.each(langsCount, function(count, lang){
                        if (count > maxCount) {
                            mostPopularLanguage = lang;
                            maxCount = count;
                        }
                    });
                }
                return mostPopularLanguage;
            }
        }),

        RepositoriesAnalysisView = Backbone.View.extend({
            className: 'centered-content repos',
            template: repoDetails,

            ui: {
                text: '.text',
                username: '.username',
                info: '.info',
                noReposMsg: '.alert-warning'
            },

            initialize: function(opts){
                if (opts.collection) {
                    this.listenTo(opts.collection, 'sync', this.refresh);
                }
            },

            render: function(){
                var self = this;

                this.$el.html(this.template());

                _.each(this.ui, function(val, key){
                    self.ui[key] = self.$(val);
                });

                return this;
            },

            refresh: function(collection){
                var commonLanguage = this.collection.getCommonLanguage();

                this.ui.text.text();

                if (!commonLanguage) {
                    this.ui.noReposMsg.addClass('in');
                    this.ui.info.fadeOut();
                } else {
                    this.ui.noReposMsg.removeClass('in');
                    this.ui.text.text(commonLanguage);
                    this.ui.username.text(collection.userName);
                    this.ui.info.fadeIn();
                }
            }

        });

    // Username check
    var UsernameFormView = Backbone.View.extend({
        template: formTmpl,

        events: {
            'click .js-check-user:not(.disabled)' : 'onSubmit',
            'keyup .git-user-name': 'onUsernameChange'
        },

        initialize: function(){
            _.bindAll(this, 'onUsernameChange');
        },

        render: function(){
            this.$el.html(this.template());
            return this;
        },

        onUsernameChange: function(e){
            this.$('.js-check-user').toggleClass('disabled', this.getUserName() ? false : true);
            this.$('.alert').removeClass('in');
            this.trigger('userNameChanged');
        },

        getUserName: function(){
            var username = $.trim(this.$('.git-user-name').val());
            return username;
        },

        onSubmit: function(e) {
            var self = this,
                username = this.getUserName();

            e.preventDefault();

            var promise = $.ajax({
                url: window.APP_CONFIG.apiUrl + '/users/' + username
            });

            $.when(promise).then(function(){
                self.trigger('userExists', username);
            }, function(){
                self.$('.alert.alert-warning').addClass('in');
            });
        }
    });

    // APP View
    var AppView = Backbone.View.extend({
        el: $('#app'),

        ui: {
            content: $('#content'),
            form: $('#usersForm'),
        },

        initialize: function() {
            this.repositories = new ReposCollection();
            this.userCheckform = new UsernameFormView();
            this.reposAnalisis = new RepositoriesAnalysisView({
                collection: this.repositories
            });

            this.listenTo(this.userCheckform, 'userExists', this.displayRepository);
        },

        displayRepository: function(username){
            this.repositories.userName = username;
            this.repositories.fetch();
        },

        render: function() {
            this.ui.content.html(this.reposAnalisis.render().$el);
            this.ui.form.html(this.userCheckform.render().$el);
            return this;
        }

    });

    var App = new AppView().render();

    return App;
});