import { SignatureReader as PaxSignatureReader, CardReader as PaxCardReader } from "./Pax";
import { Device, DeviceIpReader, IpDeviceCommunicator } from './Device'

/**
 * 
 * @param {TransactionRequest} request 
 */
export async function process(request) {
    try {
        const ipReader = new DeviceIpReader(request.settings);
        const device = new Device({
            cardReader: new PaxCardReader(
                new IpDeviceCommunicator(ipReader.getIP(), request.settings.deviceIpPort, request.settings.deviceIpProtocol || location.protocol)
            )
        });
        updateInProgress(request.settings.deviceIpAddress, device);
        return await device.process(request);
    } catch (error) {
        return {
            xResult: "E",
            xStatus: "Error",
            xError: error.toString()
        }
    } finally {
        inProgress[request.settings.deviceIpAddress] = undefined;
    }
}

/**
 * 
 * @param {SignatureRequest} request 
 * @returns {Promise<String>} base64-encoded PNG
 * @description returns the image *without* the data header
 */
export async function getSignature(request) {
    try {
        const ipReader = new DeviceIpReader(request);
        const device = new Device({
            signatureReader: new PaxSignatureReader(
                new IpDeviceCommunicator(ipReader.getIP(), request.deviceIpPort, request.deviceIpProtocol || location.protocol)
            )
        });
        updateInProgress(request.deviceIpAddress, device)
        return await device.getSignature();
    } catch (error) {
        return {
            xResult: "E",
            xStatus: "Error",
            xError: error.toString()
        }
    } finally {
        inProgress[request.deviceIpAddress] = undefined;
    }
}

export function cancel(request) {
    try {
        const ipReader = new DeviceIpReader(request);
        const device = new Device();
        device.cancel(new IpDeviceCommunicator(ipReader.getIP(), request.deviceIpPort, 'http'));
    } catch (error) {
        console.error(error)
        throw error;
    }
}

const inProgress = {};

function updateInProgress(ip, device) {
    if (inProgress[ip]) {
        throw 'Transaction in progress';
    } else {
        inProgress[ip] = device;
    }
}