
let ip = '10.166.110.129';

export default class DeviceIpReader {
    constructor(deviceInfo = {}) {
        if (deviceInfo.ip)
            ip = deviceInfo.ip;
        else if (!deviceInfo.serialNumber)
            throw 'Device serial number required';

        this.serialNumber = deviceInfo.serialNumber;
    }
    getIP() {

        // fetch here
        return ip;
    }
}
