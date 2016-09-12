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
						if(item.state==="未接单") {
							item.cancel = true;
						}
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

	$scope.cancel = function(id) {
		var data = {
    		id: id
    	};
		callApi.getData("/deliver/delete", "POST", data, user.token).then(function(data){
				if(data['code'] != 200) {
					if(data['code'] == 302) {
						$rootScope.lastState = "deliver.home";
                        $state.go('login');
					} else {
						MessageShow.MessageShow(data['content'],2000);
					}
				} else {
					MessageShow.MessageShow("取消成功",2000);
					var content = $scope.order.content;
					content.forEach(function(item, index) {
						if(item.id === id) {
							content.splice(index,1);
							return;
						}
					})
				}
    	}).catch(function(err){
				MessageShow.MessageShow("网络错误",2000);
    	});
	}
	function init() {
		$scope.show();
		get_my_order(1, function(){
			$scope.hide();
		});
	}
	init();

}])

.controller('DeliverPostCtrl', ['$scope', 'callApi', 'MessageShow', '$ionicLoading', 'User', '$state', '$rootScope', function($scope, callApi, MessageShow, $ionicLoading, User, $state, $rootScope){
	var user = User.getCurrentUser();
	$scope.info = {
		name: "",
		sms: "",
		phone: "",
		location: 0,
		arrival: 0,
		weight: 0,
		dest :0
	}
	var show_information = {
		location: ["东门","南门"],
		arrival: ["12:20~12:40","17:40~18:00"],
		weight: ["2kg以下","2~4kg","4kg以上"],
		dest :["梅九大厅","梅三四大厅"]
	};
	$scope.show_info = show_information;

	$scope.select  = function(key, value) {
		$scope.info[key] = value;
	};
	$scope.submit = function(){
		var info = $scope.info;
		if(info.name.length<1||info.sms.length<1||info.phone.length<1) {
			alert("信息不能为空")
		} else {
			var data = {
				user_name: info.name,
				dest: show_information['dest'][info.dest],
				sms_txt: info.sms,
				arrival: show_information['arrival'][info.arrival],
				locate: show_information['location'][info.location],
				weight: show_information['weight'][info.weight],
				phone: info.phone
			}
			callApi.getData("/deliver/submit", "POST", data, user.token).then(function(data){
				if(data['code'] != 200) {
					if(data['code'] == 302) {
						$rootScope.lastState = "deliver.home";
                        $state.go('login');
					} else {
						MessageShow.MessageShow(data['content'],2000);
					}
				} else {
					MessageShow.MessageShow("提交成功",2000);
					$state.go("deliver.home");
				}
	    	}).catch(function(err){
					MessageShow.MessageShow("网络错误",2000);
	    	});
		}
	};
}]);
