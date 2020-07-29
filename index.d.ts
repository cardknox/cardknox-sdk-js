
export { ENUM_COMMAND_TYPE } from './src/constants';

declare interface Settings {
    deviceName: string;
    deviceIpAddress: string;
    deviceIpPort: string;
    deviceSerialNumber: string;
}

declare interface TransactionRequest {
    xKey: string;
    xVersion: string;
    xSoftwareName: string;
    xSoftwareVersion: string;
    xCommand: string;
    xAmount: number;
    xInvoice: string;
    settings: Settings;
}

export function process(request: TransactionRequest): Promise<any>;

export function getSignature(request: Settings): Promise<string>;