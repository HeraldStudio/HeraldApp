angular.module('HeraldApp')
.controller('yuyueBeforeCtrl', ['$state','User','$rootScope', 'MessageShow',function($state,User,$rootScope,MessageShow){
    var user = User.getCurrentUser();
    if (user.token){
        $rootScope.user = user;
    } else {
        MessageShow.MessageShow("请先登录",1000);
        $rootScope.lastState = "yuyue.home";
        $state.go('login');
    }
}])
/*
*可预约信息
*/
.controller('yuyueCtrl', ['$scope','callApi','$ionicLoading','User','MessageShow',
    '$http','$state','yuyueService','$rootScope',
    function($scope,callApi,$ionicLoading,User,MessageShow,$http,$state,yuyueService,$rootScope){

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
        },
        'judgeOrderUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/judgeOrderP.do',
            'method':'GET'
        },
        'getPhoneUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/initEditOrderP.do?sclId=1',
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
   
    /*
    *获取标题栏的日期信息
    */
    var getDateInfo = function(){
        var data = generateData('getDateUrl');
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(data){
                if(data['code'] != 200){
                    if(data['code']==401){
                        $rootScope.lastState = "yuyue.home";
                        $state.go('login');
                    } else {
                        MessageShow.MessageShow(data['content'],2000);
                    };
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
        $scope.dateInfo = dateInfo;
    }

    /*
    *获取每一个预约项目选择可预约
    */
    var current_state = true;
    var getOrderInfo = function(itemid,day){
        if(!orderInfoCtrl[day][itemid]&&current_state){
            current_state=false;
            MessageShow.MessageShow("正在加载",10000);
            // MessageShow.show("正在加载");
            data = generateData('getOrderInfoUrl');
            data['data'] = {
                'sclId':1,
                'itemId':itemid,
                'dayInfo':$scope.dateInfo[day]["dayInfo"]
            };
            callApi.getData("/yuyue","POST",data,user.token)
                .then(function(data){
                    if(data['code'] != 200){
                        if(data['code']==401){
                            $rootScope.lastState = "yuyue.home";
                            $state.go('login');
                        } else {
                            MessageShow.MessageShow(data['content'],2000);
                        };
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
        MessageShow.hide();
        current_state = true;
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
    *预约逻辑
    */
    $scope.newOrder = function(id,day,time){
        var dayinfo = $scope.dateInfo[day]["dayInfo"];
        judgeOrder(id,dayinfo,time);
    }
    /*
    *判断当前是否可预约
    */
    var judgeOrder = function(id,day,time){
        var data = generateData("judgeOrderUrl");
        data['data'] = {
            'sclId':1,
            'itemId':id,
            'dayInfo':day,
            'time':time
        }
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(response){
                if(response['code']!=200){
                    if(data['code']==401){
                        $rootScope.lastState = "yuyue.home";
                        $state.go('login');
                    } else {
                        MessageShow.MessageShow(data['content'],2000);
                    };
                } else {
                    console.log("judge result start");
                    console.log(response['content']);
                    console.log("judge result end");
                    if(response['content']['code']!=0){
                        MessageShow.MessageShow(response['content']['msg'],2000);
                    } else {
                        yuyueService.setInfo(typeInfo[id]['name'],id,time,day,response['content'])
                        getPhone();
                       
                    }
                }
            }, function(response){
                MessageShow.MessageShow("网络错误",2000);
            });
    }
    /*
    *获取手机号
    */
    var getPhone = function(){
        var data = generateData("getPhoneUrl");
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(response){
                if(response['code'] != 200){
                    MessageShow.MessageShow(response['content'],2000);
                } else {
                    yuyueService.setPhone(response['content']['phone']);
                    $state.go('yuyue-new');
                }
            },function(){
                MessageShow.MessageShow("网络错误",2000);
            })
    }

    /*
    *页面初始化函数
    *决定哪些函数需要进入即加载
    */
    function init(){
        if(!$scope.dateInfo&&user.token){
            getDateInfo();
        }
    }
    init();

}])



/*
*新建预约
*Controller
*/
.controller('yuyueNewCtrl', ['$scope','yuyueService','callApi','MessageShow','User','$ionicModal','$sce',
     function($scope,yuyueService,callApi,MessageShow,User,$ionicModal,$sce){
    var yuyueInfo = yuyueService.getInfo();
    var user;
    var allUrl = {
        'myOrderUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/fetchMyOrdersP.do?sclId=1',
            'method':'GET'
        },
        'validateImgUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/control/validateimage',
            'method':'GET'
        },
        'getFriendList':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/searchUserP.do?sclId=1&pageNumber=1&start=0&pageSize=5',
            'method':'GET'
        },
        'newUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/insertOredrP.do',
            'method':'GET'
        }
    };
    var groundInfo = {
        "allUserNum":0,
        "allUser":[],
        "allUserString":"",
        "searchUser":[],
        "searchCardnum":""
    }
    
    $scope.yuyueInfo = yuyueInfo;
    $scope.groundInfo = groundInfo;

    /*
    *将搜索到的好友添加以及移除
    *groundInfo的alluser
    */
    var removeUser = function(user){
        groundInfo.allUser.pop(user);
    }
    $scope.removeUser = removeUser;
    var newUser = function(user){
        groundInfo.allUser.push(user);
        user.state=false;
    }
    $scope.newUser = newUser;
    /*
    *搜索好友，并且显示搜索到的好友
    */
    var searchUser = function(){
        var cardnum = groundInfo.searchCardnum;
        var data = {
            'url':allUrl.getFriendList.url+"&cardNo="+cardnum,
            'method':allUrl.getFriendList.method
        }
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(response){
                if(response.code!=200){
                    if(data['code']==401){
                        $rootScope.lastState = "yuyue.home";
                        $state.go('login');
                    } else {
                        MessageShow.MessageShow(data['content'],2000);
                    };
                } else {
                    dealSerchResult(cardnum,response.content);
                }
            }, function(){
                MessageShow.MessageShow("网络错误",2000);
            })
    }
    var dealSerchResult = function(cardnum,content){
        groundInfo.searchUser = [];
        if(content.total<1){
            MessageShow.MessageShow("没有搜索到该用户",1000);
        } else {
            for(var i=0;i<content.rows. length;i++){
                var temp = {
                    'cardnum':cardnum,
                    'name':content.rows[i].nameDepartment,
                    'userId':content.rows[i].userId,
                    'state':true
                }
                groundInfo.searchUser.push(temp);
            }
        }
    }
    $scope.searchUser = searchUser;

    /*
    *添加好友完成
    */
    var completeAddUser = function(){
        groundInfo.allUserNum = groundInfo.allUser.length;
        groundInfo.allUserString = "";
        for(var i=0;i<groundInfo.allUser.length;i++){
            groundInfo.allUserString += groundInfo.allUser[i].name+"</br>";
        }
        groundInfo.allUserString =  $sce.trustAsHtml(groundInfo.allUserString);
        $scope.modal.hide();

    }
    $scope.completeAddUser = completeAddUser;
    /*
    *判断预约信息是否合法
    */
    var judegInfo = function(){
        if(!yuyueInfo.phone || yuyueInfo.phone.length!=11){
            MessageShow.MessageShow("手机号不合法",1000);
        } else if(groundInfo.allUserNum+1<groundInfo.min[groundInfo.MySelect] || groundInfo.allUserNum+1>groundInfo.max[groundInfo.MySelect]) {
            MessageShow.MessageShow("人数不合法",1000);
        } else {
            newYuyue();
        }
    }
    $scope.judegInfo = judegInfo;
    /*
    *新建预约
    */
    var newYuyue = function(){
        var senddata = {
            'orderVO.useMode':$scope.groundInfo.MySelect,
            'sclId':1,
            'orderVO.useTime':yuyueInfo.day+" "+yuyueInfo.time,
            'orderVO.itemId':yuyueInfo.id,
            'orderVO.phone':yuyueInfo.phone,
            'orderVO.remark':''
        } 
        var init_url = allUrl['newUrl']['url']+"?";
        var state=0;
        for(var i in senddata){
            if(state==0){
                init_url += i+"="+senddata[i];
                state = 1;
            } else {
                init_url += "&"+i+"="+encodeURIComponent(senddata[i]);
            }
            
        }
        for(var i=0;i<groundInfo.allUserNum;i++){
            init_url += "&"+"useUserIds="+groundInfo.allUser[i].userId;
        }
        var data = {
            'url':init_url,
            'method':allUrl['newUrl']['method'],
        }
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(response){
                if(response['code'] == 200){
                    if(data['code']==401){
                        $rootScope.lastState = "yuyue.home";
                        $state.go('login');
                    } else {
                        MessageShow.MessageShow(data['content'],2000);
                    };
                } else {
                    MessageShow.MessageShow(response['content'],2000);
                }
            },function(){
                MessageShow.MessageShow("网络错误",2000);
            })

    }

    /*
    *判断用户是否已经登录
    *如果没有登录，跳转到登录页面
    */
    var judgeUser = function(){
        user = User.getCurrentUser();
        if (user.token){
           
        } else {
            MessageShow.MessageShow("请先登录",1000);
            $rootScope.lastState = "yuyue-new";
            $state.go('login');
        }
    }
    function init() {
        judgeUser();
        if (yuyueInfo['data']['item']['allowHalf'] == 1) {
            groundInfo.allGround = [{
                "id": 1,
                "name": "全场"
            }, {
                "id": 2,
                "name": "半场"
            }];
            groundInfo.max = {
                "1": yuyueInfo['data']['item']['fullMaxUsers'],
                "2": yuyueInfo['data']['item']['halfMaxUsers']
            };
            groundInfo.min = {
                "1": yuyueInfo['data']['item']['fullMinUsers'],
                "2": yuyueInfo['data']['item']['halfMinUsers']
            }
        } else {
            groundInfo.allGround = [{
                "id": 2,
                "name": "半场"
            }];
            groundInfo.max = {
                "2": yuyueInfo['data']['item']['fullMaxUsers']
            };
            groundInfo.min = {
                "2": yuyueInfo['data']['item']['fullMinUsers']
            }
        }
        groundInfo.MySelect = groundInfo.allGround[0]['id'];

        $ionicModal.fromTemplateUrl('addFriend.html',{
            scope:$scope,
            animation:'slide-in-up'
        }).then(function(modal){
            $scope.modal = modal;
        });
        
    }

    init();
}])

/*
*我的预约
*Controller
*/
.controller('yuyueMyCtrl', ['$scope','callApi','Storage','User','MessageShow',
    function($scope,callApi,Storage,User,MessageShow){
    
    var allUrl = {
        'myOrderUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/fetchMyOrdersP.do?sclId=1',
            'method':'GET'
        },
        'cancelUrl':{
            'url':'http://yuyue.seu.edu.cn/eduplus/phoneOrder/delOrderP.do?sclId=1',
            'method':'GET'
        }
    };

    var user = User.getCurrentUser();


/*
*   get my order
*
*/
    function getMyorder() {
        var data = {
            'url':allUrl['myOrderUrl']['url'],
            'method':allUrl['myOrderUrl']['method']
        };
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(data){
                if(data['code'] != 200){
                    if(data['code']==401){
                        $rootScope.lastState = "yuyue.home";
                        $state.go('login');
                    } else {
                        MessageShow.MessageShow(data['content'],2000);
                    };
                } else {
                   dealMyorder(data);
                }
            },function(data){
                MessageShow.MessageShow("网络错误",2000);
            })
    };

    function dealMyorder(data){
        $scope.Myorder = data;
    }

    var cancelOrder = function(id){
        var data = {
            'url':allUrl['cancelUrl']['url']+"&id="+id,
            'method':allUrl['cancelUrl']['method']
        };
        console.log("cancel id:"+id);
        callApi.getData("/yuyue","POST",data,user.token)
            .then(function(data){
                if(data['code'] != 200){
                    MessageShow.MessageShow(data['content'],2000);
                } else {
                   if(data['content']['msg'] == "success"){
                        MessageShow.MessageShow("取消成功",2000);
                        getMyorder();
                   } else {
                    MessageShow.MessageShow(data['content']['msg'],2000);
                   }
                }
            },function(){
                MessageShow.MessageShow("网络错误",2000);
            })
    }
    $scope.cancelOrder = cancelOrder;
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