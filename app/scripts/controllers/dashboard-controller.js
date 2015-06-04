'use strict';

window.app.controller('DashboardController', function ($scope) {

    // get count of access doors & access doors information
    //$scope.accessDoorsInfo = {
    //    "Robot": {
    //        "numberOfAcccessDoors": 3,
    //        "doorsInfo": {
    //            "1": {
    //                "name": "R200",
    //                "desc": "classroom on 2nd floor",
    //                "accessTime": {
    //                    "type": "custom",
    //                    "beginDate": "1-4-2015",
    //                    "endDate": "30-4-2015",
    //                    "time": {
    //                        "1": { "beginTime": "1:30 am", "endTime": "4.30 pm", "days": [M,T]},
    //                        "2": { "beginTime": "1:30 am", "endTime": "4.30 pm", "days": [M,T]}
    //                    }
    //                }
    //            }
    //        }
    //    }
    //};
    $scope.accessDoors = 3;

    // get count of unread msg (notifications)
    $scope.unreadMsgs = 2;

    // get count of this user request (waiting for approval status)
    $scope.thisUserRequest = 1;

    // if user is door approver, get count of request (waiting for approval status)
    $scope.peopleRequest = 2;

});
