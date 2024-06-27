<script>
import { defineComponent, ref } from 'vue';
import { useProjectStore } from '@/stores/ProjectStore';

export default defineComponent({
  setup() {
    const projectStore = useProjectStore();

    const title = ref('');
    const details = ref('');

    const handleSubmit = async () => {
      if (title.value && details.value) {
        try {
          await projectStore.addProject({
            title: title.value,
            details: details.value,
            complete: false,
          });
          title.value = '';
          details.value = '';
        } catch (error) {
          console.error("Er is een fout opgetreden:", error);
        }
      }
    };

    return {
      title,
      details,
      handleSubmit
    };
  },
});
</script>


<template>
  <div class="container col-8">
    <form @submit.prevent="handleSubmit">
      <div class="mb-2">
        <label for="titelInput" class="form-label">Titel</label>
        <input type="text" class="form-control" id="titelInput" placeholder="Voer titel in" v-model="title">
      </div>
      <div class="mb-2">
        <label for="infoTextarea" class="form-label">Extra Informatie</label>
        <textarea class="form-control" id="infoTextarea" rows="3" placeholder="Voer extra informatie in"
                  v-model="details"></textarea>
      </div>
      <button type="submit" class="btn btn-secondary">Voeg toe</button>
    </form>
  </div>

</template>

<style scoped>

</style>