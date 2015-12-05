angular.module('HeraldApp', ['ionic','HeraldApp.config','HeraldApp.services'])

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    // $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
    //index
    .state(
        "index",{
            url:"/herald",
            abstract:true,
            templateUrl:"pages/index/menu.html"
        })
    .state(
        "index.home",
        {
            url:"/home",
            views:{
                "home":{
                    templateUrl:"pages/index/home.html",
                    controller:"HomeCtrl"
                }
            }
        })
    .state(
        "index.state2",
        {
            url:"/state2",
            views:{
                "home":{
                    templateUrl:"pages/index/state2.html",
                    controller:"MyCtrl"
                }
            }
        })
    //login
    .state(
        "login",{
            url:"/login",
            templateUrl:"pages/auth/login.html",
            controller:"LoginCtrl"
        })
    //yuyue
    .state(
        "yuyue",{
            url:"/yuyue",
            abstract:true,
            templateUrl:"pages/yuyue/menu.html"
        })
    .state(
        "yuyue.home",
        {
            url:"/home",
            views:{
                "yuyue-home":{
                    templateUrl:"pages/yuyue/home.html",
                    controller:"yuyueCtrl"
                }
            }
        })
    .state(
        "yuyue.My",
        {
            url:"/my",
            views:{
                "yuyue-my":{
                    templateUrl:"pages/yuyue/my.html",
                    controller:"yuyueMyCtrl"
                }
            }
        })

    .state(
        "testpage",{
            url:"/testpage",
            templateUrl:"testpage.html",
            controller:"pagetestCtrl"
        });
    $urlRouterProvider.otherwise('/herald/home');
})
.controller('MyCtrl', function($scope,$state) {
     $scope.data = {
        showDelete: false
      };
      
      $scope.edit = function(item) {
        alert('Edit Item: ' + item.id);
      };
      $scope.share = function(item) {
        alert('Share Item: ' + item.id);
      };
      
      $scope.moveItem = function(item, fromIndex, toIndex) {
        $scope.items.splice(fromIndex, 1);
        $scope.items.splice(toIndex, 0, item);
      };
      
      $scope.onItemDelete = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
      };
      
      $scope.items = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
        { id: 15 },
        { id: 16 },
        { id: 17 },
        { id: 18 },
        { id: 19 },
        { id: 20 },
        { id: 21 },
        { id: 22 },
        { id: 23 },
        { id: 24 },
        { id: 25 },
        { id: 26 },
        { id: 27 },
        { id: 28 },
        { id: 29 },
        { id: 30 },
        { id: 31 },
        { id: 32 },
        { id: 33 },
        { id: 34 },
        { id: 35 },
        { id: 36 },
        { id: 37 },
        { id: 38 },
        { id: 39 },
        { id: 40 },
        { id: 41 },
        { id: 42 },
        { id: 43 },
        { id: 44 },
        { id: 45 },
        { id: 46 },
        { id: 47 },
        { id: 48 },
        { id: 49 },
        { id: 50 }
      ];
      
})

.controller('pagetestCtrl', function($scope,$state){
    $scope.content1="hhahh,okok";
});