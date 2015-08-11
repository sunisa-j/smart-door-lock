'use strict';

window.app.factory('mifare', function () {

    var mifare = [
        {
            id: 'mifare1',
            user: 1,
            uid: '28C74ECF',
            disable: false,
            deactivated: false,
            lastUsedAt: '2015-07-24T09:30:16.000Z',
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedAt: '2015-06-18T08:47:09.000Z'
        },
        {
            id: 'mifare2',
            user: 1,
            uid: '28BA46A9',
            disabled: true,
            deactivated: true,
            lastUsedAt: '2015-05-08T10:39:21.000Z',
            createdAt: '2015-01-18T08:47:09.000Z',
            updatedAt: '2015-06-13T11:25:44.000Z'
        }
    ];

    // transform calendars to obj
    var mifareObj = {};
    angular.forEach(mifare, function(value){
        mifareObj[value.id] = {};
        mifareObj[value.id].user = value.user;
        mifareObj[value.id].uid = value.uid;
        mifareObj[value.id].disabled = value.disabled;
        mifareObj[value.id].deactivated = value.deactivated;
        mifareObj[value.id].lastUsedAt = value.lastUsedAt;
        mifareObj[value.id].createdAt = value.createdAt;
        mifareObj[value.id].updatedAt = value.updatedAt;
    });

    return function(data){

        if(data === 'object'){
            return mifareObj;
        }
        else if (data === 'array') {
            return mifare;
        }
    };
});