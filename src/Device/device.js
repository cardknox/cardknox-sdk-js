
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
        return this.signatureReader.getSignature();
    }

    async process(request) {
        return this.cardReader.process(request);
    }
}