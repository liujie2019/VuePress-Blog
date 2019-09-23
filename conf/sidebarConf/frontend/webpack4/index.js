const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.webpack4;

module.exports = [
    genSidebar('Webpack4实战', children, false)
];