educationApp.controller('areaCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','$timeout', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,$timeout) {
	console.log('技术专区控制器');
	var topicId=$stateParams.topicid;
	var topicName=$stateParams.topicname;
	$scope.topicName=topicName;
	$scope.areaList = [];
	var areaPage=1;
	var data = {
		topicid:topicId,
		page:areaPage
	};
	Http.post('/page/unl/topicvideo.json',data)
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			var videoList = resp.data.videolist;
			for (var i = 0; i < videoList.length; i++) {
				videoList[i].imgurl = picBasePath + videoList[i].imgurl;
				if(parseInt(videoList[i].price) >= 0){
					videoList[i].showprice=true;
				}else{
					videoList[i].showprice=false;
				}
			}
			$scope.areaList = videoList;
			areaPage++;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
	// 详情页跳转
	$scope.goAreaDetail=function(data){
		$state.go("boutiquedetail",{videoid:data.id},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};
	// 上拉加载
	$scope.noMorePage=false;
	$scope.loading=false;
	$scope.loadMore=function(){
	 	if(!$scope.loading){
			$scope.loading=true;
			$timeout(function(){
		        Http.post('/page/unl/topicvideo.json',{topicid:topicId,page:areaPage})
				.success(function (resp) {
					console.log(resp);
					if (1 === resp.code) {
						var videoList = resp.data.videolist;
						for (var i = 0; i < videoList.length; i++) {
							videoList[i].imgurl = picBasePath + videoList[i].imgurl;
							$scope.areaList.push(videoList[i]);
						}
						areaPage+=1;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.loading=false;
						if (videoList.length === 0) {
			                $scope.noMorePage=true;//禁止滚动触发事件
			            } 
					}
					else if (0 === resp.code) {
					}
				})
				.error(function (resp) {
					console.log(resp);
				});
		    },1000);
			
		}
	};
	// 下拉刷新
	$scope.doRefresh = function() {
		var areaPage=1;
		var data = {
			topicid:topicId,
			page:areaPage
		};
		Http.post('/page/unl/topicvideo.json',data)
		.success(function (resp) {
			// console.log(resp);
			if (1 === resp.code) {
				var videoList = resp.data.videolist;
				for (var i = 0; i < videoList.length; i++) {
					videoList[i].imgurl = picBasePath + videoList[i].imgurl;
					if(parseInt(videoList[i].price) >= 0){
						videoList[i].showprice=true;
					}else{
						videoList[i].showprice=false;
					}
				}
        		$scope.areaList = [];
				$scope.areaList = videoList;
				areaPage++;
				$scope.noMorePage=false;
			}
			else if (0 === resp.code) {
			}
		})
		.finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);