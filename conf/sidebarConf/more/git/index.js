const genSidebar = require('../../../../utils/genSidebar');
const filenames = require('../../../filenames.json');
const children = filenames.more.git;

module.exports = [
    genSidebar('Git', children, false)
];