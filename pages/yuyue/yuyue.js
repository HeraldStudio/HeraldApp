angular.module('HeraldApp')
.controller('yuyueCtrl', ['$scope','callApi','$ionicLoading','Storage','User','MessageShow','$http',
    function($scope,callApi,$ionicLoading,Storage,User,MessageShow,$http){

    console.log('yuyue');
    var allUrl = {
        'getDateUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/initOrderIndexP.do?sclId=1',
            'method':'GET'
        },
        'myOrderUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/fetchMyOrdersP.do?sclId=1',
            'method':'GET'
        },
        'getOrderInfoUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/phoneOrder/getOrderInfoP.do',
            'method':'GET'
        }
    };

    var typeInfo = {
        "7":{
            "name":"乒乓球"
        },
        "8":{
            "name":"篮球"
        },
        "9":{
            "name":"排球"
        },
        "10":{
            "name":"羽毛球"
        },
        "11":{
            "name":"舞蹈"
        },
        "12":{
            "name":"健身"
        },
        "13":{
            "name":"武术"
        },
        "14":{
            "name":"跆拳道"
        }
    }
    $scope.typeInfo = typeInfo;

    /*
    *生成发送到后台的数据
    */
    var generateData = function(key){
        var data = {
            'url':allUrl[key]['url'],
            'method':allUrl[key]['method']
        }

        return data;
    }

    var user = User.getCurrentUser();
    console.log(user)
    /*
    *获取标题栏的日期信息
    */
    var getDateInfo = function(){
        var data = generateData('getDateUrl');
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(data){
                if(data['code'] != 200){
                    MessageShow.MessageShow(data['content'],2000);
                } else {
                   dealDateInfo(data['content']);
                }
            },function(data){
                MessageShow.MessageShow("网络错误",2000);
            })
    }
    /*
    *处理后台返回的关于标题栏日期信息
    *生成前台需要的格式
    */
    var dealDateInfo = function(data){
        var dateInfo = {
            "today":{
                "dayInfo":data['timeList'][0]['dayInfo'].split(' ')[0],
                "weekInfo":data['timeList'][0]['dayInfo'].split(' ')[1]
            },
            "tomorrow":{
                "dayInfo":data['timeList'][1]['dayInfo'].split(' ')[0],
                "weekInfo":data['timeList'][1]['dayInfo'].split(' ')[1]
            },
            "afterTomo":{
                "dayInfo":data['timeList'][2]['dayInfo'].split(' ')[0],
                "weekInfo":data['timeList'][2]['dayInfo'].split(' ')[1]
            }
        }
        console.log(dateInfo);
        $scope.dateInfo = dateInfo;
    }

    /*
    *获取每一个预约项目选择可预约
    */
    var getOrderInfo = function(itemid,day){
        if(!orderInfoCtrl[day][itemid]){
        data = generateData('getOrderInfoUrl');
        data['data'] = {
            'sclId':1,
            'itemId':itemid,
            'dayInfo':$scope.dateInfo[day]["dayInfo"]
        };
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(data){
                if(data['code'] != 200){
                    MessageShow.MessageShow(data['content'],2000);
                } else {
                   dealOrderInfo(itemid,day,data['content']);
                }
            },function(data){
                MessageShow.MessageShow("网络错误",2000);
            });
        }
    }

    var orderInfoCtrl = {
        "today":{},
        "tomorrow":{},
        "afterTomo":{}
    }

    $scope.orderInfo = orderInfoCtrl;
    var dealOrderInfo = function(itemid,day,data){
        if(!orderInfoCtrl[day][itemid]){
            orderInfoCtrl[day][itemid] = [];
        }
        for(i in data['orderIndexs']){
            var info = {
                "used":data['orderIndexs'][i]["usedSite"],
                "all":data['orderIndexs'][i]["allSite"],
                "avaliTime":data['orderIndexs'][i]["avaliableTime"],
                "enable":data['orderIndexs'][i]['enable']
            }
            orderInfoCtrl[day][itemid].push(info);
        }
        console.log("orderIndo:");
        console.log(orderInfoCtrl)
    }


    /*
    *控制下拉列表
    */
    var groupShowControl = {
        "today":{},
        "tomorrow":{},
        "afterTomo":{}
    }
    $scope.toggleGroup = function(day,key){
        groupShowControl[day][key] = groupShowControl[day][key]|false;
        groupShowControl[day][key] = !groupShowControl[day][key];
        if(groupShowControl[day][key]){
            getOrderInfo(key,day);
        }
    }

    $scope.isToggleGroup = function(day,key){
        return groupShowControl[day][key];
    }
    /*
    *页面初始化函数
    *决定哪些函数需要进入即加载
    */
    function init(){
        if(!$scope.dateInfo){
            getDateInfo();
        }
    }
    init();

}])

.controller('yuyueMyCtrl', ['$scope','callApi','Storage','User','MessageShow',
    function($scope,callApi,Storage,User,MessageShow){
    
    var allUrl = {
        'myOrderUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/fetchMyOrdersP.do?sclId=1',
            'method':'GET'
        }
    };

    var user = User.getCurrentUser();
    console.log(user);


/*
*   get my order
*
*/
    function getMyorder() {
        var data = {
            'url':allUrl['myOrderUrl']['url'],
            'method':allUrl['myOrderUrl']['method']
        };
        console.log(data);
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(data){
                console.log(data);
                if(data['code'] != 200){
                    MessageShow.MessageShow(data['content'],2000);
                } else {
                   dealMyorder(data);
                }
            },function(data){
                MessageShow.MessageShow("网络错误",2000);
            })
    };

    function dealMyorder(data){
        $scope.Myorder = data;
        console.log($scope.Myorder);
    }

    function init(){
        if(!$scope.Myorder){
            getMyorder();
        }
    }
    $scope.stateContent = {
        '4':"通过",
        '6':"取消",
        '2':'完成'
    }
    init();


}])
;