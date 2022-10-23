import { SignatureReader as PaxSignatureReader, CardReader as PaxCardReader } from "./Pax";
import { Device, DeviceIpReader, IpDeviceCommunicator } from './Device'

/**
 * 
 * @typedef TransactionCommandRequest
 * @property {string} xCommand
 * @property {number} xAmount
 * @property {number} xTip
 * @property {string} xInvoice
 * @property {string} xZip
 * @property {string} xStreet
 * @property {string} xCustom02
 */

/**
 * 
 * @param {TransactionCommandRequest} request 
 */
export async function process(request) {
    try {
        const ipReader = new DeviceIpReader(request.settings);
        const device = new Device({
            cardReader: new PaxCardReader(
                new IpDeviceCommunicator(ipReader.getIP(), request.settings.deviceIpPort, request.settings.deviceIpProtocol || location.protocol)
            )
        });
        updateInProgress(request.settings.deviceIpAddress);
        const response = await device.process(request);
        progressEnd(request.settings.deviceIpAddress);
        return response;
    } catch (error) {
        if (error.message !== inProgressMessage)
            progressEnd(request.deviceIpAddress);
        return {
            xResult: "E",
            xStatus: "Error",
            xError: error.toString()
        }
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
        updateInProgress(request.deviceIpAddress);
        const response = await device.getSignature();
        progressEnd(request.deviceIpAddress);
        return response;
    } catch (error) {
        if (error.message !== inProgressMessage)
            progressEnd(request.deviceIpAddress);
        return {
            xResult: "E",
            xStatus: "Error",
            xError: error.toString()
        }
    }
}

const inProgress = {};
const inProgressMessage = 'Transaction in progress';
function updateInProgress(ip) {
    if (inProgress[ip]) {
        throw new Error(inProgressMessage);
    } else {
        inProgress[ip] = true;
    }
}

function progressEnd(ip) {
    inProgress[ip] = false;
}
