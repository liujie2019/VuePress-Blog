const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.backend.koa;

module.exports = [
    genSidebar('Koa', children, false)
];