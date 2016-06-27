app = angular.module('angularRails',['ui.router','templates','Devise','angular-loading-bar']);
app.config([
'$stateProvider',
'$urlRouterProvider',
'AuthInterceptProvider',
'AuthProvider',
function($stateProvider, $urlRouterProvider,AuthInterceptProvider,AuthProvider) {

  AuthProvider.resourceName('spree_user');
  AuthProvider.loginPath("/store/user/spree_user/sign_in.js");
  AuthProvider.logoutPath("/store/user/spree_user/sign_out.js");
  AuthProvider.registerPath("/store/user/spree_user.js");
  AuthProvider.resetPasswordPath("/store/user/spree_user/password.js");
  AuthProvider.sendResetPasswordInstructionsPath("/store/user/spree_user/password.js");

  AuthInterceptProvider.interceptAuth(true);

  $stateProvider
  .state('main', {
      url: '/main',
      templateUrl: 'main/_main.html',
      controller: 'MainCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (user){
          if(!user.admin)
          {
            $state.go('home');
          }
        })
      }]
    })
    .state('home', {
      url: '/home',
      templateUrl: 'home/_home.html',
      controller: 'HomeCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (user){
          if(user.admin)
          {
            $state.go('main');
          }
        })
      }]
    })
    .state('products', {
    url: '/products',
    templateUrl: 'products/_products.html',
    controller: 'ProductsCtrl',
    resolve: {
          productPromise: ['products', function(products){
            products_aux = products.getAll();
            return products_aux;
          }]
        }
  }).state('orders', {
    url: '/orders',
    templateUrl: 'orders/_orders.html',
    controller: 'OrdersCtrl',
      resolve: {
          orderPromise: ['orders', function(orders){  
            orders_aux = orders.getAll();
            return orders_aux;
          }]
        }
  }).state('stores', {
    url: '/stores',
    templateUrl: 'stores/_stores.html',
    controller: 'StoresCtrl',
    resolve: {
          storePromise: ['stores', function(stores){
            return stores.getAll();
          }]
        }
  }).state('login', {
      url: '/login',
      templateUrl: 'auth/_login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (){
         if(user.admin)
          {
            $state.go('main');
          }else
          {
            $state.go('home');
          }
        })
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: 'auth/_register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'Auth', function($state, Auth) {
        Auth.currentUser().then(function (){
          if(user.admin)
          {
            $state.go('main');
          }else
          {
            $state.go('home');
          }
        })
      }]
    });

  $urlRouterProvider.otherwise('/home');
}]);


