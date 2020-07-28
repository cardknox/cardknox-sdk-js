
import { ENUM_COMMAND_TYPE } from "../constants";
import { getDateyyyyMMddHHmmss, FS, US } from "../core/core";

export const RESPONSECODE_OK = '000000';
export const API_VERSION = '1.26';


export class A09_Response {
    constructor(response) {
        const responseParts = response.split(FS);

        if (responseParts.length < 1) return;
        this.status = responseParts[0].trim();

        if (responseParts.length < 4) return;
        this.responseCode = responseParts[3].trim();

        if (responseParts.length < 5) return;
        this.responseMessage = responseParts[4].trim();

        if (responseParts.length < 6) return;
        this.signatureLength = responseParts[5].trim();

        if (responseParts.length < 7) return;
        this.responseLength = responseParts[6].trim();

        if (responseParts.length < 8) return;
        this.signature = responseParts[7].trim();
    }
}

/**
 * 
 * @typedef TransactionCommandRequest
 * @property {string} xCommand
 * @property {number} xAmount
 * @property {number} xTip
 * @property {string} xInvoice
 * @property {bool} enablePin
 * @property {string} xZip
 * @property {string} xStreet
 */

/**
 * 
 * @param {TransactionCommandRequest} request 
 */
export function getTransactionCommand(request) {

    request.xInvoice = request.xInvoice || '';
    request.xStreet = request.xStreet || '';
    request.xZip = request.xZip || '';
    request.xTip = request.xTip || '';

    const EDCType = getEDCType(request.xCommand, request.enablePin);        // TODO: add enable pin setting
    const commandField = getCommand(request.xCommand);
    const invoiceField = getInvoice(request.xInvoice);

    const payload = [
        EDCType,
        API_VERSION,
        commandField,
        getAmount(request.xCommand, request.xAmount, request.xTip),
        getAccountInformation(request.xCommand),
        getTraceInformation(invoiceField, '', '0')
    ];

    if (['T00', 'T06'].includes(EDCType))
        payload.push(getAVSInformation(request) + FS + FS + FS + FS);
    else
        payload.push(FS + FS);
    return payload.join(FS);
}

function getEDCType(command, enablePin) {
    if (command.toLowerCase().indexOf('cc') >= 0)
        if (enablePin)                  // add to validation?
            return 'T02';
        else
            return 'T00';
    if (command.toLowerCase().indexOf('ebt') >= 0)
        return 'T04';
    if (command.toLowerCase().indexOf('gift') >= 0)
        return 'T06';
    throw 'Unsupported command: ' + command;
}

function getCommand(command) {
    switch (command) {
        case ENUM_COMMAND_TYPE.CC_SALE:
        case ENUM_COMMAND_TYPE.EBTFS_SALE:
        case ENUM_COMMAND_TYPE.EBTCB_SALE:
        case ENUM_COMMAND_TYPE.GIFT_REDEEM:
            return '01';        // sale/redeem
        case ENUM_COMMAND_TYPE.CC_CREDIT:
        case ENUM_COMMAND_TYPE.EBTFS_CREDIT:
            return '02';        // return
        case ENUM_COMMAND_TYPE.CC_AUTHONLY:
            return '03';        // auth
        case ENUM_COMMAND_TYPE.CC_CAPTURE:
            return '04';        // postauth
        case ENUM_COMMAND_TYPE.CC_POSTAUTH:
            return '05';        // forced
        case ENUM_COMMAND_TYPE.GIFT_ISSUE:
            return "10"; // issue
        case ENUM_COMMAND_TYPE.CC_VOID:
        case ENUM_COMMAND_TYPE.CC_VOIDRELEASE:
        case ENUM_COMMAND_TYPE.CC_VOIDREFUND:
            return "16"; // void
        case ENUM_COMMAND_TYPE.CC_BALANCE:
        case ENUM_COMMAND_TYPE.EBTFS_BALANCE:
        case ENUM_COMMAND_TYPE.EBTCB_BALANCE:
        case ENUM_COMMAND_TYPE.GIFT_BALANCE:
            return "23";
        default:
            break;
    }
    throw 'Unsupported command: ' + command;
}

function getEBTType(command) {
    if (command.toLowerCase().indexOf('ebt') < 0)
        return '';
    if (command.toLowerCase().indexOf('ebtfs') >= 0)
        return 'F';
    else if (command.toLowerCase().indexOf('ebtcb') >= 0)
        return 'C';
    else
        throw "Unsupported EBT Type: " + command;
}

function getInvoice(invoice) {       // , url; TODO: check merchant URL - only supports 8 chars
    if (!invoice)
        invoice = getDateyyyyMMddHHmmss(new Date());
    return invoice.length < 21 ? invoice : invoice.substr(invoice.length - 20);
}

function getAmount(command, amount, tip) {
    switch (getCommand(command)) {
        case '06', '16', '23', '24':
            return '';
        default:
            return amount.toString().replace('.', '') + US + tip.toString().replace('.', '') + US + US + US;
    }
}

function getAccountInformation(command) {
    return US + US + US + getEBTType(command);
}

function getTraceInformation(ECRInvoice, authCode, refnum) {
    return ECRInvoice + US + ECRInvoice + US + authCode + US + refnum + US + getDateyyyyMMddHHmmss(new Date())
}

function getAVSInformation(request) {
    return request.xZip + US + request.xStreet;
}
