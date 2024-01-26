<template>
    <v-sheet class="mx-auto login-box dashboard" elevation="20">
        <h2>{{ botData.name }} - Pacchetto {{ botData.plan }}</h2>
        <h1>{{ botData.monthly_thread_usage }} / {{ limit }} chat in questo mese</h1>
        <br><v-divider :thickness="3" /><br>
        <ModifyPanel @btnSetupBot="emitBtnSetupBot" />
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue';
    import prices_list from '@/utils/prices';
    import ModifyPanel from '@/components/dashboard/ModifyPanel';

    const emit = defineEmits(['btnSetupBot']);
    const { botData } = defineProps(['botData']);
    const limit = ref(100);     // TEST_PLAN_THREADS_LIMIT
    const plan = prices_list.prices.find(plan => plan.name == botData.plan);
    if (plan)
        limit.value = parseInt(plan.features[0].text.split(' ')[0]);

    const emitBtnSetupBot = () => {
        emit('btnSetupBot');
    };
</script>

<style scoped>
    .dashboard {
        max-width: 1000px;
    }
</style>
