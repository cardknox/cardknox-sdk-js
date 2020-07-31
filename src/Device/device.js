
/**
 * @typedef Options
 */

/**
 * 
 */
export default class Device {
    
    /**
     * 
     * @param {Options} options 
     */
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