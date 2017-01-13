educationApp.controller('payactivityCtrl',
	['$timeout', '$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', '$ionicLoading', 'Util',
	function ($timeout, $scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher, $ionicLoading, Util) {

	$timeout(function () {
        Util.setWxConfig();
    });
	console.log('活动支付');
	var activityId =　$stateParams.activityid;
	var mName =　$stateParams.name;
	var mTelephone =　$stateParams.telephone;
	var mCompany =　$stateParams.company;
	var mJob =　$stateParams.job;
	console.log("activityId " + activityId);
	console.log("mName " + mName);
	console.log("mTelephone " + mTelephone);
	console.log("mCompany " + mCompany);
	console.log("mJob " + mJob);


	$scope.mName = mName;
	$scope.mTelephone = mTelephone;

	$scope.subDetailList = {};
	var data = {
		activityid: activityId,
		name: mName,
		telephone: mTelephone,
		company: mCompany,
		job: mJob
	};
	Http.post('/activity/add.json',data)
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

	$scope.payActivity = function (orderID) {
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
				// if (WeixinJSBridge) {
				// 	WeixinJSBridge.invoke(
				//        'getBrandWCPayRequest', {
				//            "appId": data.appId,     //公众号名称，由商户传入     
				//            "timeStamp": data.timeStamp.toString(),         //时间戳，自1970年以来的秒数     
				//            "nonceStr": data.nonceStr, //随机串     
				//            "package": data.package,     
				//            "signType": data.signType,         //微信签名方式    
				//            "paySign": data.paySign //微信签名 
				//        },
				//        function(res) {
				//            if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				//                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
				//                var confirm = Popup.alert('支付成功');
				//                confirm.then(function () {
				// 			    	$state.go("activitydetail",{activityorderid:$scope.subDetailList.id},{reload:true});
			 //                   		$ionicViewSwitcher.nextDirection("forward");
				// 			   });
				//            }
				//            else {
				//                Popup.alert('支付失败' + res.err_msg);
				//            }
				//        }
				//    );
				// }
				wx.chooseWXPay({
				    timestamp: data.timeStamp.toString(), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
				    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
				    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
				    signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				    paySign: data.paySign, // 支付签名
				    success: function (res) {
				        // 支付成功后的回调函数
				        Popup.alert(JSON.stringify(res));
				    }
				});
			}
		})
		.error(function () {
			$ionicLoading.hide();
			Popup.alert('数据请求失败，请稍后再试');
		});
	}
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);