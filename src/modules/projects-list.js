import { Project } from "./project";

class ProjectsList {
    #projectsList;
    #activeProject;
    #defaultProject;

    constructor() {
        this.#projectsList = [];
    }

    init() {
        // Create the default project, add it to the list and set as the active project
        this.#defaultProject = new Project("Default");
        this.#projectsList.push(this.#defaultProject);
        this.#activeProject = this.#defaultProject;
    }

    get activeProject() {
        return this.#activeProject;
    }

    set activeProject(newActiveProject) {
        this.#activeProject = newActiveProject;
    }

    // Get the default project from local storage instead of from page load.
    get defaultProject() {
        return list.getAllProjects()[0];
    }

    addProject(projectToAdd) {
        // Checks if an object with that name already exists
        if (!this.getProjectByName(projectToAdd.name)) {
            this.#projectsList.push(projectToAdd);
        } else {
            alert("Project name already exists");
        }
    }

    // Check if the project name already exists
    checkProjectName(projectName) {
        // Return true if it doesn't exist, false otherwise
        if (!this.getProjectByName(projectName)) {
            return true;
        } else {
            return false;
        }
    }

    removeProject(project) {
        // Prevent removal of the default project
        if (project.id === this.defaultProject.id) {
            alert("Cannot delete 'default' project");
            return;
        }

        const projectID = project.id;
        for (let i = 0; i < this.#projectsList.length; i++) {
            if (this.#projectsList[i].id === projectID) {
                this.#projectsList.splice(i, 1);
                console.log(`Project '${project.name}' removed.`);
                return;
            }
        }
    }

    // Returns a project object with the corresponding name
    getProjectByName(projectName) {
        return this.#projectsList.find(
            (project) => project.name === projectName
        );
    }

    getProjectByID(id) {
        return this.#projectsList.find((project) => project.id === id);
    }

    getAllProjects() {
        return this.#projectsList;
    }

    clearAllProjects() {
        this.#projectsList = [];
    }
}

// Export the singleton instance of ProjectsList
// Ensures that only one ProjectsList can be created.
const list = new ProjectsList();

export { list };
