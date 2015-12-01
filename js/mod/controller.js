angular.module('HeraldApp')
.controller('HomeCtrl', ['$scope', '$ionicSlideBoxDelegate','$sce',function($scope,$ionicSlideBoxDelegate,$sce){
    $scope.slideHasChanged = function($index){
        
        // console.log($index);
    };
    $scope.slide_item=[
            {'slideimg':"./img/index/slide1.jpg"},
            {'slideimg':"./img/index/slide2.jpg"},
            {'slideimg':"./img/index/slide1.jpg"}
        ];
    // $scope.testurl = "./img/index/slide1.jpg";
}])

.controller('YuyueCtrl', ['$scope','callApi','$ionicLoading','Storage',function($scope,callApi,$ionicLoading,Storage){

    var allUrl = {
        'getDateUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/initOrderIndexP.do?sclId=1',
            'method':'GET'
        },
        'myOrderUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/fetchMyOrdersP.do',
            'method':'GET'
        },
        'getOrderInfoUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/phoneOrder/getOrderInfoP.do',
            'method':'GET'
        }
    };

    function errorShow(message){
        $ionicLoading.show({
            template:message,
            noBackdrop:true,
            duration:2000
        });
    }

    function getMyorder() {
        var data = {
            'url':allUrl['myOrderUrl']['url'],
            'method':allUrl['myOrderUrl']['method']
        };
        callApi.getData("/yuyue","POST",data)
            .then(function(data){
                dealMyorder(data);
            },function(data){
                errorShow("网络错误");
            })
    };

    function dealMyorder(data){
        console.log(data);
    }

    $scope.getDate = function(){
        callApi.getData("/yuyue","POST",{'url':allUrl['getDateUrl']})
    }

    $scope.namedata=callApi.namedata;
    $scope.testApi = function(){
        callApi.getData("/test","POST",{'test':'getok','t':'ok'},1)
            .then(function(data){
                console.log(data);
                console.log(data.code);
            }, function(data,status){
                errorShow("网络错误");
            })
    };

    $scope.testSet = function(){
        // var user = {}
        // user.accesstoken=1;
        // user.name = 'test';
        // Storage.set('item1',user);

        var result = Storage.get('item1')
        console.log(typeof(result))
        console.log(result.name)
 
    };
    $scope.testGet = function() {
        var result = Storage.get('item1')
        console.log(result.name)
        return result;
    }
}])






;
