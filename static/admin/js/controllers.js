/**
 * Created by matteo on 27/08/14.
 */
var yakAdminControllers = angular.module('yakAdminControllers', ['ui.bootstrap']);

yakAdminControllers.controller('DocumentListCtrl', ['$scope', '$http',
	function($scope, $http) {
		$http.get('../documents').success(function(data) {
			$scope.documents = data._items;
		});

		$scope.openDetail = function(name){
			location.href = "#/documents/"+encodeURIComponent(name);
		}
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
				scope: $scope,
				backdrop: 'static',
				controller: function($scope, $modalInstance){
					$scope.ok = function () {
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
						location.href = "#/documents";
					};

				},
				size: 'lg'
			});
		});

	}
]);

