const secretKeyConf = require('../conf/secretKeyConf');
module.exports = [
    [
        '@vuepress/last-updated',
        {
            transformer: (timestamp, lang) => {
                const moment = require('moment');
                moment.locale(lang);
                return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    ],
    ['@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新"
        }
    }],
    '@vuepress/back-to-top',
    ['@vuepress/google-analytics', {
        'ga': secretKeyConf.ga
    }]
];