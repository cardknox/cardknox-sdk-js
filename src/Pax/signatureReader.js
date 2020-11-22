import { A09_Response, A21_Response } from "./signatureApi";
import { RESPONSECODE_OK } from "./constants";


const DO_SIGNATURE_HASH = 'AkEyMBwxLjI4HDAcHBwyMDADSw==';
const GET_SIGNATURE_HASH = 'AkEwOBwxLjI4HDAcOTAwMDADSg==';


export default class SignatureReader {
    constructor(ipDeviceCommunicator) {
        this.ipDeviceCommunicator = ipDeviceCommunicator;
    }

    async getSignature() {
        try {
            const doSignatureResponse = new A21_Response(await this.doSignature());
            if (doSignatureResponse.responseCode !== RESPONSECODE_OK)
                throw doSignatureResponse.responseMessage;

            const parsedResponse = new A09_Response(await this._getSignature());
            if (parsedResponse.responseCode !== RESPONSECODE_OK)
                throw parsedResponse.responseMessage;

            const signatureImage = this.paxPointsToPNG(parsedResponse.signature);

            return signatureImage;
        } catch (error) {
            return {
                xResult: "E",
                xStatus: "Error",
                xError: error.toString()
            }
        }
    }

    async _getSignature() {     // prefixed as private to prevent usage as this is only part of the process
        return await this.ipDeviceCommunicator.getData(GET_SIGNATURE_HASH);
    }

    async doSignature() {
        return await this.ipDeviceCommunicator.getData(DO_SIGNATURE_HASH);
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
    x = 0;              // to avoid undefind
    y = 0;
}