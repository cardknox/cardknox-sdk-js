import { A09, RESPONSECODE_OK } from "./paxApi";


const DO_SIGNATURE_HASH = 'AkEyMBwxLjI4HDAcHBwyMDADSw==';
const GET_SIGNATURE_HASH = 'AkEwOBwxLjI4HDAcOTAwMDADSg==';

export default class SignatureReader {
    constructor(deviceInfo) {
        if (!deviceInfo.ip)
            throw 'Device IP address required';
        if (!deviceInfo.port)
            throw 'Device IP port required';

        this.deviceInfo = deviceInfo;
    }

    async getSignature() {
        const doSignatureResponse = await this.doSignature();
        //parse response

        const getSignatureResponse = await this._getSignature();

        const parsedResponse = new A09(getSignatureResponse);

        if (parsedResponse.responseCode !== RESPONSECODE_OK)
            throw parsedResponse.responseMessage;

        const signatureImage = this.paxPointsToPNG(parsedResponse.signature);

        return signatureImage;
    }

    async _getSignature() {     // prefixed as private to prevent usage as this is only part of the process
        const getSignatureResponse = await fetch(`http://${this.deviceInfo.ip}:${this.deviceInfo.port}?${GET_SIGNATURE_HASH}`);

        const getDeviceResponseReader = getSignatureResponse.body.getReader();
        let { value: chunk, done: readerDone } = await getDeviceResponseReader.read();

        //handle !readerDone

        chunk = chunk ? new TextDecoder('utf-8').decode(chunk) : '';

        console.log(chunk);
        return chunk;
    }

    async doSignature() {
        const doSignatureResponse = await fetch(`http://${this.deviceInfo.ip}:${this.deviceInfo.port}?${DO_SIGNATURE_HASH}`);

        const doGeviceResponseReader = doSignatureResponse.body.getReader();
        let { value: chunk, done: readerDone } = await doGeviceResponseReader.read();

        //handle !readerDone

        chunk = chunk ? new TextDecoder('utf-8').decode(chunk) : '';
        console.log(chunk);
        return chunk;
    }

    paxPointsToPNG(pointsString) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const points = pointsString.split('^');

        for (let i = 0; i < points.length; i++) {
            if (points[i].indexOf('~') > -1) {
                continue;
            } else if (points[i] === '0,65535') {
                const nextPoint = new Point(points[i + 1]);
                ctx.moveTo(nextPoint.x - 1, nextPoint.y - 1);
            } else {
                const point = new Point(points[i]);
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
        var image = canvas.toDataURL('image/png');
        return image.replace('data:image/png;base64,', '');         // to save to gateway, we need to strip the PNG header
    }
}

class Point {
    constructor(point) {
        if (point.indexOf(',') >= 0) {
            this.x = point.split(',')[0];
            this.y = point.split(',')[1];
        }
    }
    x = 0;              //to avoid undefind
    y = 0;
}