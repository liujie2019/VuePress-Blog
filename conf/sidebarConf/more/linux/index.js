const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.more.linux;

module.exports = [
    genSidebar('Linux', children, false)
];