educationApp.controller('registrationCtrl', ['$scope','Http', 'Popup', '$rootScope','$state','$stateParams','$ionicHistory','$ionicViewSwitcher', function ($scope,Http, Popup, $rootScope,$state,$stateParams,$ionicHistory,$ionicViewSwitcher) {
    console.log('填写参加人信息');
    // 获取线下课信息
    var activityId=$stateParams.activityid;
    console.log(activityId);
    var phoneRe = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    var pwdRe = /^[0-9a-zA-Z_]{6,20}/;
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
        $state.go('payactivity'
            ,{activityid:activityId, name:username, telephone:userphone, company:Company, job:Job}
            ,{reload:true});
        $ionicViewSwitcher.nextDirection("forward");
     };
}]);