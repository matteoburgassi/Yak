/**
 * Created by matteo on 27/08/14.
 */
var yakAdminControllers = angular.module('yakAdminControllers', ['ui.bootstrap', 'angularFileUpload']);

yakAdminControllers.controller('DocumentListCtrl', ['$scope', '$http', '$location',
	function($scope, $http) {
		$http.get('../documents').success(function(data) {
			$scope.documents = data._items;
		});

		$scope.openDetail = function(name){
			location.href = "#/documents/"+encodeURIComponent(name);
		}

        $scope.add = function(){
			location.href = "#/documents/add";
		}


	}
]);

yakAdminControllers.controller('DocumentDetailCtrl', ['$scope', '$http', '$stateParams', '$modal', '$location',
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

                    $scope.delete = function() {
                        var confirmModal = $modal.open({
                            templateUrl: 'templates/confirm.html',
                            scope: $scope,
                            backdrop: 'static',
                            controller: function($scope, $modalInstance){
                                $scope.ok = function () {
                                    console.log("removing", $scope.detail);
                                    for(i=0; i<$scope.detail.images.length; i++){
                                        var path=$scope.detail.images[i].path;
                                        var fileToDelete = path.substring(path.lastIndexOf('/')+1);
                                        $http.delete("../documents/images/upload/"+encodeURI(fileToDelete)).
                                            success(function (data, status, headers, config) {
                                                console.log("deleted", data, status, headers, config);
                                                $scope.detail.images.splice(i,1);
                                            }).
                                            error(function(data, status, headers, config){
                                                console.log("error", data, status, headers, config);
                                            });
                                    }
                                    $http.delete("../documents/"+$scope.detail.name).
                                        success(function(){
                                            console.log("successfully deleted");
                                            $modalInstance.dismiss('cancel');
                                            modalInstance.dismiss('cancel');
                                            location.href = "#/documents";
                                        });

                                };

                                $scope.cancel = function () {
                                    $modalInstance.dismiss('cancel');
                                };

                            },
                            size: 'sm'
                        });
                    }

                    $scope.modify = function(){
                        $modalInstance.dismiss('cancel');
                        location.href = "#/documents/edit/"+encodeURIComponent($scope.detail.name);
                    }

				},
				size: 'lg'
			});
		});

	}
]);

yakAdminControllers.controller('DocumentAddCtrl', ['$scope', '$http', '$stateParams', '$modal', '$location',
	function($scope, $http, $stateParams, $modal, FileUploader) {

        $scope.dummy = {
            "name": "",
            "description": "",
            "category": "",
            "year": 2014,
            "authors": [],
            "images": []
        }


        if (!$scope.documents || $scope.documents.length == 0){
            $http.get('../documents').success(function(data) {
                $scope.documents = data._items;
            });
        }
        var modalInstance = $modal.open({
            templateUrl: 'templates/document_add.html',
            scope: $scope,
            backdrop: 'static',
            controller: function($scope, $modalInstance, FileUploader){
                var uploader = $scope.uploader = new FileUploader({
                    url: "../documents/images/upload/11"
                });

                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                    var path = JSON.parse(headers.location).file[0].path;
                    var name = path.substring(path.lastIndexOf("/")+1);
                    $scope.dummy.images.push(
                        {
                            "nomeFile": fileItem.file.name,
                            "title": fileItem.title,
                            "caption": fileItem.caption,
                            "path": "images/" + name
                        }
                    );
                    console.log("file", name, "completed");
                };

                $scope.ok = function () {
                    console.log("ok");
                };

                $scope.save = function(){
                    console.log("save() called");
                    if(uploader.queue.length==0){
                        uploader.onCompleteAll();
                        return;
                    }
                    uploader.uploadAll();

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    location.href = "#/documents";
                };

                $scope.addAuthor = function(){
                    console.log("addAuthor");
                    $scope.dummy.authors.push(
                        {
                            "name":"",
                            "email":""
                        }
                    )
                }

                $scope.removeAuthor = function(index){
                    $scope.dummy.authors.splice(index,1);
                }


                uploader.onCompleteAll = function(){
                    console.log(JSON.stringify($scope.dummy));
                    //call save here!!!
                    $http.post("../documents", $scope.dummy).
                        success(function(data, status, headers, config){
                            $modalInstance.dismiss('cancel');
                            location.href = "#/documents";
                        }).
                        error(function(data, status, headers, config){});

                }

            },
            size: 'lg'
        });

        function assembleData(){
            var dummy= $scope.dummy;
            console.log(dummy.name, dummy.description, dummy.category, dummy.authors.length);
        }

	}
]);

yakAdminControllers.controller('DocumentEditCtrl', ['$scope', '$http', '$stateParams', '$modal', '$location',
    function($scope, $http, $stateParams, $modal, FileUploader) {
        $http.get('../documents/'+ encodeURIComponent($stateParams.id)).success(function(data) {
        $scope.dummy = data[0];
        $scope.deleteQueue = [];
            if (!$scope.documents || $scope.documents.length == 0) {
                $http.get('../documents').success(function (data) {
                    $scope.documents = data._items;
                });
            }
            var modalInstance = $modal.open({
                templateUrl: 'templates/document_edit.html',
                scope: $scope,
                backdrop: 'static',
                controller: function ($scope, $modalInstance, FileUploader) {
                    var uploader = $scope.uploader = new FileUploader({
                        url: "../documents/images/upload/11"
                    });

                    uploader.onCompleteItem = function (fileItem, response, status, headers) {
                        var path = JSON.parse(headers.location).file[0].path;
                        var name = path.substring(path.lastIndexOf("/") + 1);
                        $scope.dummy.images.push(
                            {
                                "nomeFile": fileItem.file.name,
                                "title": fileItem.title,
                                "caption": fileItem.caption,
                                "path": "images/" + name
                            }
                        );
                        console.log("file", name, "completed");
                    };
                    $scope.removeImage = function(index){
                        $scope.deleteQueue.push($scope.dummy.images[index]);
                        $scope.dummy.images.splice(index, 1);
                    }

                    $scope.ok = function () {
                        console.log("ok");
                    };

                    $scope.save = function () {
                        console.log("save() called");
                        if(uploader.queue.length==0){
                            uploader.onCompleteAll();
                            return;
                        }
                        uploader.uploadAll();

                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                        location.href = "#/documents";
                    };

                    $scope.addAuthor = function () {
                        console.log("addAuthor");
                        $scope.dummy.authors.push(
                            {
                                "name": "",
                                "email": ""
                            }
                        )
                    }

                    $scope.removeAuthor = function (index) {
                        $scope.dummy.authors.splice(index, 1);
                    }


                    uploader.onCompleteAll = function () {
                        console.log(JSON.stringify($scope.dummy));
                        //delete images from disk:
                        for(i=0; i<$scope.deleteQueue.length; i++){
                            var path=$scope.deleteQueue[i].path;
                            var fileToDelete = path.substring(path.lastIndexOf('/')+1);
                            $http.delete("../documents/images/upload/"+encodeURI(fileToDelete)).
                                success(function (data, status, headers, config) {
                                    console.log("deleted", data, status, headers, config);
                                    $scope.deleteQueue.splice(i,1);
                                }).
                                error(function(data, status, headers, config){
                                    console.log("error", data, status, headers, config);
                                });
                        }
                        $http.put("../documents/"+ encodeURI($scope.dummy.name), $scope.dummy).
                            success(function (data, status, headers, config) {
                                $modalInstance.dismiss('cancel');
                                location.href = "#/documents";
                            }).
                            error(function (data, status, headers, config) {
                            });

                    }

                },
                size: 'lg'
            });
        });

    }
]);

