const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.jsTopic;

module.exports = [
    genSidebar('JS专题', children, false)
];