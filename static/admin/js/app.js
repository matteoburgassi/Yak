var yakAdmin = angular.module('yakAdmin', [
	'ui.router',
    'angular.filter',
	'yakAdminControllers'
]);

yakAdmin.config(
	function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/documents");
		$stateProvider
			.state('documents', {
				url:            "/documents",
				templateUrl:    "templates/document_list.html",
				controller:     "DocumentListCtrl"
			})
            .state('add', {
                url:            "/documents/add",
                templateUrl:    "templates/document_list.html",
                controller:     "DocumentAddCtrl"
            })
			.state('documentDetail', {
				url:            "/documents/:id",
				templateUrl:    "templates/document_list.html",
				controller:     "DocumentDetailCtrl"
			})
            .state('documentEdit', {
				url:            "/documents/edit/:id",
				templateUrl:    "templates/document_list.html",
				controller:     "DocumentEditCtrl"
			})

	}
)

