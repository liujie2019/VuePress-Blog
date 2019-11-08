const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.react;

module.exports = [
    genSidebar('React全家桶', children, false)
];