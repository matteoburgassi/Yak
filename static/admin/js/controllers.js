/**
 * Created by matteo on 27/08/14.
 */
var adminApp = angular.module('adminApp', []);

adminApp.controller('DocumentListCtrl', function($scope, $http) {
	$http.get('../documents').success(function(data) {
		$scope.documents = data._items;
	});
})