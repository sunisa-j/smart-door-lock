'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('SmartDoorLock', ['ionic', 'ui.router.stateHelper', 'ui.calendar']);

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
                name: 'about',
                url: '/about',
                views: {
                    menuContent: {
                        templateUrl: 'templates/about.html'
                    }
                }
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
            },
            {
                name: 'profile',
                url: '/profile',
                views: {
                    menuContent: {
                        controller: 'ProfileController',
                        templateUrl: '../templates/profile.html'
                    }
                },
                children: [
                    {
                        name: 'changePin',
                        url: '/change-pin',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'ProfileController',
                                templateUrl: 'templates/change-pin.html'
                            }
                        }
                    },
                    {
                        name: 'manageCard',
                        url: '/manage-card',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'ProfileController',
                                templateUrl: 'templates/manage-card.html'
                            }
                        }
                    }
                ]
            },
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
                        url: '/door-info/:groupId/:doorId',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'DoorInfoController',
                                templateUrl: 'templates/door-info.html'
                            }
                        },
                        children: [
                            {
                                name: 'passcodeUnlock',
                                url: '/passcode-unlock',
                                views: {
                                    'menuContent@mainMenu': {
                                        controller: 'DoorInfoController',
                                        templateUrl: 'templates/passcode-unlock.html'
                                    }
                                },
                                children: [
                                    {
                                        name: 'editPasscodeUnlock',
                                        url: '/edit-passcode-unlock/:passcodeUnlockId',
                                        views: {
                                            'menuContent@mainMenu': {
                                                controller: 'DoorInfoController',
                                                templateUrl: 'templates/edit-passcode-unlock.html'
                                            }
                                        },
                                        children: [
                                            {
                                                name: 'passcodeAccessTime',
                                                url: '/passcode-access-time/:doorId/:passcodeUnlockId',
                                                views: {
                                                    'menuContent@mainMenu': {
                                                        controller: 'PasscodeAccessTimeController',
                                                        templateUrl: '../templates/passcode-access-time.html'
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'autoReleaseAccessTime',
                                url: '/auto-release-access-time/:doorId',
                                views: {
                                    'menuContent@mainMenu': {
                                        controller: 'AutoReleaseAccessTimeController',
                                        templateUrl: '../templates/auto-release-access-time.html'
                                    }
                                }
                            },
                            {
                                name: 'userManagement',
                                url: '/user-management/:doorId',
                                views: {
                                    'menuContent@mainMenu': {
                                        controller: 'UserManagementController',
                                        templateUrl: '../templates/user-management.html'
                                    }
                                },
                                children: [
                                    {
                                        name: 'addUser',
                                        url: '/add-user',
                                        views: {
                                            'menuContent@mainMenu': {
                                                controller: 'UserManagementController',
                                                templateUrl: '../templates/add-user.html'
                                            }
                                        }
                                    },
                                    {
                                        name: 'editUser',
                                        url: '/edit-user/:doorUserId',
                                        views: {
                                            'menuContent@mainMenu': {
                                                controller: 'UserManagementController',
                                                templateUrl: '../templates/edit-user.html'
                                            }
                                        },
                                        children: [
                                            {
                                                name: 'userAccessTime',
                                                url: '/user-access-time/:doorUserId',
                                                views: {
                                                    'menuContent@mainMenu': {
                                                        controller: 'UserAccessTimeController',
                                                        templateUrl: '../templates/user-access-time.html'
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'myActivityLog',
                                url: '/my-activity-log',
                                views: {
                                    'menuContent@mainMenu': {
                                        controller: 'DoorInfoController',
                                        templateUrl: 'templates/my-activity-log.html'
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                name: 'calendars',
                url: '/calendars',
                views: {
                    menuContent: {
                        controller: 'CalendarsController',
                        templateUrl: 'templates/calendars.html'
                    }
                },
                children: [
                    {
                        name: 'calendar',
                        url: '/calendar/:calendarId/:accessRole',
                        views: {
                            'menuContent@mainMenu': {
                                controller: 'CalendarController',
                                templateUrl: 'templates/calendar.html'
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
