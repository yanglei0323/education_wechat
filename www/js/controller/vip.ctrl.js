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