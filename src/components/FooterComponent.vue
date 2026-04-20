<template>
  <v-footer class="footer" app>
    <div class="links">
      <a href="#">Términos</a>
      <a href="#">Privacidad</a>
      <a href="#">Soporte</a>
      <a href="#">Cookies</a>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: #ffffff;
  border-top: 1px solid #eee;
}

/* Links */
.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 20px;
  text-align: center;
}

.links a {
  font-size: 13px;
  color: #444;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.links a:hover {
  color: #000;
}

/* Responsive */
@media (max-width: 600px) {
  .links a {
    font-size: 12px;
  }
}
</style>