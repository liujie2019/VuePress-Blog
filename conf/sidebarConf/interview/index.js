const genSidebar = require('../../../utils/genSidebar');
const filenames = require('../../filenames.json');
const children = filenames.interview;

module.exports = [
    genSidebar('每日一题', children, false)
];