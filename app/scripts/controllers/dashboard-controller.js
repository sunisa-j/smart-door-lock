'use strict';

window.app.controller('DashboardController', function ($scope, doorsAccess) {

    // get count of access doors & access doors information
    $scope.doorsAccess = doorsAccess('array');
    $scope.doorsNumber = doorsAccess('count');

    $scope.dateNow = new Date();
    $scope.getTimeDateNow = $scope.dateNow.getTime();

    $scope.groupDoorsExpireDate = function(doorsAccessData) {
        var doorsExpireData = [];

        angular.forEach(doorsAccessData, function (group) {

            angular.forEach(group.doorsAccess, function (door) {
                var tmp = {
                    doorId: door.$id,
                    doorName: door.name,
                    groupId: group.$id,
                    groupName: group.name,
                    expireDate: door.expire,
                    getTimeExpireDate : (door.expire).getTime()
                };
                doorsExpireData.push(tmp);
            });
        });
        return doorsExpireData;
    };
    $scope.doorsExpireData = $scope.groupDoorsExpireDate($scope.doorsAccess);

    // month
    $scope.month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // get count of unread msg (notifications)
    $scope.unreadMsgs = 2;

    // get count of this user request (waiting for approval status)
    $scope.thisUserRequest = 1;

    // if user is door approver, get count of request (waiting for approval status)
    $scope.peopleRequest = 2;

});
