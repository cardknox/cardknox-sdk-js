
import requestSchema from './validateSchema';
import { GATEWAY_URL as GatewayURL, SDK_NAME, SDK_VERSION } from './constants';

const utf8Decoder = new TextDecoder('utf-8');

export async function processAsync(request) {

    try {
        console.log(request);

        // validation and error handling here
        const errors = requestSchema.validate(request);

        if (errors.length > 0)
            throw errors[0].message;

        const verifyRequestBody = {
            xKey: request.xKey,
            xVersion: '4.5.8',
            xSoftwareName: request.xSoftwareName,
            xSoftwareVersion: request.xSoftwareVersion,
            xCommand: request.xCommand,
            xAmount: request.xAmount,
            xDeviceType: request.xDeviceType,
            xSerialNumber: request.xSerialNumber,
            xSDKName: SDK_NAME,
            xSDKVersion: SDK_VERSION
        };

        const verifyResponse = await fetch(GatewayURL, {
            body: JSON.stringify(verifyRequestBody),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(r => r.json());

        console.log(verifyResponse);

        if (!verifyResponse.xVerifyURL)
            return verifyResponse;

        const deviceResponse = await fetch(verifyResponse.xVerifyURL);

        const deviceResponseReader = deviceResponse.body.getReader();
        let { value: chunk, done: readerDone } = await deviceResponseReader.read();

        //handle !readerDone

        chunk = chunk ? utf8Decoder.decode(chunk) : '';
        console.log(chunk);

        const encodedData = window.btoa(chunk);

        console.log(encodedData);

        const gatewayRequestBody = Object.assign({}, verifyRequestBody, { xDeviceResponse: encodedData });

        const gatewayResponse = await fetch(GatewayURL, {
            body: JSON.stringify(gatewayRequestBody),
            method: 'POST'
        }).then(r => r.json());

        console.log(gatewayResponse);

        return gatewayResponse;

    } catch (error) {
        return {
            xResult: "E",
            xStatus: "Error",
            xError: error.toString()
        }
    }
}
