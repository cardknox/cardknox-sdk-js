//Following logic in OOS3


/**
 * @typedef Device
 */
export default class Device {
    constructor(options = {}) {
        this.signatureReader = options.signatureReader;
        this.cardReader = options.cardReader;
    }

    async getSignature() {
        return await this.signatureReader.getSignature();
    }

    async process(request) {
        return await this.cardReader.process(request);
    }
}