angular.module('HeraldApp')
.controller('HomeCtrl', ['$scope', '$ionicSlideBoxDelegate','$sce',function($scope,$ionicSlideBoxDelegate,$sce){
    $scope.slideHasChanged = function($index){
        
    };
    $scope.slide_item=[
            {'slideimg':"./static/img/index/slide1.jpg"},
            {'slideimg':"./static/img/index/slide2.jpg"},
            {'slideimg':"./static/img/index/slide2.jpg"},
        ];
}])





;
