educationApp.controller('setUpCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','User','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,User,$ionicViewSwitcher) {
	console.log('设置页面控制器');
	$scope.logout = User.logout;
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
	$scope.goComplaints= function () {
	    $state.go("complaints",{reload:true});
	    $ionicViewSwitcher.nextDirection("forward");
	};
	$scope.goAboutUs= function () {
	    $state.go("aboutus",{reload:true});
	    $ionicViewSwitcher.nextDirection("forward");
	};
}]);