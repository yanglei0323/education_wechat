educationApp.controller('microLessonCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$timeout','$ionicSlideBoxDelegate','$ionicViewSwitcher','$ionicScrollDelegate', function ($scope, Http, Popup, $rootScope,$state,$timeout,$ionicSlideBoxDelegate,$ionicViewSwitcher,$ionicScrollDelegate) {
	console.log('小悦微课控制器');
	$scope.scrollNum2=false;
	$scope.scrollNum3=false;
	$scope.scrollNum4=false;
	// 轮播图
	$scope.bannerList = {};
	Http.post('/page/unl/choosead.json')
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			var homeAdList = resp.data.adlist;
			for (var i = 0; i < homeAdList.length; i++) {
				homeAdList[i].imgurl = picBasePath + homeAdList[i].imgurl;
			}
			$scope.bannerList = homeAdList;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		// console.log(resp);
	});
	$timeout(function(){
        $scope.mySwiper = new Swiper("#indexbanner",{  
	   		autoplayDisableOnInteraction : false,/*触摸后是否停止自动播放*/ 
	        direction:"horizontal",/*横向滑动*/  
	        loop:true,/*形成环路（即：可以从最后一张图跳转到第一张图*/  
	        pagination:".swiper-pagination",/*分页器*/   
	        autoplay:3000,/*每隔3秒自动播放*/ 
	        observer:true,//修改swiper自己或子元素时，自动初始化swiper
			observeParents:true//修改swiper的父元素时，自动初始化swiper 
	    })
    },500);
    //判断显示状态
	var tabNum=JSON.parse(sessionStorage.getItem('tabNum'));
	if(tabNum == null){
		$('.y-home-content').css({'display':'none'});
		$('.y-home-content-1').css({'display':'block'});
	}else{
		$('.home-tab-item').removeClass("home-tab-active");
		$('.home-tab-item-'+tabNum).addClass("home-tab-active");
		$('.y-home-content').css({'display':'none'});
		$('.y-home-content-'+tabNum).css({'display':'block'});
		if(tabNum == 2){
			$scope.scrollNum2=true;
			$scope.scrollNum3=false;
			$scope.scrollNum4=false;
		}else if(tabNum == 3){
			$scope.scrollNum2=false;
			$scope.scrollNum3=true;
			$scope.scrollNum4=false;
		}else if(tabNum == 4){
			$scope.scrollNum2=false;
			$scope.scrollNum3=false;
			$scope.scrollNum4=true;
		}
	}
	// 专栏订阅
	$scope.subDesignerList = {};
	Http.post('/page/unl/chooseteacherlist.json')
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			var teacherList = resp.data.teacherlist;
			for (var i = 0; i < teacherList.length; i++) {
				teacherList[i].imgurl = picBasePath + teacherList[i].imgurl;
			}
			$scope.subDesignerList = teacherList;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	$scope.goSubDetails=function(index){
		$state.go("subscribdetails",{teacherid:index.id},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};

	// 专题
	$scope.specialList = {};
	Http.post('/page/unl/choosetopic.json')
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			var topicList = resp.data.topiclist;
			for (var i = 0; i < topicList.length; i++) {
				topicList[i].imgurl = picBasePath + topicList[i].imgurl;
			}
			$scope.specialList = topicList;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	$scope.goArea=function(topic){
		$state.go("area",{topicid:topic.id,topicname:topic.name,},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};

	// 热门推荐
	$scope.recomList = {};
	Http.post('/page/unl/choosehotvideo.json')
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			var hotvideoList = resp.data.hotvideolist;
			for (var i = 0; i < hotvideoList.length; i++) {
				hotvideoList[i].imgurl = picBasePath + hotvideoList[i].imgurl;
				if(parseInt(hotvideoList[i].video.price) >= 0){
					hotvideoList[i].showprice=true;
				}else{
					hotvideoList[i].showprice=false;
				}
			}
			$scope.recomList = hotvideoList;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	$scope.homeSwitch=function(index){
		$('.home-tab-item').removeClass("home-tab-active");
		$('.home-tab-item-'+index).addClass("home-tab-active");
		$('.y-home-content').css({'display':'none'});
		$('.y-home-content-'+index).css({'display':'block'});
		sessionStorage.setItem('tabNum',index);
		$scope.mySwiper.stopAutoplay();
		if(index == 1){
		    // 轮播图
			$scope.bannerList = {};
			Http.post('/page/unl/choosead.json')
			.success(function (resp) {
				// console.log(resp);
				if (1 === resp.code) {
					var homeAdList = resp.data.adlist;
					for (var i = 0; i < homeAdList.length; i++) {
						homeAdList[i].imgurl = picBasePath + homeAdList[i].imgurl;
					}
					$scope.bannerList = homeAdList;
					$scope.mySwiper.startAutoplay();
				}
				else if (0 === resp.code) {
				}
			})
			.error(function (resp) {
				// console.log(resp);
			});
		}else if(index == 2){
			$scope.scrollNum2=true;
			$scope.scrollNum3=false;
			$scope.scrollNum4=false;
		}else if(index == 3){
			$scope.scrollNum2=false;
			$scope.scrollNum3=true;
			$scope.scrollNum4=false;
		}else if(index == 4){
			$scope.scrollNum2=false;
			$scope.scrollNum3=false;
			$scope.scrollNum4=true;
		}
		$timeout(function(){
            $ionicScrollDelegate.resize();
        },1000);
	}
		
	// 付费精品模块
	$scope.boutiqueList = {};
	var boutiquePage=1;
	var data = {
		page:boutiquePage
	};
	Http.post('/page/unl/payvidedo.json',data)
	.success(function (resp) {
		if (1 === resp.code) {
			var payvidedoList = resp.data.payvidedolist;
			for (var i = 0; i < payvidedoList.length; i++) {
				payvidedoList[i].imgurl = picBasePath + payvidedoList[i].imgurl;
			}
			$scope.boutiqueList = payvidedoList;
			boutiquePage++;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	$scope.goBoutiDetail=function(data){
		$state.go("boutiquedetail",{videoid:data.id},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};



	// 公开课模块
	$scope.publicList = {};
	var publicPage=1;
	var data = {
		page:publicPage
	};
	Http.post('/page/unl/freevidedo.json',data)
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			var freevidedoList = resp.data.freevidedolist;
			for (var i = 0; i < freevidedoList.length; i++) {
				freevidedoList[i].imgurl = picBasePath + freevidedoList[i].imgurl;
			}
			$scope.publicList = freevidedoList;
			publicPage++;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	$scope.gopublicDetail=function(data){
		$state.go("publicdetail",{videoid:data.id},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};

	// 课程表模块
	$scope.curriculumList = {};
	var curriculumPage=1;
	var data = {
		page:curriculumPage
	};
	Http.post('/page/unl/schedule.json',data)
	.success(function (resp) {
		// console.log(resp);
		if (1 === resp.code) {
			var currList = resp.data.freevidedolist;
			for (var i = 0; i < currList.length; i++) {
				currList[i].imgurl = picBasePath + currList[i].imgurl;
			}
			$scope.curriculumList = currList;
			curriculumPage++;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	// 付费精品上拉加载
	$scope.noMorePage=false;
	$scope.loading=false;
	$scope.loadMore=function(){
		if($scope.noMorePage){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			return;
		}else{
			if($scope.scrollNum2){
				if(!$scope.loading){
					$scope.loading=true;
					$timeout(function(){
						Http.post('/page/unl/payvidedo.json',{page:boutiquePage})
						.success(function (resp) {
							console.log(resp);
							if (1 === resp.code) {
								var payvidedoList = resp.data.payvidedolist;
								for (var i = 0; i < payvidedoList.length; i++) {
									payvidedoList[i].imgurl = picBasePath + payvidedoList[i].imgurl;
									$scope.boutiqueList.push(payvidedoList[i]);
								}
								boutiquePage+=1;
								$scope.$broadcast('scroll.infiniteScrollComplete');
								$scope.loading=false;
								if (payvidedoList.length === 0) {
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
			}else{
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		}
		
	 	
	};
	// 公开课上拉加载
	$scope.noMorePage1=false;
	$scope.loading1=false;
	$scope.loadMore1=function(){
		if($scope.noMorePage1){
			$scope.$broadcast('scroll.infiniteScrollComplete');
			return;
		}else{
			if($scope.scrollNum3){
				if(!$scope.loading1){
					$scope.loading1=true;
					Http.post('/page/unl/freevidedo.json',{page:publicPage})
					.success(function (resp) {
						console.log(resp);
						if (1 === resp.code) {
							var freevidedoList = resp.data.freevidedolist;
							for (var i = 0; i < freevidedoList.length; i++) {
								freevidedoList[i].imgurl = picBasePath + freevidedoList[i].imgurl;
								$scope.publicList.push(freevidedoList[i]);
							}
							publicPage+=1;
							$scope.$broadcast('scroll.infiniteScrollComplete');
							$scope.loading1=false;
							if (freevidedoList.length === 0) {
				                $scope.noMorePage1=true;//禁止滚动触发事件
				            } 
						}
						else if (0 === resp.code) {
						}
					})
					.error(function (resp) {
						console.log(resp);
					});
				}
			}else{
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		}
		
	 	
	};
	// 课程表上拉加载
	$scope.noMorePage2=false;
	$scope.loading2=false;
	$scope.loadMore2=function(){
		if($scope.scrollNum4){
			if(!$scope.loading2){
				$scope.loading2=true;
				Http.post('/page/unl/schedule.json',{page:curriculumPage})
				.success(function (resp) {
					console.log(resp);
					if (1 === resp.code) {
						var currList = resp.data.freevidedolist;
						for (var i = 0; i < currList.length; i++) {
							currList[i].imgurl = picBasePath + currList[i].imgurl;
							$scope.curriculumList.push(currList[i]);
						}
						curriculumPage+=1;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.loading2=false;
						if (currList.length === 0) {
			                $scope.noMorePage2=true;//禁止滚动触发事件
			            } 
					}
					else if (0 === resp.code) {
					}
				})
				.error(function (resp) {
					console.log(resp);
				});
			}
		}else{
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	 	
	};
	$scope.bannerJump=function(banner){
		var index=banner.jumpflag;
		switch (index) {
			case 0:
				// 图文
				// window.location.href=banner.type;
				break;
			case 1:
				// 链接
				// window.location.href=banner.jumpurl;
				break;
			case 21:
				// 专题1列表
				$state.go("area",{topicid:$scope.specialList[0].id,topicname:$scope.specialList[0].name,},{reload:true});
				$ionicViewSwitcher.nextDirection("forward");
				break;
			case 22:
				// 专题2列表
				$state.go("area",{topicid:$scope.specialList[1].id,topicname:$scope.specialList[1].name,},{reload:true});
				$ionicViewSwitcher.nextDirection("forward");
				break;
			case 23:
				// 专题3列表
				$state.go("area",{topicid:$scope.specialList[2].id,topicname:$scope.specialList[2].name,},{reload:true});
				$ionicViewSwitcher.nextDirection("forward");
				break;
			case 24:
				// 专题4列表
				$state.go("area",{topicid:$scope.specialList[3].id,topicname:$scope.specialList[3].name,},{reload:true});
				$ionicViewSwitcher.nextDirection("forward");
				break;
			case 3:
				// 付费精品列表
				$scope.homeSwitch(2);
				break;
			case 4:
				// 线下课列表
				$scope.homeSwitch(3);
				break;
			case 5:
				// 课程表
				$scope.homeSwitch(4);
				break;
			case 6:
				// vip表
				$state.go("vip",{reload:true});
            	$ionicViewSwitcher.nextDirection("forward");
				break;
			case 99:
				// 不跳转
				break;

		}
	};
	// 付费列表下拉刷新
	$scope.doRefresh = function() {
        // 付费精品模块
		var boutiquePage=1;
		var data = {
			page:boutiquePage
		};
		Http.post('/page/unl/payvidedo.json',data)
		.success(function (resp) {
			// console.log(resp);
			if (1 === resp.code) {
				var payvidedoList = resp.data.payvidedolist;
				for (var i = 0; i < payvidedoList.length; i++) {
					payvidedoList[i].imgurl = picBasePath + payvidedoList[i].imgurl;
				}
				$scope.boutiqueList = {};
				$scope.boutiqueList = payvidedoList;
				boutiquePage++;
				$scope.noMorePage=false;
			}
			else if (0 === resp.code) {
			}
		})
		.finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    // 公开课下拉刷新
	$scope.doRefresh1 = function() {
        // 公开课模块
		var publicPage=1;
		var data = {
			page:publicPage
		};
		Http.post('/page/unl/freevidedo.json',data)
		.success(function (resp) {
			// console.log(resp);
			if (1 === resp.code) {
				var freevidedoList = resp.data.freevidedolist;
				for (var i = 0; i < freevidedoList.length; i++) {
					freevidedoList[i].imgurl = picBasePath + freevidedoList[i].imgurl;
				}
				$scope.publicList = {};
				$scope.publicList = freevidedoList;
				publicPage++;
				// $scope.noMorePage1=false;
			}
			else if (0 === resp.code) {
			}
		}).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    // 课程表模块下拉刷新
	$scope.doRefresh2 = function() {
       // 课程表模块
		var curriculumPage=1;
		var data = {
			page:curriculumPage
		};
		Http.post('/page/unl/schedule.json',data)
		.success(function (resp) {
			// console.log(resp);
			if (1 === resp.code) {
				var currList = resp.data.freevidedolist;
				for (var i = 0; i < currList.length; i++) {
					currList[i].imgurl = picBasePath + currList[i].imgurl;
				}
				$scope.curriculumList = {};
				$scope.curriculumList = currList;
				curriculumPage++;
				$scope.noMorePage2=false;
			}
			else if (0 === resp.code) {
			}
		})
		.finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
}]);