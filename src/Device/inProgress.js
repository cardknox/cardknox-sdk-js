

const inProgress = {};
export const inProgressMessage = 'Transaction in progress';
export function updateInProgress(ip) {
    if (inProgress[ip]) {
        throw new Error(inProgressMessage);
    } else {
        inProgress[ip] = true;
    }
}

export function progressEnd(ip) {
    inProgress[ip] = false;
}