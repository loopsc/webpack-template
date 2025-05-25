import { Project } from "../../project";
import { list } from "../../projects-list";
import { attachEscapeHandler, handleFormClose } from "../../utils";
import { saveProjects } from "../../storage";

export default function addProjectDialog() {
    return new Promise((resolve, reject) => {
        const dialog = document.createElement("dialog");
        dialog.classList.add("dialog");

        const form = document.createElement("form");
        form.classList.add("form");
        form.setAttribute("method", "dialog");

        const taskGroup = document.createElement("div");
        taskGroup.classList.add("form-group");

        const projectLabel = document.createElement("label");
        projectLabel.setAttribute("for", "project-name");
        projectLabel.textContent = "Project Name:";
        taskGroup.appendChild(projectLabel);

        const projectName = document.createElement("input");
        projectName.setAttribute("type", "text");
        projectName.setAttribute("name", "project");
        projectName.setAttribute("id", "project-name");
        projectName.setAttribute("required", "");
        projectName.setAttribute("maxlength", "20");
        projectName.setAttribute("autocomplete", "off");
        taskGroup.appendChild(projectName);

        form.appendChild(taskGroup);

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("button-group");

        // Create Cancel Button
        const cancelButton = document.createElement("button");
        cancelButton.classList.add("form-button");
        cancelButton.setAttribute("type", "button");
        cancelButton.textContent = "Cancel";
        buttonGroup.appendChild(cancelButton);

        // Cancel button event
        cancelButton.addEventListener("click", (e) => {
            e.preventDefault();
            handleFormClose(form, dialog);
            reject("Form closed. User canceled");
        });

        // Create Submit Button
        const submitButton = document.createElement("button");
        submitButton.classList.add("form-button");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = "Submit";
        buttonGroup.appendChild(submitButton);

        // Append button group to form
        form.appendChild(buttonGroup);

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            if (list.checkProjectName(projectName.value)) {
                const project = new Project(projectName.value);

                list.addProject(project);
                saveProjects();

                handleFormClose(form, dialog);
                resolve(project);
            } else {
                alert("Project name already exists");
            }
        });

        // Append form to dialog
        dialog.appendChild(form);

        document.body.appendChild(dialog);
        dialog.showModal()
        projectName.focus();

        dialog.addEventListener("keyup", (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                console.log(e)
                handleFormClose(form, dialog);
                reject("Form closed. User canceled");
            }
        });

        attachEscapeHandler(dialog, form, reject)
    });
}
