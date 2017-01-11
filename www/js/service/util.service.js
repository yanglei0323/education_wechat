educationApp.factory('Util', ['Http', '$window', function (Http, $window) {
	
	return {
		getWxConfig: function () {
			var data = {
				url: $window.location.href;
			};
			Http.post('/user/unl/wzinfo.json', data)
			.success(function (resp) {
				console.log(resp);
				if (1 === resp.code) {
					return resp.data;
				}
			})
			.error(function () {
				Popup.alert('数据请求失败，请稍后再试');
			});
		},
		setWxConfig: function () {
			var wxConfig = this.getWxConfig();
			if (wxConfig) {
				wx.config({
				    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: wxConfig.appid, // 必填，公众号的唯一标识
				    timestamp: wxConfig.timestamp.toString(), // 必填，生成签名的时间戳
				    nonceStr: wxConfig.noncestr, // 必填，生成签名的随机串
				    signature: wxConfig.signature,// 必填，签名，见附录1
				    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			}
		}
	};
	
}]);