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

.controller('DeliverAdminCtrl', ['$scope', 'callApi','DeliverAdmin','MessageShow','$rootScope','$state','$ionicLoading',
    function($scope,callApi,DeliverAdmin,MessageShow,$rootScope,$state,$ionicLoading){
    var admin = DeliverAdmin.getCurrentUser();
    

    var order = {
        page: 1,
        scrollState: true,
        content:[],
        no_content:false
    }
    $scope.order = order;
    var get_order = function(pageNumber, callback){
        var data = {
            page: pageNumber
        };
        callApi.getData("/deliver/admin_query", "POST", data, {'Expressadmin':DeliverAdmin.getCurrentUser().token})
            .then(function(data){
                if(data['code'] != 200) {
                    if(data['code'] == 302) {
                        MessageShow.MessageShow("请先登录",1000);
                        $state.go('deliver.admin_login');
                    } else {
                        MessageShow.MessageShow(data['content'],2000);
                    }
                } else {
                    var content = data['content'];
                    content.forEach(function(item) {
                        item.state = getState(item['receiving'], item['finish']);
                    })
                    $scope.order.content = $scope.order.content.concat(content);
                    if(content.length<10){
                        $scope.order.scrollState = false;
                    }
                }
                if($scope.order.content.length === 0) {
                    $scope.order.no_content = true;
                } else {
                    $scope.order.no_content = false;
                }
                if(typeof callback === "function"){
                    callback(data['code']);
                }
        }).catch(function(err){
                MessageShow.MessageShow("网络错误",2000);
                if(typeof callback === "function"){
                    callback();
                }
        });

    };
    function getState(is_receive,is_finish) {
        if(is_finish) {
            return {
                state:"已完成",
                is_operate: false
            };
        } else if(is_receive && !is_finish){
            return {
                state:"派送中",
                is_operate: true,
                key:'finish',
                value:true,
                name:"派送完成"
            };
        } else if(!is_receive && !is_finish){
            return {
                state:"未接单",
                is_operate: true,
                key:'receiving',
                value:true,
                name:"我要接单"
            };
        } else {
            return {
                state:"未知",
                is_operate: false
            };
        }
    }
    $scope.doRefresh = function() {
        $scope.order.page = 1;
        $scope.order.content = [];
        $scope.order.scrollState = true;
        get_order(1, function(state) {
            $scope.$broadcast("scroll.refreshComplete");
            if(state==200) {
                MessageShow.MessageShow("刷新成功",2000);
            }
        })
    }

    $scope.show = function() {
        $ionicLoading.show({
          template: '正在加载...'
        });
    };
    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.changeState = function(item) {
        var data = {
            id: item.id,
            key: item.state.key,
            state: item.state.value,
        }
        callApi.getData("/deliver/change", "POST", data, {'Expressadmin':DeliverAdmin.getCurrentUser().token})
            .then(function(data){
                if(data['code'] != 200) {
                    if(data['code'] == 302) {
                        MessageShow.MessageShow("请先登录",1000);
                        $state.go('deliver.admin_login');
                    } else {
                        MessageShow.MessageShow(data['content'],2000);
                    }
                } else {
                    MessageShow.MessageShow("操作成功",2000);
                    var key = item.state.key;
                    if(key === "finish") {
                        item.state = getState(true,true);
                    } else if(key === "receiving") {
                        item.state = getState(false, true);
                    }
                }
        }).catch(function(err){
                MessageShow.MessageShow("网络错误",2000);
                if(typeof callback === "function"){
                    callback();
                }
        });
    };

    function init() {
        if(!admin.token) {
            MessageShow.MessageShow("请先登录",1000);
            $state.go('deliver.admin_login');
        } else {
            $scope.show();
            get_order(1, function(){
                $scope.hide();
            });
        }
    }
    init();

}]);
