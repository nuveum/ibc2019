module.exports = (app) => {
    const kqiResults = [
        {
            location: 'Нижегородский',
            last_mile_technology: 'FTTB',
            last_inch_technology: 'WIFI',
            manufacturer: 'Hawai',
            equipment_type: 'EquipmentType',
            abonent_group: 'Все',
            date_time: '2018-04-01T00:12:21.434',
            value: 99.95,
            weight: 0.1
        },
        {
            location: 'Нижегородский',
            last_mile_technology: 'FTTB',
            last_inch_technology: 'WIFI',
            manufacturer: 'Hawai',
            equipment_type: 'EquipmentType',
            abonent_group: 'Некоторые',
            date_time: '2018-04-01T00:12:21.434',
            value: 99.95,
            weight: 0.1
        }
    ];

    const history = [
        {
            location: 'Нижегородский',
            last_mile_technology: 'FTTB',
            last_inch_technology: 'WIFI',
            manufacturer: 'Hawai',
            equipment_type: 'EquipmentType',
            abonent_group: 'Некоторые',
            date_time: '2018-04-01T00:12:21.434',
            values: [
                {
                    date_time: '2018-04-01T00:12:30',
                    value: 25
                },
                {
                    date_time: '2018-04-01T00:12:40',
                    value: 47
                },
                {
                    date_time: '2018-04-01T00:12:50',
                    value: 68
                },
                {
                    date_time: '2018-04-01T00:13:00',
                    value: 41
                },
                {
                    date_time: '2018-04-01T00:13:10',
                    value: 79
                },
            ]
        }
    ];

    const kpi = [
        {
            id: 1,
            name: 'Кгс',
            kpi_parameter_type: '1',
            ['kpi-object_type']: 'STB',
            operator: 'EQ',
            level: '1.1',
            projection_count: 10,
        },
        {
            id: 2,
            name: 'Каб',
            kpi_parameter_type: '11',
            ['kpi-object_type']: 'ACC',
            operator: 'GT',
            level: '1.1',
            projection_count: 2,
        },
        {
            id: 3,
            name: 'Кспд',
            kpi_parameter_type: '10',
            ['kpi-object_type']: 'AGG',
            operator: 'LT',
            level: '1.1',
            projection_count: 5,
        },
    ];

    const projectionsByKqiId = {
        1: [{
            projection_id: 1,
            projection_name: 'МРФ_Волга',
            results: [
                {
                    id: 10,
                    creation_date: new Date(),
                    author: 'User 1',
                    status: 'SUCCESS'
                },
                {
                    id: 11,
                    creation_date: new Date(),
                    author: 'User 2',
                    status: 'FAILED'
                },
                {
                    id: 12,
                    creation_date: new Date(),
                    author: 'User 3',
                    status: 'RUNNING'
                }
            ]
        }],
        2: [{
            projection_id: 2,
            projection_name: 'МРФ_Волга',
            results: [
                {
                    id: 20,
                    creation_date: new Date(),
                    author: 'User 4',
                    status: 'FAILED'
                }
            ]
        }],
        3: [{
            projection_id: 3,
            projection_name: 'МРФ_Волга',
            results: []
        }, {
            projection_id: 4,
            projection_name: 'МРФ',
            results: [
                {
                    id: 40,
                    creation_date: new Date(),
                    author: 'User 5',
                    status: 'FAILED'
                }
            ]
        }]
    };

    const locations = [
        {
            id: 1,
            name: 'МРФ Волга',
        },
        {
            id: 2,
            name: 'МРФ Москва',
        },
    ];

    const manufacturers = [
        {
            id: 1,
            name: 'Vendor 1',
        },
        {
            id: 2,
            name: 'Vendor 2',
        },
    ];

    const equipments = [
        {
            id: 1,
            name: 'SuperSTB 300-x',
        },
        {
            id: 2,
            name: 'SuperSTB 200-x',
        },
    ];

    const usergroups = [
        {
            id: 1,
            name: 'Группа 1',
        },
        {
            id: 2,
            name: 'Группа 2',
        },
    ];

    const parameters = [
        {
            id: 1,
            name: 'loading',
        },
        {
            id: 2,
            name: 'bandwidth',
        },
    ];


    app.get('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', (req, res) => {
        res.send(kqiResults);
    });


    app.get('/api/v1/kqi/:configId', (req, res) => {
        res.send(kpi[0]);
    });

    app.post('/api/v1/kqi/:configId/projection/:projectionId/result/:resultId', (req, res) => {
        res.send(history);
    });

    app.get('/api/v1/kqi/:id/projection', (req, res) => {
        if (req.params.id) {
            const response = projectionsByKqiId[req.params.id] || null;
            res.send(response);
        } else {
            res.status = 401;
            res.end();
        }
    });

    app.get('/api/v1/common/location', (req, res) => {
        res.send(locations);
    });

    app.get('/api/v1/common/manufacture', (req, res) => {
        res.send(manufacturers);
    });

    app.get('/api/v1/common/equipment', (req, res) => {
        res.send(equipments);
    });

    app.get('/api/v1/common/parameters', (req, res) => {
        res.send(parameters);
    });

    app.get('/api/v1/common/usergroup', (req, res) => {
        res.send(usergroups);
    });

    app.post('/api/v1/kqi', (req, res) => {
        res.send(Object.assign(
            {},
            req.body,
            {
                id: Date.now()
            }
        ));
    });

    app.get('/api/v1/kqi', (req, res) => {
        res.send(kpi);
    });

};