/**
 * Created by matteo on 27/08/14.
 */
var adminApp = angular.module('adminApp', []);

adminApp.controller('DocumentListCtrl', function($scope) {
	$scope.documents =[
		{"name": "pippo", "category": "projects"},
		{"name": "pluto", "category": "docs"}
	]
})