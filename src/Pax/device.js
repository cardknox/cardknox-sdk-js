//Following logic in OOS3

import SignatureReader from "./signatureReader";
import DeviceIpReader from './DeviceIpReader';

/**
 * @typedef Device
 */
export default class Device {

    constructor(deviceInfo, options = {}) {
        this.ipReader = options.IpReader ? options.IpReader : new DeviceIpReader(deviceInfo);
        deviceInfo.ip = this.ipReader.getIP();

        this.signatureReader = options.signatureReader ? options.signatureReader : new SignatureReader(deviceInfo);
    }
}