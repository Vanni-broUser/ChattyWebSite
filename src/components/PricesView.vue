<template>
    <v-container>
        <v-divider></v-divider>
        <v-row class="divider-price">
            <v-col>
                <h3 block>{{ titleCard }}</h3>
            </v-col>
            <v-col cols="auto">
                <v-switch :label="switchFlag ? 'Annuale' : 'Mensile'" v-model="switchFlag" class="switch-price" />
            </v-col>
        </v-row>
        <v-item-group selected-class="bg-primary">
            <v-row>
                <v-col v-for="(price, i) in prices" :key="i" cols="12" md="4">
                    <v-item>
                        <v-card class="d-flex align-center" height="190" elevation="20" @click.prevent="buy(price.name)">
                            <template v-slot:title>
                                {{ price.name }}
                            </template>
                            <template v-slot:subtitle>
                                <div>
                                    {{ switchFlag ? price.value.year : price.value.month }},00
                                    €/{{ switchFlag ? 'year' : 'month' }}
                                </div>
                                <div v-if="switchFlag">
                                    {{ price.value.yearMonth }} €/month
                                </div>
                            </template>
                            <template v-slot:text>
                                <v-list density="compact">
                                    <v-list-item v-for="(item, j) in price.features" :key="j">
                                        <template v-slot:prepend v-if="!isMobile">
                                            <v-icon :icon="item.icon"></v-icon>
                                        </template>
                                        <v-list-item-title color="primary">
                                            {{ item.text }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </template>
                        </v-card>
                    </v-item>
                </v-col>
            </v-row>
        </v-item-group>
    </v-container>
</template>

<script setup>
    import { ref } from 'vue';
    import utils from '@/utils/utils';

    const switchFlag = ref(true);
    const { titleCard } = defineProps(['titleCard']);
    const { isMobile } = utils.setupMobileUtils();
    const prices = ref([
        {
            name: "Basic",
            value: {
                year: 150,
                month: 15,
                yearMonth: "12,50"
            },
            features: [
                {
                    icon: "mdi-numeric-1-circle",
                    text: "Un chat-bot personalizzato"
                },
                {
                    icon: "mdi-numeric-2-circle",
                    text: "Acquisizione di contatti"
                },
                {
                    icon: "mdi-numeric-3-circle",
                    text: "Prenotazione di appuntamenti"
                }
            ]
        },
        {
            name: "Premium",
            value: {
                year: 300,
                month: 30,
                yearMonth: "25,00"
            },
            features: [
                {
                    icon: "mdi-numeric-1-circle",
                    text: "Un chat-bot personalizzato"
                },
                {
                    icon: "mdi-numeric-2-circle",
                    text: "Acquisizione di contatti"
                },
                {
                    icon: "mdi-numeric-3-circle",
                    text: "Prenotazione di appuntamenti"
                },
                {
                    icon: "mdi-numeric-4-circle",
                    text: "Automazione delle vendite"
                }
            ]
        },
        {
            name: "Enterprise",
            value: {
                year: 500,
                month: 50,
                yearMonth: "41,66"
            },
            features: [
                {
                    icon: "mdi-numeric-1-circle",
                    text: "Tre chat-bot personalizzati"
                },
                {
                    icon: "mdi-numeric-2-circle",
                    text: "Acquisizione di contatti"
                },
                {
                    icon: "mdi-numeric-3-circle",
                    text: "Prenotazione di appuntamenti"
                },
                {
                    icon: "mdi-numeric-4-circle",
                    text: "Automazione delle vendite"
                }
            ]
        }
    ])

    const buy = (packageName) => {
        alert(packageName)
    }
</script>

<style scoped>
    @media only screen and (max-width: 600px) {
        .v-list-item-title {
            white-space: normal;
        }
        .d-flex.align-center {
            min-height: 240px;
        }
    }
    .divider-price {
        margin-top: 20px;
    }
    .switch-price {
        margin-top: -15px;
    }
</style>