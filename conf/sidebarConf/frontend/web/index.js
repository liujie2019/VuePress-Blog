const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.web;

module.exports = [
    genSidebar('浏览器相关', children, false)
];