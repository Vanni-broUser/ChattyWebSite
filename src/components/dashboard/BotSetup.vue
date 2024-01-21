<template>
    <v-container class="login-container">
        <v-sheet width="400" class="mx-auto login-box" elevation="20">
            <h3>Crea il tuo Chatty</h3><br>
            <v-form @submit.prevent="activeBot" enctype="multipart/form-data">
                <v-file-input accept="image/*" label="Carica il tuo logo"></v-file-input>
                <br><v-row class="d-flex align-center justify-space-around">
                    <v-chip-group v-model="userColor">
                        <v-chip variant="flat" v-for="(colore, i) in colors" :key="i" :color="colore.color">
                            {{ colore.name }}
                        </v-chip>
                    </v-chip-group>
                </v-row><br>
                <v-textarea v-model="note" rows="3" label="I tuoi feeback" />
                <v-btn type="submit" block class="mt-2 gradient" variant="tonal">CREA</v-btn>
            </v-form>
            <br><div class="error-message">{{ error }}</div>
        </v-sheet>
    </v-container>
</template>

<script setup>
    import { ref } from 'vue';
    import utils from '@/utils/utils';
    import { useRoute, useRouter } from 'vue-router';

    const img = ref('');
    const note = ref('');
    const error = ref('');
    const route = useRoute();
    const router = useRouter();
    const userColor = ref(null);
    const colors = [
        {
            name: 'Rosso',
            color: 'red'
        },
        {
            name: 'Blu',
            color: 'blue'
        },
        {
            name: 'Verde',
            color: 'green'
        },
        {
            name: 'Giallo',
            color: 'yellow'
        },
        {
            name: 'Arancione',
            color: 'orange'
        }
    ];

    const activeBot = () => {
        /** 
        error.value = '';
        const boId = route.params.botId;
        var formData = new FormData();
        formData.append('file', img);
        formData.append('json', JSON.stringify({
            plan: 1,
            bot_id: boId,
            feedback: note.value,
            color: colors[userColor.value].name
        }));
        const hostname = utils.postRequest(null).hostname;

        fetch(`${hostname}active-bot`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/json'
            },
        })
        */
       
        const hostname = utils.postRequest(null).hostname;
        const formData = new FormData();
         formData.append('file', img.value);

            fetch(`${hostname}upload`, {
            method: 'POST',
            body: formData,
            })
            .then(response => {
                if (!response.ok)
                    throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                if (data.status == 'ok')
                    router.push(`/dashboard/${boId}`);
                else
                    error.value = data.error;
            })
            .catch(error => {
                console.error('Errore:', error);
            });
    };
</script>
