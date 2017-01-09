educationApp.controller('offlineLessonCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$ionicViewSwitcher','$timeout', function ($scope, Http, Popup, $rootScope,$state,$ionicViewSwitcher,$timeout) {
	console.log('线下课控制器');
	
	$scope.lineList = {};
	var page=1;
	var data = {
		page:page
	};
	Http.post('/page/unl/activitylist.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			var activityList = resp.data.activitylist;
			for (var i = 0; i < activityList.length; i++) {
				activityList[i].imgurl = picBasePath + activityList[i].imgurl;
			}
			$scope.lineList = activityList;
			page++;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	$scope.goOfficeDetails=function(index){
		$state.go("officedetails",{activityid:index.id},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};
	// 上拉加载
	$scope.noMorePage=false;
	$scope.loading=false;
	$scope.loadMore=function(){
	 	if(!$scope.loading){
			$scope.loading=true;
			$timeout(function(){
		        Http.post('/page/unl/activitylist.json',{page:page})
				.success(function (resp) {
					console.log(resp);
					if (1 === resp.code) {
						var activityList = resp.data.activitylist;
						for (var i = 0; i < activityList.length; i++) {
							activityList[i].imgurl = picBasePath + activityList[i].imgurl;
							$scope.lineList.push(activityList[i]);
						}
						page+=1;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.loading=false;
						if (activityList.length === 0) {
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
		var page=1;
		var data = {
			page:page
		};
		Http.post('/page/unl/activitylist.json',data)
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				var activityList = resp.data.activitylist;
				for (var i = 0; i < activityList.length; i++) {
					activityList[i].imgurl = picBasePath + activityList[i].imgurl;
				}
				$scope.lineList = {};
				$scope.lineList = activityList;
				page++;
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