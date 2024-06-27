<template>
  <div class="d-flex justify-content-center">
    <button type="button" class="btn btn-outline-secondary btn-lg px-3 mt-3" @click="toggleFormVisibility">
      <span class="bi bi-window-plus" aria-hidden="true"></span> Nieuw project
    </button>
  </div>

  <div>
    <AddProject  v-show="isFormVisible"></AddProject>
  </div>

  <div class="cards-container d-flex flex-row flex-wrap justify-content-center mt-0">
    <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
    />
  </div>

  <ModalView
      :isVisible="isModalVisible"
      :project="editingProject"
      @close="closeModal"
  />
</template>

<script>
import ProjectCard from "@/components/ProjectCard.vue";
import AddProject from "@/components/AddProject.vue";
import ModalView from "@/components/ModalView.vue";
import { useProjectStore } from '@/stores/ProjectStore';
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

export default {
  components: {
    ProjectCard,
    AddProject,
    ModalView,
  },
  setup() {
    const projectStore = useProjectStore();
    const { projects, isModalVisible, editingProject, isFormVisible } = storeToRefs(projectStore);

    onMounted(async () => {
      await projectStore.fetchProjects();
    });

    const toggleFormVisibility = () => {
      projectStore.toggleFormVisibility();
    };

    const closeModal = () => {
      projectStore.closeModal();
    };

    return { projects, isModalVisible, editingProject, isFormVisible, toggleFormVisibility, closeModal };
  },
  data() {
    return {
      showForm: false,
    };
  },
};
</script>



<style>

</style>