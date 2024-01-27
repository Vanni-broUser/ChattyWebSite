<template>
    <v-sheet class="mx-auto login-box dashboard" elevation="20">
        <h2>Chat effettuate con il bot</h2><br>
        <v-btn @click="emitDisableSetupBot" block class="mt-2 gradient" variant="tonal">Indietro</v-btn>
    </v-sheet>
</template>

<script setup>
    const emit = defineEmits(['btnViewChat']);

    const emitDisableSetupBot = () => {
        emit('btnViewChat');
    };
</script>
