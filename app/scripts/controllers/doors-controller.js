'use strict';

window.app.controller('DoorsController', function ($scope, doorsAccess) {

    //Get doors user can access informaiton
    $scope.doorsAccessData = doorsAccess('array');

});
