module.exports = [
    { text: '首页', link: '/' },
    {
      text: '前端积累',
      items: [
        { text: 'HTML', link: '/frontend/html/'},
        { text: 'CSS', link: '/frontend/css/'},
        { text: '重学JS基础', link: '/frontend/javascript/'},
        { text: 'JS专题', link: '/frontend/jsTopic/'},
        { text: 'ES6', link: '/frontend/es6/'},
        { text: 'React全家桶', link: '/frontend/react/'},
        { text: 'Vue全家桶', link: '/frontend/vue/'},
        { text: 'Babel', link: '/frontend/babel/'},
        { text: 'Webpack', link: '/frontend/webpack/'},
        { text: 'Webpack4配置实战', link: '/frontend/webpack4/'},
        { text: '每天学点typescript', link: '/frontend/typescript/'},
        { text: '浏览器相关', link: '/frontend/web/'}
      ]
    }, {
      text: '服务端积累',
      items: [
        { text: 'Docker', link: '/backend/docker/'},
        { text: 'NodeJS', link: '/backend/nodejs/'},
        { text: 'Koa', link: '/backend/koa/'},
        { text: 'Mysql', link: '/backend/mysql/'},
        { text: 'MongoDB', link: '/backend/mongodb/'},
        { text: 'Nginx', link: '/backend/nginx/'},
        { text: 'HTTP协议', link: '/backend/http/'},
      ]
    }, {
        text: '前端杂谈',
        link: '/blog/'
    }, {
        text: '每日一题',
        link: '/interview/'
    }, {
        text: '数据结构与算法',
        link: '/algorithm/'
    }, {
        text: '更多',
        items: [
          { text: 'Git', link: '/more/git/'},
          { text: 'Linux', link: '/more/linux/'}
        ]
    }, {text: '关于我', link: '/about/'}
];