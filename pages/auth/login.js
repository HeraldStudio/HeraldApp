angular.module('HeraldApp')
.controller('LoginCtrl', ['User','$scope','$log','MessageShow',function(User,$scope,$log,MessageShow){
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
					}
				},function(error){
					MessageShow.errorShow("网络错误");
				})
		}
	}
}])


;