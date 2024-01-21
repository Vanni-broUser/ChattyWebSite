<template>
    <v-container class="login-container" v-if="status == 'Not Ready'">
        <BotSetup />
    </v-container>
    <v-container class="login-container" v-if="status == 'Not Verified'">
        <OtpVerification :email="mail" :botId="botId" :home="false" @updateStatus="updateStatus" />
    </v-container>
    <v-container v-if="status == 'Ready'">
        <Demo v-if="startDemo" />
        <v-container v-else  class="message-box">
            <h1>Clicca qui per avviare una demo</h1><br>
            <v-btn variant="outlined" type="submit" block class="mt-2 gradient" @click="btnDemo">
                Prova ora
            </v-btn><br>
        </v-container>
        <PricesView :home="false" :mail="mail" />
    </v-container>
    <v-container v-if="status == 'Production'">
        <v-sheet width="400" class="mx-auto login-box" elevation="20">
            <h1>Il tuo bot è in fase di produzione.<br>Copia questo script javascript per integrarlo sul tuo sito web.</h1>
        </v-sheet>
    </v-container>
</template>

<script setup>
    import utils from '@/utils/utils';
    import { ref, onMounted } from 'vue';
    import session from '@/utils/session';
    import Demo from '@/components/dashboard/Demo';
    import { useRoute, useRouter } from 'vue-router';
    import BotSetup from '@/components/dashboard/BotSetup';
    import PricesView from '@/components/shared/PricesView';
    import OtpVerification from '@/components/shared/OtpVerification';

    const mail = ref('');
    const botId = ref('');
    const status = ref('');
    const route = useRoute();
    const router = useRouter();
    const startDemo = ref(false);

    onMounted(async () => {
        botId.value = route.params.botId;
        const post = utils.postRequest({
            bot_id: botId.value,
            session_token: session.token.value
        });
        const response = await fetch(`${post.hostname}try-bot`, post.options);
        if (!response.ok)
            throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        status.value = data.status;
        mail.value = data.mail;
        if (data.status == 'ko' && data.message == 'Sessione scaduta') {
            alert(data.message);
            router.push('/login');
        }
    });

    const btnDemo = async () => {
        startDemo.value = true;
    };

    const updateStatus = (newValue) => {
        status.value = newValue;
    }
</script>
