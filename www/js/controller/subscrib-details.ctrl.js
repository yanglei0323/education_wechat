educationApp.controller('subscribdetailsCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','$ionicActionSheet','$sce','$timeout', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,$ionicActionSheet,$sce,$timeout) {
	console.log('专栏订阅详情');
	var teacherId=$stateParams.teacherid;
	$scope.subDetailList = {};
	$scope.showPrice = true;
	$('.y-bPage').css({'display':'none'});
    $('.y-page-1').css({'display':'block'});
	// 视频功能
	var data1 = {
		columnid:teacherId
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

	var data = {
		teacherid:teacherId
	};
	Http.post('/page/unl/teacherdetail.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			resp.data.avatar=picBasePath + resp.data.avatar;
			resp.data.imgurl=picBasePath + resp.data.imgurl;
			$scope.subDetailList =resp.data;
			$scope.columnList =resp.data.columnlist;
			for (var i = 0; i < $scope.columnList.length; i++) {
				$scope.columnList[i].isplay = false;
				$scope.columnList[i].indexnum = i;
			}
			var priceType=parseInt(resp.data.price);
			if(priceType>=0 || $scope.columnList.price == '免费'){
				$scope.priceType = true;
			}
			if($scope.columnList.price == '免费'){
				$scope.showPrice = false;
			}
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	// 切换tab
	$scope.goSwitch=function(index){
		$('.y-bPage').css({'display':'none'});
        $('.y-page-'+index).css({'display':'block'});
	};
	
	// 关注（收藏）或者取消关注（取消收藏）发型师/课程/活动
	$scope.keepDesigner = function (subDetailList) {
		var postUrl = subDetailList.iskeep ? '/user/unkeep.json' : '/user/keep.json';
		var data2 = {
			type:1,
			id:subDetailList.id
		};
		Http.post(postUrl, data2)
		.success(function (data) {
			if (-1 === data.code) {
				console.log('用户未登录');
				$state.go('login');
			}
			else if (1 === data.code) {
				$scope.subDetailList.iskeep = !$scope.subDetailList.iskeep;
			}
		})
		.error(function (data) {
			console.log('数据请求失败，请稍后再试！');
		});
	};
	// 分享功能
	$scope.goShare = function (index) {
		var data3 = {
			kind:2,
			id:index.id
		};
		Http.post('/user/unl/share.json', data3)
		.success(function (data) {
			console.log(data);
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


	// 付费订阅支付页
	$scope.subscribPay = function (tid) {
		Http.post('/user/mine.json')
		.success(function (data) {
			if (-1 === data.code) {
				console.log('用户未登录');
				$state.go('login');
			}
			else if (1 === data.code) {
				var time=Math.floor(document.getElementById("playVideo").currentTime);
				if(time>=1){
					// 存储观看记录
					var dataTime = {
						type:0,
						id:$scope.subDetailList.id,
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
				$state.go("subscribpay", {teacherid:tid},{reload:true});
				$ionicViewSwitcher.nextDirection("forward");

			}
		})
		.error(function (data) {
			console.log('数据请求失败，请稍后再试！');
		});
	}
	// 返回上一页
	$scope.ionicBack= function () {
		var time=Math.floor(document.getElementById("playVideo").currentTime);
		if(time>=1){
			// 存储观看记录
			var dataTime = {
				type:0,
				id:$scope.subDetailList.id,
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
	// 课程目录跳转
	$scope.playVideoId=0;
	$scope.indexNum='';
	var video = document.getElementById("playVideo");
	// 视频播放状态监听,将状态赋给课程目录中的元素
	$timeout(function(){
		video.addEventListener('play',function(){
			if($scope.indexNum == ''){
				return;
			}else{
				var m=parseInt($scope.indexNum);
				$scope.columnList[m].isplay = true;
			}    
		});
		video.addEventListener('pause',function(){
			if($scope.indexNum == ''){
				return;
			}else{
				var m=parseInt($scope.indexNum);
				$scope.columnList[m].isplay = false;
			}      
		});
    },500);
	$scope.goPlayVideo=function(index){
		if(index.isplay){
			// 暂停
			index.isplay=!index.isplay;
			video.pause();
		}else{
			if($scope.playVideoId == index.id){
				index.isplay=true;
				video.play();
				return;
			}else{
				$scope.videoInfo={};
				// 获取视频地址，自动播放（第一次播放此视频执行）
				var data1 = {
					videoid:index.id
				};
				// console.log(data1);
				Http.post('/unl/playurl.json',data1)
				.success(function (resp) {
					if (1 === resp.code) {
						$scope.videoInfo=resp.data;
						$scope.playVideoId=index.id;
						$scope.indexNum=index.indexnum;
						for (var i = 0; i < $scope.columnList.length; i++) {
							$scope.columnList[i].isplay = false;
						}
						index.isplay=true;
						$timeout(function(){
							video.play();
					    },500);
					}
					else if (0 === resp.code) {
					}
				})
				.error(function (resp) {
					console.log(resp);
				});
			}
			
		}
		
	};
}]);