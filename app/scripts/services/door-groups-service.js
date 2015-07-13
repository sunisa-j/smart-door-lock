'use strict';

window.app.factory('doorGroups', function () {

    // Get doorGroups
    var doorGroups = [
        {
            id: 'group1',
            name: 'Classroom',
            description: 'COE Classroom',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        },
        {
            id: 'group2',
            name: 'Laboratory',
            description: 'COE Laboratory',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        }
    ];

    return doorGroups;
});