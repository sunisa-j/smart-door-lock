// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('SmartDoorLock', ['ionic', 'ui.router.stateHelper']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});

app.config(function(stateHelperProvider, $urlRouterProvider) {

    stateHelperProvider.setNestedState({
        name: 'mainMenu',
        abstract: true,
        url: '/main-menu',
        templateUrl: 'templates/main-menu.html',
        controller: 'MainMenuController',
        children: [
            {
                name: 'doors',
                url: '/doors',
                views: {
                    menuContent: {
                        controller: 'DoorsController',
                        templateUrl: 'templates/doors.html'
                    }
                },
                children: [
                    {
                        name: 'doorInfo',
                        url: '/door-info/:doorId',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'DoorInfoController',
                                templateUrl: 'templates/door-info.html'
                            }
                        }
                    },
                    {
                        name: 'myActivityLog',
                        url: '/my-activity-log/:doorId',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'DoorInfoController',
                                templateUrl: 'templates/my-activity-log.html'
                            }
                        }
                    }
                ]
            },
            {
                name: 'dashboard',
                url: '/dashboard',
                views: {
                    menuContent: {
                        controller: 'DashboardController',
                        templateUrl: 'templates/dashboard.html'
                    }
                }
            },
            {
                name: 'settings',
                url: '/settings',
                views: {
                    menuContent: {
                        controller: 'SettingsController',
                        templateUrl: 'templates/settings.html'
                    }
                },
                children: [
                    {
                        name: 'changePasscode',
                        url: '/change-passcode',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'SettingsController',
                                templateUrl: 'templates/change-passcode.html'
                            }
                        }
                    },
                    {
                        name: 'manageCard',
                        url: '/manage-card',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'SettingsController',
                                templateUrl: 'templates/manage-card.html'
                            }
                        }
                    },
                    {
                        name: 'about',
                        url: '/about',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'SettingsController',
                                templateUrl: 'templates/about.html'
                            }
                        }
                    }
                ]
            },
            {
                name: 'notifications',
                url: '/notifications',
                views: {
                    menuContent: {
                        controller: 'NotificationsController',
                        templateUrl: 'templates/notifications.html'
                    }
                },
                children: [
                    {
                        name: 'notification',
                        url: '/notification/:notificationId',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'NotificationsController',
                                templateUrl: 'templates/notification.html'
                            }
                        }
                    }
                ]
            }
        ]
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main-menu/doors');
});
