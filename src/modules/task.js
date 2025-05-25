import { list } from "./projects-list";
import { format } from "date-fns"

class Task {
    #project;
    #id;
    #isComplete;

    // Project will be placed in default project if not specified
    // when object is created
    constructor(title, desc, dueDate, prio, project=list.getAllProjects()[0]) {
        this.title = title;
        this.desc = desc;
        this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
        this.prio = prio;
        this.#project = project;
        this.#id = crypto.randomUUID()
        this.#isComplete = false
    }

    get project() {
        return this.#project;
    }

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id
    }

    get isComplete() {
        return this.#isComplete;
    }

    set isComplete(complete) {
        this.#isComplete = complete 
    }

    toggleComplete() {
        this.#isComplete = !this.#isComplete
    }

    // Convert a Task to a plain object
    toJSON() {
        return {
            title: this.title,
            desc: this.desc,
            dueDate: this.dueDate,
            prio: this.prio,
            id: this.id,
            isComplete: this.isComplete,
            projectId: this.project.id
        };
    }

    // Create a task from a JSON object
    // Static is called from the class itself.
    static fromJSON(obj, project) {
        const task = new Task(obj.title, obj.desc, obj.dueDate, obj.prio, project);
        task.#id = obj.id;
        task.#isComplete = obj.isComplete;
        return task;
    }
}

export { Task };
