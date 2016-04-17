angular.module('conFusion', ['ionic', 'ngCordova', 'conFusion.controllers','conFusion.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  
  $timeout(function(){
                $cordovaSplashscreen.hide();
      },2000);

  $rootScope.$on('loading:show', function() {
      $ionicLoading.show({
          template: '<ion-spinner></ion-spinner> Loading...'
      })
  });

  $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
  });

  $rootScope.$on('$stateChangeStart', function() {
      console.log('Loading ...');
      $rootScope.$broadcast('loading:show');
  });

  $rootScope.$on('$stateChangeSuccess', function() {
      console.log('done');
      $rootScope.$broadcast('loading:hide');
  });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller: 'IndexController',
        resolve: {
            dish: ['menuFactory', function(menuFactory) {
                return menuFactory.get({id:0});
            }],
            leader: ['corporateFactory', function(corporateFactory) {
                return corporateFactory.get({id:3});
            }],
            promotion: ['promotionFactory', function(promotionFactory) {
                return promotionFactory.get({id:0});
            }]
        }
      }
    }
  })

   .state('app.favorites', {
      url: '/favorites',
      views: {
        'mainContent': {
          templateUrl: 'templates/favorites.html',
            controller:'FavoritesController',
            resolve: {
                dishes: ['menuFactory', function(menuFactory) {
                    return menuFactory.query();
                }],
                favorites: ['favoriteFactory', function(favoriteFactory) {
                    return favoriteFactory.getFavorites();
                }]
            }
        }
      }
    })

  .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'mainContent': {
          templateUrl: 'templates/aboutus.html',
          controller: 'AboutController',
          resolve: {
              leaders: ['corporateFactory', function(corporateFactory) {
                  return corporateFactory.query();
              }]
          }
        }
      }
    })

   .state('app.contactus', {
      url: '/contactus',
      views: {
        'mainContent': {
          templateUrl: 'templates/contactus.html'
        }
      }
    })

    .state('app.menu', {
      url: '/menu',
      views: {
        'mainContent': {
          templateUrl: 'templates/menu.html',
          controller: 'MenuController',
          resolve: {
              dishes: ['menuFactory', function(menuFactory) {
                  return menuFactory.query();
              }]
          }
        }
      }
    })

  .state('app.dishdetails', {
    url: '/menu/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/dishdetail.html',
        controller: 'DishDetailController',
        resolve: {
            dish: ['$stateParams', 'menuFactory', function($stateParams, menuFactory) {
                return menuFactory.get({id:parseInt($stateParams.id, 10)});
            }]
        }
      }
    }
  });

  $urlRouterProvider.otherwise('/app/home');

});