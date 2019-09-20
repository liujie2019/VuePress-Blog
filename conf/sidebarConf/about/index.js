const genSidebar = require('../../../utils/genSidebar');
const filenames = require('../../filenames.json');
const children = filenames.about;

module.exports = [
    genSidebar('关于我', children, false)
];