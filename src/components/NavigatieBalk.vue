<script setup>
import {RouterLink} from "vue-router";
</script>

<template>

  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand"><i class="bi bi-kanban-fill px-2 me-3"></i>Kanban</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">

        <ul class="navbar-nav">
        </ul>

      </div>
    </div>
  </nav>

</template>

<style scoped>

</style>
