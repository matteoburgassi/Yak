var yakAdmin = angular.module('yakAdmin', [
	'ui.router',
	'yakAdminControllers'
]);

yakAdmin.config(
	function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/documents");
		$stateProvider
			.state('documents', {
				url: "/documents",
				templateUrl: "templates/document_list.html",
				controller: "DocumentListCtrl"
			})
			.state('documentDetail', {
				url: "/documents/:id",
				templateUrl: "templates/document_list.html",
				controller: "DocumentDetailCtrl"
			})
	}
)