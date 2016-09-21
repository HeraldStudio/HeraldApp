angular.module('HeraldApp')
.controller('DeliverAdminLoginCtrl', ['$scope','MessageShow','$state','$rootScope','DeliverAdmin',
    function($scope,MessageShow,$state,rootScope,DeliverAdmin){
    $scope.formData = {
        'login_username':'',
        'login_password':''
    };
    var laststate = "deliver.admin";

    var check_dormData = function(formData){
        if(formData.login_username.length < 1){
            return "用户名不能为空!";
        } else if(formData.login_password.length < 1){
            return "密码不能为空";
        } else {
            return null;
        }
    }

    $scope.login = function(isValid){
        var error = check_dormData($scope.formData);
        if(error){
            $scope.error_message = error;
        } else {
            DeliverAdmin.login($scope.formData.login_username,$scope.formData.login_password)
                .then(function(response){
                    if(response){
                        $scope.error_message = response;
                    } else {
                        MessageShow.MessageShow("登录成功",1000);
                        $state.transitionTo(laststate, {},{reload: true, notify:true});
                    }

                },function(error){
                    MessageShow.MessageShow("网络错误",1000);
                })
        }
    }

}])

.controller('DeliverAdminCtrl', ['$scope', 'callApi','DeliverAdmin','MessageShow','$rootScope','$state',
    function($scope,callApi,DeliverAdmin,MessageShow,$rootScope,$state){
        var admin = DeliverAdmin.getCurrentUser();
        function init() {
            if(!admin.token) {
                MessageShow.MessageShow("请先登录",1000);
                $state.go('deliver.admin_login');
            }
        }
        init();

}]);
