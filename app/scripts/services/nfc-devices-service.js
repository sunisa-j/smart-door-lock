'use strict';

window.app.factory('nfcDevices', function () {

    var nfcDevices = [
        {
            id: 'nfcDevices1',
            user: 1,
            alias: 'My phone',
            platform: 'android',
            uid: 'fc02b86ae1a5e63f',
            lastUsedAt: '2015-07-24T09:30:16.000Z',
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedAt: '2015-06-18T08:47:09.000Z'
        }
    ];

    // transform calendars to obj
    var nfcDevicesObj = {};
    angular.forEach(accessLogs, function(value){
        nfcDevicesObj[value.id] = {};
        nfcDevicesObj[value.id].user = value.user;
        nfcDevicesObj[value.id].alias = value.alias;
        nfcDevicesObj[value.id].platform = value.platform;
        nfcDevicesObj[value.id].uid = value.uid;
        nfcDevicesObj[value.id].lastUsedAt = value.lastUsedAt;
        nfcDevicesObj[value.id].createdAt = value.createdAt;
        nfcDevicesObj[value.id].updatedAt = value.updatedAt;
    });

    return function(data){

        if(data === 'object'){
            return nfcDevicesObj;
        }
        else if (data === 'array') {
            return nfcDevices;
        }
    };
});