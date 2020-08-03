import { SignatureReader } from "./Pax";
import { Device, DeviceIpReader, IpDeviceCommunicator } from './Device'

/**
 * 
 * @param {SignatureRequest} request 
 * @returns {Promise<String>} base64-encoded PNG
 * @description returns the image *without* the data header
 */
export async function getSignature(request) {
    const ipReader = new DeviceIpReader(request);
    const device = new Device({
        signatureReader: new SignatureReader(
            new IpDeviceCommunicator(ipReader.getIP(), request.deviceIpPort, 'http')
        )
    });
    return await device.getSignature();
}

