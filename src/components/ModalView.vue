<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit">
        <div class="mb-2">
          <label for="titleInput" class="form-label">Title</label>
          <input type="text" class="form-control" id="titleInput" v-model="title">
        </div>
        <div class="mb-2">
          <label for="infoTextarea" class="form-label">Extra Information</label>
          <textarea class="form-control" id="infoTextarea" rows="3" v-model="details"></textarea>
        </div>
        <button type="submit" class="btn btn-secondary">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import { useProjectStore } from '../stores/ProjectStore';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

export default {
  props: {
    isVisible: Boolean,
  },
  setup(props, { emit }) {
    const projectStore = useProjectStore();
    const { editingProject } = storeToRefs(projectStore);

    const title = ref('');
    const details = ref('');

    watch(editingProject, (newProject) => {
      if (newProject) {
        title.value = newProject.title || '';
        details.value = newProject.details || '';
      }
    }, { immediate: true });

    const close = () => {
      emit('close');
      projectStore.closeModal();
    };

    const handleSubmit = async () => {
      await projectStore.updateProject({
        ...editingProject.value,
        title: title.value,
        details: details.value,
      });
      close();
    };

    return {
      title,
      details,
      close,
      handleSubmit,
    };
  },
};
</script>

<style>
.modal-overlay {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}

.modal-content {
  width: 800px;
  padding: 20px;
  margin: 200px auto;
  background: white;
  border-radius: 10px;
}

</style>
