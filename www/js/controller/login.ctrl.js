educationApp.controller('loginCtrl',
	['$scope','$rootScope', 'Http', 'Popup', 'User', '$http', '$state', '$ionicLoading', '$window', function ($scope, $rootScope, Http, Popup, User, $http, $state, $ionicLoading, $window) {

	$scope.user = {};

	// 获取验证码
	$scope.getCode = function () {
		if (!$scope.user.telephone || $.trim($scope.user.telephone) == '') {
			Popup.alert('请输入手机号');
			return;
		}
		Http.post('/user/unl/sendlogin.json', {telephone: $scope.user.telephone})
		.success(function (resp) {
			if (1 === resp.code) {
				// 发送成功
				// 目前发送不了短信，验证码为reason后4位
				Popup.alert(resp.reason);
			}
			else if (0 === resp.code) {
				Popup.alert(resp.reason);
			}
		})
		.error(function (resp) {
			Popup.alert('数据请求失败，请稍后再试');
		});
	};

	// 登录按钮点击事件
	$scope.login = User.login;

	// 微信登录
	$scope.wechatLogin = function () {
		var scope = "snsapi_userinfo",
		    state = "_" + (+new Date());
		Wechat.auth(scope, state, function (resp) {
		    // 授权成功，根据code等获取appid等信息
		    $http.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx55bde7209676fe4c&secret=34932985e0a2540c9b490e06940243ab&grant_type=authorization_code&code=' + resp.code)
		    .success(function (resp) {
		    	$ionicLoading.show({
			        template: '请稍后...'
			    });
		    	// 获取openid失败
		    	if (resp.errcode) {
		    		Popup.alert(resp.errmsg);
		    	}
		    	else {
		    		var data = {
		    			type: 'wx',
		    			token: resp.access_token,
		    			openid: resp.openid
		    		};
		    		// localStorage.setItem('isWechatLogin', true);
		    		Http.post('/user/unl/thirdlogin.json', data)
		    		.success(function (resp) {
		    			$ionicLoading.hide();
		    			if (1 === resp.code) {
		    				// 登录成功(用户已绑定手机号)
		    				localStorage.setItem('isLogin', true);
							localStorage.setItem('user', JSON.stringify(resp.data));
		    				var confirm = Popup.alert('登录成功');
							confirm.then(function () {
								// $ionicHistory.goBack();
								// $window.history.back();
								$rootScope.$ionicGoBack();
							});
		    			}
		    			else if (2 === resp.code) {
		    				// 微信授权成功，用户未绑定手机号，则跳转到手机号绑定页
		    				var confirm = Popup.alert('请先绑定手机号');
							confirm.then(function () {
								$state.go('binding-phone');
							});
		    				
		    			}
		    			else {
		    				Popup.alert(resp.reason);
		    			}
		    		})
		    		.error(function () {
		    			$ionicLoading.hide();
		    			Popup.alert('数据请求失败，请稍后再试');
		    		});
		    	}
		    })
		    .error(function () {
		    	Popup.alert('数据请求失败，请稍后再试');
		    });

		}, function (reason) {
			Popup.alert('Failed：' + reason);
		    alert("Failed: " + reason);
		});

		

	};
	$scope.qqLogin = function () {
			var checkClientIsInstalled = 1;//default is 0,only for iOS
			YCQQ.ssoLogin(function(args) {
			    // Popup.alert("token is " + args.access_token);
			    $ionicLoading.show({
			        template: '请稍后...'
			    });
			    // Popup.alert("expires_time is "+ new Date(parseInt(args.expires_time)) + " TimeStamp is " +args.expires_time);
			    var data = {
	    			type: 'qq',
	    			token: args.access_token,
	    			openid: args.userid
	    		};
	    		// localStorage.setItem('isQQLogin', true);
	    		Http.post('/user/unl/thirdlogin.json', data)
	    		.success(function (resp) {
	    			$ionicLoading.hide();
	    			if (1 === resp.code) {
	    				// 登录成功(用户已绑定手机号)
	    				localStorage.setItem('isLogin', true);
						localStorage.setItem('user', JSON.stringify(resp.data));
	    				var confirm = Popup.alert('登录成功');
						confirm.then(function () {
							$rootScope.$ionicGoBack();
						});
	    			}
	    			else if (2 === resp.code) {
	    				// 授权成功，用户未绑定手机号，则跳转到手机号绑定页
	    				var confirm = Popup.alert('请先绑定手机号');
						confirm.then(function () {
							$state.go('binding-phone');
						});
	    				
	    			}
	    			else {
	    				Popup.alert(resp.reason);
	    			}
	    		})
	    		.error(function () {
	    			$ionicLoading.hide();
	    			Popup.alert('数据请求失败，请稍后再试');
	    		});
			}, function(failReason){
		        Popup.alert(failReason);
			}, checkClientIsInstalled);
		};
}]);