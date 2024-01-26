<template>
  <v-container>
    <hr style="background-color: white;" v-if="page != 'Production'">
    <v-row class="divider-price">
      <v-col>
        <h3 block v-if="page == 'Home'">Prezzi</h3>
        <h3 block v-if="page == 'Ready'">Per procedere con l\'integrazione scegli un abbonamento</h3>
        <h3 block v-if="page == 'Production'">Aggiorna il tuo pacchetto</h3>
      </v-col>
      <v-col cols="auto">
        <v-switch :label="switchFlag ? 'Annuale' : 'Mensile'" v-model="switchFlag" class="switch-price" />
      </v-col>
    </v-row>
    <v-item-group selected-class="bg-primary">
      <v-row>
        <v-col v-for="(price, i) in prices" :key="i" cols="12" md="4">
          <v-item>
            <v-card class="d-flex align-center" elevation="20">
              <template v-slot:title>
                <v-btn block class="mt-2 gradient" variant="tonal" v-if="
                  page == 'Ready' || (page == 'Production' && price.name != plan)
                " @click.prevent="buy(price.name)">
                  {{ price.name }}
                </v-btn>
                <div v-else>{{ price.name }}</div><br>
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
  import Stripe from 'stripe';
  import utils from '@/utils/utils';
  import { useRoute } from 'vue-router';
  import prices_list from '@/utils/prices';

  const route = useRoute();
  const switchFlag = ref(true);
  const prices = ref(prices_list.prices);
  const { isMobile } = utils.setupMobileUtils();
  const { page, mail, plan } = defineProps(['page', 'mail', 'plan']);

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
      customer_email: mail,
      success_url:  `${window.location.origin}/dashboard/${route.params.botId}`,
      cancel_url: `${window.location.origin}/dashboard/${route.params.botId}`
    });
    window.location.href = checkoutSession.url;
  };
</script>

<style scoped>
  .v-list-item-title {
    white-space: normal;
  }
  .divider-price {
    margin-top: 20px;
  }
  .switch-price {
    margin-top: -15px;
  }
</style>
