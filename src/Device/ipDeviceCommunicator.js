import { readAll } from "../core/core";

export default class IpDeviceCommunicator {
    constructor(ip, port, protocol) {
        this.ip = ip;
        this.port = port;
        this.protocol = protocol;
    }

    /**
     * 
     * @param {string} command 
     * @returns {Promise<string>}
     */
    async getData(command) {
        try {
            const response = await fetch(`${this.protocol}://${this.ip}:${this.port}?${command}`);

            if (!response.ok)
                throw response;

            const responseReader = response.body.getReader();

            let chunk = await readAll(responseReader, new Uint8Array());

            chunk = chunk ? new TextDecoder('utf-8').decode(chunk) : '';
            return chunk;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
