
const hostname = 'https://526f682d-1859-45c1-9612-b5608defa5cf-00-ypuac8ssycx.janeway.replit.dev/';

function postRequest(body) {
    return {
        hostname: hostname, 
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
    }
};

export default {
    postRequest
};
