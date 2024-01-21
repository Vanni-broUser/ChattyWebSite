<template>
    <v-container class="login-container">
        <v-sheet width="400" class="mx-auto login-box" elevation="20">
            <h3>Crea il tuo Chatty</h3><br>
            <v-file-input accept="image/*" label="Carica il tuo logo" v-model="image" @change="uploadImage" />
            <div class="text-caption" v-if="message != ''">{{ message }}</div>
            <div class="error-message" v-if="error != ''">{{ error }}</div>
            <hr>
            <v-form @submit.prevent="activeBot" enctype="multipart/form-data">
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
    import { useRouter } from 'vue-router';

    const img = ref('');
    const note = ref('');
    const error = ref('');
    const image = ref(null);
    const message = ref('');
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

    const uploadImage = () => {
        if (!image.value) return;
        alert(image.value)
        error.value = '';
        message.value = '';
        const post = utils.postRequest(image.value[0]);
      
        fetch(`${post.hostname}upload-image`, post.options)
            .then(response => {
                if (!response.ok)
                    throw new Error(`Errore nella risposta del server: ${response.status} - ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                if (data.status == 'ok') 
                    message.value = data.message;
                else
                    error.value = data.error;
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    };

    const activeBot = () => {
       
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
