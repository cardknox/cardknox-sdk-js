import Pax from "./Pax";
export { default as Bbpos } from "./Bbpos";

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
 */

export const process = Pax.process;
export const getSignature = Pax.getSignature;

export {
    Pax
}
