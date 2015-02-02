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
                    if($scope.dummy.name == "" || $scope.dummy.name == undefined){
                        alert("name can't be empty!!!")
                        return;
                    }
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
                        if($scope.dummy.name == "" || $scope.dummy.name == undefined){
                            alert("name can't be empty!!!")
                            return;
                        }
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

yakAdminControllers.controller('AuthorsListCtrl', ['$scope', '$http', '$location',
    function($scope, $http) {
        $http.get('../designers').success(function(data) {
            $scope.authors = data._items;
        });

        $scope.openDetail = function(email){
            location.href = "#/authors/"+encodeURIComponent(email);
        }

        $scope.add = function(){
            location.href = "#/authors/add";
        }


    }
]);

yakAdminControllers.controller('AuthorDetailCtrl', ['$scope', '$http', '$stateParams', '$modal', '$location',
    function($scope, $http, $stateParams, $modal) {
        if (!$scope.documents || $scope.documents.length == 0){
            $http.get('../designers').success(function(data) {
                $scope.documents = data._items;
            });
        }
        $http.get('../designers/'+ encodeURIComponent($stateParams.id)).success(function(data) {
            $scope.detail = data[0];
            var modalInstance = $modal.open({
                templateUrl: 'templates/author_detail.html',
                scope: $scope,
                backdrop: 'static',
                controller: function($scope, $modalInstance){

                    $scope.ok = function () {
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                        location.href = "#/authors";
                    };

                    $scope.delete = function() {
                        var confirmModal = $modal.open({
                            templateUrl: 'templates/confirm.html',
                            scope: $scope,
                            backdrop: 'static',
                            controller: function($scope, $modalInstance){
                                $scope.ok = function () {
                                    console.log("removing", $scope.detail);
                                    for(i=0; i<$scope.detail.photo.length; i++){
                                        var path=$scope.detail.photo[i].path;
                                        var fileToDelete = path.substring(path.lastIndexOf('/')+1);
                                        $http.delete("../designers/images/upload/"+encodeURI(fileToDelete)).
                                            success(function (data, status, headers, config) {
                                                console.log("deleted", data, status, headers, config);
                                                $scope.detail.photo.splice(i,1);
                                            }).
                                            error(function(data, status, headers, config){
                                                console.log("error", data, status, headers, config);
                                            });
                                    }
                                    $http.delete("../designers/"+encodeURIComponent($scope.detail.email)).
                                        success(function(){
                                            console.log("successfully deleted");
                                            $modalInstance.dismiss('cancel');
                                            modalInstance.dismiss('cancel');
                                            location.href = "#/authors";
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
                        location.href = "#/authors/edit/"+encodeURIComponent($scope.detail.email);
                    }

                },
                size: 'lg'
            });
        });

    }
]);

yakAdminControllers.controller('AuthorAddCtrl', ['$scope', '$http', '$stateParams', '$modal', '$location',
    function($scope, $http, $stateParams, $modal, FileUploader) {

        $scope.reset = function(){
            $scope.dummy = {
                photo:[],
                name: "",
                secondName: "",
                email: "",
                address: "",
                phone: [],
                school: [],
                experiences: []
            }
        };

        $scope.reset();

        $scope.opened = false;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.format = 'dd/MM/yyyy';

        $scope.open = function($event, index, dataType, type) {
            console.log($scope.opened);
            $event.preventDefault();
            $event.stopPropagation();
            switch (type){
                case 'e':{
                    dataType==='start'? $scope.dummy.experiences[index].start.opened = true:$scope.dummy.experiences[index].end.opened = true;
                    break;
                };
                case 's':{
                    dataType==='start'? $scope.dummy.school[index].start.opened = true:$scope.dummy.school[index].end.opened = true;
                    break;
                }
            }

        };

        if (!$scope.documents || $scope.documents.length == 0){
            $http.get('../designers').success(function(data) {
                $scope.documents = data._items;
            });
        }
        var modalInstance = $modal.open({
            templateUrl: 'templates/author_add.html',
            scope: $scope,
            backdrop: 'static',
            controller: function($scope, $modalInstance, FileUploader){
                var uploader = $scope.uploader = new FileUploader({
                    url: "../designers/images/upload/11"
                });

                uploader.onCompleteItem = function(fileItem, response, status, headers) {
                    var path = JSON.parse(headers.location).file[0].path;
                    var name = path.substring(path.lastIndexOf("/")+1);
                    $scope.dummy.photo.push(
                        {
                            "nomeFile": fileItem.file.name,
                            "path": "images/" + name
                        }
                    );
                    console.log("file", name, "completed");
                };

                $scope.ok = function () {
                    console.log("ok");
                };

                uploader.onAfterAddingFile = function(fileItem) {
                    console.info('onAfterAddingFile', fileItem);
                    $('div#imgAdder').remove();
                    if(uploader.queue.length>1)
                        uploader.queue.splice(0, 1);
                };


                $scope.save = function(){
                    console.log("save() called", $scope.dummy.email);
                    if($scope.dummy.email==="" || $scope.dummy.email===undefined) {
                        alert("email cannot be empty!!!");
                        return;
                    }
                    if(uploader.queue.length==0){
                        uploader.onCompleteAll();
                        return;
                    }
                    uploader.uploadAll();

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    location.href = "#/authors";
                };

                $scope.addPhone = function(){
                    console.log("add phone");
                    $scope.dummy.phone.push(
                        {
                            number: ""
                        }
                    )
                }

                $scope.removePhone = function(index){
                    $scope.dummy.phone.splice(index,1);
                }

                $scope.addSchool = function(){
                    console.log("addAuthor");
                    $scope.dummy.school.push(
                        {
                            start: {date: new Date(), opened: false},
                            end: {date: new Date(), opened: false},
                            description: ""
                        }
                    )
                }

                $scope.removeSchool = function(index){
                    $scope.dummy.school.splice(index,1);
                }

                $scope.addExperience = function(){
                    console.log("addAuthor");
                    $scope.dummy.experiences.push(
                        {
                            start: {date: new Date(), opened: false},
                            end: {date: new Date(), opened: false},
                            description: ""
                        }
                    )
                }

                $scope.removeExperience = function(index){
                    $scope.dummy.experiences.splice(index,1);
                }




                uploader.onCompleteAll = function(){
                    console.log(JSON.stringify($scope.dummy));
                    //call save here!!!
                    $http.post("../designers", $scope.dummy).
                        success(function(data, status, headers, config){
                            $modalInstance.dismiss('cancel');
                            location.href = "#/authors";
                        }).
                        error(function(data, status, headers, config){
                            alert("some error occurred");
                        });

                }

            },
            size: 'lg'
        });

        function assembleData(){
            var dummy= $scope.dummy;
            console.log(JSON.stringify(dummy));
        }

    }
]);

yakAdminControllers.controller('AuthorEditCtrl', ['$scope', '$http', '$stateParams', '$modal', '$location',
    function ($scope, $http, $stateParams, $modal, FileUploader) {
        $http.get('../designers/' + encodeURIComponent($stateParams.id)).success(function (data) {
            $scope.dummy = data[0];
            $scope.oldEmail = $scope.dummy.email;


            $scope.reset = function () {
                $scope.dummy = {
                    photo: [],
                    name: "",
                    secondName: "",
                    email: "",
                    address: "",
                    phone: [],
                    school: [],
                    experiences: []
                }
            };

            $scope.deleteQueue = [];

            $scope.opened = false;

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.format = 'dd/MM/yyyy';

            $scope.open = function ($event, index, dataType, type) {
                console.log($scope.opened);
                $event.preventDefault();
                $event.stopPropagation();
                switch (type) {
                    case 'e':
                    {
                        dataType === 'start' ? $scope.dummy.experiences[index].start.opened = true : $scope.dummy.experiences[index].end.opened = true;
                        break;
                    }
                        ;
                    case 's':
                    {
                        dataType === 'start' ? $scope.dummy.school[index].start.opened = true : $scope.dummy.school[index].end.opened = true;
                        break;
                    }
                }

            };

            if (!$scope.documents || $scope.documents.length == 0) {
                $http.get('../designers').success(function (data) {
                    $scope.documents = data._items;
                });
            }
            var modalInstance = $modal.open({
                templateUrl: 'templates/author_edit.html',
                scope: $scope,
                backdrop: 'static',
                controller: function ($scope, $modalInstance, FileUploader) {
                    var uploader = $scope.uploader = new FileUploader({
                        url: "../designers/images/upload/11"
                    });

                    uploader.onCompleteItem = function (fileItem, response, status, headers) {
                        var path = JSON.parse(headers.location).file[0].path;
                        var name = path.substring(path.lastIndexOf("/") + 1);
                        $scope.dummy.photo.push(
                            {
                                "nomeFile": fileItem.file.name,
                                "path": "images/" + name
                            }
                        );
                        console.log("file", name, "completed");
                    };

                    $scope.ok = function () {
                        console.log("ok");
                    };
                    $scope.oldPhotoDeleted = false;

                    uploader.onAfterAddingFile = function (fileItem) {
                        console.info('onAfterAddingFile', fileItem);

                        $('div#imgAdder').remove();
                        if (uploader.queue.length > 1) {
                            uploader.queue.splice(0, 1);
                        }
                        if($scope.oldPhotoDeleted==false){
                            $scope.deleteQueue.push($scope.dummy.photo[0]);
                            $scope.oldPhotoDeleted = true;
                        }
                        $scope.dummy.photo=[];

                    };


                    $scope.save = function () {
                        console.log("save() called", $scope.dummy.email);
                        if($scope.dummy.email==="" || $scope.dummy.email===undefined) {
                            alert("email cannot be empty!!!");
                            return;
                        }
                        if (uploader.queue.length == 0) {
                            uploader.onCompleteAll();
                            return;
                        }
                        uploader.uploadAll();

                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                        location.href = "#/authors";
                    };

                    $scope.addPhone = function () {
                        console.log("add phone");
                        $scope.dummy.phone.push(
                            {
                                number: ""
                            }
                        )
                    }

                    $scope.removePhone = function (index) {
                        $scope.dummy.phone.splice(index, 1);
                    }

                    $scope.addSchool = function () {
                        console.log("addAuthor");
                        $scope.dummy.school.push(
                            {
                                start: {date: new Date(), opened: false},
                                end: {date: new Date(), opened: false},
                                description: ""
                            }
                        )
                    }

                    $scope.removeSchool = function (index) {
                        $scope.dummy.school.splice(index, 1);
                    }

                    $scope.addExperience = function () {
                        console.log("addAuthor");
                        $scope.dummy.experiences.push(
                            {
                                start: {date: new Date(), opened: false},
                                end: {date: new Date(), opened: false},
                                description: ""
                            }
                        )
                    }

                    $scope.removeExperience = function (index) {
                        $scope.dummy.experiences.splice(index, 1);
                    }


                    uploader.onCompleteAll = function () {
                        for(i=0; i<$scope.deleteQueue.length; i++){
                            var path=$scope.deleteQueue[i].path;
                            var fileToDelete = path.substring(path.lastIndexOf('/')+1);
                            $http.delete("../designers/images/upload/"+encodeURI(fileToDelete)).
                                success(function (data, status, headers, config) {
                                    console.log("deleted", data, status, headers, config);
                                    $scope.deleteQueue.splice(i,1);
                                }).
                                error(function(data, status, headers, config){
                                    console.log("error", data, status, headers, config);
                                });
                        };
                        $http.put("../designers/"+ encodeURIComponent($scope.oldEmail), $scope.dummy).
                            success(function (data, status, headers, config) {
                                $modalInstance.dismiss('cancel');
                                location.href = "#/authors";
                            }).
                            error(function (data, status, headers, config) {
                            });
                    }

                },
                size: 'lg'
            });

            function assembleData() {
                var dummy = $scope.dummy;
                console.log(JSON.stringify(dummy));
            }

        });
    }
]);


