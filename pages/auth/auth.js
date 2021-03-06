angular.module('HeraldApp')
.controller('LoginCtrl', ['User','$scope','$log','MessageShow','$state','$stateParams','$rootScope',
		function(User,$scope,$log,MessageShow,$state,$stateParams,$rootScope){
	$scope.formData = {
		'login_username':'',
		'login_password':''
	};
	var laststate = $rootScope.lastState||"index.home";
	console.log(laststate);

	var check_dormData = function(formData){
		if(formData.login_username.length < 1){
			return "用户名不能为空!";
		} else if(formData.login_password.length < 1){
			return "密码不能为空";
		} else {
			return null;
		}
	}

	var doLogin = function(response){

	}

	$scope.login = function(isValid){
		var error = check_dormData($scope.formData);
		if(error){
			$scope.error_message = error;
		} else {
			User.login($scope.formData.login_username,$scope.formData.login_password)
				.then(function(response){
					$log.debug(response)
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

.controller('registerCtrl', ['User','$scope','$log','MessageShow','$state','$rootScope',
		function(User,$scope,$log,MessageShow,$state,$rootScope){
	var laststate = $rootScope.lastState||"index.home";
	$scope.formData = {
		'reg_username':'',
		'pwd':'',
		'cardnumber':'',
		'cardpwd':''
	};
	var check_dormData = function(formData){
		if(formData.reg_username.length < 1){
			return "用户名不能为空!";
		} else if(formData.pwd.length < 1){
			return "密码不能为空";
		} else if(formData.cardnumber.length < 1){
			return "一卡通不能为空";
		} else if(formData.cardpwd.length < 1){
			return "一卡通密码不能为空";
		} else {
			return null;
		}
	}
	
	$scope.register = function(isvalid){
		var error = check_dormData($scope.formData);
		if(error){
			$scope.error_message = error;
		} else {
			User.register($scope.formData.reg_username,$scope.formData.pwd,$scope.formData.cardnumber,$scope.formData.cardpwd)
				.then(function(response){
					$log.debug(response)
					if(response){
						$scope.error_message = response;
					} else {
						MessageShow.MessageShow("注册成功",1000);
						setTimeout(function(){
							$state.transitionTo(laststate, {},{reload: true, notify:true});
						},1000)
					}

				},function(error){
					MessageShow.MessageShow("网络错误",1000);
				})
		}
	}
}])
;