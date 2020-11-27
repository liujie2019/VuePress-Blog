const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.backend.docker;

module.exports = [
    genSidebar('Docker知识汇总', children, false)
];