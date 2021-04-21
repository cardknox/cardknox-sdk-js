
import { FS } from "../core/core";

export class A09Response {
    constructor(response) {
        response = response.substr(0, response.length - 2);
        const responseParts = response.split(FS);

        if (responseParts.length < 1) return;
        this.status = responseParts[0].trim();

        if (responseParts.length < 4) return;
        this.responseCode = responseParts[3].trim();

        if (responseParts.length < 5) return;
        this.responseMessage = responseParts[4].trim();

        if (responseParts.length < 6) return;
        this.signatureLength = responseParts[5].trim();

        if (responseParts.length < 7) return;
        this.responseLength = responseParts[6].trim();

        if (responseParts.length < 8) return;
        this.signature = responseParts[7].trim();
    }
}

export class A21Response {
    constructor(response) {
        response = response.substr(0, response.length - 2);
        const responseParts = response.split(FS);

        if (responseParts.length < 1) return;
        this.status = responseParts[0].trim();

        if (responseParts.length < 4) return;
        this.responseCode = responseParts[3].trim();

        if (responseParts.length < 5) return;
        this.responseMessage = responseParts[4].trim();
    }
}
