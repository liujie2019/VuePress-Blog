module.exports = {
    title: 'VuePress Blog',
    description: '博客描述',
    // theme: 'awesome',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    sidebarDepth: 2, // 将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: '前端积累', items: [
            { text: 'HTML', link: '/html/' },
            { text: 'CSS', link: '/css/' },
            { text: 'JavaScript', link: '/javascript/' }
          ]},
          { text: '前端工程化', items: [
            { text: 'Webpack', link: '/webpack/' },
            { text: 'Babel', link: '/babel/' },
          ]},
          { text: 'Guide', link: '/guide/' },
          {
            text: 'Languages',
            items: [
              { text: 'Chinese', link: '/language/chinese' },
              { text: 'Japanese', link: '/language/japanese' }
            ]
          },
          { text: 'External', link: 'https://google.com' }
        ],
        sidebar: [
            {
              title: '前端积累',
              collapsable: false,
              children: [
                '/html/',
                '/css/',
                '/javascript/'
              ]
            },
            {
              title: '前端工程化',
              collapsable: false,
              children: [
                '/webpack/',
                '/babel/'
              ]
            }
        ],
        // sidebarDepth: 2,
        searchMaxSuggestions: 10,
        lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
        // 假定 GitHub。也可以是一个完整的 GitLab URL。
        repo: 'vuejs/vuepress',
        // 自定义项目仓库链接文字
        // 默认根据 `themeConfig.repo` 中的 URL 来自动匹配是 "GitHub"/"GitLab"/"Bitbucket" 中的哪个，如果不设置时是 "Source"。
        repoLabel: '贡献代码！',

        // 以下为可选的 "Edit this page" 链接选项

        // 如果你的文档和项目位于不同仓库：
        docsRepo: 'vuejs/vuepress',
        // 如果你的文档不在仓库的根目录下：
        docsDir: 'docs',
        // 如果你的文档在某个特定的分支（默认是 'master' 分支）：
        docsBranch: 'master',
        // 默认为 false，设置为 true 来启用
        editLinks: true,
        // 自定义编辑链接的文本。默认是 "Edit this page"
        editLinkText: '帮助我们改进页面内容！'
    }
}