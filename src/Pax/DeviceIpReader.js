
let ip = '';

export default class DeviceIpReader {
    constructor(settings = {}) {
        if (settings.deviceIpAddress)
            ip = settings.deviceIpAddress;
        else if (!settings.deviceSerialNumber)
            throw 'Device serial number required';

        this.serialNumber = settings.deviceSerialNumber;
    }
    getIP() {

        // fetch here
        return ip;
    }
}
