educationApp.controller('mapCtrl',
	['$scope', '$state', '$location','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope, $state, $location,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('地图控制器');
    var positionX=$stateParams.positionx;
    var positionY=$stateParams.positiony;
	
   
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(116.404,39.915),11);
    map.enableScrollWheelZoom(true);
    // 用经纬度设置地图中心点
    map.clearOverlays(); 
    var new_point = new BMap.Point(positionX,positionY);
    var marker = new BMap.Marker(new_point);  // 创建标注
    map.addOverlay(marker);              // 将标注添加到地图中
    map.panTo(new_point);      
        
    // 返回上一页
    $scope.ionicBack= function () {
        $ionicHistory.goBack();
        $ionicViewSwitcher.nextDirection("back");
    };
}]);