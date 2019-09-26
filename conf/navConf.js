module.exports = [
    { text: '首页', link: '/' },
    {
      text: '前端积累',
      items: [
        { text: 'HTML', link: '/frontend/html/'},
        { text: 'CSS', link: '/frontend/css/'},
        { text: 'JS基础', link: '/frontend/javascript/'},
        { text: 'JS专题', link: '/frontend/jsTopic/'},
        { text: 'ES6', link: '/frontend/es6/'},
        { text: 'Vue', link: '/frontend/vue/'},
        { text: 'Babel', link: '/frontend/babel/'},
        { text: 'Webpack', link: '/frontend/webpack/'},
        { text: 'Webpack4配置实战', link: '/frontend/webpack4/'}
      ]
    }, {
      text: '服务端积累',
      items: [
        { text: 'NodeJS', link: '/backend/nodejs/'},
        { text: 'Koa', link: '/backend/koa/'},
        { text: 'Mysql', link: '/backend/mysql/'},
        { text: 'MongoDB', link: '/backend/mongodb/'},
        { text: 'Nginx', link: '/backend/nginx/'},
      ]
    }, {
        text: '更多',
        items: [
          { text: 'Git', link: '/more/git/'},
          { text: 'Linux', link: '/more/linux/'}
        ]
    }, {text: '关于我', link: '/about/'}
];