import ls from '../../../i18n';

export const VIEW_MODE = {
    MAP: 'map',
    GRAPH: 'graph',
};

export const REGULARITIES = {
    HOUR: 'HOUR',
    DAY: 'DAY',
    WEEK: 'WEEK',
};

export const MACRO_RF_ID = 'macro';
export const DEFAULT_PATH_PARAMETERS = {
    regularity: REGULARITIES.HOUR,
    mode: VIEW_MODE.MAP,
    mapMrfId: '9',
    graphMrfId: '9',
    type: undefined,
};

export const FILTERS = [
    {
        id: 'service',
        title: 'Сервисы',
        editable: false,
        options: [
            {
                value: 'IPTV',
                label: ls('IPTV', 'IPTV/OTT'),
                enabled: true,
            // }, {
            //     value: 'INTERNET',
            //     label: ls('INTERNET', 'INTERNET'),
            // }, {
            //     value: 'VOIP',
            //     label: ls('VOIP', 'VoIP'),
            },
        ],
    }, {
        id: 'product',
        title: 'Продукт',
        editable: true,
        type: 'radio',
        options: [
            {
                value: 'ITV',
                label: ls('ITV', 'ИТВ'),
                enabled: true,
            }, {
                value: 'ITV2',
                label: ls('ITV2', 'ИТВ 2.0'),
            },
        ],
    }, {
        id: 'feature',
        title: 'Услуга',
        editable: true,
        options: [
            {
                value: 'LIVE',
                label: 'Live',
                enabled: true,
            }, {
                value: 'PVR',
                label: 'PVR',
            }, {
                value: 'VOD',
                label: 'VoD',
            },
        ],
    }, {
        id: 'technology',
        title: 'Технология',
        editable: true,
        options: [
            {
                value: 'FTTB',
                label: ls('FTTB', 'FTTB'),
            }, {
                value: 'GPON',
                label: ls('GPON', 'GPON'),
            }, {
                value: 'XDSL',
                label: ls('XDSL', 'XDSL'),
            },
        ],
    },
];
