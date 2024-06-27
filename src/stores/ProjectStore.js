import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {

    state: () => ({
        projects: [],
        isModalVisible: false,
        editingProject: null,
        isFormVisible: false,
    }),

    actions:

        {
        async fetchProjects() {
            try {
                const response = await fetch('http://localhost:3000/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                this.projects = data.map(project => ({
                    ...project,
                    checklist: project.checklist || []
                }));
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        },

        async addProject(newProject) {
            try {
                const response = await fetch('http://localhost:3000/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProject),
                });
                if (!response.ok) throw new Error('Failed to add project');
                const addedProject = await response.json();
                this.projects.push({
                    ...addedProject,
                    checklist: addedProject.checklist || []
                });
                this.isFormVisible = false;
            } catch (error) {
                console.error('Error adding project:', error);
            }
        },

        async deleteProject(projectId) {
            try {
                const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete project');
                this.projects = this.projects.filter(project => project.id !== projectId);
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        },

        async toggleComplete(projectId) {
            const project = this.projects.find(project => project.id === projectId);
            if (!project) return;

            try {
                const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ complete: !project.complete }),
                });
                if (!response.ok) throw new Error('Failed to toggle project completion');
                project.complete = !project.complete;
            } catch (error) {
                console.error('Error toggling project completion:', error);
            }
        },

        async editProject(projectId) {
            try {
                const response = await fetch(`http://localhost:3000/projects/${projectId}`);
                if (!response.ok) throw new Error('Failed to fetch project details');
                const project = await response.json();
                this.editingProject = {
                    ...project,
                    checklist: project.checklist || []
                };
                this.isModalVisible = true;
            } catch (error) {
                console.error('Error fetching project details:', error);
            }
        },

        async updateProject(updatedProject) {
            try {
                const response = await fetch(`http://localhost:3000/projects/${updatedProject.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProject),
                });
                if (!response.ok) throw new Error('Failed to update project');
                const index = this.projects.findIndex(project => project.id === updatedProject.id);
                if (index !== -1) {
                    this.projects.splice(index, 1, updatedProject);
                }
            } catch (error) {
                console.error('Error updating project:', error);
            }
        },

        closeModal() {
            this.isModalVisible = false;
            this.editingProject = null;
        },

        async addCheckListItem(projectId, item) {
            const project = this.projects.find(project => project.id === projectId);
            if (project) {
                project.checklist.push(item);
                await this.updateProject(project);
            }
        },

        async deleteCheckListItem(projectId, itemId) {
            const project = this.projects.find(project => project.id === projectId);
            if (project) {
                project.checklist = project.checklist.filter(item => item.id !== itemId);
                await this.updateProject(project);
            }
        },

        async toggleCheckListItemComplete(projectId, itemId) {
            const project = this.projects.find(project => project.id === projectId);
            if (project) {
                const item = project.checklist.find(item => item.id === itemId);
                if (item) {
                    item.complete = !item.complete;
                }
                await this.updateProject(project);
            }
        },

        async updateCheckListItem(projectId, itemId, text) {
            const project = this.projects.find(project => project.id === projectId);
            if (project) {
                const item = project.checklist.find(item => item.id === itemId);
                if (item) {
                    item.text = text;
                }
                await this.updateProject(project);
            }
        },

        toggleFormVisibility() {
            this.isFormVisible = !this.isFormVisible;
        },

        moveCheckListItem(sourceProjectId, draggedItemId, targetProjectId, itemText, itemComplete) {
            const sourceProject = this.projects.find(p => p.id === sourceProjectId);
            const targetProject = this.projects.find(p => p.id === targetProjectId);

            if (sourceProject && targetProject) {
                const draggedItemIndex = sourceProject.checklist.findIndex(item => item.id === draggedItemId);
                if (draggedItemIndex > -1) {
                    const [draggedItem] = sourceProject.checklist.splice(draggedItemIndex, 1);
                    targetProject.checklist.push({
                        ...draggedItem,
                        text: itemText,
                        complete: itemComplete
                    });
                    this.projects = [...this.projects];
                }
            }
        },
    },
});
