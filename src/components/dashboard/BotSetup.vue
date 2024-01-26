<template>
    <v-container class="login-container">
        <v-sheet width="400" class="mx-auto login-box" elevation="20">
            <h3>Crea il tuo Chatty</h3><br>
            <v-file-input accept="image/*" label="Carica il tuo logo" v-model="image" @change="uploadImage" />
            <div class="text-caption" v-if="messageImg != ''">{{ messageImg }}</div>
            <div class="error-message" v-if="errorImg != ''">{{ errorImg }}</div>
            <br><v-divider :thickness="3" /><br>
            <v-form @submit.prevent="activeBot" enctype="multipart/form-data">
                <v-textarea v-model="note" rows="3" label="Descrivi la tua azienda"
                    hint="Più informazioni ci darai sulla tua azienda più il bot sarà efficace" />
                <h4>Seleziona l'obbiettivo del tuo bot:</h4>
                <v-checkbox v-model="service1" label="Automazione delle vendite" class="service-check-box" @click="checkBox(1)" />
                <v-checkbox v-model="service2" label="Acquisizione di contatti" class="service-check-box" @click="checkBox(2)" />
                <v-checkbox v-model="service3" label="Prenotazione di appuntamenti" class="service-check-box" @click="checkBox(3)" />
                <div class="text-caption" v-if="msgCheckBox != ''">{{ msgCheckBox }}</div>
                <br><h4>Seleziona una palette colori:</h4><br>
                <v-row class="d-flex align-center justify-space-around">
                    <v-chip-group v-model="userColor">
                        <v-chip variant="flat" v-for="(colore, i) in colors" :key="i" color="black" :class="`${colore.color}-chip`">
                            {{ colore.name }}
                        </v-chip>
                    </v-chip-group>
                </v-row><br>
                <v-btn type="submit" block class="mt-2 gradient" variant="tonal">Salva</v-btn>
            </v-form>
            <div class="text-caption" v-if="messageForm != ''"><br>{{ messageForm }}</div>
            <div class="error-message" v-if="errorForm != ''"><br>{{ errorForm }}</div>
            <v-btn @click="disableSetupBot" block class="mt-2 gradient" variant="tonal" v-if="flagSetupBot">Indietro</v-btn>
        </v-sheet>
    </v-container>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import utils from '@/utils/utils';
    import { useRoute } from 'vue-router';

    const note = ref('');
    const image = ref(null);
    const route = useRoute();
    const errorImg = ref('');
    const errorForm = ref('');
    const messageImg = ref('');
    const messageForm = ref('');
    const msgCheckBox = ref('');
    const service1 = ref(false);
    const service2 = ref(false);
    const service3 = ref(false);
    const userColor = ref(null);
    const emit = defineEmits(['disableSetupBot']);
    const { flagSetupBot, botData } = defineProps(['flagSetupBot', 'botData']);

    onMounted(() => {
        note.value = botData.description || '';
        userColor.value = botData.color_palette || null;
        service1.value = botData.template && botData.template.includes('Automazione delle vendite');
        service2.value = botData.template && botData.template.includes('Acquisizione di contatti');
        service3.value = botData.template && botData.template.includes('Prenotazione di appuntamenti');
        messageImg.value = botData.image ? 'Immagine caricata' : 'Nussuna immagine caricata';
    });

    const colors = [
        {
            name: 'Blu',
            color: 'blue'
        },
        {
            name: 'Rosso',
            color: 'red'
        },
        {
            name: 'Verde',
            color: 'green'
        },
        {
            name: 'Viola',
            color: 'purple'
        },
        {
            name: 'Arancione',
            color: 'orange'
        }
    ];

    const disableSetupBot = () => {
        emit('disableSetupBot');
    };

    const checkBox = (n) => {
        if (n == 1) {
            service2.value = false;
            service3.value = false;
        } else if (n == 2) {
            service1.value = false;
            service3.value = false;
        } else if (n == 3) {
            service1.value = false;
            service2.value = false;
        }
        if (msgCheckBox.value == '')
            msgCheckBox.value = 'Abbonati al pacchetto Premium o Enterprise per usare più funzionalità contemporaneamente'
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

    const activeBot = () => {
        errorForm.value = '';
        messageForm.value = '';
        const template = []
        if (service1.value) template.push('Automazione delle vendite');
        if (service2.value) template.push('Acquisizione di contatti');
        if (service3.value) template.push('Prenotazione di appuntamenti');
        const post = utils.postRequest({
            template: template,
            description: note.value,
            bot_id: route.params.botId,
            color_palette: userColor.value
        });

        fetch(`${post.hostname}setup-bot`, post.options)
            .then(response => {
                if (!response.ok)
                    throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                if (data.status == 'ok') 
                    messageForm.value = data.message;
                else
                    errorForm.value = data.error;
            })
            .catch(error => {
                console.error('Errore nella richiesta:', error);
            });
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
</style>
