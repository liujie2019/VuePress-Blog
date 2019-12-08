const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.backend.http;

module.exports = [
    genSidebar('HTTP协议', children, false)
];