educationApp.controller('publicdetailsCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','$ionicActionSheet','$sce','$ionicModal', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,$ionicActionSheet,$sce,$ionicModal) {
	console.log('公开课视频详情');
	var videoId=$stateParams.videoid;
	$scope.boutiDetailList = {};
	// 视频功能
	var data1 = {
		videoid:videoId
	};
	Http.post('/unl/playurl.json',data1)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			$scope.videoInfo=resp.data;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	// 对视频添加信任
	$scope.videoUrl = function(url){ 
        return $sce.trustAsResourceUrl(url);  
    };
    // 获取视频信息
	var data = {
		videoid:videoId
	};
	Http.post('/page/unl/videodetail.json',data)
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			resp.data.teacheravatar=picBasePath + resp.data.teacheravatar;
			resp.data.imgurl=picBasePath + resp.data.imgurl;
			$scope.boutiDetailList =resp.data;
			$scope.boutiDetailList.teacherdescribe=$scope.boutiDetailList.teacherdescribe.split("\n");
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
			type:2,
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
	// 返回上一页
	$scope.ionicBack= function () {
		var time=Math.floor(document.getElementById("playVideo").currentTime);
		if(time>=1){
			// 存储观看记录
			var dataTime = {
				type:1,
				id:videoId,
				time:time
			};
			// console.log(dataTime);
			Http.post('/endplay.json',dataTime)
			.success(function (resp) {
				console.log(resp);
				if (1 === resp.code) {
				}
				else if (0 === resp.code) {
				}
			})
			.error(function (resp) {
				console.log(resp);
			});
		}
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
	$ionicModal.fromTemplateUrl('templates/modal.html', {
	  scope: $scope
	}).then(function(modal) {
	  $scope.modal = modal;
	});
	// 头像放大
	$scope.enlarge=function(url){
		$scope.modal.show();
		$scope.enlargeImg=url;
	};
	// 头像放大
	$scope.hideModal=function(){
		$scope.modal.hide();
	};
}]);