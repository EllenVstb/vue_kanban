<template>
  <div
      :class="['d-flex', 'justify-content-between', 'list-group-item', { complete: item.complete }]"
      draggable="true"
      @dragstart="dragStart"
      @dragover="allowDrop"
      @drop="drop"
      :data-id="item.id"
  >
    <div class="d-flex align-items-center">
      <i class="bi bi-trash-fill fs-6" @click="deleteItem"></i>
      <i :class="toggleClass" class="bi mx-2 bi-check-circle-fill" @click="toggleComplete"></i>
    </div>
    <div
        contenteditable="true"
        @input="updateItemText"
        @blur="saveEdit"
        class="form-control form-control-sm w-100"
        :class="{ 'complete': item.complete }"
        ref="editableDiv"
    >{{ itemText }}</div>
    <div class="d-flex align-items-center">
      <i class="bi bi-three-dots-vertical"></i>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useProjectStore } from '../stores/ProjectStore';

export default {
  props: {
    item: { type: Object, required: true },
    projectId: String,
  },
  setup(props) {
    const projectStore = useProjectStore();
    const isEditing = ref(false);
    const itemText = ref(props.item.text || '');
    const editableDiv = ref(null);

    const toggleComplete = () => projectStore.toggleCheckListItemComplete(props.projectId, props.item.id);
    const deleteItem = () => projectStore.deleteCheckListItem(props.projectId, props.item.id);

    const saveEdit = () => {
      if (editableDiv.value) {
        const textValue = editableDiv.value.innerText || editableDiv.value.textContent;
        projectStore.updateCheckListItem(props.projectId, props.item.id, textValue.trim());
        isEditing.value = false;
      } else {
        console.error('editableDiv is not set');
      }
    };

    const dragStart = (ev) => {
      ev.dataTransfer.setData('application/json', JSON.stringify({
        draggedItemId: props.item.id,
        sourceProjectId: props.projectId,
        itemText: itemText.value,
        itemComplete: props.item.complete
      }));
      ev.dropEffect = "move";
    };

    const allowDrop = (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
    };

    const drop = (ev) => ev.preventDefault();

    const toggleClass = computed(() => ({
      'bi-check-circle-fill': true,
      'text-success': props.item.complete,
      'text-muted': !props.item.complete,
    }));

    const updateItemText = (event) => itemText.value = event.target.innerText;

    return {
      isEditing,
      itemText,
      toggleComplete,
      deleteItem,
      saveEdit,
      dragStart,
      allowDrop,
      drop,
      toggleClass,
      editableDiv,
      updateItemText,
    };
  },
};
</script>

<style scoped>
.bi {
  color: lightgray !important;
  cursor: pointer;
  font-size: 20px;
}
.bi:hover {
  color: slategray !important;
}

.complete {
  color: lightgray !important;
}
.complete .bi-check-circle-fill {
  color: #0b910b !important;

}
</style>
