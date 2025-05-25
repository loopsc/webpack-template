import { list } from "../../projects-list";
import { saveProjects } from "../../storage";
import { attachEscapeHandler, handleFormClose } from "../../utils";

export default function editProjectDialog(project) {
    return new Promise((resolve, reject) => {
        // Dialog element
        const dialog = document.createElement("dialog");
        dialog.classList.add("dialog");

        // Form element
        const form = document.createElement("form");
        form.classList.add("form");
        form.setAttribute("method", "dialog");

        // Div to hold inputs
        const inputsGroup = document.createElement("div");
        inputsGroup.classList.add("form-group");

        // Label and input for project name change
        const newNameLabel = document.createElement("label");
        newNameLabel.setAttribute("for", "projectNameEdit");
        newNameLabel.textContent = "Project Name";

        const newNameInput = document.createElement("input");
        newNameInput.setAttribute("type", "text");
        newNameInput.setAttribute("id", "projectNameEdit");
        newNameInput.setAttribute("name", "projectNameEdit");
        newNameInput.setAttribute("required", "");
        newNameInput.setAttribute("placeholder", project.name);
        newNameInput.setAttribute("autocomplete", "off");

        inputsGroup.append(newNameLabel, newNameInput);

        // Div to hold all buttons
        const buttonsGroup = document.createElement("div");
        buttonsGroup.classList.add("button-group");

        // Div to hold save and cancel buttons
        const saveCancelButtonsGroup = document.createElement("div");
        saveCancelButtonsGroup.classList.add("save-cancel-group");
        saveCancelButtonsGroup.style.display = "flex";
        saveCancelButtonsGroup.style.gap = "2px";

        const submitButton = document.createElement("button");
        submitButton.setAttribute("type", "submit");
        submitButton.classList.add("form-button");
        submitButton.textContent = "Save";

        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("type", "button");
        cancelButton.classList.add("form-button");
        cancelButton.textContent = "Cancel";

        cancelButton.addEventListener("click", (e) => {
            e.preventDefault();

            handleFormClose(form, dialog);
            reject("Form closed");
        });

        saveCancelButtonsGroup.append(submitButton, cancelButton);

        // Div to hold delete project button
        const deleteButtonGroup = document.createElement("div");
        deleteButtonGroup.classList.add("delete-button-group");

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add("form-button");
        deleteButton.classList.add("delete");
        deleteButton.setAttribute("id", "deleteButton");
        deleteButton.textContent = "Delete Project";

        // Delete project button
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault();

            if (confirm("Are you sure you want to delete this project?")) {
                // Delete the current project and save data to local storage
                list.removeProject(list.activeProject);
                saveProjects();
                // Return user to the default project when a project is deleted
                list.activeProject = list.defaultProject;

                handleFormClose(form, dialog);
                resolve();
            }
        });

        const deleteTasksButton = document.createElement("button");
        deleteTasksButton.setAttribute("type", "button");
        deleteTasksButton.classList.add("form-button");
        deleteTasksButton.classList.add("delete");
        deleteTasksButton.setAttribute("id", "deleteTasks");
        deleteTasksButton.textContent = "Delete all tasks";

        deleteTasksButton.addEventListener("click", (e) => {
            e.preventDefault();

            if (confirm("Are you sure you want to delete all tasks?")) {
                list.activeProject.removeAllTasks();
                saveProjects();

                handleFormClose(form, dialog);
                resolve();
            }
        });

        deleteButtonGroup.appendChild(deleteButton);
        deleteButtonGroup.appendChild(deleteTasksButton);

        buttonsGroup.append(saveCancelButtonsGroup, deleteButtonGroup);

        form.append(inputsGroup, buttonsGroup);

        form.addEventListener("submit", () => {
            list.activeProject.name = newNameInput.value;
            saveProjects();

            handleFormClose(form, dialog);
            resolve();
        });

        dialog.appendChild(form);

        document.body.appendChild(dialog);
        dialog.showModal();
        newNameInput.focus();

        attachEscapeHandler(dialog, form, reject);
    });
}
