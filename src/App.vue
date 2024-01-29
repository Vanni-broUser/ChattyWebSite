<template>
  <router-view />
</template>

<script setup>
  import chat from '@/chat/index';

  chat.injectChat('95bc0add-aa2c-4f0b-9a28-ef9956fb21f8');
</script>
