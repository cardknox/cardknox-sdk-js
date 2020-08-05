
import { getDateyyyyMMddHHmmss, FS, US, STX_ETX_LRC } from "../core/core";
import { ENUM_COMMAND_TYPE } from "../constants";
import { API_VERSION } from "./constants";

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

    const command = getCommand(request);
    const transactionType = getTransactionType(request);
    const amountInfo = getAmountInfo(request, transactionType);
    const accountInfo = getAccountInfo(request);
    const traceInfo = getTraceInfo(request);

    const payload = [
        command,
        API_VERSION,
        transactionType,
        amountInfo,
        accountInfo,
        traceInfo
    ];

    if (['T00', 'T06'].includes(command))
        payload.push(getAVSInformation(request) + FS + FS + FS + FS);
    else
        payload.push(FS + FS);

    const payloadString = payload.join(FS);
    return STX_ETX_LRC(payloadString);
}

function getCommand({ xCommand }, enablePin) {
    if (xCommand.toLowerCase().indexOf('cc') >= 0)
        if (enablePin)                  // add to validation?
            return 'T02';
        else
            return 'T00';
    if (xCommand.toLowerCase().indexOf('ebt') >= 0)
        return 'T04';
    if (xCommand.toLowerCase().indexOf('gift') >= 0)
        return 'T06';
    throw 'Unsupported command: ' + xCommand;
}

function getTransactionType({ xCommand }) {
    switch (xCommand) {
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
    throw 'Unsupported command: ' + xCommand;
}

function getAmountInfo({ xAmount, xTip, xTax }, command) {
    switch (command) {
        case '01':
        case '04':
        case '05':
            return [
                formatAmount(xAmount),
                '',                             // tip
                '',                             // cashback
                '',                             //fee
                formatAmount(xTax)
            ].join(US);
        case '03':
            return formatAmount(xAmount);
        case '02':
            return [formatAmount(xAmount), formatAmount(xTax)].join(US);
        case '06':
            return formatAmount(xAmount);
        case '10':
            return formatAmount(xAmount);
        case '16':
        case '18':
        case '19':
        case '20':
        case '21':
        case '23':
        case '24':
            return '';
        // case '38':               // TRANSACTION ADJUSTMENT
        default:
            return [formatAmount(xAmount), formatAmount(xTip), formatAmount(xTax)].join(US);
    }
}

function getAccountInfo({ xExp, xCommand, xAllowDuplicate, xBillFirstName, xBillLastName, xCity, xEmail }) {
    return [
        '',
        xExp,
        '',
        getEBTType(xCommand),
        '',
        xAllowDuplicate ? 1 : '',
        xBillFirstName,
        xBillLastName,
        '',                             //country code
        '',                             // state code
        xCity,
        xEmail
    ].join(US);
}

function getTraceInfo({ xInvoice, xRefnum, xZip, xStreet }) {
    return [
        xRefnum,
        xInvoice,
        '',
        xRefnum,
        getDateyyyyMMddHHmmss(new Date()),
        '',
        xZip,
        xStreet,
        US
    ].join(US);
}

function getEBTType(xCommand) {
    if (xCommand.toLowerCase().indexOf('ebt') < 0)
        return '';
    if (xCommand.toLowerCase().indexOf('ebtfs') >= 0)
        return 'F';
    else if (xCommand.toLowerCase().indexOf('ebtcb') >= 0)
        return 'C';
    else
        throw "Unsupported EBT Type: " + xCommand;
}

function getAVSInformation({ xZip, xStreet }) {
    return [
        xZip,
        xStreet
    ].join(US);
}

function formatAmount(amount) {
    return Math.round(amount * 100);
}

export class TransactionResponse {
    constructor(response) {
        response = response.substr(0, response.length - 2);
        const responseParts = response.split(FS);

        if (responseParts.length < 1) return;
        this.status = responseParts[0].trim();

        if (responseParts.length < 2) return;
        this.command = responseParts[1].trim();

        if (responseParts.length < 4) return;
        this.responseCode = responseParts[3].trim();

        if (responseParts.length < 5) return;
        this.responseMessage = responseParts[4].trim();

        if (responseParts.length < 6) return;
        this.hostInformation = new ResponseHostInformation(responseParts[5].trim());

        if (responseParts.length < 7) return;
        this.transactionType = responseParts[6].trim();

        if (responseParts.length < 8) return;
        this.amountInformation = new ResponseAmountInformation(responseParts[7].trim());

        if (responseParts.length < 9) return;
        this.accountInformation = new ResponseAccountInformation(responseParts[8].trim());

        if (responseParts.length < 10) return;
        this.traceInformation = new ResponseTraceInformation(responseParts[9].trim());

        if (responseParts.length < 11) return;
        this.avsInformation = new ResponseAVSInformation(responseParts[10].trim());

        if (responseParts.length < 14) return;
        this.additionalInformation = responseParts[13].trim();
    }
    hostInformation = {}
    amountInformation = {}
    accountInformation = {}
    traceInformation = {}
    avsInformation = {}
}

class ResponseHostInformation {
    constructor(response) {
        const responseParts = response.split(US);

        if (responseParts.length < 1) return;
        this.hostResponseCode = responseParts[0].trim();

        if (responseParts.length < 2) return;
        this.hostResponseMessage = responseParts[1].trim();

        if (responseParts.length < 3) return;
        this.authCode = responseParts[2].trim();

        if (responseParts.length < 4) return;
        this.hostReferenceNumber = responseParts[3].trim();

        if (responseParts.length < 5) return;
        this.traceNumber = responseParts[4].trim();

        if (responseParts.length < 6) return;
        this.batchNumber = responseParts[5].trim();

        if (responseParts.length < 7) return;
        this.transactionIdentifier = responseParts[6].trim();

        if (responseParts.length < 8) return;
        this.gatewayTransactionID = responseParts[7].trim();
    }
}

class ResponseAmountInformation {
    constructor(response) {
        const responseParts = response.split(US);

        if (responseParts.length < 1) return;
        this.approveAmount = responseParts[0].trim();

        if (responseParts.length < 2) return;
        this.amountDue = responseParts[1].trim();

        if (responseParts.length < 3) return;
        this.tipAmount = responseParts[2].trim();

        if (responseParts.length < 4) return;
        this.cashbackAmount = responseParts[3].trim();

        if (responseParts.length < 5) return;
        this.fee = responseParts[4].trim();

        if (responseParts.length < 6) return;
        this.taxAmount = responseParts[5].trim();

        if (responseParts.length < 7) return;
        this.balance1 = responseParts[6].trim();

        if (responseParts.length < 8) return;
        this.balance2 = responseParts[7].trim();

        if (responseParts.length < 9) return;
        this.serviceFee = responseParts[8].trim();
    }
}

class ResponseAccountInformation {
    constructor(response) {
        const responseParts = response.split(US);

        if (responseParts.length < 1) return;
        this.account = responseParts[0].trim();

        if (responseParts.length < 2) return;
        this.entryMode = responseParts[1].trim();

        if (responseParts.length < 3) return;
        this.expDate = responseParts[2].trim();

        if (responseParts.length < 8) return;
        this.cardHolder = responseParts[7].trim();
    }
}

class ResponseTraceInformation {
    constructor(response) {
        const responseParts = response.split(US);

        if (responseParts.length < 1) return;
        this.transactionNumber = responseParts[0].trim();

        if (responseParts.length < 2) return;
        this.referenceNumber = responseParts[1].trim();

        if (responseParts.length < 3) return;
        this.timeStamp = responseParts[2].trim();

        if (responseParts.length < 4) return;
        this.invoiceNumber = responseParts[3].trim();
    }
}

class ResponseAVSInformation {
    constructor(response) {
        const responseParts = response.split(US);

        if (responseParts.length < 1) return;
        this.approvalCode = responseParts[0].trim();

        if (responseParts.length < 2) return;
        this.message = responseParts[1].trim();

        if (responseParts.length < 3) return;
        this.zipCode = responseParts[2].trim();

        if (responseParts.length < 4) return;
        this.address1 = responseParts[3].trim();

        if (responseParts.length < 5) return;
        this.approvalCode = responseParts[4].trim();
    }
}

/**
 * 
 * @param {TransactionResponse} response 
 */
export function convertToResponse(request, response){
    return {
        xResult: 'A',
        xStatus: 'Approved',
        xAuthCode: response.hostInformation.authCode,
        xCommand: request.xCommand,
        xAuthAmount: response.amountInformation.approveAmount,
        xRefNum: response.hostInformation.hostReferenceNumber,
        xBatch: response.hostInformation.batchNumber,
        xAvsResult: response.avsInformation.message,
        xAvsResultCode: response.avsInformation.approvalCode,
        xMaskedCardNumber: response.accountInformation.account,
        xName: response.accountInformation.cardHolder,
        xRemainingBalance: response.amountInformation.balance1,
        xRemainingBalanceEBTCB: request.xCommand.startsWith('ebt')? response.amountInformation.balance1 : '',
        xRemainingBalanceEBTFS: request.xCommand.startsWith('ebt')? response.amountInformation.balance2 : '',
        xConvenienceFee: response.amountInformation.serviceFee,
        xCashbackAmount: response.amountInformation.cashbackAmount,
        xTip: response.amountInformation.tipAmount,
        xExp: response.accountInformation.expDate,
        xInvoice: response.traceInformation.invoiceNumber
        // TODO: determine xCardType: , xEntryMethod: ''
    };
}
