/**
 * Created by matteo on 27/08/14.
 */
var yakAdminControllers = angular.module('yakAdminControllers', ['ui.bootstrap']);

yakAdminControllers.controller('DocumentListCtrl', ['$scope', '$http',
	function($scope, $http) {
		$http.get('../documents').success(function(data) {
			$scope.documents = data._items;
		});
	}
]);

yakAdminControllers.controller('DocumentDetailCtrl', ['$scope', '$http', '$stateParams', '$modal',
	function($scope, $http, $stateParams, $modal) {
		if (!$scope.documents || $scope.documents.length == 0){
			$http.get('../documents').success(function(data) {
				$scope.documents = data._items;
			});
		}
		$http.get('../documents/'+ encodeURIComponent($stateParams.id)).success(function(data) {
			$scope.detail = data[0];
			var modalInstance = $modal.open({
				templateUrl: 'templates/document_detail.html',
				controller: function(){
					console.log($scope.detail);
				},
				size: 'lg'
			});
		});

	}
]);

