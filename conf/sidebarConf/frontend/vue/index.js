const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.frontend.vue;

module.exports = [
    genSidebar('Vue', children, false)
];