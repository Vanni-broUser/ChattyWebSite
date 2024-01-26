<template>
    <v-container class="login-container" v-if="botData.status == 'Not Ready' || flagSetupBot">
        <BotSetup :flagSetupBot="flagSetupBot" :botData="botData" @disableSetupBot="disableSetupBot" />
    </v-container>
    <v-container class="login-container" v-if="botData.status == 'Not Verified'">
        <OtpVerification :email="botData.mail" :botId="botId" :home="false" @updateStatus="updateStatus" />
    </v-container>
    <v-container v-if="botData.status == 'Ready' && !flagSetupBot">
        <Demo v-if="startDemo" />
        <v-container v-else class="message-box">
            <h1>Clicca qui per avviare una demo</h1><br>
            <v-btn variant="outlined" type="submit" block class="mt-2 gradient" @click="btnDemo">
                Prova ora
            </v-btn><br><br>
        </v-container>
        <v-container class="message-box">
            <ModifyPanel @btnSetupBot="btnSetupBot" /><br><br>
        </v-container>
        <PricesView :home="false" :mail="botData.mail" />
    </v-container>
    <v-container v-if="botData.status == 'Production' && !flagSetupBot">
        <Dashboard @btnSetupBot="btnSetupBot" :botData="botData" />
        <PricesView :home="false" :mail="botData.mail" />
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
    import Dashboard from '@/components/dashboard/Dashboard';
    import ModifyPanel from '@/components/dashboard/ModifyPanel';
    import OtpVerification from '@/components/shared/OtpVerification';

    const botData = ref({});
    const botId = ref('');
    const route = useRoute();
    const router = useRouter();
    const startDemo = ref(false);
    const flagSetupBot = ref(false);

    onMounted(async () => {
        botId.value = route.params.botId;
        const post = utils.postRequest({
            bot_id: botId.value,
            session_token: session.getCookie('session_token')
        });
        const response = await fetch(`${post.hostname}try-bot`, post.options);
        if (!response.ok)
            throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        if (data.status == 'ko' && data.message == 'Sessione scaduta') {
            alert(data.message);
            router.push('/login');
        } else
            botData.value = data.bot;
    });

    const btnSetupBot = () => {
        flagSetupBot.value = true;
    };

    const disableSetupBot = () => {
        flagSetupBot.value = false;
    };

    const btnDemo = async () => {
        startDemo.value = true;
    };

    const updateStatus = (newValue) => {
        botData.value.status = newValue;
    }
</script>
