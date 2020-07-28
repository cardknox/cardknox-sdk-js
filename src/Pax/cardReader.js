
import { getTransactionCommand } from "./paxApi";
import { STX_ETX_LRC } from "../core/core";

export default class CardReader {
    constructor(ipDeviceCommunicator) {
        this.ipDeviceCommunicator = ipDeviceCommunicator;
    }

}