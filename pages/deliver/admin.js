angular.module('HeraldApp')
.controller('DeliverAdminLoginCtrl', ['$scope', 'callApi',function($scope,callApi){
    $scope.slide_item=[
            {'slideimg':"./static/img/2016-recuit.jpg"},
            {'slideimg':"./static/img/2016-activity-advertising.jpg"}];

    var getSlide = function() {
    }

}])

.controller('DeliverAdminCtrl', ['$scope', 'callApi',function($scope,callApi){
    $scope.slide_item=[
            {'slideimg':"./static/img/2016-recuit.jpg"},
            {'slideimg':"./static/img/2016-activity-advertising.jpg"}];

    var getSlide = function() {
    }

}]);
