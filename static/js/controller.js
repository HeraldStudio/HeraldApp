angular.module('HeraldApp')
.controller('HomeCtrl', ['$scope', 'callApi',function($scope,callApi){
    $scope.slide_item=[
            {'slideimg':"./static/img/2016-recuit.jpg"},
            {'slideimg':"./static/img/2016-activity-advertising.jpg"}];

    var getSlide = function() {
    }

}]);
