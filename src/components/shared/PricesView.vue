<template>
  <v-container>
    <hr style="background-color: white;" v-if="page != 'Production'">
    <v-row class="divider-price">
      <v-col>
        <h3 block v-if="page == 'Home'">Prezzi</h3>
        <h3 block v-if="page == 'Ready'">Per procedere con l'integrazione scegli un abbonamento</h3>
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
            <v-card elevation="20">
              <v-container>
                <v-row>
                  <v-col cols="12" md="9">
                    <h1>{{ price.name }}</h1>
                    {{ switchFlag ? price.value.year : price.value.month }},00
                    €/{{ switchFlag ? 'year' : 'month' }}
                    <div v-if="switchFlag">
                      {{ price.value.yearMonth }} €/month
                    </div>
                  </v-col>
                  <v-col  cols="12" md="3" v-if="
                    page == 'Ready' || (page == 'Production' && (price.name != plan.name || (switchFlag && plan.type == 'M')))
                  ">
                    <v-btn block class="mt-2 gradient" variant="tonal" @click.prevent="buy(price.name)">
                      Vai
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row>
                  <v-list density="compact">
                    <v-list-item v-for="(item, j) in price.features" :key="j">
                      <template v-slot:prepend>
                        <v-icon :icon="item.icon" style="color: #49246E;"></v-icon>
                      </template>
                      <v-list-item-title color="primary">
                        {{ item.text }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-row>
              </v-container>
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
  import { useRoute } from 'vue-router';
  import prices_list from '@/utils/prices';

  const route = useRoute();
  const switchFlag = ref(true);
  const prices = ref(prices_list.prices);
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
