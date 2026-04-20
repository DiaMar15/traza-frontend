<template>
  <div class="header-wrapper">
    <v-img
      src="@/assets/morichal.jpg"
      alt="Logo"
      class="logo"
      contain
    />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.header-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}

/* Logo responsive */
.logo {
  max-width: 220px;
  width: 100%;
  border-radius: 16px;
}

/* Responsive */
@media (max-width: 600px) {
  .logo {
    max-width: 180px;
  }
}
</style>