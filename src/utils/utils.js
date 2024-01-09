import { ref, onMounted, onBeforeUnmount } from 'vue';

const isMobile = ref(false);

const checkMobile = () => {
    isMobile.value = window.innerWidth < 600;
};

const setupMobileUtils = () => {
    onMounted(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', checkMobile);
    });

  return { isMobile };
};

function postRequest(body) {
    return {
        hostname: 'https://526f682d-1859-45c1-9612-b5608defa5cf-00-ypuac8ssycx.janeway.replit.dev/', 
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }
    }
};

async function validateInputAsync(value, rules) {
    const errors = [];
    for (const rule of rules) {
        const result = await Promise.resolve(rule(value));
        if (result !== true)
            errors.push(result);
    }
    return errors.length === 0 ? null : errors;
}

function validateInput(value, rules) {
    const errors = [];
    for (const rule of rules) {
        const result = rule(value);
        if (result !== true)
            errors.push(result);
    }
    return errors.length === 0 ? null : errors;
}

async function tryBot(botId) {
    const post = postRequest({
        bot_id: botId
    });
    const response = await fetch(`${post.hostname}try-bot`, post.options);
    if (!response.ok)
        throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
    return await response.json();
}

export default {
    postRequest,
    validateInput,
    validateInputAsync,
    setupMobileUtils,
    tryBot
};
