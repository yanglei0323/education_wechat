educationApp.controller('meCtrl',
    ['$scope', '$state', '$location', 'User','Http','Popup','$ionicViewSwitcher','$timeout', function ($scope, $state, $location, User,Http,Popup,$ionicViewSwitcher,$timeout) {
    console.log('我的控制器');
    $scope.isLogin = false;
    // 未登录提示语
    $scope.noLoginAlert = "请先登录！";
    $scope.logout = User.logout;
    $scope.nocontent=true;
    $scope.nobuy=true;
    $scope.nosign=true;
    $scope.noMorePage=false;
    $scope.noMorePage1=false;
    $scope.noMorePage2=false;
    
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
    };
    // 判断登录状态
    Http.post('/user/mine.json')
    .success(function (data) {
        if (-1 === data.code) {
            console.log('用户未登录');
            // $state.go('login');
            $scope.noMorePage=true;
            $scope.noMorePage1=true;
            $scope.noMorePage2=true;
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
                    return;
                }else{
                    $('.y-meTab-item').removeClass("meTab-item-h");
                    $('.y-meTab-item-'+meTab).addClass("meTab-item-h");
                    $('.y-page').css({'display':'none'});
                    $('.y-page-'+meTab).css({'display':'block'});
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
                };
            }
        }
    })
    .error(function (data) {
        console.log('数据请求失败，请稍后再试！');
    });
    
    
}]);