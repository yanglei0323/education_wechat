// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var picBasePath = 'http://yuemeikeimg.oss-cn-beijing.aliyuncs.com';
var educationApp = angular.module('education', ['ionic','ngCordova'])

.run(function($ionicPlatform, $rootScope, User, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.overlaysWebView(false);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $locationProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  // 微信授权登录后获取code
  (function wechatAuth() {
      console.log(navigator.userAgent);
      var getUrlParam = function(name) {  
          //构造一个含有目标参数的正则表达式对象  
          var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
          //匹配目标参数  
          var r = window.location.search.substr(1).match(reg);  
          //返回参数值  
          if (r!=null) return decodeURI(r[2]);  
          return null;  
      };
      var code = getUrlParam('code');
      console.log(code);
      if (code) {
          // 通过code获取access_token等信息
          var data = {
              appid: 'wxef3e1498e754b61d',
              secret: '5e21b13a8d5e9b071b9bef2ad65e1883',
              code: code,
              grant_type: 'authorization_code'
          };
          $.ajax({
              url: '/sns/oauth2/access_token',
              type: 'GET',
              data: data,
              success: function (resp) {
                  console.log(resp);
              },
              error: function () {
                  alert('数据请求失败，请稍后再试');
              }
          });
      }
  })();
  $locationProvider.html5Mode(true);

  // 设置android中tabs默认显示在底部
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');
  // 全局禁用cache
  $ionicConfigProvider.views.maxCache(0);

  // 修改post请求默认配置
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.transformRequest = [function (data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
  }];

  // 路由设置
  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.micro-lesson', {
    url: '/micro-lesson',
    views: {
      'tab-micro-lesson': {
        templateUrl: 'templates/tab-micro-lesson.html',
        controller: 'microLessonCtrl'
      }
    }
  })
  .state('tab.subscribed', {
      url: '/subscribed',
      views: {
        'tab-subscribed': {
          templateUrl: 'templates/tab-subscribed.html',
          controller: 'subscribedCtrl'
        }
      },
      // needLogin: true,
      cache: false
    })
    .state('tab.offline-lesson', {
      url: '/offline-lesson',
      views: {
        'tab-offline-lesson': {
          templateUrl: 'templates/tab-offline-lesson.html',
          controller: 'offlineLessonCtrl'
        }
      }
    })
  .state('tab.me', {
    url: '/me',
    views: {
      'tab-me': {
        templateUrl: 'templates/tab-me.html',
        controller: 'meCtrl'
      }
    },
    // needLogin: true,
    cache: false
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl',
    cache: false
  })
  .state('area', {
    url: '/area:topicid/:topicname',
    templateUrl: 'templates/area.html',
    controller: 'areaCtrl'
  })
  .state('boutiquedetail', {
    url: '/boutiquedetail:videoid',
    templateUrl: 'templates/boutique-details.html',
    controller: 'boutiquedetailCtrl'
  })
  .state('buyvideo', {
    url: '/buyvideo:videoid',
    templateUrl: 'templates/buyvideo.html',
    controller: 'buyvideoCtrl'
  })
  .state('publicdetail', {
    url: '/publicdetail:videoid',
    templateUrl: 'templates/public-details.html',
    controller: 'publicdetailsCtrl'
  })
  .state('subscribdetails', {
    url: '/subscribdetails:teacherid',
    templateUrl: 'templates/subscrib-details.html',
    controller: 'subscribdetailsCtrl'
  })
  .state('subscribpay', {
    url: '/subscribpay:teacherid',
    templateUrl: 'templates/subscrib-pay.html',
    controller: 'subscribpayCtrl'
  })
  .state('officedetails', {
    url: '/officedetails:activityid',
    templateUrl: 'templates/office-details.html',
    controller: 'officedetailCtrl'
  })
  .state('payactivity', {
    url: 'payactivity/:activityid/:name/:telephone/:company/:job',
    templateUrl: 'templates/pay-activity.html',
    controller: 'payactivityCtrl'
  })
  .state('binding-phone', {
    url: '/binding-phone',
    templateUrl: 'templates/binding-phone.html',
    controller: 'bindingPhoneCtrl'
  })
  .state('map', {
    url: '/map:positionx/:positiony',
    templateUrl: 'templates/map.html',
    controller: 'mapCtrl'
  })
  .state('registration', {
    url: '/registration:activityid',
    templateUrl: 'templates/registration.html',
    controller: 'registrationCtrl'
  })
  .state('setup', {
    url: '/setup',
    templateUrl: 'templates/setUp.html',
    controller: 'setUpCtrl'
  })
  .state('complaints', {
    url: '/complaints',
    templateUrl: 'templates/complaints.html',
    controller: 'complaintsCtrl'
  })
  .state('aboutus', {
    url: '/aboutus',
    templateUrl: 'templates/aboutus.html',
    controller: 'aboutusCtrl'
  })
  .state('collection', {
    url: '/collection',
    templateUrl: 'templates/collection.html',
    controller: 'collectionCtrl'
  })
  .state('personalcenter', {
    url: '/personalcenter',
    templateUrl: 'templates/personalCenter.html',
    controller: 'personalcenterCtrl'
  })
  .state('activitydetail', {
    url: '/activitydetail:useractivityid',
    templateUrl: 'templates/activitydetail.html',
    controller: 'activitydetailCtrl'
  })
  .state('vip', {
    url: '/vip',
    templateUrl: 'templates/vip.html',
    controller: 'vipCtrl'
  })
  .state('payvip', {
    url: '/payvip/:vipid/:name/:telephone/:company/:job/:city',
    templateUrl: 'templates/pay-vip.html',
    controller: 'payvipCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/micro-lesson');
});
