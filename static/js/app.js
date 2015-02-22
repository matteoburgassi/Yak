var qayin = angular.module('qayin', [
    'ui.router',
    'angular.filter',
    'qayinControllers',
    'ngSanitize'
]);

qayin.config(
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");
        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .state('progetti', {
                url: "/progetti",
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .state('anni', {
                url: "/progetti/:year",
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .state('dettaglio', {
                url: "/progetti/:year/:name",
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .state('team', {
                url: "/team",
                templateUrl: "templates/team.html",
                controller: "designersCtrl"
            })
            .state('designer', {
                url: "/team/:email",
                templateUrl: "templates/team.html",
                controller: "designersDetailCtrl"
            })
            .state('link', {
                url: "/link",
                templateUrl: "templates/custom.html",
                controller: "linkCtrl"
            })
            .state('contatti', {
                url: "/contatti",
                templateUrl: "templates/home.html",
                controller: "homeCtrl"
            })
            .state('profilo', {
                url: "/profilo",
                templateUrl: "templates/custom.html",
                controller: "profileCtrl"
            });

    }
)