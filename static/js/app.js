var qayin = angular.module('qayin', [
    'ui.router',
    'angular.filter',
    'qayinControllers'
]);

qayin.config(
    function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home");
        $stateProvider
            .state('home', {
                url:            "/home",
                templateUrl:    "templates/home.html",
                controller:     "homeCtrl"
            })
            .state('progetti', {
                url:            "/progetti",
                templateUrl:    "templates/home.html",
                controller:     "homeCtrl"
            })
            .state('anni', {
                url:            "/progetti/:year",
                templateUrl:    "templates/home.html",
                controller:     "homeCtrl"
            })
            .state('dettaglio', {
                url:            "/progetti/:year/:name",
                templateUrl:    "templates/home.html",
                controller:     "homeCtrl"
            })
            .state('team', {
                url:            "/team",
                templateUrl:    "templates/home.html",
                controller:     "homeCtrl"
            })
            .state('link', {
                url:            "/link",
                templateUrl:    "templates/home.html",
                controller:     "homeCtrl"
            })
            .state('contatti', {
                url:            "/contatti",
                templateUrl:    "templates/home.html",
                controller:     "homeCtrl"
            });
    }
)