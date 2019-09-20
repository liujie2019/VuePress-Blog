/**
 * 主要实现:
 * 1. 文件目录结构 --> 导航栏结构  (每个顶级父目录为 nav 标题,  子目录为下拉列表)
 * 2. 文本文档 ---> 侧边栏导航结构  (每个最低级子目录对应一个页面, 对应一个sidebar)
 */

/**
 * 修改配置, 直接修改 config 对象即可
 * 1. 站点LOGO
 * 2. 服务器端口
 * 3. 主题配置: 侧边栏 , 导航条
 * 4. Other ...
 */

const fs = require('fs');
const path = require('path');
const navMap = require('./navMap');
const rootpath = path.dirname(__dirname);

const filehelper = {
    getAllFiles: function (rpath) {
        let filenames = [];
        fs.readdirSync(rpath).forEach(file => {
            fullpath = rpath + '/' + file;
            var fileinfo = fs.statSync(fullpath);
            if (fileinfo.isFile()) {
                if (file === 'README.md' || file === 'readme.md') {
                    file = '';
                } else {
                    file = file.replace('.md', '');
                }
                filenames.push(file);
            }
        });
        filenames.sort();
        return filenames;
    },
    getAllDirs: function getAllDirs(mypath = '.') {
        const items = fs.readdirSync(mypath);
        let result = [];
        // 遍历当前目录中所有文件夹
        items.map(item => {
            let temp = path.join(mypath, item);
            if (fs.statSync(temp).isDirectory() && !item.startsWith('.')) {
                let path = mypath + '/' + item + '/';
                result.push(path);
                result = result.concat(getAllDirs(temp));
            }
        });
        return result;
    },

};
// nav的链接路径
var navLinks = [];
var sidebar = {};
var nav = getNav();

function genSideBar() {
    var sidebars = {};
    var allDirs = filehelper.getAllDirs(rootpath);
    allDirs.forEach(item => {
        let dirFiles = filehelper.getAllFiles(item);
        let dirname = item.replace(rootpath, '');
        navLinks.push(dirname);
        if (dirFiles.length > 1) {
            sidebars[dirname] = dirFiles;
        }
    });
    sidebar = sidebars;
}

/**
 * 先生成所有nav文件链接;
 * @param filepaths
 * @returns {Array}
 */
function genNavLink(filepaths) {
    genSideBar();
    var navLinks = [];
    filepaths.forEach(p => {
        var ss = p.toString().split('/');
        var name = ss[ss.length - 2];
        var parent = p.replace(name + '/', '');
        navLinks.push({
            text: name,
            link: p,
            items: [],
            parent: parent
        });

    });
    return navLinks;
}

/**
 * 自定义排序文件夹
 * @param a
 * @param b
 * @returns {number}
 */
function sortDir(a, b) {
    let al = a.parent.toString().split('/').length;
    let bl = b.parent.toString().split('/').length;
    if (al > bl) {
        return -1;
    }
    if (al === bl) {
        return 0;
    }
    if (al < bl) {
        return 1;
    }
}
/**
 * 生成最终的 nav配置信息
 * @param navLinks
 * @returns {Array}
 */

function getNav() {
    let nnavs = genNavLink(navLinks);
    nnavs.sort(sortDir);
    var iniMap = {};
    var result = [];
    var delMap = {};
    nnavs.forEach(l => {
        iniMap[l.link] = l;
    });
    nnavs.forEach(l => {
        var parentLink = l.parent;
        if (parentLink !== '/') {
            iniMap[parentLink].items.push(l);
            delMap[l.link] = l;
        }
    });
    for (var k in iniMap) {
        if (delMap[k] != null) {
            delete iniMap[k];
            continue;
        }
        result.push(iniMap[k]);
    }
    result.forEach(item => {
        const text = item.text;
        item.text = navMap[text];
    });
    result.unshift({ text: '首页', link: '/' });
    return result;
}
console.log(nav);
console.log(sidebar);
module.exports = {
    nav,
    sidebar
};
