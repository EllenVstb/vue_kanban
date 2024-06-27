<template>
  <div class="card mt-5 mx-2" style="width: 24rem;" @drop="handleDrop" @dragover="allowDrop">
    <div class="card-body" :class="{ complete: project.complete }">
      <div class="d-flex justify-content-between">
        <h5 class="card-title" @click="toggleShowList">{{ project.title }}</h5>
        <div class="icons d-flex">
          <i class="bi bi-trash-fill" @click="deleteProject"></i>
          <i class="bi bi-check-circle-fill mx-2" @click="toggleComplete"></i>
          <i class="bi bi-pencil-fill" @click="editProject"></i>
        </div>
      </div>
      <p class="card-text">{{ project.details }}</p>
    </div>
    <div v-if="showList" class="list-group list-group-flush">
      <CheckListItem
          v-for="item in project.checklist"
          :key="item.id"
          :item="item"
          :projectId="project.id"
          @item-drop="handleItemDrop"
      />
      <div class="bi bi-plus-circle-fill list-group-item" @click="addCheckListItem"></div>
    </div>
  </div>
</template>

<script>
import { useProjectStore } from '../stores/ProjectStore';
import CheckListItem from './CheckListItem.vue';
import { ref } from 'vue';

export default {
  props: {
    project: Object,
  },
  components: {
    CheckListItem,
  },
  setup(props) {
    const projectStore = useProjectStore();
    const showList = ref(true);

    const deleteProject = () => projectStore.deleteProject(props.project.id);
    const toggleComplete = () => projectStore.toggleComplete(props.project.id);
    const editProject = () => projectStore.editProject(props.project.id);
    const addCheckListItem = () => {
      const newId = Date.now().toString();
      projectStore.addCheckListItem(props.project.id, { id: newId, text: '', complete: false });
    };
    const allowDrop = (ev) => ev.preventDefault();
    const handleDrop = (ev) => {
      ev.preventDefault();
      const data = JSON.parse(ev.dataTransfer.getData('application/json'));
      handleItemDrop({ ...data, targetProjectId: props.project.id });
    };
    const handleItemDrop = ({ draggedItemId, sourceProjectId, targetProjectId, itemText, itemComplete }) => {
      projectStore.moveCheckListItem(sourceProjectId, draggedItemId, targetProjectId, itemText, itemComplete);
    };
    const toggleShowList = () => showList.value = !showList.value;

    return {
      showList,
      deleteProject,
      toggleComplete,
      editProject,
      addCheckListItem,
      allowDrop,
      handleDrop,
      handleItemDrop,
      toggleShowList,
    };
  },
};
</script>

<style scoped>
.card-body {
  border-left: 5px solid #771919;
}

.bi {
  color: lightgray;
  cursor: pointer;
  font-size: 20px;
}
.bi:hover {
  color: slategray;
}

.card-title {
  cursor: pointer;
  font-size: 1rem;
}
.complete {
  border-left: 5px solid #0b910b;
  color: lightgray;
}

.complete .bi-check-circle-fill {
  color: #0b910b;
}
</style>
