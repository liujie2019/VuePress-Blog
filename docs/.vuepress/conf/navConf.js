const sidebar = require('./sidebarConf');
module.exports = [
    { text: '首页', link: '/' },
    {
      text: '前端积累',
      items: [
        { text: 'HTML', link: '/frontend/' + sidebar['/frontend/'][0]['children'][0] },
        { text: 'CSS', link: '/frontend/' + sidebar['/frontend/'][1]['children'][0] },
        { text: 'JS', link: '/frontend/' + sidebar['/frontend/'][2]['children'][0] },
        { text: 'Babel', link: '/frontend/' + sidebar['/frontend/'][3]['children'][0] },
        { text: 'Webpack', link: '/frontend/' + sidebar['/frontend/'][4]['children'][0] }
      ]
    }, {
      text: '服务端积累',
      items: [
        { text: 'NodeJS', link: '/backend/' + sidebar['/backend/'][0]['children'][0] },
        { text: 'Koa', link: '/backend/' + sidebar['/backend/'][1]['children'][0] },
      ]
    }, {
      text: '数据库',
      items: [
        { text: 'database', link: '/database/' + sidebar['/database/'][0]['children'][0] }
      ]
    }
];