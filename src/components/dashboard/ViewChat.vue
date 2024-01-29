<template>
    <v-sheet class="mx-auto login-box dashboard" elevation="20">
        <h2>Chat effettuate con il bot</h2>
        <v-container>
            <v-row>
                <v-col cols="12" sm="4">
                    <label for="dateStart">Date di inizio:</label>
                    <input type="date" v-model="dateStart" id="dateStart" />
                </v-col>
                <v-col cols="12" sm="4">
                    <label for="dateEnd">Date di fine:</label>
                    <input type="date" v-model="dateEnd" /> 
                </v-col>
                <v-col cols="12" sm="4">
                    <v-btn @click="emitDisableSetupBot" block class="mt-2 gradient" variant="tonal">Filtra</v-btn>
                </v-col>
            </v-row>
            <v-list>
                <v-list-item v-for="(thread, i) in threads" :key="i"
                    :title="thread.description" :subtitle="thread.date"/>
            </v-list>
        </v-container>
        <v-btn @click="emitDisableSetupBot" block class="mt-2 gradient" variant="tonal">Indietro</v-btn>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue';

    const emit = defineEmits(['btnViewChat']);
    const threads = ref([
        {
            date: 'Oggi',
            description: 'Mi ha mandato il numero'
        },
        {
            date: 'Oggi',
            description: 'Mi ha mandato il numero'
        },
        {
            date: 'Oggi',
            description: 'Mi ha mandato il numero'
        },
        {
            date: 'Oggi',
            description: 'Mi ha mandato il numero'
        }
    ]);

    const emitDisableSetupBot = () => {
        emit('btnViewChat');
    };
    
    const getStartOfMonth = () => {
        return (new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)).toISOString().split('T')[0];
    }

    function getEndOfMonth() {
        return (new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0)).toISOString().split('T')[0];
    }

    const dateStart = ref(getStartOfMonth());
    const dateEnd = ref(getEndOfMonth());
</script>
