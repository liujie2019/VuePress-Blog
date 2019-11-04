const genSidebar = require('../../../utils/genSidebar');
const filenames = require('../../filenames.json');
const children = filenames.algorithm;

module.exports = [
    genSidebar('数据结构与算法', children, false)
];