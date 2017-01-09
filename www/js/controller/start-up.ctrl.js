educationApp.controller('startUpCtrl', ['$scope','$state','$timeout','$ionicPlatform', function ($scope,$state,$timeout,$ionicPlatform) {
	console.log('启动控制器');
	// $ionicPlatform.fullScreen(true,false);
	// $ionicPlatform.showStatusBar(false);
	$timeout(function () {
		if (!localStorage.getItem('isfirstLoad')) {
			$state.go('guide');
		} else {
			$state.go('tab.micro-lesson');
		}
	}, 1000);
	
	$scope.goTab = function () {
		$state.go('tab.micro-lesson');
	};
}]);