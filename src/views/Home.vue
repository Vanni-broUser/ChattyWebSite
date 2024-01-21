<template>
  <TripleGrid />
  <ContactForm />
  <PotentialCarousel id="potenzialitaSection" />
  <FunctionalCard id="funzionamentoSection" />
  <div id="prezziSection">
    <PricesView :home="true" />
  </div>
  <AddingValue />
  <br>
</template>

<script setup>
  import TripleGrid from '@/components/home/TripleGrid.vue';
  import PricesView from '@/components/shared/PricesView.vue';
  import AddingValue from '@/components/home/AddingValue.vue';
  import ContactForm from '@/components/home/ContactForm.vue';
  import FunctionalCard from '@/components/home/FunctionalCard.vue';
  import PotentialCarousel from '@/components/home/PotentialCarousel.vue';
</script>
