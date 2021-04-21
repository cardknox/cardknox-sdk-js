
import { getTransactionCommand, convertToResponse, TransactionResponse } from "./transactionApi";

export default class CardReader {
    constructor(ipDeviceCommunicator) {
        this.ipDeviceCommunicator = ipDeviceCommunicator;
    }

    async process(request) {
        try {
            this.validate(request);
            const command = getTransactionCommand(request);
            const deviceResponse = await this.ipDeviceCommunicator.getData(btoa(command));
            const parsedResponse = new TransactionResponse(deviceResponse);
            return convertToResponse(request, parsedResponse);
        } catch (error) {
            return {
                xResult: "E",
                xStatus: "Error",
                xError: error.toString()
            }
        }
    }

    validate(request) {
        //TODO: handle string '0'
        request.xInvoice = request.xInvoice || '';
        request.xStreet = request.xStreet || '';
        request.xZip = request.xZip || '';
        request.xTip = request.xTip || '';
        request.xTax = request.xTax || '';
        request.xExp = request.xExp || '';
        request.xAllowDuplicate = !!request.xAllowDuplicate;
        request.xBillFirstName = request.xBillFirstName || '';
        request.xBillLastName = request.xBillLastName || '';
        request.xCity = request.xCity || '';
        request.xEmail = request.xEmail || '';
        request.xRefnum = request.xRefnum || 0;
    }
}
