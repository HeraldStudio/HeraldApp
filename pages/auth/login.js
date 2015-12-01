angular.module('HeraldApp')
.controller('LoginCtrl', ['User','$scope','$log','MessageShow','$state',
		function(User,$scope,$log,MessageShow,$state){
	$scope.testValue="";
	$scope.login_username="wrong";
	$scope.formData = {
		'login_username':'',
		'login_password':''
	};

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
						setTimeout(function(){
							$state.go('index.home');
						},1000)
						
					}

				},function(error){
					MessageShow.MessageShow("网络错误",1000);
				})
		}
	}
}])


;