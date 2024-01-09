<template>
    <v-container>
        <v-row no-gutters class="chat-box">
            <v-col cols="12">
                <div class="message-box" ref="scrollContainer">
                    <v-list lines="ten" class="demo-message">
                        <v-list-item
                            v-for="(message, i) in messages"
                            :key="i"
                            :title="message.bot ? 'Bot' : 'Utente'"
                        >
                            <template v-slot:subtitle>
                                <div v-html="marked.parseMd(message.message)"></div>
                            </template>
                        </v-list-item>
                    </v-list>
                </div>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card class="message-box">
                    <v-container class="step-container">
                        <v-form @submit.prevent="sendMessageByFormDemo">
                            <v-row>
                                <v-col class="pa-2 ma-2" cols="13">
                                    <v-text-field v-model="userMessage" label="Message" />
                                </v-col>
                                <v-col class="pa-2 ma-2" cols="auto">
                                    <v-btn
                                        type="submit"
                                        density="comfortable"
                                        block
                                        style="background-color: #49246E; color: white"
                                        class="mt-2"
                                        icon="mdi-plus"
                                        :disabled="loading"
                                        :loading="loading"
                                    />
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import marked from '@/chat/marked';
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import session from '@/utils/session';
    import utils from '@/utils/utils';

    var botId = null;
    var threadId = false;
    const messages = ref([]);
    const route = useRoute();
    const router = useRouter();
    const loading = ref(false);
    const userMessage = ref('');
    const scrollContainer = ref(null);

    onMounted(async () => {
        loading.value = true;
        sendMessage(route.params.botId, threadId, 'Ciao');
    });

    const addMessageDemo = (message, bot = true) => {
        messages.value.push({
            bot: bot,
            message: message
        });
        requestAnimationFrame(() => {
            scrollToBottom(scrollContainer.value);
        });
        loading.value = false;
    };

    const sendMessageByFormDemo = async () => {
        if (userMessage.value) {
            addMessageDemo(userMessage.value, false);
            loading.value = true;
            sendMessage(botId, threadId, userMessage.value);
            userMessage.value = '';
        }
    };

    const sendMessage = (botId, message) => {
        var body = {
            message: message,
            bot_id: botId,
            session_token: session.token.value
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
                if (data.status == 'ok') {
                    if (!threadId) threadId = data.thread_id;
                    addMessageDemo(data.response);
                } else if (data.status == 'ko' && data.message == 'Sessione scaduta') {
                    alert(data.message);
                    router.push('/login');
                }
            })
            .catch(error => {
                console.error('Errore nella richiesta:', error);
            })

    };

    const scrollToBottom = (container) => {
        container.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    };
</script>

<style scoped>
    .chat-box {
        height: 60vh;
        overflow-y: auto;
    }
    .demo-message {
        background: none;
        color: white;
    }
</style>
