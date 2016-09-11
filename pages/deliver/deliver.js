angular.module('HeraldApp')
.controller('DeliverCtrl', ['$scope', 'callApi', 'MessageShow', '$ionicLoading', 'User', '$state', '$rootScope', function($scope, callApi, MessageShow, $ionicLoading, User, $state, $rootScope){
	var order = {
		page: 1,
		scrollState: true,
		content:[]
	}
	$scope.order = order;
	var user = User.getCurrentUser();
    var get_my_order = function(pageNumber, callback){
    	var data = {
    		page: pageNumber
    	};
    	callApi.getData("/deliver/query", "POST", data, user.token).then(function(data){
				if(data['code'] != 200) {
					if(data['code'] == 302) {
						$rootScope.lastState = "deliver.home";
                        $state.go('login');
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
	  	if(!is_receive && !is_finish) {
	  		return "未接单";
	  	} else if(is_receive && !is_finish){
	  		return "派送中";
	  	} else if(is_receive && is_finish){
	  		return "已完成";
	  	} else {
	  		return "未知";
	  	}
	}
    $scope.doRefresh = function() {
    	$scope.order.page = 1;
    	$scope.order.content = [];
    	$scope.order.scrollState = true;
    	get_my_order(1, function(state) {
    		$scope.$broadcast("scroll.refreshComplete");
    		if(state==200) {
    			MessageShow.MessageShow("刷新成功",2000);
    		}
    	})
    }

    $scope.addItems = function() {
    	order.page += 1;
    	get_my_order(order.page, function(){
    		$scope.$broadcast("scroll.refreshComplete");
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

	function init() {
		$scope.show();
		get_my_order(1, function(){
			$scope.hide();
		});
	}
	init();

}]);
