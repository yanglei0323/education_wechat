educationApp.factory('Popup', ['$ionicPopup', function ($ionicPopup) {
	
	return {
		alert: function (template) {
			return $ionicPopup.alert({
				title: '提示',
				template: template,
				okText: '确定'
			});
		}
	};
	
}]);