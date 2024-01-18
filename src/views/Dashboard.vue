<template>
    <v-container class="login-container" v-if="['Not Ready', 'Not Verified'].includes(status)">
        <v-sheet width="400" class="mx-auto login-box" elevation="20">
            <h1>Il tuo bot è in fase di preparazione.<br>Ti invieremo una mail appena sarà pronto.</h1>
        </v-sheet>
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
    import PricesView from '@/components/PricesView';
    import { useRoute, useRouter } from 'vue-router';

    const mail = ref('');
    const status = ref('');
    const route = useRoute();
    const router = useRouter();
    const startDemo = ref(false);

    onMounted(async () => {
        const post = utils.postRequest({
            bot_id: route.params.botId,
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
</script>
