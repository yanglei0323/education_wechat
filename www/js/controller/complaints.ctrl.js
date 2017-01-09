educationApp.controller('complaintsCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','User','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,User,$ionicViewSwitcher) {
	console.log('产品吐槽控制器');
	$('.complaintsText').val('');
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
	// 提交吐槽信息
    $scope.goComplaints = function () {
        if ($('.complaintsText').val() == '' || $('.complaintsText').val().length<=0) {
            Popup.alert('请填写吐槽信息！');
            return;
        }else{
        	var data = {
				content:$('.complaintsText').val()
			};
			console.log(data);
	        Http.post('/user/feedback.json',data)
			.success(function (resp) {
				console.log(resp);
				if (1 === resp.code) {
					Popup.alert('感谢吐槽，我们一直在努力......');
					$ionicHistory.goBack();
	    			$ionicViewSwitcher.nextDirection("back");
				}
				else if (0 === resp.code) {
				}
			})
			.error(function (resp) {
				console.log(resp);
			});
        }
        
    };
}]);