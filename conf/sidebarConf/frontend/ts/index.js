const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.typescript;

module.exports = [
    genSidebar('每天学点typescript', children, false)
];