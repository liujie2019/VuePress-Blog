const genSidebar = require('../../../utils/genSidebar');
const filenames = require('../../filenames.json');
const children = filenames.blog;

module.exports = [
    genSidebar('前端杂谈', children, false)
];