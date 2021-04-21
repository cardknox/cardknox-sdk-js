
let ip = '';

export default class DeviceIpReader {
    /**
     * 
     * @param {Settings} settings 
     */
    constructor(settings = {}) {
        if (settings.deviceIpAddress)
            ip = settings.deviceIpAddress;
        else if (!settings.deviceSerialNumber)
            throw new Error('Device serial number required');

        this.serialNumber = settings.deviceSerialNumber;
    }
    getIP() {

        // fetch here
        return ip;
    }
}
