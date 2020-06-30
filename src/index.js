
const GATEWAY_URL = 'https://x1.cardknox.com/gatewayjson';

const softwareName = "cardknox-sdk-js";

const utf8Decoder = new TextDecoder('utf-8');

async function process(request, settings) {

    // validation and error handling here
    try {

        console.log(request);

        const verifyRequestBody = {
            xKey: request.xKey,
            xVersion: '4.5.5',
            xSoftwareName: softwareName + ': ' + request.xSoftwareName,
            xSoftwareVersion: request.xSoftwareVersion,
            xCommand: request.xCommand,
            xAmount: request.xAmount,
            xDeviceType: settings.xDeviceType,
            xSerialNumber: settings.xSerialNumber
        };

        const verifyResponse = await fetch(GATEWAY_URL, {
            body: JSON.stringify(verifyRequestBody),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(r => r.json());

        console.log(verifyResponse);

        const deviceResponse = await fetch(verifyResponse.xVerifyURL);

        const deviceResponseReader = deviceResponse.body.getReader();
        let { value: chunk, done: readerDone } = await deviceResponseReader.read();

        //handle !readerDone

        chunk = chunk ? utf8Decoder.decode(chunk) : '';
        console.log(chunk);

        const encodedData = window.btoa(chunk);

        console.log(encodedData);

        const gatewayRequestBody = Object.assign({}, verifyRequestBody, { xDeviceResponse: encodedData });

        const gatewayResponse = await fetch(GATEWAY_URL, {
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
