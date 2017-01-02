educationApp.controller('collectionCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','User','$ionicViewSwitcher','$timeout', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,User,$ionicViewSwitcher,$timeout) {
    console.log('收藏列表控制器');
    $scope.nocolumn=true;
    $scope.novideo=true;
    $scope.noactivity=true;
    $scope.noMorePage=false;
    $scope.noMorePage1=false;
    $scope.noMorePage2=false;
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
    };
}]);