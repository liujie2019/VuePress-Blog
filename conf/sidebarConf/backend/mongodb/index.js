const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.backend.mongodb;

module.exports = [
    genSidebar('MongoDB', children, false)
];