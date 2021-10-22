import { readAll, last } from "../core/core";

const LOCAL_DEVICE_TOOL_URL = 'http://localdevice.us-west-2.elasticbeanstalk.com/api/dnsrecord/save';

export default class IpDeviceCommunicator {
    constructor(ip, port, protocol) {
        this._ip = ip;
        this.port = port;
        if (last(protocol) !== ':')
            protocol += ':';
        this.protocol = protocol;
    }

    get ip() {
        if (!this.isHttps)
            return this._ip;
        return `ip-${this._ip.replaceAll('.', '-')}.mylocaldevice.com`;
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
            await this.tryRegisterIp();
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
