educationApp.controller('activitydetailCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('报名详情详情控制器');
	var useractivityId=$stateParams.useractivityid;
	var activityorderId=$stateParams.activityorderid;
	$scope.activityDetailsInfo = {};
	
	// 获取验证码
	console.log(activityorderId);
	if(activityorderId == ''){
		console.log('报名id');
		var data = {
			useractivityid:useractivityId
		};
		Http.post('/activity/myactivity.json',data)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				resp.data.activity.imgurl=picBasePath + resp.data.activity.imgurl;
				$scope.activityDetailsInfo=resp.data;
			}
			else if (0 === resp.code) {
				Popup.alert(resp.reason);
			}
		})
		.error(function (resp) {
			console.log(resp);
		});
	}
	if(useractivityId == ''){
		console.log('订单id');
		var data = {
			activityorderid:activityorderId
		};
		Http.post('/activity/myactivity.json',data)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				resp.data.activity.imgurl=picBasePath + resp.data.activity.imgurl;
				$scope.activityDetailsInfo=resp.data;
			}
			else if (0 === resp.code) {
				Popup.alert(resp.reason);
			}
		})
		.error(function (resp) {
			console.log(resp);
		});
	}
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