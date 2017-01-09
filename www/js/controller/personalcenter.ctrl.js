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