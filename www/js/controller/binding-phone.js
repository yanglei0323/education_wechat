educationApp.controller('bindingPhoneCtrl', ['$scope', '$rootScope', '$state', 'Http', 'Popup', function ($scope, $rootScope, $state, Http, Popup) {
	
	$scope.user = {};

	// 获取验证码
	$scope.getBindingCode = function () {
		if (!$scope.user.telephone || $.trim($scope.user.telephone) == '') {
			Popup.alert('请输入手机号');
			return;
		}
		Http.post('/user/unl/sendlogin.json', {telephone: $scope.user.telephone})
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				// 发送成功
				// 目前发送不了短信，验证码为reason后4位
				Popup.alert(resp.reason);
			}
			else if (0 === resp.code) {
				Popup.alert(resp.reason);
			}
		})
		.error(function () {
			Popup.alert('数据请求失败，请稍后再试');
		});
	};

	// 绑定手机号按钮点击事件
	$scope.binding = function () {
		var data = {
			telephone: $scope.user.telephone,
			check: $scope.user.code,
			logintype: 1
		};
		Http.post('/user/unl/login.json', data)
		.success(function (resp) {
			console.log(resp);
			if( 1 === resp.code ) {
				// 跳转到 登录后的我
				localStorage.setItem('isLogin', true);
				localStorage.setItem('user', JSON.stringify(resp.data));
				$state.go('tab.me');
			} else if ( 0 === resp.code ) {
				Popup.alert(resp.reason);
			} else {
				Popup.alert(resp.code);
			}
		})
		.error(function () {
			Popup.alert('数据请求失败，请稍后再试');
		});;
	};
}]);