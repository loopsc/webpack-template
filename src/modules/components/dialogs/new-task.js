import { attachEscapeHandler, handleFormClose } from "../../utils";
import { Task } from "../../task";
import { format, parseISO, isBefore, startOfToday } from "date-fns";
import { list } from "../../projects-list";
import { saveProjects } from "../../storage";

export default function addTaskDialog() {
    return new Promise((resolve, reject) => {
        // Create the dialog element
        const dialog = document.createElement("dialog");
        dialog.classList.add("dialog");

        // Create the form element
        const form = document.createElement("form");
        form.classList.add("form");
        form.setAttribute("method", "dialog");

        // Create Task name Section
        const taskGroup = document.createElement("div");
        taskGroup.classList.add("form-group");

        const taskLabel = document.createElement("label");
        taskLabel.setAttribute("for", "task");
        taskLabel.textContent = "Task:";
        taskGroup.appendChild(taskLabel);

        const taskInput = document.createElement("input");
        taskInput.setAttribute("type", "text");
        taskInput.setAttribute("name", "task");
        taskInput.setAttribute("id", "task");
        taskInput.setAttribute("required", "");
        taskInput.setAttribute("autocomplete", "off");
        taskGroup.appendChild(taskInput);

        // Append task group to form
        form.appendChild(taskGroup);

        // Create Description Textarea Section
        const descGroup = document.createElement("div");
        descGroup.classList.add("form-group");

        const descLabel = document.createElement("label");
        descLabel.setAttribute("for", "desc");
        descLabel.textContent = "Description:";
        descGroup.appendChild(descLabel);

        const descTextarea = document.createElement("textarea");
        descTextarea.setAttribute("name", "desc");
        descTextarea.setAttribute("id", "desc");
        descGroup.appendChild(descTextarea);

        // Append description group to form
        form.appendChild(descGroup);

        // Create Due Date Input Section
        const dueGroup = document.createElement("div");
        dueGroup.classList.add("form-group");

        const dueLabel = document.createElement("label");
        dueLabel.setAttribute("for", "due");
        dueLabel.textContent = "Due Date:";
        dueGroup.appendChild(dueLabel);

        const dueInput = document.createElement("input");
        dueInput.setAttribute("type", "date");
        dueInput.setAttribute("name", "due");
        dueInput.setAttribute("id", "due");
        // dueInput.setAttribute("required", "");
        dueGroup.appendChild(dueInput);

        // Append due group to form
        form.appendChild(dueGroup);

        // Create Priority Select Section
        const priorityGroup = document.createElement("div");
        priorityGroup.classList.add("form-group");

        const priorityLabel = document.createElement("label");
        priorityLabel.setAttribute("for", "priority");
        priorityLabel.textContent = "Priority:";
        priorityGroup.appendChild(priorityLabel);

        const prioritySelect = document.createElement("select");
        prioritySelect.setAttribute("id", "priority");
        prioritySelect.setAttribute("name", "priority");
        prioritySelect.setAttribute("required", "");

        const optionDefault = document.createElement("option");
        optionDefault.setAttribute("value", "");
        optionDefault.textContent = "--Select--";
        prioritySelect.appendChild(optionDefault);

        for (let i = 1; i <= 5; i++) {
            const option = document.createElement("option");
            option.setAttribute("value", i);
            option.textContent = i;
            prioritySelect.appendChild(option);
        }

        // Append priority group to form
        priorityGroup.appendChild(prioritySelect);
        form.appendChild(priorityGroup);

        // Create Button Group
        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("button-group");

        // Create Cancel Button
        const cancelButton = document.createElement("button");
        cancelButton.classList.add("form-button");
        cancelButton.setAttribute("type", "button");
        cancelButton.textContent = "Cancel";
        buttonGroup.appendChild(cancelButton);

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

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Create a new task using inputs
            const name = taskInput.value;
            const desc = descTextarea.value;
            let due;
            // Choose current date if not specified
            if (dueInput.value === "") {
                due = format(new Date(), "yyyy-MM-dd");
            } else {
                due = dueInput.value;
            }
            const prio = prioritySelect.value;

            if (!isBefore(parseISO(due), startOfToday())) {
                // prettier-ignore
                const task = new Task(name, desc, due, prio, list.activeProject);

                list.activeProject.addTask(task);
                saveProjects();

                handleFormClose(form, dialog);
                resolve(task);
            } else {
                alert("Cannot choose a date in the past");
            }
        });

        buttonGroup.appendChild(submitButton);

        // Append button group to form
        form.appendChild(buttonGroup);

        // Append form to dialog
        dialog.appendChild(form);
        document.body.appendChild(dialog);
        dialog.showModal();
        taskInput.focus();

        attachEscapeHandler(dialog, form, reject);
    });
}
