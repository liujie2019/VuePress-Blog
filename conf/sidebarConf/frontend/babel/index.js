const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.babel;

module.exports = [
    genSidebar('Babel', children, false)
];