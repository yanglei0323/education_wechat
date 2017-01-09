educationApp.controller('guideCtrl', ['$scope','$state','$ionicPlatform','$ionicViewSwitcher', function ($scope,$state,$ionicPlatform,$ionicViewSwitcher) {
	console.log('引导控制器');
	// $ionicPlatform.fullScreen(true,false);
	// $ionicPlatform.showStatusBar(false);

	if(!localStorage.getItem('isfirstLoad')){
		console.log('引导~~~');
	}
	
	$scope.goTab = function () {
		localStorage.setItem('isfirstLoad', true);
		$state.go('tab.micro-lesson');
	};
}]);