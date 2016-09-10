angular.module('HeraldApp')
.controller('activityCtrl', ['$scope','callApi','MessageShow','$state','$ionicScrollDelegate','$ionicLoading', function($scope,callApi,MessageShow,$state,$ionicScrollDelegate,$ionicLoading){

		var activity = {
			page:1,
			scrollState:true,
			content:[]
		}

    var getActivity = function(pagenumber,callback) {
    	var data = {
    		page: pagenumber
    	};
    	callApi.getData("/huodong/get", "GET", data).then(function(data){
				if(data['code'] != 200) {
					MessageShow.MessageShow(data['content'],2000);
				} else {
					var content = data['content'];
					content.forEach(function(item) {
						item.state = getState(item['start_time'], item['end_time']);
						if(item.pic_url=="") {
							item.pic_url = "./static/img/2016-activity-advertising.jpg";
						}
					})
					$scope.activity.content = $scope.activity.content.concat(content);
					if(content.length<10){
						activity.scrollState = false;
					}
				}
				if(typeof callback === "function"){
					callback();
				}
    	}).catch(function(err){
				MessageShow.MessageShow("网络错误",2000);
				if(typeof callback === "function"){
					callback();
				}
    	});
    }

    function init() {
    	$scope.show();
    	getActivity(1, function() {
    		$scope.hide();
    	});
    	$scope.activity = activity;
    }

    $scope.doRefresh = function(){
    	$scope.activity.page = 1;
    	$scope.activity.content = [];
    	$scope.activity.scrollState = true;
    	getActivity(1, function() {
    		$scope.$broadcast("scroll.refreshComplete");
    		MessageShow.MessageShow("刷新成功",2000);
    	});
    }
    $scope.addItems = function() {
    	activity.page += 1;
    	getActivity(activity.page, function(){
    		$scope.$broadcast("scroll.refreshComplete");
    	});
    }

    $scope.show = function() {
	    $ionicLoading.show({
	      template: '正在加载...'
	    });
	  };
	  $scope.hide = function(){
	    $ionicLoading.hide();
	  };

	  $scope.clickDetail = function(url) {
	  	if(url!="") {
	  		window.location.href = url;
	  	}
	  }

	  function getState(start_time,end_time) {
	  	var start_date = new Date(Date.parse(start_time.replace(/-/g, "/")));
	  	var end_date = new Date(Date.parse(end_time.replace(/-/g, "/")));
	  	var current_date = new Date();
	  	if(current_date>end_date) {
	  		return "已结束";
	  	} else {
	  		return "进行中";
	  	} 
	  }

    init();
}]);
