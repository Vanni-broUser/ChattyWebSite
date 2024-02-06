<template>
    <v-container v-if="!flagSetupBot" style="text-align: center;">
        <h1>Entro due giorni lavorativi la tua demo sarà pronta</h1>
        <h3>Riceverai una mail appena sarà disponibile!</h3>
    </v-container>
    <h3 v-if="flagSetupBot">Configura il tuo Chatty</h3><br>
    <v-expansion-panels v-model="panels" multiple>
        <v-expansion-panel style="max-width: 1000px;">
            <v-expansion-panel-title>Immagine</v-expansion-panel-title>
            <v-expansion-panel-text>
                <div class="text-caption" v-if="messageImg != ''">{{ messageImg }}</div>
                <div class="error-message" v-if="errorImg != ''">{{ errorImg }}</div>
                <v-file-input accept="image/*" label="Carica il tuo logo" v-model="image" @change="uploadImage" />
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel style="max-width: 1000px;">
            <v-expansion-panel-title>Informazioni di base</v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form @submit.prevent="activeBotBasicData">
                    <v-text-field label="Nome" v-model="name" />
                    <v-text-field label="Sito web" v-model="site" />
                    <v-btn type="submit" block class="mt-2 gradient" variant="tonal">Salva</v-btn>
                </v-form>
                <div class="text-caption" v-if="messageBaseForm != ''"><br>{{ messageBaseForm }}</div>
                <div class="error-message" v-if="errorBaseForm != ''"><br>{{ errorBaseForm }}</div>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel style="max-width: 1000px;">
            <v-expansion-panel-title>Informazioni bot</v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form @submit.prevent="activeBot">
                    <v-textarea v-model="note" rows="3" label="Descrivi la tua azienda e i tuoi obbiettivi"
                        hint="Più informazioni ci darai sulla tua azienda più il bot sarà efficace" />
                    <h4>Seleziona l'obbiettivo del tuo bot:</h4>
                    <v-checkbox v-model="service1" label="Automazione delle vendite" class="service-check-box" @click="checkBox(1)" />
                    <v-checkbox v-model="service2" label="Acquisizione di contatti" class="service-check-box" @click="checkBox(2)" />
                    <v-checkbox v-model="service3" label="Prenotazione di appuntamenti" class="service-check-box" @click="checkBox(3)" />
                    <div class="text-caption" v-if="msgCheckBox != ''">{{ msgCheckBox }}</div>
                    <br><h4>Seleziona una palette colori:</h4><br>
                    <v-row class="d-flex align-center justify-space-around">
                        <v-chip-group v-model="userColor">
                            <v-chip variant="flat" v-for="(colore, i) in colors" :key="i" selected-class="selected" :class="`${colore.class}-chip`">
                                {{ colore.name }}
                            </v-chip>
                        </v-chip-group>
                    </v-row><br>
                    <v-btn type="submit" block class="mt-2 gradient" variant="tonal">Salva</v-btn>
                </v-form>
                <div class="text-caption" v-if="messageForm != ''"><br>{{ messageForm }}</div>
                <div class="error-message" v-if="errorForm != ''"><br>{{ errorForm }}</div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels><br>
    <v-btn @click="disableSetupBot" block class="mt-2 gradient" variant="outlined" v-if="flagSetupBot">Indietro</v-btn>
</template>

<script setup>
    import { ref } from 'vue';
    import utils from '@/utils/utils';
    import session from '@/utils/session';
    import { useRoute, useRouter } from 'vue-router';

    const image = ref(null);
    const route = useRoute();
    const router = useRouter();
    const errorImg = ref('');
    const errorForm = ref('');
    const panels = ref([0, 2]);
    const msgCheckBox = ref('');
    const messageForm = ref('');
    const errorBaseForm = ref('');
    const messageBaseForm = ref('');
    const emit = defineEmits(['disableSetupBot']);

    const colors = [
        {
            name: 'Blu',
            class: 'blue'
        },
        {
            name: 'Rosso',
            class: 'red'
        },
        {
            name: 'Verde',
            class: 'green'
        },
        {
            name: 'Viola',
            class: 'purple'
        },
        {
            name: 'Arancione',
            class: 'orange'
        }
    ];

    const { flagSetupBot, botData } = defineProps(['flagSetupBot', 'botData']);
    const name = ref(botData.name || '');
    const site = ref(botData.website || '');
    const note = ref(botData.description || '');
    const userColor = ref(botData.color_palette ? colors.
        findIndex(palette => palette.name == botData.color_palette) : null);
    const messageImg = ref(botData.image ? 'Immagine caricata' : 'Nussuna immagine caricata');
    const service1 = ref(botData.template && botData.template.includes('Selling'));
    const service3 = ref(botData.template && botData.template.includes('Booking'));
    const service2 = ref(botData.template && botData.template.includes('Lead Capture'));

    const disableSetupBot = () => {
        emit('disableSetupBot');
    };

    const checkBox = (n) => {
        if (n == 1)
            deactiveCheckBox(service2, service3);
        else if (n == 2)
            deactiveCheckBox(service1, service3);
        else if (n == 3)
            deactiveCheckBox(service1, service2);
        if (msgCheckBox.value == '' && botData.plan != 'Enterprise')
            msgCheckBox.value = `Abbonati al pacchetto ${botData.plan != 'Premium' ? 'Premium o ' : ''}Enterprise per usare più funzionalità contemporaneamente`;
    };

    const deactiveCheckBox = (first, second) => {
        if (botData.plan == 'Basic' || ['Not Ready', 'Ready', 'Testing'].includes(botData.status)) {
            first.value = false;
            second.value = false;
        } else if (botData.plan == 'Premium') {
            if (first.value) second.value = false;
            else if (second.value) first.value = false;
        }
    };

    const uploadImage = () => {
        if (!image.value) return;
        errorImg.value = '';
        messageImg.value = '';
        const post = utils.postRequestFile(image.value[0], route.params.botId);
      
        fetch(`${post.hostname}upload-image`, post.options)
            .then(response => {
                if (!response.ok)
                    throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                if (data.status == 'ok') 
                    messageImg.value = data.message;
                else
                    errorImg.value = data.error;
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    };

    const activeBotBasicData = () => {
        if (!['', botData.name].includes(name.value) || !['', botData.website].includes(site.value)) {
            errorBaseForm.value = '';
            messageBaseForm.value = '';
            const post = utils.postRequest({
                name: name.value,
                website: site.value,
                bot_id: route.params.botId,
                session_token: session.getCookie('session_token')
            });

            fetch(`${post.hostname}setup-bot`, post.options)
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    if (data.status == 'ok') 
                        messageBaseForm.value = data.message;
                    else if (data.status == 'ko' && data.message == 'Sessione scaduta') {
                        alert(data.message);
                        router.push('/login');
                    } else
                        errorBaseForm.value = data.error;
                })
                .catch(error => {
                    console.error('Errore nella richiesta:', error);
                });

        }
    };

    const activeBot = () => {
        const template = []
        if (service1.value) template.push('Selling');
        if (service3.value) template.push('Booking');
        if (service2.value) template.push('Lead Capture');
        if (template.length > 0 || note.value != '' || userColor.value) {
            errorForm.value = '';
            messageForm.value = '';
            let body = {
                template: template,
                description: note.value,
                bot_id: route.params.botId,
                color_palette: userColor.value,
                session_token: session.getCookie('session_token')
            };
            if (userColor.value)
                body['color_palette'] = colors[userColor.value].name;
            const post = utils.postRequest(body);

            fetch(`${post.hostname}setup-bot`, post.options)
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    if (data.status == 'ok') 
                        messageForm.value = data.message;
                    else if (data.status == 'ko' && data.message == 'Sessione scaduta') {
                        alert(data.message);
                        router.push('/login');
                    } else
                        errorForm.value = data.error;
                })
                .catch(error => {
                    console.error('Errore nella richiesta:', error);
                });
        }
    };
</script>

<style scoped>
    .service-check-box {
        height: 50px;
    }
    .red-chip {
        background: red;
    }
    .blue-chip {
        background: blue;
    }
    .green-chip {
        background: green;
    }
    .purple-chip {
        background: purple;
    }
    .orange-chip {
        background: orange;
    }
    .selected {
        border: 4px solid black;
    }
</style>
