
export { ENUM_COMMAND_TYPE } from './src/constants';

declare interface Settings {
    deviceIpAddress: string;
    deviceIpPort: string;
    deviceIpProtocol: string;
}

declare interface TransactionRequest {
    xVersion: string;
    xSoftwareName: string;
    xSoftwareVersion: string;
    xCommand: string;
    xAmount: number;
    xTip: number;
    xInvoice: string;
    xCustom02: string;
    xAllowDuplicate: boolean;
    settings: Settings;
}

export function process(request: TransactionRequest): Promise<any>;

export function getSignature(request: Settings): Promise<string>;