import { ref, onMounted, onBeforeUnmount } from 'vue';

const isMobile = ref(false);
const hostname = 'https://9a34361f-5207-4d58-a782-e3689098fc7f-00-3oimqd2b5kvwi.worf.replit.dev/';

const checkMobile = () => {
    isMobile.value = window.innerWidth < 600;
};

const getScriptCode = (botId) => {
    return `<script type="module" src="/chat/chat.js?bot=${botId}"></script>`;
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

function postRequestFile(file, filename) {
    const formData = new FormData();
    formData.append('file', file, `${filename}.${file.name.split('.').pop()}`);
    return {
        hostname: hostname, 
        options: {
            method: 'POST',
            headers: {
                'Accept': '*/*',
            },
            body: formData
        }
    };
}

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

export default {
    postRequest,
    postRequestFile,
    validateInput,
    validateInputAsync,
    setupMobileUtils,
    getScriptCode
};
