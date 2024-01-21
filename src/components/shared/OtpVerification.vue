<template>
    <v-card elevation="20" class="form-container">
        <v-card-title style="white-space: normal;">Verifica la tua mail</v-card-title>
        <v-form @submit.prevent="verifyOtp">
            <v-card-text>
                <div style="text-align: center;">
                    Abbiamo inviato una mail all'indirizzo {{ email }} con un codice OTP a 6 cifre.
                </div>
                <v-otp-input v-model="otp" type="password" />
                <div v-if="error != ''" class="error-message">{{ error }}</div>
            </v-card-text>
            <v-card-actions>
                <v-btn class="mt-2 gradient" type="submit" variant="tonal">Verifica</v-btn>
                <v-spacer></v-spacer>
                <div class="text-caption" v-if="flagOtpAgain">
                    Non hai ricevuto nessun codice? <a href="#" @click.prevent="sendOtpAgain">Invia di nuovo</a>
                </div>
                <div class="text-caption" v-else>
                    Non hai ricevuto nessun codice? Richiedi tra {{ timerOtpAgain }}
                </div>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup>
    import utils from '@/utils/utils';
    import session from '@/utils/session';
    import { useRouter } from 'vue-router';
    import { ref, onBeforeUnmount, onMounted } from 'vue';

    const otp = ref('');
    const error = ref('');
    const router = useRouter();
    const timerOtpAgain = ref(60);
    const emit = defineEmits(['updateStatus']);
    const flagOtpAgain = ref(false);
    const { email, botId, home } = defineProps(['email', 'botId', 'home']);

    onMounted(async () => {  
        const timerOptInterval = setInterval(() => {
            if (!flagOtpAgain.value) {
                timerOtpAgain.value -= 1;
                if (timerOtpAgain.value == 0) {
                    flagOtpAgain.value = true;
                }
            }
        }, 1000);

        onBeforeUnmount(() => {
            clearInterval(timerOptInterval);
        });
    });

    const verifyOtp = () => {
            if (otp.value) {
            error.value = '';
            const post = utils.postRequest({
                otp: otp.value,
                bot_id: botId
            });

            fetch(`${post.hostname}otp`, post.options)
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    if (data.status == 'ok') {
                        if (!home)
                            emit('updateStatus', 'Not Ready');
                        else {
                            session.setCookie('session_token', data.session_token);
                            router.push(`/dashboard/${botId}`);
                        }
                    } else
                        error.value = data.error;
                })
                .catch(error => {
                    console.error('Errore nella richiesta:', error);
                });
        }
    };

    const sendOtpAgain = () => {
        flagOtpAgain.value = false;
        timerOtpAgain.value = 60;
        error.value = '';
        const post = utils.postRequest({
            bot_id: botId
        });

        fetch(`${post.hostname}send-otp-again`, post.options)
            .then(response => {
                if (!response.ok)
                    throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                return response.json();
            })
            .catch(error => {
                console.error('Errore nella richiesta:', error);
            });
    };
</script>
