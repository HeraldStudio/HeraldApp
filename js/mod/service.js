angular.module('HeraldApp.services',[])

//存储模块，包含set，get，remove函数
.service('Storage',['ENV',function(ENV){
    this.set = function(key,data) {
        return window.localStorage.setItem(key,window.JSON.stringify(data));
    }

    this.get = function(key) {
        return window.JSON.parse(window.localStorage.getItem(key));
    }

    this.remove = function(key) {
        return window.localStorage.removeItem(key);
    }
}])


.service('User', ['Storage','callApi','$q','$log', function(Storage,callApi,$q,$log){
    var storageKey = 'user';
    var user = Storage.get(storageKey) || {}
    $log.debug("service start")

    this.login = function(username,password) {
        data = {
            'user_phone':username,
            'password':password
        }
        loginDefer = $q.defer();
        callApi.getData('/auth/login','POST',data)
            .then(function(response){
                if(response.code == 200){
                    user.token = response.content;
                    Storage.set(storageKey,user);
                    loginDefer.resolve(null);
                } else {
                    loginDefer.resolve(response.content);
                }
            },function(response){
                loginDefer.reject(response);
            });

        return loginDefer.promise;
    };

    this.logout = function() {
        Storage.remove(storageKey);
    }

    this.getCurrentUser = function() {
        return user;
    }
}])

.service('MessageShow', ['$ionicLoading', function($ionicLoading){
    this.errorShow = function(message){
        $ionicLoading.show({
            template:message,
            noBackdrop:true,
            duration:2000
        });
    }

    this.MessageShow = function(message,time){
        var time = time|2000;
        $ionicLoading.show({
            template:message,
            noBackdrop:true,
            duration:time
        });
    }
    
}])
.service('callApi', ['$http','ENV','$q','$log', function($http,ENV,$q,$log){
    var i = 1;
    // $log.debug(ionic.Platform)
    this.namedata = function(){
        return i;
    }
    

    /**
    * 获取后台数据这个地方很多点需要注意：
    * 后台以及开启支持跨域的请求，所以开发时不需要前端服务器支持了
    * 对于get方式：
    *       正常使用就好
    * 对于post方式：
    *       如果是以form-data形式传递的话，就像test=test这种，后台可以直接通过get_argument方式获取，
    *       有两种写法：
    *           data:"test=test"
    *           或者： 
    *           transformRequest: function(obj) {
    *               var str = [];
    *               for(var p in obj)
    *                   str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    *               return str.join("&");
    *           },  
    *       如果数据是直接在body里以post格式传到后台，后台需要单独解析body，这样直接放入data就好 
    * data是传入的数据，type仅对post方式有效，分为0：arg，1：body
    */

    this.getData = function(url,method,data,token,type){
        var deferred = $q.defer();
        var final_url = ENV.api+url;//+'?&callback=JSON_CALLBACK';
        data = data || null;
        type = type || null;
        var config = {
            method:method,
            url:final_url,
            headers:{
                'token':token,
                // 'Content-Type':'application/x-www-form-urlencoded'
            },
            timeout:5000
        }
        // $http.defaults.headers.common['Token'] = token;
        if(method=="GET"){
            config['params'] = data;
        }
        else if(method=="POST"){
            if(!type) {
                
                config['transformRequest'] = function(obj){
                var str = [];
                for(var p in obj){
                    if(p!="data"){
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    } else {
                        console.log(JSON.stringify(obj[p]));
                        str.push(encodeURIComponent(p) + "=" + JSON.stringify(obj[p]));
                    }
                }
                return str.join("&");
                }
            }
            config['headers']['Content-Type'] = 'application/x-www-form-urlencoded';
            // config['headers'] = {
            //     'Content-Type':'application/x-www-form-urlencoded',
            //     // 'Token':1
            // };
            config['data'] = data;
        }
        $http(config).success(function(data){
            deferred.resolve(data);
        }).error(function(data,status,headers){
            deferred.reject(data);
        })
        return deferred.promise;
    }

}]);