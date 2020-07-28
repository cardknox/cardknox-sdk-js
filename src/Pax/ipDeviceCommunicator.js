
export default class IpDeviceCommunicator{
    constructor(ip, port, protocol) {
        this.ip = ip;
        this.port = port;
        this.protocol = protocol;
    }
    async getData(command) {
        return await fetch(`${this.protocol}://${this.ip}:${this.port}?${command}`);
    }
}