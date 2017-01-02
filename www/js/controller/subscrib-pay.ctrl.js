educationApp.controller('subscribpayCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('专栏订阅支付');
	var teacherId　=　$stateParams.teacherid;
	$scope.subDetailList = {};
	var data = {
		teacherid:teacherId
	};
	Http.post('/teacher/follow.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			// resp.data.avatar = picBasePath + resp.data.avatar;
			resp.data.imgurl = picBasePath + resp.data.imgurl;
			$scope.subDetailList = resp.data;
			// $scope.columnList =resp.data.columnlist;
			// var priceType=parseInt(resp.data.price);
			// if(priceType>=0 || $scope.columnList.price == '免费'){
			// 	$scope.priceType = true;
			// }
			// if($scope.columnList.price == '免费'){
			// 	$scope.showPrice = false;
			// }
		}
		else if (0 === resp.code) {
			Popup.alert(resp.reason);
		}
		else if (-1 === resp.code) {
			$state.go('login');
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	
	// console.log(data1);
	// Http.post('/unl/playurl.json',data1)
	// .success(function (resp) {
	// 	if (1 === resp.code) {
	// 		$scope.videoInfo=resp.data;
	// 	}
	// 	else if (0 === resp.code) {
	// 	}
	// })
	// .error(function (resp) {
	// 	console.log(resp);
	// });
	
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);