'use strict';

window.app.controller('DoorsController', function ($scope, doorsAccess) {

    $scope.doorsAccess = doorsAccess(false);
    console.log($scope.doorsAccess);

});
