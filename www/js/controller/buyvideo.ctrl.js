educationApp.controller('buyvideoCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('视频支付');
	var videoId　=　$stateParams.videoid;
	$scope.subDetailList = {};
	var data = {
		videoid:videoId
	};
	Http.post('/video/add.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			resp.data.imgurl = picBasePath + resp.data.imgurl;
			$scope.subDetailList = resp.data;
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

	$scope.payVideo = function (orderID) {
		var data = {
			type: 'wx',
			orderid: orderID
		};
		Http.post('/pay/prepay.json', data)
		.success(function (resp) {
			if (1 === resp.code) {
				var data = resp.data;
				// 预支付成功
				var params = {
				    partnerid: data.partnerid, // merchant id
				    prepayid: data.prepayid, // prepay id
				    noncestr: data.noncestr, // nonce
				    timestamp: data.timestamp, // timestamp
				    sign: data.sign, // signed string
				};
				Wechat.sendPaymentRequest(params, function () {
				    var confirm = Popup.alert("支付成功！");
				    confirm.then(function () {
				    	// 这里支付成功后的逻辑是什么，暂时跳转到我的
				    	sessionStorage.setItem('meTab',2);
				    	$state.go('tab.me');
				    	$ionicViewSwitcher.nextDirection("forward");
				    });

				}, function (reason) {
				    Popup.alert("Failed: " + reason);
				});
			}
		})
		.error(function (){
			Popup.alert('数据请求失败，请稍后再试');
		});
	}
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);