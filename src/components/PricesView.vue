<template>
  <v-container>
    <hr style="background-color: white;">
    <v-row class="divider-price">
      <v-col>
        <h3 block>
          {{ home ? 'Prezzi': 'Per procedere con l\'integrazione scegli un abbonamento' }}
        </h3>
      </v-col>
      <v-col cols="auto">
        <v-switch :label="switchFlag ? 'Annuale' : 'Mensile'" v-model="switchFlag" class="switch-price" />
      </v-col>
    </v-row>
    <v-item-group selected-class="bg-primary">
      <v-row>
        <v-col v-for="(price, i) in prices" :key="i" cols="12" md="4">
          <v-item>
            <v-card class="d-flex align-center" height="190" elevation="20">
              <template v-slot:title>
                <v-btn block class="mt-2 gradient" variant="tonal" v-if="!home" @click.prevent="buy(price.name)">
                  {{ price.name }}
                </v-btn>
                <div v-else>{{ price.name }}</div>
              </template>
              <template v-slot:subtitle>
                <div>
                  <br v-if="!home">
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
                      <v-icon :icon="item.icon" style="color: #49246E;"></v-icon>
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
import { useRoute } from 'vue-router';
import Stripe from 'stripe';

const route = useRoute();
const switchFlag = ref(true);
const { home } = defineProps(['home']);
const { isMobile } = utils.setupMobileUtils();
const prices = ref([
  {
    name: "Basic",
    value: {
      year: 150,
      month: 15,
      yearMonth: "12,50"
    },
    stripeIds: {
      year: "price_1OSNvVAKuqbgBCCYD9Jnc5DX",
      month: "price_1OSNvVAKuqbgBCCY72AuWkZ"
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
    stripeIds: {
      year: "price_1OSNwrAKuqbgBCCYPcfwCL3e",
      month: "price_1OSNwrAKuqbgBCCYKg3skdBN"
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
    stripeIds: {
      year: "price_1OSNzCAKuqbgBCCYL1jm1SUV",
      month: "price_1OSNzCAKuqbgBCCY5lRXJX5S"
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
]);

const privateKey = "sk_test_51OSKyZAKuqbgBCCYHdeAWFk6rFwKwtIHcLgDv4aY6pdEFyvnNhM3cpZrGvvMUSM6gApoXIWCDNJX29kEr5jYCIU200lQjxxOe2";
const buy = async (priceName) => {
  const stripe = new Stripe(privateKey);
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: prices.value.find(price => price.name == priceName).stripeIds[switchFlag.value ? 'year' : 'month'],
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url:  `${window.location.origin}/create-bot/${route.params.botId}`,
    cancel_url: `${window.location.origin}/dashboard/${route.params.botId}`
    });
    window.location.href = checkoutSession.url;
  };
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
