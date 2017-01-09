educationApp.controller('activitydetailCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('报名详情详情控制器');
	var useractivityId=$stateParams.useractivityid;
	$scope.activityDetailsInfo = {};
	
	// 获取验证码
	var data = {
		useractivityid:useractivityId
	};
	Http.post('/activity/myactivity.json',data)
	.success(function (resp) {
		if (1 === resp.code) {
			resp.data.activity.imgurl=picBasePath + resp.data.activity.imgurl;
			$scope.activityDetailsInfo=resp.data;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
	// 活动详情跳转
	$scope.goOfficeDetails=function(index){
		$state.go("officedetails",{activityid:index.activity.id},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};
	
}]);