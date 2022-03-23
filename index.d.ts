
export { ENUM_COMMAND_TYPE } from './src/constants';

declare interface Settings {
    // deviceName: string;
    deviceIpAddress: string;
    deviceIpPort: string;
    // deviceSerialNumber: string;
    deviceIpProtocol: string;
}

declare interface TransactionRequest {
    xVersion: string;
    xSoftwareName: string;
    xSoftwareVersion: string;
    xCommand: string;
    xAmount: number;
    xInvoice: string;
    xCustom02: string;
    xAllowDuplicate: boolean;
    settings: Settings;
}

export function process(request: TransactionRequest): Promise<any>;

export function getSignature(request: Settings): Promise<string>;