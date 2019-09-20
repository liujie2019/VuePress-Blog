const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.backend.nodejs;

module.exports = [
    genSidebar('NodeJS', children, false)
];