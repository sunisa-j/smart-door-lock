'use strict';

window.app.controller('UserManagementController', function ($scope, $stateParams, doorsAccess, doorsUsers, users, $state, $ionicPopup) {

    var doorId = $stateParams.doorId;
    $scope.doorName = (doorsAccess('doors'))[doorId].name;

    $scope.doorUsers = doorsUsers(doorId, 'array');
    var usersData = users('array');

    var editDoorUserId = $stateParams.doorUserId;
    $scope.editUser = doorsUsers(doorId, 'object')[editDoorUserId];
    console.log($scope.editUser);


    // Search user ready to add
    $scope.searchUserForAdd = function(req) {
        $scope.usersRes = [];
        $scope.load = true;

        if(req != '') {
            // finding req user
            angular.forEach(usersData, function(user){
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
            }
            $scope.load = false;

        }else{
            $scope.load = false;
            $scope.usersRes = [];
        }
    };

    // Confirm to add selected user
    $scope.confirmAddUser = function(userId, employeeNumber) {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to add <span class="balanced">' + employeeNumber + '</span> to new member in ' + $scope.doorName + '?',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Cancel</span>' +
                    '</div>',
                    type: 'button-outline button-stable',
                    onTap: function(e) {
                        //e.preventDefault();
                        return false;
                    }
                },{
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-checkmark-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Confirm</span>' +
                    '</div>',
                    type: 'button-outline button-balanced',
                    onTap: function(e) {
                        //e.preventDefault();
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res) {
                addNewUser(userId);
            } else {
                console.log('Canceled');
            }
        });
    };

    // Add User
    var addNewUser = function(userId) {
        $state.go('mainMenu.doors.doorInfo.userManagement.editUser', {userId: userId});
    };

    // Delete User (remove out of doorsUsers)
    $scope.confirmDeleteUser = function(doorUserId) {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to delete "' + $scope.editUser.user.employeeNumber + '" out of '+ $scope.doorName +' ?',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Cancel</span>' +
                    '</div>',
                    type: 'button-outline button-stable',
                    onTap: function(e) {
                        //e.preventDefault();
                        return false;
                    }
                },{
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-minus-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Delete</span>' +
                    '</div>',
                    type: 'button-outline button-assertive',
                    onTap: function(e) {
                        //e.preventDefault();
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res) {
                console.log('delete: ', doorUserId);
            } else {
                console.log('cancel');
            }
        });
    };


});