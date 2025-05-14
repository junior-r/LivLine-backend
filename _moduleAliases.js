/* eslint-disable @typescript-eslint/no-require-imports */
require('module-alias/register');
const path = require('path');

module.exports = {
    '@': path.join(__dirname, 'src') // Points to src in dev, build in prod
};