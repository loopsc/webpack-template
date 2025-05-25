import { Task } from "../task";
import { saveProjects } from "../storage";
import { isBefore, parseISO, startOfToday } from "date-fns";

/**
 *
 * @param {Task} task - A Task object
 * @returns a rendered card onto the DOM
 */
export default function createTaskCard(task) {
    const card = document.createElement("div");
    card.classList.add("task-div");
    task.isComplete
        ? card.classList.add("completed")
        : card.classList.remove("completed");

    const priorityIndicator = document.createElement("div");
    priorityIndicator.classList.add("priority-indicator");
    card.appendChild(priorityIndicator);

    const title = document.createElement("p");
    title.classList.add("task-title");
    title.textContent = `Title: ${task.title}`;

    const desc = document.createElement("p");
    desc.classList.add("task-desc");
    desc.textContent = task.desc;

    const due = document.createElement("p");
    due.classList.add("task-due-date");
    due.textContent = `Due: ${task.dueDate}`;

    const prio = document.createElement("p");
    prio.classList.add("task-priority");
    prio.textContent = `Priority: ${task.prio}`;

    // Input fields
    const titleInput = document.createElement("input");
    titleInput.classList.add("task-inputs");
    titleInput.setAttribute("maxlength", "15");
    titleInput.value = task.title;
    titleInput.style.display = "none";

    const descInput = document.createElement("textarea");
    descInput.classList.add("task-inputs");
    descInput.setAttribute("maxlength", "200");
    descInput.value = task.desc;
    descInput.style.display = "none";

    const dueInput = document.createElement("input");
    dueInput.classList.add("task-inputs");
    dueInput.type = "date";
    dueInput.value = task.dueDate;
    dueInput.style.display = "none";

    const prioInput = document.createElement("select");
    prioInput.classList.add("task-inputs");

    const placeholderOption = document.createElement("option");
    placeholderOption.textContent = "--Priority--";
    placeholderOption.disabled = true;
    prioInput.appendChild(placeholderOption);

    for (let i = 1; i <= 5; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        if (i == task.prio) opt.selected = true;
        prioInput.appendChild(opt);
    }
    prioInput.style.display = "none";

    showPriorityIndicator(prioInput.value, priorityIndicator);

    // Buttons
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("task-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-btn");
    saveButton.style.display = "none";

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancel-btn");
    cancelButton.style.display = "none";

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete-btn");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    const contentGroup = document.createElement("div");
    contentGroup.classList.add("task-content");

    contentGroup.append(
        title,
        titleInput,
        desc,
        descInput,
        due,
        dueInput,
        prio,
        prioInput
    );

    buttonGroup.append(
        editButton,
        saveButton,
        cancelButton,
        completeButton,
        deleteButton
    );
    card.append(contentGroup, buttonGroup);

    card.addEventListener("click", () => console.log(task));

    editButton.addEventListener("click", () => {
        if (!task.isComplete) {
            card.classList.add("editing");

            // Hide the labels and show the inputs
            [title, desc, due, prio].forEach(
                (el) => (el.style.display = "none")
            );
            [titleInput, descInput, dueInput, prioInput].forEach(
                (el) => (el.style.display = "block")
            );

            // Hide 'edit', 'complete' and 'delete' button when in edit mode
            [editButton, completeButton, deleteButton].forEach(
                (el) => (el.style.display = "none")
            );
            // Show 'save' and 'cancel' button when in edit mode
            [saveButton, cancelButton].forEach(
                (el) => (el.style.display = "inline")
            );
        }
    });

    saveButton.addEventListener("click", () => {
        card.classList.remove("editing");

        task.title = titleInput.value;
        task.desc = descInput.value;
        if (!isBefore(parseISO(dueInput.value), startOfToday())) {
            task.dueDate = dueInput.value;
        } else {
            alert("Cannot choose a date in the past");
        }

        task.prio = prioInput.value;

        title.textContent = `Title: ${task.title}`;
        desc.textContent = task.desc;
        due.textContent = `Due: ${task.dueDate}`;
        prio.textContent = `Priority: ${task.prio}`;

        showPriorityIndicator(prioInput.value, priorityIndicator);

        // Hide the inputs and show labels
        [title, desc, due, prio].forEach((el) => (el.style.display = "block"));
        [titleInput, descInput, dueInput, prioInput].forEach(
            (el) => (el.style.display = "none")
        );

        [saveButton, cancelButton].forEach((el) => (el.style.display = "none"));
        [editButton, completeButton, deleteButton].forEach(
            (el) => (el.style.display = "inline")
        );

        saveProjects();
    });

    cancelButton.addEventListener("click", () => {
        card.classList.remove("editing");

        // Hide inputs and show labels
        [title, desc, due, prio].forEach((el) => (el.style.display = "block"));
        [titleInput, descInput, dueInput, prioInput].forEach(
            (el) => (el.style.display = "none")
        );

        [saveButton, cancelButton].forEach((el) => (el.style.display = "none"));
        [editButton, completeButton, deleteButton].forEach(
            (el) => (el.style.display = "inline")
        );
    });

    completeButton.addEventListener("click", () => {
        task.toggleComplete();

        if (task.isComplete) {
            card.classList.add("completed");
            editButton.disabled = true;
        } else {
            card.classList.remove("completed");
            editButton.disabled = false;
        }

        saveProjects();
    });

    deleteButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this task?")) {
            task.project.removeTask(task);

            card.remove();
            saveProjects();
        }
    });

    return card;
}

function showPriorityIndicator(priority, corner) {
    switch (priority) {
        case "1":
            corner.style.borderTopColor = "lightgreen";
            break;
        case "2":
            corner.style.borderTopColor = "green";
            break;
        case "3":
            corner.style.borderTopColor = "yellow";
            break;
        case "4":
            corner.style.borderTopColor = "orange";
            break;
        case "5":
            corner.style.borderTopColor = "red";
            break;
    }
}
