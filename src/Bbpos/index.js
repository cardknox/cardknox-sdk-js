import { IpDeviceCommunicator } from "../Device";
import { inProgressMessage, progressEnd, updateInProgress } from "../Device/inProgress";
import { default as CardReader } from "./cardReader";

export { CardReader };
export default class Bbpos {

  /**
   * 
   * @param {import('../index').TransactionCommandRequest} request 
   */
  static async process(request) {
    try {
      const cardReader = new CardReader(
        new IpDeviceCommunicator(request.settings.deviceIpAddress, request.settings.deviceIpPort, request.settings.deviceIpProtocol || location.protocol)
      );
      updateInProgress(request.settings.deviceIpAddress);
      const response = await cardReader.process(request);
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
   * @param {import('../index').DeviceSettings} request 
   * @returns {Promise<String>} base64-encoded PNG
   * @description returns the image *without* the data header
   */
  static getSignature = async (request) => {
    const response = await this.process(Object.assign({}, { settings: request }, { xCommand: 'Device_GetSignature' }));
    if (response.xError)
      return response;
    return response.xDeviceData;
  }

  /**
   * 
   * @param {import('../index').DeviceSettings} request 
   * @returns {Promise<String>} base64-encoded PNG
   * @description returns the image *without* the data header
   */
  static async cancel(request) {
    try {
      const device = new CardReader(
        new IpDeviceCommunicator(request.deviceIpAddress, request.deviceIpPort, request.deviceIpProtocol || location.protocol)
      );
      return await device.process({ xCancel: true });
    } catch (error) {
      return {
        xResult: "E",
        xStatus: "Error",
        xError: error.toString()
      }
    }
  }
}