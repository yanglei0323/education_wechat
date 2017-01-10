educationApp.controller('subscribpayCtrl',
	['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', '$ionicLoading',
	function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher, $ionicLoading) {
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
	
	$scope.paySubscrib = function (orderID) {
		var data = {
			type: 'wz',
			orderid: orderID
		};
		$ionicLoading.show({
			template: '<ion-spinner></ion-spinner>'
		});
		Http.post('/pay/prepay.json', data)
		.success(function (resp) {
			$ionicLoading.hide();
			if (1 === resp.code) {
				var data = resp.data;
				// 预支付成功
				if (WeixinJSBridge) {
					WeixinJSBridge.invoke(
				       'getBrandWCPayRequest', {
				           "appId": data.appId,     //公众号名称，由商户传入     
				           "timeStamp": data.timeStamp.toString(),         //时间戳，自1970年以来的秒数     
				           "nonceStr": data.nonceStr, //随机串     
				           "package": data.package,     
				           "signType": data.signType,         //微信签名方式    
				           "paySign": data.paySign //微信签名 
				       },
				       function(res) {
				           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				               // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
				               var confirm = Popup.alert('支付成功');
				               confirm.then(function () {
							    	// 支付成功后返回订阅列表
							    	$state.go('tab.subscribed');
							    	$ionicViewSwitcher.nextDirection("forward");
							   });
				           }
				           else {
				               Popup.alert('支付失败' + res.err_msg);
				           }
				       }
				   );
				}
			}
		})
		.error(function () {
			$ionicLoading.hide();
			Popup.alert('数据请求失败，请稍后再试');
		});
	};
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);