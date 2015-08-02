'use strict';

window.app.controller('UserManagementController', function ($scope, $stateParams, doorsAccess, doorsUsers, users, $state, $ionicPopup) {

    var doorId = $stateParams.doorId;
    $scope.doorName = (doorsAccess(userId,'doors'))[doorId].name;
    //$scope.doorUsers = doorsUsers(doorId, 'array');
    var usersData = users('array');

    // Login user id
    var userId = 1;
    $scope.userId = userId;

    // Get Members
    $scope.doorUsers = doorsUsers(doorId, 'array');

    // Get Permission of Login User
    $scope.loginUser = { permission: {} };

    angular.forEach($scope.doorUsers, function(value){
        if(value.user.id == userId) {
            $scope.loginUser.permission = value.permission;
        }
    });

    // Search user ready to add ------------------------------------------------
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

    // Confirm to add selected user --------------------------------------------
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

    // Add User ----------------------------------------------------------------
    var addNewUser = function(userId) {
        $state.go('mainMenu.doors.doorInfo.userManagement.editUser', {userId: userId});
    };

    // Delete User (remove out of doorsUsers) ----------------------------------
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


    // -------------------------------------------------------------------------
    // User Policy -------------------------------------------------------------
    // -------------------------------------------------------------------------
    var editDoorUserId = $stateParams.doorUserId;

    // Get all user who have permission to access this door ----------

    $scope.getMemberSelected = function(){

        if(editDoorUserId){
            $scope.editUser = doorsUsers(doorId, 'object')[editDoorUserId];

            $scope.selectedUser = { latestPermission: {} };
            $scope.selectedUser.latestPermission = $scope.editUser.permission;
        }
    };
    $scope.getMemberSelected();

    // Save Permission for Edit User ----------------------------------
    $scope.savePermission = function(){
        console.log('Edit Permission to "' + $scope.editUser.permission + '" of User ID is ' + $scope.editUser.user.id);

        // When save success then refresh data
        $scope.selectedUser.latestPermission = $scope.editUser.permission;
        console.log('Selected User Latest Permission: "' + $scope.selectedUser.latestPermission + '" of User ID is ' + $scope.editUser.user.id);
        //$scope.getMemberSelected(); // Use when API Ready
    };

    $scope.cancelEditPermission = function(){
        $scope.editUser.permission = $scope.selectedUser.latestPermission;
        console.log('Selected User Latest Permission: "' + $scope.editUser.permission + '" of User ID is ' + $scope.editUser.user.id);

        // Refresh data
        $scope.getMemberSelected();
    };


});