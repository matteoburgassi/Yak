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
            .state('documentAdd', {
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
            .state('authors', {
                url:            "/authors",
                templateUrl:    "templates/authors_list.html",
                controller:     "AuthorsListCtrl"
            })
            .state('authorAdd', {
                url:            "/authors/add",
                templateUrl:    "templates/authors_list.html",
                controller:     "AuthorAddCtrl"
            })
            .state('authorDetail', {
                url:            "/authors/:id",
                templateUrl:    "templates/authors_list.html",
                controller:     "AuthorDetailCtrl"
            })
            .state('authorEdit', {
                url:            "/authors/edit/:id",
                templateUrl:    "templates/authors_list.html",
                controller:     "AuthorEditCtrl"
            })

	}
)

