const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.backend.nginx;

module.exports = [
    genSidebar('Nginx', children, false)
];