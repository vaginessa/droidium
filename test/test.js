/**
 * Created by vista on 2015. 12. 19..
 */
'use strict';

const co = require('co');
const fs = require('fs');

const script = require('./app');

co(function*() {
    yield script();

}).catch(function(err) {
    console.error(err.stack)
});