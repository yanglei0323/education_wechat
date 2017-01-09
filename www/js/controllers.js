educationApp.controller('aboutusCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','User','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,User,$ionicViewSwitcher) {
	console.log('关于我们控制器');
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);
educationApp.controller('activitydetailCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('报名详情详情控制器');
	var useractivityId=$stateParams.useractivityid;
	$scope.activityDetailsInfo = {};
	
	// 获取验证码
	var data = {
		useractivityid:useractivityId
	};
	Http.post('/activity/myactivity.json',data)
	.success(function (resp) {
		if (1 === resp.code) {
			resp.data.activity.imgurl=picBasePath + resp.data.activity.imgurl;
			$scope.activityDetailsInfo=resp.data;
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
	// 活动详情跳转
	$scope.goOfficeDetails=function(index){
		$state.go("officedetails",{activityid:index.activity.id},{reload:true});
		$ionicViewSwitcher.nextDirection("forward");
	};
	
}]);
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
educationApp.controller('bindingPhoneCtrl', ['$scope', '$rootScope', '$state', 'Http', 'Popup', function ($scope, $rootScope, $state, Http, Popup) {
	
	$scope.user = {};

	// 获取验证码
	$scope.getBindingCode = function () {
		if (!$scope.user.telephone || $.trim($scope.user.telephone) == '') {
			Popup.alert('请输入手机号');
			return;
		}
		Http.post('/user/unl/sendlogin.json', {telephone: $scope.user.telephone})
		.success(function (resp) {
			console.log(resp);
			if (1 === resp.code) {
				// 发送成功
				// 目前发送不了短信，验证码为reason后4位
				Popup.alert(resp.reason);
			}
			else if (0 === resp.code) {
				Popup.alert(resp.reason);
			}
		})
		.error(function () {
			Popup.alert('数据请求失败，请稍后再试');
		});
	};

	// 绑定手机号按钮点击事件
	$scope.binding = function () {
		var data = {
			telephone: $scope.user.telephone,
			check: $scope.user.code,
			logintype: 1
		};
		Http.post('/user/unl/login.json', data)
		.success(function (resp) {
			console.log(resp);
			if( 1 === resp.code ) {
				// 跳转到 登录后的我
				localStorage.setItem('isLogin', true);
				localStorage.setItem('user', JSON.stringify(resp.data));
				$state.go('tab.me');
			} else if ( 0 === resp.code ) {
				Popup.alert(resp.reason);
			} else {
				Popup.alert(resp.code);
			}
		})
		.error(function () {
			Popup.alert('数据请求失败，请稍后再试');
		});;
	};
}]);
educationApp.controller('boutiquedetailCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','$ionicActionSheet','$sce','$ionicModal', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,$ionicActionSheet,$sce,$ionicModal) {
	console.log('付费精品视频详情');
	var videoId=$stateParams.videoid;
	$scope.boutiDetailList = {};
	$scope.priceType = false;
	$scope.showPrice = true;
	$scope.endedDiv = false;
	$('.y-endplay').css({'display':'none'});

	// 视频功能
	var data1 = {
		videoid:videoId
	};
	// console.log(data1);
	Http.post('/unl/playurl.json',data1)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			$scope.videoInfo=resp.data;
			// 视频监听
			if($scope.videoInfo.type == 'short'){
				var yvideo = document.getElementById('playVideo') || null;
				yvideo.addEventListener('ended',function(){
					$('.y-endplay').css({'display':'block'});
				});
			}
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
		console.log(resp);
		if (1 === resp.code) {
			resp.data.teacheravatar=picBasePath + resp.data.teacheravatar;
			resp.data.imgurl=picBasePath + resp.data.imgurl;
			$scope.boutiDetailList =resp.data;
			$scope.boutiDetailList.teacherdescribe=$scope.boutiDetailList.teacherdescribe.split("\n");
			var priceType=parseInt(resp.data.price);
			if(priceType>=0 ){
				$scope.priceType = true;
			}
			if($scope.boutiDetailList.price == '免费'){
				// $scope.showPrice = false;
				$scope.priceType = false;
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
	// 分享功能
	$scope.goShare = function (index) {
		var data3 = {
			kind:3,
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
	$scope.goBuyVideo = function (vid) {
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
				
				$state.go("buyvideo", {videoid:vid},{reload:true});
				$ionicViewSwitcher.nextDirection("forward");
			}
		})
		.error(function (data) {
			console.log('数据请求失败，请稍后再试！');
		});
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
	
	// 重新试看
	$scope.playAgin=function(){
		var yvideo = document.getElementById('playVideo') || null;
		$('.y-endplay').css({'display':'none'});
		yvideo.play();
	};
	// 立即订阅
	$scope.goSub=function(){
		sessionStorage.setItem('tabNum',1);
		$state.go("tab.micro-lesson",{reload:true});
        $ionicViewSwitcher.nextDirection("forward");
	};
}]);
educationApp.controller('buyvideoCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('视频支付');
	var videoId　=　$stateParams.videoid;
	$scope.subDetailList = {};
	var data = {
		videoid:videoId
	};
	Http.post('/video/add.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			resp.data.imgurl = picBasePath + resp.data.imgurl;
			$scope.subDetailList = resp.data;
		}
		else if (0 === resp.code) {
			Popup.alert(resp.reason);
		}
		else if (-1 === resp.code) {
			$state.go('login');
		}
	})
	.error(function (resp) {
		console.log(resp);
	});

	$scope.payVideo = function (orderID) {
		var data = {
			type: 'wx',
			orderid: orderID
		};
		Http.post('/pay/prepay.json', data)
		.success(function (resp) {
			if (1 === resp.code) {
				var data = resp.data;
				// 预支付成功
				var params = {
				    partnerid: data.partnerid, // merchant id
				    prepayid: data.prepayid, // prepay id
				    noncestr: data.noncestr, // nonce
				    timestamp: data.timestamp, // timestamp
				    sign: data.sign, // signed string
				};
				Wechat.sendPaymentRequest(params, function () {
				    var confirm = Popup.alert("支付成功！");
				    confirm.then(function () {
				    	// 这里支付成功后的逻辑是什么，暂时跳转到我的
				    	sessionStorage.setItem('meTab',2);
				    	$state.go('tab.me');
				    	$ionicViewSwitcher.nextDirection("forward");
				    });

				}, function (reason) {
				    Popup.alert("Failed: " + reason);
				});
			}
		})
		.error(function (){
			Popup.alert('数据请求失败，请稍后再试');
		});
	}
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);
educationApp.controller('collectionCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','User','$ionicViewSwitcher','$timeout','$ionicScrollDelegate', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,User,$ionicViewSwitcher,$timeout,$ionicScrollDelegate) {
    console.log('收藏列表控制器');
    $scope.nocolumn=true;
    $scope.novideo=true;
    $scope.noactivity=true;
    $scope.noMorePage=false;
    $scope.noMorePage1=false;
    $scope.noMorePage2=false;
    $scope.scrollNum1=true;
    $scope.scrollNum2=false;
    $scope.scrollNum3=false;
    // 返回上一页
    $scope.ionicBack= function () {
        $ionicHistory.goBack();
        $ionicViewSwitcher.nextDirection("back");
    };
    // 获取收藏记录(1专栏)
    $scope.columnList=[];
    var page=1;
    var data = {
        page:page,
        type:1
    };
    Http.post('/user/keeplist.json',data)
    .success(function (resp) {
        console.log(resp);
        if (1 === resp.code) {
            var teacherList = resp.data.teacherlist;
            for (var i = 0; i < teacherList.length; i++) {
                teacherList[i].imgurl = picBasePath + teacherList[i].imgurl;
            }
            $scope.columnList = teacherList;
            if(teacherList.length == 0){
                $scope.nocolumn=true;
                $scope.noMorePage=true;
            }else{
                $scope.nocolumn=false;
            }
            page++;
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
    // 专栏收藏上拉加载
    $scope.noMorePageText=false;
    $scope.loading=false;
    $scope.loadMore=function(){
        if($scope.scrollNum1){
           if(!$scope.loading){
                $scope.loading=true;
                $timeout(function(){
                    Http.post('/user/keeplist.json',{type:1,page:page})
                    .success(function (resp) {
                        console.log(resp);
                        if (1 === resp.code) {
                            var teacherList = resp.data.teacherlist;
                            for (var i = 0; i < teacherList.length; i++) {
                                teacherList[i].imgurl = picBasePath + teacherList[i].imgurl;
                                $scope.columnList.push(teacherList[i]);
                            }
                            page+=1;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.loading=false;
                            if (teacherList.length === 0) {
                                $scope.noMorePage=true;//禁止滚动触发事件
                                $scope.noMorePageText=true;
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
        
    };


    // 获取收藏记录(2视频)
    $scope.videoList=[];
    var page1=1;
    var data1 = {
        page:page1,
        type:2
    };
    Http.post('/user/keeplist.json',data1)
    .success(function (resp) {
        console.log(resp);
        if (1 === resp.code) {
            var videoList = resp.data.videolist;
            for (var i = 0; i < videoList.length; i++) {
                videoList[i].imgurl = picBasePath + videoList[i].imgurl;
            }
            $scope.videoList = videoList;
            if(videoList.length == 0){
                $scope.novideo=true;
                $scope.noMorePage1=true;
            }else{
                $scope.novideo=false;
            }
            page1++;
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
    // 视频记录上拉加载
    $scope.noMorePageText1=false;
    $scope.loading1=false;
    $scope.loadMore1=function(){
        if($scope.scrollNum2){
            if(!$scope.loading1){
                $scope.loading1=true;
                $timeout(function(){
                    Http.post('/user/keeplist.json',{type:2,page:page1})
                    .success(function (resp) {
                        console.log(resp);
                        if (1 === resp.code) {
                            var videoList = resp.data.videolist;
                            for (var i = 0; i < videoList.length; i++) {
                                videoList[i].imgurl = picBasePath + videoList[i].imgurl;
                                $scope.videoList.push(videoList[i]);
                            }
                            page1+=1;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.loading1=false;
                            if (videoList.length === 0) {
                                $scope.noMorePage1=true;//禁止滚动触发事件
                                $scope.noMorePageText1=true;
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
        
    };

    // 获取收藏记录(3活动)
    $scope.activityList=[];
    var page2=1;
    var data2 = {
        page:page2,
        type:3
    };
    Http.post('/user/keeplist.json',data2)
    .success(function (resp) {
        console.log(resp);
        if (1 === resp.code) {
            var activityList = resp.data.activitylist;
            for (var i = 0; i < activityList.length; i++) {
                activityList[i].imgurl = picBasePath + activityList[i].imgurl;
            }
            $scope.activityList = activityList;
            if(activityList.length == 0){
                $scope.noactivity=true;
                $scope.noMorePage2=true;
            }else{
                $scope.noactivity=false;
            }
            page2++;
        }
        else if (0 === resp.code) {
        }
    })
    .error(function (resp) {
        console.log(resp);
    });
    // 活动记录上拉加载
    $scope.noMorePageText2=false;
    $scope.loading2=false;
    $scope.loadMore2=function(){
        if($scope.scrollNum3){
            if(!$scope.loading2){
                $scope.loading2=true;
                $timeout(function(){
                    Http.post('/user/keeplist.json',{type:3,page:page2})
                    .success(function (resp) {
                        console.log(resp);
                        if (1 === resp.code) {
                            var activityList = resp.data.activitylist;
                            for (var i = 0; i < activityList.length; i++) {
                                activityList[i].imgurl = picBasePath + activityList[i].imgurl;
                                $scope.activityList.push(activityList[i]);
                            }
                            page2+=1;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.loading2=false;
                            if (activityList.length === 0) {
                                $scope.noMorePage2=true;//禁止滚动触发事件
                                $scope.noMorePageText2=true;
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
        
    };
    $scope.goOfficeDetails=function(index){
        $state.go("officedetails",{activityid:index.id},{reload:true});
        $ionicViewSwitcher.nextDirection("forward");
    };
    // 切换显示列表
    $scope.collSwitch=function(index){
        $('.coll-tab-item').removeClass("coll-tab-active");
        $('.coll-tab-item-'+index).addClass("coll-tab-active");
        $('.y-collection-content').css({'display':'none'});
        $('.y-collection-content-'+index).css({'display':'block'});
        if(index == 1){
            $scope.scrollNum1=true;
            $scope.scrollNum2=false;
            $scope.scrollNum3=false;
        }else if(index == 2){
            $scope.scrollNum1=false;
            $scope.scrollNum2=true;
            $scope.scrollNum3=false;
        }else if(index == 3){
            $scope.scrollNum1=false;
            $scope.scrollNum2=false;
            $scope.scrollNum3=true;
        }
        $timeout(function(){
            $ionicScrollDelegate.resize();
        },1000);
    };
}]);
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
educationApp.controller('loginCtrl',
	['$scope', '$rootScope', 'Http', 'Popup', 'User', '$http', '$state', '$ionicLoading', '$window', '$ionicHistory', '$ionicViewSwitcher',
	function ($scope, $rootScope, Http, Popup, User, $http, $state, $ionicLoading, $window, $ionicHistory, $ionicViewSwitcher) {

	$scope.user = {};

	// 获取验证码
	$scope.getCode = function () {
		if (!$scope.user.telephone || $.trim($scope.user.telephone) == '') {
			Popup.alert('请输入手机号');
			return;
		}
		Http.post('/user/unl/sendlogin.json', {telephone: $scope.user.telephone})
		.success(function (resp) {
			if (1 === resp.code) {
				// 发送成功
				// 目前发送不了短信，验证码为reason后4位
				Popup.alert(resp.reason);
			}
			else if (0 === resp.code) {
				Popup.alert(resp.reason);
			}
		})
		.error(function (resp) {
			Popup.alert('数据请求失败，请稍后再试');
		});
	};

	// 登录按钮点击事件
	$scope.login = User.login;

	// 微信登录
	$scope.wechatLogin = function () {
		var scope = "snsapi_userinfo",
		    state = "_" + (+new Date());
		Wechat.auth(scope, state, function (resp) {
		    // 授权成功，根据code等获取appid等信息
		    $http.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx55bde7209676fe4c&secret=34932985e0a2540c9b490e06940243ab&grant_type=authorization_code&code=' + resp.code)
		    .success(function (resp) {
		    	$ionicLoading.show({
			        template: '请稍后...'
			    });
		    	// 获取openid失败
		    	if (resp.errcode) {
		    		Popup.alert(resp.errmsg);
		    	}
		    	else {
		    		var data = {
		    			type: 'wx',
		    			token: resp.access_token,
		    			openid: resp.openid
		    		};
		    		// localStorage.setItem('isWechatLogin', true);
		    		Http.post('/user/unl/thirdlogin.json', data)
		    		.success(function (resp) {
		    			$ionicLoading.hide();
		    			if (1 === resp.code) {
		    				// 登录成功(用户已绑定手机号)
		    				localStorage.setItem('isLogin', true);
							localStorage.setItem('user', JSON.stringify(resp.data));
		    				// var confirm = Popup.alert('登录成功');
							// confirm.then(function () {
								// $ionicHistory.goBack();
								// $window.history.back();
								$rootScope.$ionicGoBack();
							// });
		    			}
		    			else if (2 === resp.code) {
		    				// 微信授权成功，用户未绑定手机号，则跳转到手机号绑定页
		    				var confirm = Popup.alert('请先绑定手机号');
							confirm.then(function () {
								$state.go('binding-phone');
							});
		    				
		    			}
		    			else {
		    				Popup.alert(resp.reason);
		    			}
		    		})
		    		.error(function () {
		    			$ionicLoading.hide();
		    			Popup.alert('数据请求失败，请稍后再试');
		    		});
		    	}
		    })
		    .error(function () {
		    	Popup.alert('数据请求失败，请稍后再试');
		    });

		}, function (reason) {
			Popup.alert('Failed：' + reason);
		    alert("Failed: " + reason);
		});

		

	};
	$scope.qqLogin = function () {
			var checkClientIsInstalled = 1;//default is 0,only for iOS
			YCQQ.ssoLogin(function(args) {
			    // Popup.alert("token is " + args.access_token);
			    $ionicLoading.show({
			        template: '请稍后...'
			    });
			    // Popup.alert("expires_time is "+ new Date(parseInt(args.expires_time)) + " TimeStamp is " +args.expires_time);
			    var data = {
	    			type: 'qq',
	    			token: args.access_token,
	    			openid: args.userid
	    		};
	    		// localStorage.setItem('isQQLogin', true);
	    		Http.post('/user/unl/thirdlogin.json', data)
	    		.success(function (resp) {
	    			$ionicLoading.hide();
	    			if (1 === resp.code) {
	    				// 登录成功(用户已绑定手机号)
	    				localStorage.setItem('isLogin', true);
						localStorage.setItem('user', JSON.stringify(resp.data));
	    				var confirm = Popup.alert('登录成功');
						confirm.then(function () {
							$rootScope.$ionicGoBack();
						});
	    			}
	    			else if (2 === resp.code) {
	    				// 授权成功，用户未绑定手机号，则跳转到手机号绑定页
	    				var confirm = Popup.alert('请先绑定手机号');
						confirm.then(function () {
							$state.go('binding-phone');
						});
	    				
	    			}
	    			else {
	    				Popup.alert(resp.reason);
	    			}
	    		})
	    		.error(function () {
	    			$ionicLoading.hide();
	    			Popup.alert('数据请求失败，请稍后再试');
	    		});
			}, function(failReason){
		        Popup.alert(failReason);
			}, checkClientIsInstalled);
		};

	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);
educationApp.controller('mapCtrl',
	['$scope', '$state', '$location','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope, $state, $location,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('地图控制器');
    var positionX=$stateParams.positionx;
    var positionY=$stateParams.positiony;
	
   
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(116.404,39.915),15);
    map.enableScrollWheelZoom(true);
    // 用经纬度设置地图中心点
    map.clearOverlays(); 
    var new_point = new BMap.Point(positionX,positionY);
    var marker = new BMap.Marker(new_point);  // 创建标注
    map.addOverlay(marker);              // 将标注添加到地图中
    map.panTo(new_point);      
        
    // 返回上一页
    $scope.ionicBack= function () {
        $ionicHistory.goBack();
        $ionicViewSwitcher.nextDirection("back");
    };
}]);
educationApp.controller('meCtrl',
    ['$scope', '$state', '$location', 'User','Http','Popup','$ionicViewSwitcher','$timeout','$ionicScrollDelegate', function ($scope, $state, $location, User,Http,Popup,$ionicViewSwitcher,$timeout,$ionicScrollDelegate) {
    console.log('我的控制器');
    $scope.isLogin = false;
    // 未登录提示语
    $scope.noLoginAlert = "请先登录！";
    $scope.logout = User.logout;
    $scope.nocontent=true;
    $scope.nobuy=true;
    $scope.nosign=true;
    $scope.noMorePage=true;
    $scope.noMorePage1=true;
    $scope.noMorePage2=true;
    $scope.scrollNum1=true;
    $scope.scrollNum2=false;
    $scope.scrollNum3=false;
    
    // 登录跳转
    $scope.goLogin = function(){
        $state.go('login');
        $ionicViewSwitcher.nextDirection("forward");
    };
    // 设置c
    $scope.goSetUp=function(){
        if($scope.isLogin) {
            $state.go("setup",{reload:true});
            $ionicViewSwitcher.nextDirection("forward");
        } else {
            Popup.alert( $scope.noLoginAlert);
        }
    };
    // 收藏跳转
    $scope.goCollection=function(){
        if($scope.isLogin) {
            $state.go("collection",{reload:true});
            $ionicViewSwitcher.nextDirection("forward");
        } else {
            Popup.alert( $scope.noLoginAlert);
        }
    };
    // 个人中心跳转
    $scope.goPerCenter=function(){
        if($scope.isLogin) {
            $state.go("personalcenter",{reload:true});
            $ionicViewSwitcher.nextDirection("forward");
        } else {
            Popup.alert( $scope.noLoginAlert);
        }
    };
    // 报名信息跳转
    $scope.goActivityDetail=function(data){
        if($scope.isLogin) {
            $state.go("activitydetail",{useractivityid:data.useractivityid},{reload:true});
            $ionicViewSwitcher.nextDirection("forward");
        } else {
            Popup.alert( $scope.noLoginAlert);
        }
    };
    // 365大咖成长跳转
    $scope.goVip=function(){
        if($scope.isLogin) {
            $state.go("vip",{reload:true});
            $ionicViewSwitcher.nextDirection("forward");
        } else {
            Popup.alert( $scope.noLoginAlert);
        }
    };
    // 切换信息
    $scope.goTab=function(index){
        $('.y-meTab-item').removeClass("meTab-item-h");
        $('.y-meTab-item-'+index).addClass("meTab-item-h");
        $('.y-page').css({'display':'none'});
        $('.y-page-'+index).css({'display':'block'});
        sessionStorage.setItem('meTab',index);
        if(index == 1){
            $scope.scrollNum1=true;
            $scope.scrollNum2=false;
            $scope.scrollNum3=false;
        }else if(index == 2){
            $scope.scrollNum1=false;
            $scope.scrollNum2=true;
            $scope.scrollNum3=false;
        }else if(index == 3){
            $scope.scrollNum1=false;
            $scope.scrollNum2=false;
            $scope.scrollNum3=true;
        }
        $timeout(function(){
            $ionicScrollDelegate.resize();
        },1000);
    };
    // 判断登录状态
    Http.post('/user/mine.json')
    .success(function (data) {
        if (-1 === data.code) {
            console.log('用户未登录');
            // $state.go('login');
        } else if (1 === data.code) {
            $scope.isLogin = true;
            if($scope.isLogin) {
                // 获取个人信息
                var userInfo=JSON.parse(localStorage.getItem('user'));
                // console.log(userInfo);
                $scope.userInfo=userInfo;
                // 头像
                if(userInfo.avatar == ''){
                    userInfo.avatar ='./img/head-none.png';
                }else{
                    userInfo.avatar=picBasePath + userInfo.avatar;
                }
                // 判断显示状态
                var meTab=JSON.parse(sessionStorage.getItem('meTab'));
                if(meTab == null){
                }else{
                    $('.y-meTab-item').removeClass("meTab-item-h");
                    $('.y-meTab-item-'+meTab).addClass("meTab-item-h");
                    $('.y-page').css({'display':'none'});
                    $('.y-page-'+meTab).css({'display':'block'});
                    if(meTab == 1){
                        $scope.scrollNum1=true;
                        $scope.scrollNum2=false;
                        $scope.scrollNum3=false;
                    }else if(meTab == 2){
                        $scope.scrollNum1=false;
                        $scope.scrollNum2=true;
                        $scope.scrollNum3=false;
                    }else if(meTab == 3){
                        $scope.scrollNum1=false;
                        $scope.scrollNum2=false;
                        $scope.scrollNum3=true;
                    }
                }
                // 获取学习记录
                $scope.studyList=[];
                $scope.studyVideoList=[];
                var page=1;
                var data = {
                    page:page
                };
                // 学习记录详情
                $scope.goBoutiDetail=function(data){
                    $state.go("boutiquedetail",{videoid:data.id},{reload:true});
                    $ionicViewSwitcher.nextDirection("forward");
                };
                $scope.goSubDetail=function(index){
                    $state.go("subscribdetails",{teacherid:index.teacherid},{reload:true});
                    $ionicViewSwitcher.nextDirection("forward");
                };
                Http.post('/user/studyhistory.json',data)
                .success(function (resp) {
                    console.log(resp);
                    if (1 === resp.code) {
                        var studyhistoryList = resp.data.studyhistorylist;
                        for (var i = 0; i < studyhistoryList.length; i++) {
                            if(studyhistoryList[i].type == 0){//专栏学习记录
                                studyhistoryList[i].scolumn.imgurl = picBasePath + studyhistoryList[i].scolumn.imgurl;
                                $scope.studyList.push(studyhistoryList[i]);
                            }else{//视频学习记录
                                studyhistoryList[i].video.imgurl = picBasePath + studyhistoryList[i].video.imgurl;
                                $scope.studyVideoList.push(studyhistoryList[i]);
                            }
                        }
                        page++;
                        if(studyhistoryList.length == 0){
                            $scope.nocontent=true;
                            $scope.noMorePage=true;
                        }else{
                            $scope.nocontent=false;
                            $scope.noMorePage=false;
                        }
                    }
                    else if (-1 === resp.code) {
                        $state.go('login');
                    }
                })
                .error(function (resp) {
                    console.log(resp);
                });
                
                // 学习记录上拉加载
                $scope.noMorePageText=false;
                $scope.loading=false;
                $scope.loadMore=function(){
                    if($scope.scrollNum1){
                        if(!$scope.loading){
                            $scope.loading=true;
                            $timeout(function(){
                                Http.post('/user/studyhistory.json',{page:page})
                                .success(function (resp) {
                                    console.log(resp);
                                    if (1 === resp.code) {
                                        var studyhistoryList = resp.data.studyhistorylist;
                                        for (var i = 0; i < studyhistoryList.length; i++) {
                                            if(studyhistoryList[i].type == 0){//专栏学习记录
                                                studyhistoryList[i].scolumn.imgurl = picBasePath + studyhistoryList[i].scolumn.imgurl;
                                                $scope.studyList.push(studyhistoryList[i]);
                                            }else{//视频学习记录
                                                studyhistoryList[i].video.imgurl = picBasePath + studyhistoryList[i].video.imgurl;
                                                $scope.studyVideoList.push(studyhistoryList[i]);
                                            }
                                        }
                                        page+=1;
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                        $scope.loading=false;
                                        if (studyhistoryList.length === 0) {
                                            $scope.noMorePage=true;//禁止滚动触发事件
                                            $scope.noMorePageText=true;
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
                    
                };
                // 获取购买记录
                $scope.buyList=[];
                var page1=1;
                var data1 = {
                    page:page1
                };
                Http.post('/video/myvideolist.json',data1)
                .success(function (resp) {
                    console.log(resp);
                    if (1 === resp.code) {
                        var videoList = resp.data.videolist;
                        for (var i = 0; i < videoList.length; i++) {
                            videoList[i].imgurl = picBasePath + videoList[i].imgurl;
                        }
                        $scope.buyList = videoList;
                        page1++;
                        if(videoList.length == 0){
                            $scope.nobuy=true;
                            $scope.noMorePage1=true;
                        }else{
                            $scope.nobuy=false;
                            $scope.noMorePage1=false;
                        }
                    }
                    else if (-1 === resp.code) {
                        $state.go('login');
                    }
                })
                .error(function (resp) {
                    console.log(resp);
                });
                // 购买记录上拉加载
                $scope.noMorePageText1=false;
                $scope.loading1=false;
                $scope.loadMore1=function(){
                    if($scope.scrollNum2){
                        if(!$scope.loading1){
                            $scope.loading1=true;
                            $timeout(function(){
                                Http.post('/video/myvideolist.json',{page:page1})
                                .success(function (resp) {
                                    console.log(resp);
                                    if (1 === resp.code) {
                                        var videoList = resp.data.videolist;
                                        for (var i = 0; i < videoList.length; i++) {
                                            videoList[i].imgurl = picBasePath + videoList[i].imgurl;
                                            $scope.buyList.push(videoList[i]);
                                        }
                                        page1+=1;
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                        $scope.loading1=false;
                                        if (videoList.length === 0) {
                                            $scope.noMorePage1=true;//禁止滚动触发事件
                                            $scope.noMorePageText1=true;
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
                    
                };
                // 获取报名记录
                $scope.signList=[];
                var page2=1;
                var data2 = {
                    page:page2
                };
                Http.post('/activity/myactivitylist.json',data2)
                .success(function (resp) {
                    console.log(resp);
                    if (1 === resp.code) {
                        var activityList = resp.data.activitylist;
                        for (var i = 0; i < activityList.length; i++) {
                            activityList[i].imgurl = picBasePath + activityList[i].imgurl;
                        }
                        $scope.signList = activityList;
                        page2++;
                        if(activityList.length == 0){
                            $scope.nosign=true;
                            $scope.noMorePage2=true;
                        }else{
                            $scope.nosign=false;
                            $scope.noMorePage2=false;
                        }
                    }
                    else if (-1 === resp.code) {
                        $state.go('login');
                    }
                })
                .error(function (resp) {
                    console.log(resp);
                });
                // 报名记录上拉加载
                $scope.noMorePageText2=false;
                $scope.loading2=false;
                $scope.loadMore2=function(){
                    if($scope.scrollNum3){
                        if(!$scope.loading2){
                            $scope.loading2=true;
                            $timeout(function(){
                                Http.post('/activity/myactivitylist.json',{page:page2})
                                .success(function (resp) {
                                    console.log(resp);
                                    if (1 === resp.code) {
                                        var activityList = resp.data.activitylist;
                                        for (var i = 0; i < activityList.length; i++) {
                                            activityList[i].imgurl = picBasePath + activityList[i].imgurl;
                                            $scope.signList.push(activityList[i]);
                                        }
                                        page2+=1;
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                        $scope.loading2=false;
                                        if (activityList.length === 0) {
                                            $scope.noMorePage2=true;//禁止滚动触发事件
                                            $scope.noMorePageText2=true;
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
                    
                };
            }
        }
    })
    .error(function (data) {
        console.log('数据请求失败，请稍后再试！');
    });
    
    
}]);
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
educationApp.controller('officedetailCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','$ionicActionSheet','$ionicModal', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,$ionicActionSheet,$ionicModal) {
	console.log('线下课详情');
	var activityId=$stateParams.activityid;
	$scope.boutiDetailList = {};
	$scope.priceType = false;
	$scope.showPrice = true;
	$scope.status = true;
	var data = {
		activityid:activityId
	};
	Http.post('/page/unl/activitydetail.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			resp.data.teacheravatar=picBasePath + resp.data.teacheravatar;
			resp.data.imgurl=picBasePath + resp.data.imgurl;
			$scope.boutiDetailList =resp.data;
			$scope.boutiDetailList.teacherdescribe=$scope.boutiDetailList.teacherdescribe.split("\n");
			$scope.boutiDetailList.detail=$scope.boutiDetailList.detail.split("\n");
			var priceType=parseInt(resp.data.price);
			if(priceType>=0 || $scope.boutiDetailList.price == '免费'){
				$scope.priceType = true;
			}
			if($scope.boutiDetailList.price == '免费'){
				$scope.showPrice = false;
			}
			if($scope.boutiDetailList.status == '已过期'){
				$scope.status = false;
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
educationApp.controller('payactivityCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('活动支付');
	var activityId =　$stateParams.activityid;
	var mName =　$stateParams.name;
	var mTelephone =　$stateParams.telephone;
	var mCompany =　$stateParams.company;
	var mJob =　$stateParams.job;
	console.log("activityId " + activityId);
	console.log("mName " + mName);
	console.log("mTelephone " + mTelephone);
	console.log("mCompany " + mCompany);
	console.log("mJob " + mJob);


	$scope.mName = mName;
	$scope.mTelephone = mTelephone;

	$scope.subDetailList = {};
	var data = {
		activityid: activityId,
		name: mName,
		telephone: mTelephone,
		company: mCompany,
		job: mJob
	};
	Http.post('/activity/add.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			resp.data.imgurl = picBasePath + resp.data.imgurl;
			$scope.subDetailList = resp.data;
		}
		else if (0 === resp.code) {
			Popup.alert(resp.reason);
		}
		else if (-1 === resp.code) {
			$state.go('login');
		}
	})
	.error(function (resp) {
		console.log(resp);
	});

	$scope.payActivity = function (orderID) {
		var data = {
			type: 'wx',
			orderid: orderID
		};
		Http.post('/pay/prepay.json', data)
		.success(function (resp) {
			if (1 === resp.code) {
				var data = resp.data;
				// 预支付成功
				var params = {
				    partnerid: data.partnerid, // merchant id
				    prepayid: data.prepayid, // prepay id
				    noncestr: data.noncestr, // nonce
				    timestamp: data.timestamp, // timestamp
				    sign: data.sign, // signed string
				};
				Wechat.sendPaymentRequest(params, function () {
				    var confirm = Popup.alert("支付成功！");
				    confirm.then(function () {
				    	// 这里支付成功后的逻辑是什么
				    	$state.go("activitydetail",{useractivityid:$scope.subDetailList.id},{reload:true});
                   		$ionicViewSwitcher.nextDirection("forward");
				    });

				}, function (reason) {
				    Popup.alert("Failed: " + reason);
				});
			}
		})
		.error(function (){
			Popup.alert('数据请求失败，请稍后再试');
		});
	}
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);
educationApp.controller('payvipCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('VIP支付');
	var vipId =　$stateParams.vipid;
	var mName =　$stateParams.name;
	var mTelephone =　$stateParams.telephone;
	var mCompany =　$stateParams.company;
	var mJob =　$stateParams.job;
	var mCity =　$stateParams.city;
	console.log("vipId " + vipId);
	console.log("mName " + mName);
	console.log("mTelephone " + mTelephone);
	console.log("mCompany " + mCompany);
	console.log("mJob " + mJob);
	console.log("mCity " + mCity);


	$scope.mName = mName;
	$scope.mTelephone = mTelephone;

	$scope.subDetailList = {};
	var data = {
		vipid: vipId,
		name: mName,
		telephone: mTelephone,
		company: mCompany,
		job: mJob,
		city:mCity
	};
	Http.post('/user/buyvip.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			resp.data.imgurl = picBasePath + resp.data.imgurl;
			$scope.subDetailList = resp.data;
		}
		else if (0 === resp.code) {
			Popup.alert(resp.reason);
		}
		else if (-1 === resp.code) {
			$state.go('login');
		}
	})
	.error(function (resp) {
		console.log(resp);
	});

	$scope.payVIP = function (orderID) {
		var data = {
			type: 'wx',
			orderid: orderID
		};
		Http.post('/pay/prepay.json', data)
		.success(function (resp) {
			if (1 === resp.code) {
				var data = resp.data;
				// 预支付成功
				var params = {
				    partnerid: data.partnerid, // merchant id
				    prepayid: data.prepayid, // prepay id
				    noncestr: data.noncestr, // nonce
				    timestamp: data.timestamp, // timestamp
				    sign: data.sign, // signed string
				};
				Wechat.sendPaymentRequest(params, function () {
				    var confirm = Popup.alert("支付成功！");
				    confirm.then(function () {
				    	// 这里支付成功后的逻辑是什么，暂时跳转到我的
				    	$state.go("vip",{reload:true});
            			$ionicViewSwitcher.nextDirection("forward");
				    });

				}, function (reason) {
				    Popup.alert("Failed: " + reason);
				});
			}
		})
		.error(function (){
			Popup.alert('数据请求失败，请稍后再试');
		});
	}
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);
educationApp.controller('personalcenterCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicActionSheet','$ionicViewSwitcher','$cordovaImagePicker','$cordovaCamera','$cordovaFileTransfer', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicActionSheet,$ionicViewSwitcher,$cordovaImagePicker,$cordovaCamera,$cordovaFileTransfer) {
	console.log('个人中心控制器');
	// 获取个人信息
    var userInfo=JSON.parse(localStorage.getItem('user'));
    if(userInfo.avatar == ''){
        userInfo.avatar ='./img/head-none.png';
    }else{
        userInfo.avatar=picBasePath + userInfo.avatar;
    }
    console.log(userInfo);
    // console.log(userInfo);
    // 将用户信息写入页面
    $scope.userInfo=userInfo;
    $scope.nickname=userInfo.nickname;
    $scope.sexname=userInfo.sexname;
    $scope.starname=userInfo.starname;
    $scope.starflag=userInfo.starflag;
    $scope.company=userInfo.company;
    $scope.job=userInfo.job;
    $scope.showSexSelect=false;
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
      $ionicViewSwitcher.nextDirection("back");
	};
	// 性别选择
	$scope.showSex = function() {
      var hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: '男神' },
            { text: '女王' }
          ],
          titleText: '选择性别',
          cancelText: '取消',
          cancel: function() {
               // add cancel code..
             },
          buttonClicked: function(index) {
          	switch (index) {
      				case 0:
      					$scope.sexname='男神';
      					userInfo.sexflag=1;
      					break;
      				case 1:
      					$scope.sexname='女王';
      					userInfo.sexflag=2;
      					break;
      			}
            return true;
          }
      });
	};
  // 日期选择
  var calendar = new LCalendar();
  calendar.init({
      'trigger': '#y-dateSelect', //标签id
      'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
      'minDate': '1900-1-1', //最小日期
      'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() //最大日期
  });
  // 计算星座
  function getxingzuo(month, day) {
      var d = new Date(1999, month - 1, day, 0, 0, 0);
      var arr = [];
      arr.push(["魔羯座", new Date(1999, 0, 1, 0, 0, 0) ,10])
      arr.push(["水瓶座", new Date(1999, 0, 20, 0, 0, 0),11])
      arr.push(["双鱼座", new Date(1999, 1, 19, 0, 0, 0),12])
      arr.push(["白羊座", new Date(1999, 2, 21, 0, 0, 0),1])
      arr.push(["金牛座", new Date(1999, 3, 21, 0, 0, 0),2])
      arr.push(["双子座", new Date(1999, 4, 21, 0, 0, 0),3])
      arr.push(["巨蟹座", new Date(1999, 5, 22, 0, 0, 0),4])
      arr.push(["狮子座", new Date(1999, 6, 23, 0, 0, 0),5])
      arr.push(["处女座", new Date(1999, 7, 23, 0, 0, 0),6])
      arr.push(["天秤座", new Date(1999, 8, 23, 0, 0, 0),7])
      arr.push(["天蝎座", new Date(1999, 9, 23, 0, 0, 0),8])
      arr.push(["射手座", new Date(1999, 10, 22, 0, 0, 0),9])
      arr.push(["魔羯座", new Date(1999, 11, 22, 0, 0, 0),10])
      for (var i = arr.length - 1; i >= 0; i--) {
        if (d >= arr[i][1]){
          userInfo.starflag=arr[i][2];
          return arr[i][0];
        }
      }
   };
   // 由于作用域问题，数据双向绑定失效，故延时两秒绑定监听事件
   setTimeout(function(){
      // 星座监听
      $('#y-dateSelect').bind('input propertychange', function() {
         userInfo.birthday=$("#y-dateSelect").val();
         var date = new Date($("#y-dateSelect").val().replace(/-/g, "/"));
         var info = getxingzuo(date.getMonth() + 1, date.getDate());
         $("#y-dateSelect").val(info);
      });
      // 昵称监听
      $('.nickname-input').bind('input propertychange', function() {
         userInfo.nickname = $(".nickname-input").val();
      });
      // 公司监听
      $('.company-input').bind('input propertychange', function() {
         userInfo.company = $(".company-input").val();
      });
      // 职业监听
      $('.job-input').bind('input propertychange', function() {
         userInfo.job = $(".job-input").val();
      });
   },2000);
    // 保存个人信息
    $scope.goSaveInfo= function () {
      var dataInfo = {
        nickname:userInfo.nickname,
        sexflag:userInfo.sexflag,
        starflag:userInfo.starflag,
        birthday:userInfo.birthday,
        company:userInfo.company,
        job:userInfo.job
      };
      Http.post('/user/edit.json',dataInfo)
        .success(function (resp) {
          if (1 === resp.code) {
            // 更新用户信息
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(resp.data));
            Popup.alert('保存个人信息成功！');
            $state.go("tab.me",{reload:true});
            $ionicViewSwitcher.nextDirection("forward");
          }
          else if (0 === resp.code) {
          }
        })
        .error(function (resp) {
          console.log(resp);
        });
    };
   // 添加图片
    $scope.addPhoto = function () {
        $ionicActionSheet.show({
            cancelOnStateChange: true,
            cssClass: 'action_s',
            titleText: "请选择获取图片方式",
            buttons: [
                {text: '相机'},
                {text: '图库'}
            ],
            cancelText: '取消',
            cancel: function () {
                return true;
            },
            buttonClicked: function (index) {

                switch (index) {
                    case 0:
                        $scope.takePhoto();
                        break;
                    case 1:
                        $scope.pickImage();
                        break;
                    default:
                        break;
                }
                return true;
            }
        });
    };

    //拍照
    $scope.takePhoto = function () {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,//Choose the format of the return value.
            sourceType: Camera.PictureSourceType.CAMERA,//资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
            targetWidth: 75,//头像宽度
            targetHeight: 75,//头像高度
            saveToPhotoAlbum: true

        };

        $cordovaCamera.getPicture(options)
            .then(function (imageURI) {
                //Success
                $scope.userInfo.avatar = imageURI;
                $scope.uploadPhoto();
            }, function (err) {
                // Error
            });
    };
    //选择照片
    $scope.pickImage = function () {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,//Choose the format of the return value.
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,//资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
            targetWidth: 75,//头像宽度
            targetHeight: 75//头像高度
        };

        $cordovaCamera.getPicture(options)
            .then(function (imageURI) {
                //Success
                $scope.userInfo.avatar = imageURI.split('?')[0];
                $scope.uploadPhoto();
            }, function (err) {
                // Error
            });
    };


    $scope.uploadPhoto = function () {
        var requestParams = "?callback=JSON_CALLBACK";

        var server = encodeURI('http://101.200.205.162:8889/user/edit.json' + requestParams);
        var fileURL = $scope.userInfo.avatar;
        var options = {
            fileKey: "avatar",//相当于form表单项的name属性
            fileName: fileURL.substr(fileURL.lastIndexOf('/') + 1),
            mimeType: "image/jpeg"
        };
        //用params保存其他参数，例如昵称，年龄之类
        // var params = {};
        // params['avatar'] = $scope.userInfo.avatar;
        // //把params添加到options的params中
        // options.params = params;
        $cordovaFileTransfer.upload(server, fileURL, options)
        .then(function (result) {
            // Success!
            Popup.alert('上传成功');
            Http.post('/user/mine.json')
            .success(function (resp) {
                if (-1 === resp.code) {
                    // $state.go('login');
                } else if (1 === resp.code) {
                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify(resp.data));
                }
            })
            .error(function (resp) {
                console.log('数据请求失败，请稍后再试！');
            });
        }, function (err) {
            // Error
            Popup.alert("上传失败: Code = " + error.code);
        }, function (progress) {
            // constant progress updates
        });

    };


}]);
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
	// 分享功能
	$scope.goShare = function (index) {
		var data3 = {
			kind:3,
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
educationApp.controller('publicCtrl', ['$scope','Http', 'Popup', '$rootScope', function ($scope, Http, Popup, $rootScope) {
	console.log('公开课控制器');
	
	$scope.publicList = {};
	var page=1;
	var data = {
		page:page
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
			page++;
		}
		else if (0 === resp.code) {
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
}]);
educationApp.controller('registrationCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
    console.log('填写参加人信息');
    // 获取线下课信息
    var activityId=$stateParams.activityid;
    // console.log(activityId);
    var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    var pwdRe = /^[0-9a-zA-Z_]{6,20}/;
    var data = {
        activityid:activityId
    };
    Http.post('/page/unl/activitydetail.json',data)
    .success(function (resp) {
        console.log(resp);
        if (1 === resp.code) {
            $scope.boutiDetailList =resp.data;
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
    function checkParams() {
        if ($('.company').val() == '') {
            Popup.alert('请填写有效公司名称！');
            return -1;
        }
        if ($('.profession').val() == '') {
            Popup.alert('请填写有效职业名称！');
            return -1;
        }
        if ($('.username').val() == '') {
            Popup.alert('请填写姓名！');
            return -1;
        }
        if (!phoneRe.test($('.userphone').val())) {
            Popup.alert('手机号无效！');
            return -1;
        }
        return 1;
    };
    // 信息填写完毕，跳转到支付页面
    $scope.goPayOffice = function (username, userphone, Company, Job) {
         if (-1 === checkParams()) {
             return;
         }
         console.log('跳转支付');
         if($scope.boutiDetailList.price == '免费'){
            var data1 = {
                activityid:activityId,
                name:$('.username').val(),
                telephone:$('.userphone').val(),
                company :$('.company').val(),
                job:$('.profession').val()
            };
            Http.post('/activity/add.json',data1)
            .success(function (resp) {
                // console.log(resp);
                if (1 === resp.code) {
                   $state.go("activitydetail",{useractivityid:resp.data.id},{reload:true});
                   $ionicViewSwitcher.nextDirection("forward");
                }
                else if (0 === resp.code) {
                }
            })
            .error(function (resp) {
                console.log(resp);
            });
         }else{
            $state.go('payactivity'
                ,{activityid:activityId, name:username, telephone:userphone, company:Company, job:Job}
                ,{reload:true});
            $ionicViewSwitcher.nextDirection("forward");
         }
     };
}]);
educationApp.controller('setUpCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','User','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,User,$ionicViewSwitcher) {
	console.log('设置页面控制器');
	$scope.logout = User.logout;
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
	$scope.goComplaints= function () {
	    $state.go("complaints",{reload:true});
	    $ionicViewSwitcher.nextDirection("forward");
	};
	$scope.goAboutUs= function () {
	    $state.go("aboutus",{reload:true});
	    $ionicViewSwitcher.nextDirection("forward");
	};
}]);
educationApp.controller('subscribdetailsCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher','$ionicActionSheet','$sce','$timeout','$ionicModal', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher,$ionicActionSheet,$sce,$timeout,$ionicModal) {
	console.log('专栏订阅详情');
	var teacherId=$stateParams.teacherid;
	$scope.subDetailList = {};
	$scope.describe={};
	$scope.showPrice = true;
	$('.y-bPage').css({'display':'none'});
    $('.y-page-1').css({'display':'block'});
    $('.y-endplay').css({'display':'none'});
	// 视频功能
	// var data1 = {
	// 	columnid:teacherId
	// };
	// Http.post('/unl/playurl.json',data1)
	// .success(function (resp) {
	// 	console.log(resp);
	// 	if (1 === resp.code) {
	// 		$scope.videoInfo=resp.data;
	// 	}
	// 	else if (0 === resp.code) {
	// 	}
	// })
	// .error(function (resp) {
	// 	console.log(resp);
	// });
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
			$scope.subDetailList.info=$scope.subDetailList.info.split("\n");
			$scope.describe=$scope.subDetailList.describe.split("\n");
			$scope.columnList =resp.data.columnlist;
			for (var i = 0; i < $scope.columnList.length; i++) {
				$scope.columnList[i].isplay = false;
				$scope.columnList[i].indexnum = i;
			}
			var priceType=parseInt(resp.data.price);
			if($scope.subDetailList.price == '免费'){
				$scope.priceType = true;
				$scope.showPrice = false;
			}else if(priceType>=0){
				$scope.priceType = true;
			}else if($scope.subDetailList.price == '已订阅'){
				$scope.priceType = false;
			}else{
				$scope.priceType = true;
				$scope.priceType = false;
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
				if($scope.subDetailList.price == '免费'){
					var data = {
						teacherid:teacherId
					};
					Http.post('/teacher/follow.json',data)
					.success(function (resp) {
						console.log(resp);
						if (1 === resp.code) {
							// $scope.priceType = false;
							$state.go('subscribed',{reload:true});
							$ionicViewSwitcher.nextDirection("forward");
							Popup.alert('订阅成功！');
						}
						else if (0 === resp.code) {
							Popup.alert(resp.reason);
						}
						else if (-1 === resp.code) {
							$state.go('login');
						}
					})
					.error(function (resp) {
						console.log(resp);
					});
				}else{
					$state.go("subscribpay", {teacherid:tid},{reload:true});
					$ionicViewSwitcher.nextDirection("forward");
				}

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
					columnid:index.id
				};
				// console.log(data1);
				Http.post('/unl/playurl.json',data1)
				.success(function (resp) {
					console.log(resp);
					if (1 === resp.code) {
						$scope.videoInfo=resp.data;
						$scope.playVideoId=index.id;
						$scope.indexNum=index.indexnum;
						$scope.subDetailList.playurl=$scope.videoInfo.playurl;
						if($scope.videoInfo.type == 'short'){
							var yvideo = document.getElementById('playVideo') || null;
							yvideo.addEventListener('ended',function(){
								$('.y-endplay').css({'display':'block'});
							});
						}
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
	// 重新试看
	$scope.playAgin=function(){
		var yvideo = document.getElementById('playVideo') || null;
		$('.y-endplay').css({'display':'none'});
		yvideo.play();
	};
	// 立即订阅
	$scope.goSub=function(){
		sessionStorage.setItem('tabNum',1);
		$state.go("tab.micro-lesson",{reload:true});
        $ionicViewSwitcher.nextDirection("forward");
	};
}]);
educationApp.controller('subscribpayCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
	console.log('专栏订阅支付');
	var teacherId　=　$stateParams.teacherid;
	$scope.subDetailList = {};
	var data = {
		teacherid:teacherId
	};
	Http.post('/teacher/follow.json',data)
	.success(function (resp) {
		console.log(resp);
		if (1 === resp.code) {
			// resp.data.avatar = picBasePath + resp.data.avatar;
			resp.data.imgurl = picBasePath + resp.data.imgurl;
			$scope.subDetailList = resp.data;
			// $scope.columnList =resp.data.columnlist;
			// var priceType=parseInt(resp.data.price);
			// if(priceType>=0 || $scope.columnList.price == '免费'){
			// 	$scope.priceType = true;
			// }
			// if($scope.columnList.price == '免费'){
			// 	$scope.showPrice = false;
			// }
		}
		else if (0 === resp.code) {
			Popup.alert(resp.reason);
		}
		else if (-1 === resp.code) {
			$state.go('login');
		}
	})
	.error(function (resp) {
		console.log(resp);
	});
	
	// console.log(data1);
	// Http.post('/unl/playurl.json',data1)
	// .success(function (resp) {
	// 	if (1 === resp.code) {
	// 		$scope.videoInfo=resp.data;
	// 	}
	// 	else if (0 === resp.code) {
	// 	}
	// })
	// .error(function (resp) {
	// 	console.log(resp);
	// });
	
	$scope.paySubscrib = function (orderID) {
		var data = {
			type: 'wx',
			orderid: orderID
		};
		Http.post('/pay/prepay.json', data)
		.success(function (resp) {
			if (1 === resp.code) {
				var data = resp.data;
				// 预支付成功
				var params = {
				    partnerid: data.partnerid, // merchant id
				    prepayid: data.prepayid, // prepay id
				    noncestr: data.noncestr, // nonce
				    timestamp: data.timestamp, // timestamp
				    sign: data.sign, // signed string
				};
				Wechat.sendPaymentRequest(params, function () {
				    var confirm = Popup.alert("支付成功！");
				    confirm.then(function () {
				    	// 支付成功后返回订阅列表
				    	$state.go('tab.subscribed');
				    	$ionicViewSwitcher.nextDirection("forward");
				    });

				}, function (reason) {
				    Popup.alert("Failed: " + reason);
				});
			}
		})
		.error(function (){
			Popup.alert('数据请求失败，请稍后再试');
		});
	};
	
	// 返回上一页
	$scope.ionicBack= function () {
	    $ionicHistory.goBack();
	    $ionicViewSwitcher.nextDirection("back");
	};
}]);
educationApp.controller('subscribedCtrl', ['$scope', '$rootScope', '$state', 'Http', 'Popup','$timeout', function ($scope, $rootScope, $state, Http, Popup,$timeout) {
	console.log('已订阅控制器');
	$scope.isLogin = false;
	$scope.showSubscribed = true;
	$scope.showNoSubscribed = false;
	$scope.showNoLogin = false;
	$scope.noMorePage=false;

	// 判断登录状态
    Http.post('/user/mine.json')
    .success(function (data) {
        if (-1 === data.code) {
            console.log('用户未登录');
            // $state.go('login');
            $scope.showSubscribed = false;
			$scope.showNoSubscribed = false;
			$scope.showNoLogin = true;
			$scope.noMorePage=true;
        } else if (1 === data.code) {
            $scope.isLogin = true;
            if($scope.isLogin) {
				// {"data":{"teacherlist":[{"id":1,"time":"2016-12-11 00:15:08",
				// "teacher":{"id":3,"title":"阿道夫","price":"55.0","keepnum":0,
				// "name":"老师3","watchnum":0,"job":"阿道夫","imgurl":"/teacher/useravatar3.jpg"}}]},"code":1}
				// 我订阅的老师列表
				$scope.followTeacherList = {};
				var page=1;
				var data = {
					page:page
				};
				Http.post('/teacher/followteacherlist.json',data)
				.success(function (resp) {
					console.log(resp);
					if (1 === resp.code) {
						var teacherList = resp.data.teacherlist;
						var teacherListLength = teacherList.length;
						if (0 === teacherListLength) {
							$scope.showSubscribed = false;
							$scope.showNoSubscribed = true;
							$scope.noMorePage=true;
							return;
						}
						for (var i = 0; i < teacherListLength; i++) {
							teacherList[i].teacher.imgurl = picBasePath + teacherList[i].teacher.imgurl;
						}
						$scope.followTeacherList = teacherList;
						page++;
					}
					else if (0 === resp.code) {
						Popup.alert(resp.reason);
						$scope.showSubscribed = false;
						$scope.showNoSubscribed = true;
					}
					else if (-1 === resp.code) {
						// $state.go('login');
						$scope.showSubscribed = false;
						$scope.showNoSubscribed = true;
					}
				})
				.error(function (resp) {
					console.log(resp);
				});
				
				// 上拉加载
				$scope.noMorePageText=false;
				$scope.loading=false;
				$scope.loadMore=function(){
				 	if(!$scope.loading){
						$scope.loading=true;
						$timeout(function(){
					        Http.post('/teacher/followteacherlist.json',{page:page})
							.success(function (resp) {
								console.log(resp);
								if (1 === resp.code) {
									var teacherList = resp.data.teacherlist;
									for (var i = 0; i < teacherList.length; i++) {
										teacherList[i].teacher.imgurl = picBasePath + teacherList[i].teacher.imgurl;
										$scope.followTeacherList.push(teacherList[i]);
									}
									page+=1;
									$scope.$broadcast('scroll.infiniteScrollComplete');
									$scope.loading=false;
									if (teacherList.length === 0) {
						                $scope.noMorePage=true;//禁止滚动触发事件
						                $scope.noMorePageText=true;
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
			}
        }
    })

    // 登录跳转
    $scope.goLogin = function(){
        $state.go('login');
    }
	$scope.goinfo = function (tid) {
		$state.go("subscribdetails",{teacherid:tid},{reload:true});
	};
	
}]);
educationApp.controller('vipCtrl',
	['$scope', '$state', '$location', 'User','Http','$ionicHistory','$ionicViewSwitcher','$ionicPopover','$ionicModal','Popup', function ($scope, $state, $location, User,Http,$ionicHistory,$ionicViewSwitcher,$ionicPopover,$ionicModal,Popup) {
	console.log('365大咖控制器');
    // 获取个人信息
    var userInfo=JSON.parse(localStorage.getItem('user'));
    if(userInfo.avatar == ''){
        userInfo.avatar ='./img/head-none.png';
    }else{
        userInfo.avatar=picBasePath + userInfo.avatar;
    }
    userInfo.vip.smallimgurl=picBasePath + userInfo.vip.smallimgurl;
    console.log(userInfo);
    $scope.userInfo=userInfo;
    switch (userInfo.vip.id) {
         case 1:
             $scope.vipOne=true;
             $scope.vipTwo=true;
             $scope.vipThr=true;
             break;
         case 2:
             $scope.vipOne=false;
             $scope.vipTwo=true;
             $scope.vipThr=true;
             break;
         case 3:
             $scope.vipOne=false;
             $scope.vipTwo=false;
             $scope.vipThr=true;
             break;
         case 4:
             $scope.vipOne=false;
             $scope.vipTwo=false;
             $scope.vipThr=false;
             break;
     }
    // 切换tab控制参数
    $scope.basics=true;//基础
    $scope.senior=false;//高级
    $scope.custom=false;//定制

    // 切换信息
    $scope.vipTab=function(index){
        switch (index) {
            case 1:
                $scope.basics=true;//基础
                $scope.senior=false;//高级
                $scope.custom=false;//定制
                break;
            case 2:
                $scope.basics=false;//基础
                $scope.senior=true;//高级
                $scope.custom=false;//定制
                break;
            case 3:
                $scope.basics=false;//基础
                $scope.senior=false;//高级
                $scope.custom=true;//定制
                break;
        }
        $('.y-meTab-item').removeClass("meTab-item-h");
        $('.y-meTab-item-'+index).addClass("meTab-item-h");
    };
    // 获取获取VIP列表
    $scope.viplistList={};
    Http.post('/user/unl/viplist.json')
    .success(function (resp) {
        console.log(resp);
        if (1 === resp.code) {
            var viplistList = resp.data.viplist;
            for (var i = 0; i < viplistList.length; i++) {
                viplistList[i].imgurl = picBasePath + viplistList[i].imgurl;
                viplistList[i].smallimgurl = picBasePath + viplistList[i].smallimgurl;
            }
            $scope.viplistList = viplistList;
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
    $scope.goBuyVip=function(index){
        $scope.vipid = index;
        // console.log($scope.vipid);
        $scope.modal.show();
    };
    // 显示入会信息模块
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
      
    $scope.createContact = function(user) {  
        if(user.firstName.length<=1){
            Popup.alert('请填写有效姓名！');
            return;
        }
        if(user.tel.length<=10){
            Popup.alert('请填写有效手机号码！');
            return;
        }
        if(user.company.length<=1){
            Popup.alert('请填写有效公司名称！');
            return;
        }
        if(user.job.length<=1){
            Popup.alert('请填写有效工作名称！');
            return;
        }
        if(user.city.length<=1){
            Popup.alert('请填写有效城市名称！');
            return;
        }
        console.log('成功');      
        $scope.modal.hide();
        $state.go('payvip'
            ,{vipid:$scope.vipid, name:user.firstName, telephone:user.tel, company:user.company, job:user.job, city:user.city}
            ,{reload:true});
    };
    $scope.goHomePage=function(){
        $state.go("tab.micro-lesson",{reload:true});
        $ionicViewSwitcher.nextDirection("forward");
    };
}]);