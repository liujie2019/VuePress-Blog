const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.backend.mysql;

module.exports = [
    genSidebar('Mysql', children, false)
];