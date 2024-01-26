<template>
    <v-sheet class="mx-auto login-box dashboard" elevation="20">
        
        <h1>Info utente</h1>
        <h3>Mail:</h3><h4>{{ botData.mail }}</h4>
        <br><v-divider :thickness="3" /><br>
        <ModifyPanel @btnSetupBot="emitBtnSetupBot" />
    </v-sheet>
</template>

<script setup>
    import ModifyPanel from '@/components/dashboard/ModifyPanel';

    const emit = defineEmits(['btnSetupBot']);
    const { botData } = defineProps(['botData']);

    const emitBtnSetupBot = () => {
        emit('btnSetupBot');
    };
</script>

<style scoped>
    .dashboard {
        max-width: 1000px;
    }
</style>
