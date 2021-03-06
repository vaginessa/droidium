/**
 * RpcClient - To communicate with UIAutomator server injected in the device
 * Code written by therne in 2016. 4. 20.
 */
'use strict';

const request = require('co-request');
const debug = require('debug')('droidium:rpc-client');

class RpcClient {
    /**
     * @param port {port} Forwarded (local) server port
     */
    constructor(port) {
        this.url = `http://localhost:${port}/jsonrpc/0`;
    }

    /**
     * Send RPC call to the device.
     * @param method {String}
     * @param params {Array}
     * @returns {Object} result
     */
    *call(method, params) {
        let payload = {
            jsonrpc: '2.0',
            id: new Buffer(method + ' ' + Date.now()).toString('base64'),
            method,
            params
        };

        debug(`Request => ${JSON.stringify(payload, null, 2)}`);
        let response = yield request.post(this.url, { json: payload });
        let result = response.body;
        debug(`Response => ${JSON.stringify(result, null, 2)}`);

        if (result.error) {
            const errorName = result.error.data.exceptionTypeName;
            const errorMsg = result.error.message;
            throw Error(`RpcError: ${errorName}: ${errorMsg}`);
        }

        return result.result;
    }
}

module.exports = RpcClient;