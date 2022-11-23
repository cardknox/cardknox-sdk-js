
export default class CardReader {
    constructor(ipDeviceCommunicator) {
        this.ipDeviceCommunicator = ipDeviceCommunicator;
    }

    /**
     * 
     * @param {import('../index').TransactionCommandRequest} request 
     */
    async process(request) {
        try {
            request = this.validate(request);
            const requestString = Object.keys(request).map(key => key + '=' + encodeURIComponent(request[key])).join('&');
            const responseString = await this.ipDeviceCommunicator.postData(requestString, 'POST');
            return JSON.parse(responseString);
        } catch (error) {
            return {
                xResult: "E",
                xStatus: "Error",
                xError: error.toString()
            }
        }
    }

    /**
     * 
     * @param {import('../index').TransactionCommandRequest} request 
     */
    validate(request) {
        const newRequest = Object.assign({}, request);
        delete newRequest.settings;
        return newRequest;
    }
}
