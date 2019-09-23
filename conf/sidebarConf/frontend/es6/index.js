const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.es6;

module.exports = [
    genSidebar('ES6', children, false)
];