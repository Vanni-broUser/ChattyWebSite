<template>
    <v-container class="login-container">
        <v-sheet width="400" class="mx-auto login-box" elevation="20">
            <div v-if="changeFlag">
                <div class="d-flex align-center justify-space-around">
                    <v-avatar image="@/assets/logo/logo.png" size="120"></v-avatar>
                </div>
                <h3>Effettua il login</h3><br>
                <v-form @submit.prevent="login">
                    <v-text-field v-model="mail" label="Email" />
                    <v-text-field v-model="pass" label="Password" type="password" />
                    <v-btn type="submit" block class="mt-2 gradient" variant="tonal">Accedi</v-btn>
                </v-form>
                <br><div class="error-message">{{ errorLogin }}</div>
                <br><div class="text-caption">
                    Non ricordi la password? <a href="#" @click.prevent="changeFlag=false">Clicca qui</a>
                </div>
            </div>
            <div v-else>
                <h3>Recupera la tua password</h3><br>
                <v-form @submit.prevent="askChangePassword">
                    <v-text-field v-model="mail" label="Email" />
                    <v-btn type="submit" block class="mt-2 gradient" variant="tonal">Invia</v-btn>
                </v-form>
                <br><div class="error-message">{{ errorChange }}</div>
                <div class="text-caption">
                    {{ messageChange }}<br>
                    <a href="#" @click.prevent="changeFlag=true">Torna indietro</a>
                </div>
            </div>
        </v-sheet>
    </v-container>
</template>

<script setup>
    import { ref } from 'vue';
    import utils from '@/utils/utils';
    import { SHA256 } from 'crypto-js';
    import session from '@/utils/session';
    import { useRouter } from 'vue-router';

    const mail = ref('');
    const pass = ref('');
    const router = useRouter();
    const errorLogin = ref('');
    const errorChange = ref('');
    const changeFlag = ref(true);
    const messageChange = ref('');

    const login = () => {
        if (mail.value && pass.value) {
            errorLogin.value = '';
            const post = utils.postRequest({
                email: mail.value,
                password: SHA256(pass.value).toString()
            });

            fetch(`${post.hostname}login`, post.options)
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    if (data.status == 'ok') {
                        session.setCookie('session_token', data.session_token);
                        router.push(`/dashboard/${data.bot_id}`);
                    } else
                        errorLogin.value = data.error;
                })
                .catch(error => {
                    console.error('Errore nella richiesta:', error);
                });
        }
    };

    const askChangePassword = () => {
        if (mail.value && pass.value) {
            errorChange.value = '';
            messageChange.value = '';
            const post = utils.postRequest({
                email: mail.value
            });

            fetch(`${post.hostname}ask-change-password`, post.options)
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    if (data.status == 'ok')
                        messageChange.value = data.message;
                    else
                        errorChange.value = data.error;
                })
                .catch(error => {
                    console.error('Errore nella richiesta:', error);
                });
        }
    };
</script>
