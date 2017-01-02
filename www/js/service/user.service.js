educationApp.factory('User',
	['Http', '$ionicHistory', 'Popup', function (Http, $ionicHistory, Popup) {

		var clearInfo = function () {
			// 清除本地存储的用户信息
			localStorage.removeItem('isLogin');
			localStorage.removeItem('user');
			// 清除cookie
			document.cookie = '';	
		};

		return {
			getUser: function () {
				return JSON.parse(localStorage.getItem('user')) || {};
			},
			isLogin: function () {
				return !!localStorage.getItem('isLogin') || false;
			},
			// 登录
			login: function (phone, code) {
				var data = {
					telephone: phone,
					check: code
				};
				Http.post('/user/unl/login.json', data)
				.success(function (resp) {
					if (1 === resp.code) {
						// 登录成功
						localStorage.setItem('isLogin', true);
						localStorage.setItem('user', JSON.stringify(resp.data));
						var confirm = Popup.alert('登录成功');
						confirm.then(function () {
							$ionicHistory.goBack();
						});
					}
				})
				.error(function (resp) {
					Popup.alert('数据请求失败，请稍后再试');
				});
			},
			clearInfo: clearInfo,
			// 退出登录
			logout: function () {
				Http.post('/user/unl/logout.json')
				.success(function (resp) {
					if (1 === resp.code) {
						// 退出登录成功
						clearInfo();
						var confirm = Popup.alert('退出登录成功');
						confirm.then(function () {
							$ionicHistory.goBack();
						});
					}
				})
				.error(function () {
					Popup.alert('数据请求失败，请稍后再试');
				});
			}
		};
	}]);