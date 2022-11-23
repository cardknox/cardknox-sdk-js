import Bbpos from "./Bbpos";
import Pax from "./Pax";
export { default as Bbpos } from "./Bbpos";
export const PaxDeviceName = 'pax';
export const BbposDeviceName = 'bbpos';

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
 * @property {DeviceSettings} settings
 */

/**
 * 
 * @typedef DeviceSettings
 * @property {string} deviceIpAddress
 * @property {string} deviceIpPort
 * @property {'http' | 'https'} deviceIpProtocol
 * @property {string} deviceName
 */

/**
 * 
 * @param {TransactionCommandRequest} request
 */
export const process = (request) => {
    if (!request || !request.settings) {
        throw new Error('request.settings is required')  
    }
    switch (request.settings.deviceName) {
        case BbposDeviceName:
            return Bbpos.process(request);
        default:
            return Pax.process(request);
    }
}
export const getSignature = Pax.getSignature;


export {
    Pax
}
