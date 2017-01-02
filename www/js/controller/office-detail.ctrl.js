educationApp.controller('officedetailCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','$ionicActionSheet', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,$ionicActionSheet) {
	console.log('线下课详情');
	var activityId=$stateParams.activityid;
	$scope.boutiDetailList = {};
	$scope.priceType = false;
	$scope.showPrice = true;
	var data = {
		activityid:activityId
	};
	Http.post('/page/unl/activitydetail.json',data)
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			resp.data.teacheravatar=picBasePath + resp.data.teacheravatar;
			$scope.boutiDetailList =resp.data;
			var priceType=parseInt(resp.data.price);
			if(priceType>=0 || $scope.boutiDetailList.price == '免费'){
				$scope.priceType = true;
			}
			if($scope.boutiDetailList.price == '免费'){
				$scope.showPrice = false;
			}
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	// 关注（收藏）或者取消关注（取消收藏）发型师/课程/活动
	$scope.keepDesigner = function (boutiDetailList) {
		var postUrl = boutiDetailList.iskeep ? '/user/unkeep.json' : '/user/keep.json';
		var data2 = {
			type:3,
			id:boutiDetailList.id
		};
		Http.post(postUrl, data2)
		.success(function (data) {
			if (-1 === data.code) {
				console.log('用户未登录');
				$state.go('login');
			}
			else if (1 === data.code) {
				$scope.boutiDetailList.iskeep = !$scope.boutiDetailList.iskeep;
			}
		})
		.error(function (data) {
			console.log('数据请求失败，请稍后再试！');
		});
	};
	// 分享功能
	$scope.goShare = function (index) {
		var data3 = {
			kind:4,
			id:index.id
		};
		Http.post('/user/unl/share.json', data3)
		.success(function (data) {
			// console.log(data);
			if (-1 === data.code) {
				console.log('用户未登录');
			}
			else if (1 === data.code) {
				$scope.title=data.data.topic;
				$scope.desc=data.data.info;
				$scope.url=data.data.jumpurl;
				$scope.thumb=data.data.imgurl;
				$ionicActionSheet.show({
			          buttons: [
			            { text: '微信朋友圈' },
			            { text: '微信好友' }
			          ],
			          titleText: '分享',
			          cancelText: '取消',
			          cancel: function() {
			               // add cancel code..
			             },
			          buttonClicked: function(index) {
			          	switch (index) {
			      				case 0:
			      					$scope.shareViaWechat(1,$scope.title,$scope.desc,$scope.url,$scope.thumb);
			      					break;
			      				case 1:
			      					$scope.shareViaWechat(0,$scope.title,$scope.desc,$scope.url,$scope.thumb);
			      					break;
			      			}
			            return true;
			          }
			      });
			}
		})
		.error(function (data) {
			console.log('数据请求失败，请稍后再试！');
		});
	};
	$scope.shareViaWechat = function(scene,title,desc,url,thumb) {
	      Wechat.share({
	        message: {
	          title: title,
	          description: desc,
	          thumb: thumb,
	          media: {
	            type: Wechat.Type.WEBPAGE,
	            webpageUrl: url
	          }
	        },
	        scene: scene // share to Timeline
	      }, function() {
	        Popup.alert('分享成功！');
	      }, function(reason) {
	        Popup.alert(reason);
	      });
    };
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
	// 地图跳转
	$scope.goMap=function(x,y){
		$state.go("map",{positionx:x,positiony:y},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
		// window.location.href='http://map.baidu.com/mobile/webapp/index/index/qt=cur&wd=%E5%8C%97%E4%BA%AC%E5%B8%82&from=maponline&tn=m01&ie=utf-8/vt=map';
	};
	// 报名信息填写页面跳转
	$scope.goRegistration=function(){
		Http.post('/user/mine.json')
		.success(function (data) {
			if (-1 === data.code) {
				console.log('用户未登录');
				$state.go('login');
			}
			else if (1 === data.code) {
				$state.go("registration",{activityid:activityId},{reload:true});
				$ionicViewSwitcher.nextDirection("forward");

			}
		})
		.error(function (data) {
			console.log('数据请求失败，请稍后再试！');
		});
	};
	
}]);