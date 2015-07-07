'use strict';

window.app.factory('users', function () {

    var usersArr = [
        {
            id: 1,
            employeeNumber: '4910110547',
            name: 'นางสาว สุนิสา จุลรัตน์',
            firstName: 'สุนิสา',
            lastName: 'จุลรัตน์',
            gender: 'F',
            picture: null,
            createdAt: "2015-06-06T00:02:07.000Z",
            updatedAt: "2015-06-06T00:02:07.000Z"
        },
        {
            id: 2,
            employeeNumber: '4910110067',
            name: 'นาย จิรศักดิ์ นพรัตน์',
            firstName: 'จิรศักดิ์',
            lastName: 'นพรัตน์',
            gender: 'M',
            picture: null,
            createdAt: "2015-06-06T00:02:07.000Z",
            updatedAt: "2015-06-06T00:02:07.000Z"
        },
        {
            id: 3,
            employeeNumber: '5710110123',
            name: 'นางสาว อารยา วิวัฒนานนท์',
            firstName: 'อารยา',
            lastName: 'วิวัฒนานนท์',
            gender: 'F',
            picture: null,
            createdAt: "2015-06-06T00:02:07.000Z",
            updatedAt: "2015-06-06T00:02:07.000Z"
        }
    ];

    var usersObj = {};

    angular.forEach(usersArr, function(value){
        usersObj[value.id] = {};
        usersObj[value.id].employeeNumber = value.employeeNumber;
        usersObj[value.id].name = value.name;
        usersObj[value.id].firstName = value.firstName;
        usersObj[value.id].lastName = value.lastName;
        usersObj[value.id].gender = value.gender;
        usersObj[value.id].picture = value.picture;
        usersObj[value.id].createdAt = value.createdAt;
        usersObj[value.id].updatedAt = value.updatedAt;
    });

    return function(data){
        if(data == 'object'){
            return usersObj;
        }
        else if (data == 'array'){
            return usersArr;
        }
    };

});