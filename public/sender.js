import utils from '@/utils/utils';

const sendMessage = (botId, threadId, message, func) => {
    var body = {
        message: message,
        bot_id: botId
    };
    if (threadId) body.thread_id = threadId;
    const post = utils.postRequest(body);

    fetch(`${post.hostname}chat`, post.options)
        .then(response => {
                if (!response.ok) {
                    throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!threadId) threadId = data.thread_id;
                func(data.response);
            })
            .catch(error => {
                console.error('Errore nella richiesta:', error);
            });
};

const scrollToBottom = (container) => {
    container.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
    });
};

export default {
    sendMessage,
    scrollToBottom
};
