'use strict';

window.app.controller('UserManagementController', function ($scope, $stateParams, doorsAccess, doorsUsers, users) {

    var doorId = $stateParams.doorId;
    $scope.doorName = (doorsAccess('doors'))[doorId].name;

    $scope.doorUsers = doorsUsers(doorId, 'array');
    var users = users('array');

    $scope.searchUserForAdd = function(req) {
        $scope.usersRes = [];
        $scope.usersResNotAdded = [];
        $scope.load = true;

        if(req != '') {

            // finding req user
            angular.forEach(users, function(user){
                var employeeNumber = user.employeeNumber;
                var name = (user.name);

                var res = employeeNumber.match(req);
                var res2 = name.match(req);

                if(res == req){
                    $scope.usersRes.push(user);
                }
                else if(res2 == req){
                    $scope.usersRes.push(user);
                }
            });

            if($scope.usersRes.length == 0) {
                console.log('no user match');
            }
            else {
                // found user(s) match then check not added in this door
                var index = 0;
                angular.forEach($scope.usersRes, function(userRes){
                    $scope.usersRes[index].addedStatus = false;

                    angular.forEach($scope.doorUsers, function(doorUser){
                        if(doorUser.user.employeeNumber == userRes.employeeNumber) {
                            $scope.usersRes[index].addedStatus = true;
                        }
                    });
                    index++;
                });
                console.log($scope.usersRes);
            }

            $scope.load = false;

        }else{
            $scope.load = false;
            $scope.usersRes = [];
            $scope.usersResNotAdded = [];
        }
    };
});