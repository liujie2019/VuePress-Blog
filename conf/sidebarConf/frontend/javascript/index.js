const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.javascript;

module.exports = [
    genSidebar('JavaScript', children, false)
];