import { list } from "./projects-list";
import { Project } from "./project";

// Check if storage is available and supported
function storageAvailable(type) {
    let localStorage;
    try {
        localStorage = window[type];
        const x = "__storage_test__";
        localStorage.setItem(x, x);
        localStorage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            (e.name === "QuotaExceededError" ||
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            localStorage &&
            localStorage.length !== 0
        );
    }
}

/**
 * 
 * @returns Saves list to local storage
 */
function saveProjects() {
    if (!storageAvailable("localStorage")) return;

    // Create variable to hold all projects in plain object notation
    // Basically 'list' but in plain object notation
    const allProjects = list.getAllProjects().map(project => project.toJSON());
    console.log("Saved to local storage", allProjects);

    // Save projects to local storage as a single JSON string
    // Converts from plain object notation to single string
    localStorage.setItem("projects", JSON.stringify(allProjects));
}


/**
 *
 * @returns Load 'list' with content from local storage
 */
function loadProjects() {
    // Check if there is local storage supported
    if (!storageAvailable("localStorage")) {
        console.log("Storage unavailable");
        return;
    }

    // json string of all projects saved
    const stored = localStorage.getItem("projects");

    // Check if there is any data in local storage
    if (!stored) {
        console.log("Couldn't retrieve items from local storage");
        return;
    }

    // clear the list so there are no duplicate projects when loading
    list.clearAllProjects();

    // Array of all projects in plain object format
    const projects = JSON.parse(stored);
    console.log("Loading projects from local storage", projects);

    // Convert each plain object project back into a Project object
    // and add it back to the list
    projects.forEach(projData => {
        const project = Project.fromJSON(projData);
        list.addProject(project);
    });

    list.activeProject = list.defaultProject;
}

export { saveProjects, loadProjects };
