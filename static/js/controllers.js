var qayinControllers = angular.module('qayinControllers', [
    'ui.bootstrap',
    'angular.filter',
    'ui.router'
]);

qayinControllers.controller('homeCtrl', ['$scope', '$http', '$location', '$state',
    function($scope, $http, $location, $stateParams) {
        console.log("homeCtrl", $stateParams.params);
        $scope.params = $stateParams.params;
        $scope.showLoader=function(toggle){
            var loader=$('#loader');
            if(toggle)
                loader.fadeIn("slow");
            else
                loader.fadeOut("slow");
        }
        if($scope.projects === null || $scope.projects===undefined){
            $http.get('/documents').success(function(data) {
                $scope.projects = data._items;
                $scope.menuData = createMenuData($scope.projects);
                $scope.slideShow = createSlideShow($scope.params);
                $scope.showLoader(false);
            });
        }else{
            $scope.slideShow = createSlideShow($scope.params);
            $scope.showLoader(false);
        };

        $scope.setCarouselHeight = function(){
            return {
                height: (($('#carousel').width())*9/16)+'px'
            }
        };
        $scope.setDetailHeight = function(){
            return {
                height: ((($('#carousel').width())*9/16)-($('#detailCategory').height()+$('#detailTitle').height())-30)+'px'
            }
        };

        $scope.menuClass = function(page){
            var current = $location.path().substring(1);
            if(page === current) {
                return "selected"
            } else {
              if(current.indexOf(page)>=0)return "visible";
            }
        };


        var createMenuData = function(data){
            result = findYears(data);
            for(var i=0; i<result.length; i++ ){
                for(var j=0; j<data.length; j++){
                    if(result[i].year === data[j].year){
                        if(result[i].projects==null || result[i].projects=="undefined")
                            result[i].projects=[];
                        result[i].projects.push(data[j]);
                    }
                }
            }
            return result;
        };

        var contains = function(data, contained){
            if(data===null || data == undefined) return false;
            for(var i=0; i<data.length; i++){
                if(data[i].year == contained) return true;
            }
            return false;
        };

        var findYears = function(data){
            var result = []
            for(var i=0; i<data.length; i++) {
                if (!contains(result, data[i].year)) {
                    result.push({"year": data[i].year});
                }
            }
            return result;
        };

        function createSlideShow(params){
            console.log("createSlideShow", params);
            var year = params.year;
            var name = params.name;
            var data = $scope.projects;
            result=[];
            console.log("year:",year,"name: ", name,"params: ", params);
            if((year==null || year==undefined) && (name == null||name==undefined)){
                console.log("no params");
                for(i=0; i<data.length; i++){
                    var image = data[i].images[0];
                    if(image!= null || image != undefined)
                        result.push(image);
                }
                return result;
            }
            if((year!=null||year!=undefined) && (name==null || name==undefined)){
                console.log("only year");
                for(i=0; i<data.length; i++){
                    if(data[i].year==year){
                        var image = data[i].images[0];
                        if(image!= null || image != undefined)
                            result.push(image);
                    }
                }
                return result;
            }
            if(name!=null || name!=undefined){
                console.log("year+name");
                for(i=0; i<data.length; i++){
                    if(data[i].name==name){
                        $scope.projectDetail = data[i];
                        for(var j=0; j<data[i].images.length; j++){
                            var image = data[i].images[j];
                            if(image!= null || image != undefined)
                                result.push(image);

                        }
                    }
                }
            }

            return result;
        }
    }
]);

qayinControllers.controller('designersCtrl', ['$scope', '$http', '$location', '$state',
    function($scope, $http, $location, $stateParams) {
        console.log("designersCtrl", $stateParams.params);
        $scope.params = $stateParams.params;
        $scope.showLoader=function(toggle){
            var loader=$('#loader');
            if(toggle)
                loader.fadeIn("slow");
            else
                loader.fadeOut("slow");
        }
        if($scope.projects === null || $scope.projects===undefined || $scope.designers === null || $scope.designers ===undefined){
            $http.get('/documents').success(function(data) {
                $http.get('/designers').success(function(designers){
                    $scope.projects = data._items;
                    $scope.menuData = createMenuData($scope.projects);
                    $scope.slideShow = createSlideShow($scope.params);
                    $scope.designers = designers._items;
                    $scope.showLoader(false);
                    console.log($scope.designers);
                })
            });
        }else{
            $scope.slideShow = createSlideShow($scope.params);
            $scope.showLoader(false);
        };

        $scope.setCarouselHeight = function(){
            return {
                height: (($('#carousel').width())*9/16)+'px'
            }
        };
        $scope.setDetailHeight = function(){
            return {
                height: ((($('#carousel').width())*9/16)-($('#detailCategory').height()+$('#detailTitle').height())-30)+'px'
            }
        };

        $scope.menuClass = function(page){
            var current = $location.path().substring(1);
            if(page === current) {
                return "selected"
            } else {
                if(current.indexOf(page)>=0)return "visible";
            }
        };


        var createMenuData = function(data){
            result = findYears(data);
            for(var i=0; i<result.length; i++ ){
                for(var j=0; j<data.length; j++){
                    if(result[i].year === data[j].year){
                        if(result[i].projects==null || result[i].projects=="undefined")
                            result[i].projects=[];
                        result[i].projects.push(data[j]);
                    }
                }
            }
            return result;
        };

        var contains = function(data, contained){
            if(data===null || data == undefined) return false;
            for(var i=0; i<data.length; i++){
                if(data[i].year == contained) return true;
            }
            return false;
        };

        var findYears = function(data){
            var result = []
            for(var i=0; i<data.length; i++) {
                if (!contains(result, data[i].year)) {
                    result.push({"year": data[i].year});
                }
            }
            return result;
        };

        function createSlideShow(params){
            console.log("createSlideShow", params);
            var year = params.year;
            var name = params.name;
            var data = $scope.projects;
            result=[];
            console.log("year:",year,"name: ", name,"params: ", params);
            if((year==null || year==undefined) && (name == null||name==undefined)){
                console.log("no params");
                for(i=0; i<data.length; i++){
                    var image = data[i].images[0];
                    if(image!= null || image != undefined)
                        result.push(image);
                }
                return result;
            }
            if((year!=null||year!=undefined) && (name==null || name==undefined)){
                console.log("only year");
                for(i=0; i<data.length; i++){
                    if(data[i].year==year){
                        var image = data[i].images[0];
                        if(image!= null || image != undefined)
                            result.push(image);
                    }
                }
                return result;
            }
            if(name!=null || name!=undefined){
                console.log("year+name");
                for(i=0; i<data.length; i++){
                    if(data[i].name==name){
                        $scope.projectDetail = data[i];
                        for(var j=0; j<data[i].images.length; j++){
                            var image = data[i].images[j];
                            if(image!= null || image != undefined)
                                result.push(image);

                        }
                    }
                }
            }

            return result;
        }
    }
]);

qayinControllers.controller('designersDetailCtrl', ['$scope', '$http', '$location', '$state', '$filter',
    function($scope, $http, $location, $stateParams, $filter) {
        $scope.params = $stateParams.params;
        $scope.showLoader=function(toggle){
            var loader=$('#loader');
            if(toggle)
                loader.fadeIn("slow");
            else
                loader.fadeOut("slow");
        }
        if($scope.projects === null || $scope.projects===undefined || $scope.designers === null || $scope.designers ===undefined){
            $http.get('/documents').success(function(data) {
                $http.get('/designers').success(function(designers){
                    $scope.projects = data._items;
                    $scope.menuData = createMenuData($scope.projects);
                    $scope.slideShow = createSlideShow($scope.params);
                    $scope.designers = designers._items;
                    $scope.showLoader(false);
                    if(decodeURIComponent($stateParams.params.email))
                        $scope.designer = $filter('filter')($scope.designers, $stateParams.params.email)[0];
                    console.log($scope.designer);
                })
            });
        }else{
            $scope.slideShow = createSlideShow($scope.params);
            $scope.showLoader(false);
            if(decodeURIComponent($stateParams.params.email))
                $scope.designer = $filter('filter')($scope.designers, $stateParams.email)[0];
            console.log($scope.designer);
        };

        $scope.setCarouselHeight = function(){
            return {
                height: (($('#carousel').width())*9/16)+'px'
            }
        };
        $scope.setDetailHeight = function(){
            return {
                height: ((($('#carousel').width())*9/16)-($('#detailCategory').height()+$('#detailTitle').height())-30)+'px'
            }
        };

        $scope.menuClass = function(page){
            var current = $location.path().substring(1);
            if(page === current) {
                return "selected"
            } else {
                if(current.indexOf(page)>=0)return "visible";
            }
        };


        var createMenuData = function(data){
            result = findYears(data);
            for(var i=0; i<result.length; i++ ){
                for(var j=0; j<data.length; j++){
                    if(result[i].year === data[j].year){
                        if(result[i].projects==null || result[i].projects=="undefined")
                            result[i].projects=[];
                        result[i].projects.push(data[j]);
                    }
                }
            }
            return result;
        };

        var contains = function(data, contained){
            if(data===null || data == undefined) return false;
            for(var i=0; i<data.length; i++){
                if(data[i].year == contained) return true;
            }
            return false;
        };

        var findYears = function(data){
            var result = []
            for(var i=0; i<data.length; i++) {
                if (!contains(result, data[i].year)) {
                    result.push({"year": data[i].year});
                }
            }
            return result;
        };

        function createSlideShow(params){
//            console.log("createSlideShow", params);
            var year = params.year;
            var name = params.name;
            var data = $scope.projects;
            result=[];
//            console.log("year:",year,"name: ", name,"params: ", params);
            if((year==null || year==undefined) && (name == null||name==undefined)){
//                console.log("no params");
                for(i=0; i<data.length; i++){
                    var image = data[i].images[0];
                    if(image!= null || image != undefined)
                        result.push(image);
                }
                return result;
            }
            if((year!=null||year!=undefined) && (name==null || name==undefined)){
//                console.log("only year");
                for(i=0; i<data.length; i++){
                    if(data[i].year==year){
                        var image = data[i].images[0];
                        if(image!= null || image != undefined)
                            result.push(image);
                    }
                }
                return result;
            }
            if(name!=null || name!=undefined){
//                console.log("year+name");
                for(i=0; i<data.length; i++){
                    if(data[i].name==name){
                        $scope.projectDetail = data[i];
                        for(var j=0; j<data[i].images.length; j++){
                            var image = data[i].images[j];
                            if(image!= null || image != undefined)
                                result.push(image);

                        }
                    }
                }
            }

            return result;
        }
    }
]);

qayinControllers.controller('profileCtrl', ['$scope', '$http',
    function($scope, $http) {
        $http.get('/pages/profilo').success(function (data) {
            console.log("load profile html");
            $scope.content = data.html;
        });
    }
]);

qayinControllers.controller('linkCtrl', ['$scope', '$http',
    function($scope, $http) {
        $http.get('/pages/links').success(function (data) {
            console.log("load profile html");
            $scope.content = data.html;
        });
    }
]);

qayinControllers.controller('contactCtrl', ['$scope', '$http',
    function($scope, $http) {
    }
]);

qayinControllers.controller('contactForm', ['$scope', '$http',
    function($scope, $http) {
        $scope.done=false;
        $scope.invia = function(){
            console.log("invia")
            if($scope.form.$valid){
                var email = {
                    from: $scope.form.email.$viewValue,
                    subject: 'richiesta da sito QayinArchitettura',
                    text: "telefono: " + $scope.form.tel.$viewValue +"\n"+ $scope.form.content.$viewValue
                }
                $http.post('/contacts', email).success(function(data){
                    console.log("success");
                    $scope.done=true;
                    $scope.form.$setPristine();
                });
            }
            console.log("not valid")
        }
    }
]);