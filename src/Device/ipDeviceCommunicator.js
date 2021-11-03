import { readAll, last } from "../core/core";
import isIp from "is-ip";

const LOCAL_DEVICE_TOOL_URL = '/';      //TODO: Use correct endpoint when app is released

export default class IpDeviceCommunicator {
    constructor(ip, port, protocol) {
        this._ip = ip;
        this.port = port;
        if (last(protocol) !== ':')
            protocol += ':';
        this.protocol = protocol;
    }

    get ip() {
        if (this.isHttps && isIp.v4(this._ip))
            return `ip-${this._ip.replaceAll('.', '-')}.mylocaldevice.com`;
        return this._ip;
    }

    get isHttps() {
        return this.protocol === 'https:';
    }

    /**
     * 
     * @param {string} command 
     * @returns {Promise<string>}
     */
    getData = async (command) => {
        try {
            const response = await fetch(`${this.protocol}//${this.ip}:${this.port}?${command}`);
            if (!response.ok)
                throw response;

            const responseReader = response.body.getReader();

            let chunk = await readAll(responseReader, new Uint8Array());

            chunk = chunk ? new TextDecoder('utf-8').decode(chunk) : '';
            return chunk;
        } catch (error) {
            console.error(error);
            // await this.tryRegisterIp(); //TODO: Enable once LOCAL_DEVICE_TOOL_URL endpoint is available
            throw error;
        }
    }

    tryRegisterIp = async () => {
        try {
            if (!this.isHttps)
                return;
            await fetch(LOCAL_DEVICE_TOOL_URL, {
                body: `ip=${this._ip}`,
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        } catch (error) {
            console.error(error);
        }
        
    }
}
