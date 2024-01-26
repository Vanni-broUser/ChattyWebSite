<template>
    <h2>Modifica le configurazioni del tuo bot</h2><br>
    <v-btn variant="outlined" type="submit" block class="mt-2 gradient" @click="emitBtnSetupBot">
        Modifica
    </v-btn>
</template>

<script setup>
    const emit = defineEmits(['btnSetupBot']);

    const emitBtnSetupBot = () => {
        emit('btnSetupBot');
    };
</script>
