import { Task } from "./task";

class Project {
    #id;
    #tasksList;

    constructor(name) {
        this.name = name;
        this.#tasksList = [];
        this.#id = crypto.randomUUID();
    }

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id
    }

    getAllTasks() {
        return this.#tasksList;
    }

    addTask(task) {
        this.#tasksList.push(task);
    }

    removeTask(task) {
        this.#tasksList = this.#tasksList.filter((t) => t.id !== task.id);
    }

    removeAllTasks() {
        this.#tasksList.length = 0
    }

    // Convert a Project to a plain object
    toJSON() {
        return {
            name: this.name,
            id: this.id,
            tasks: this.getAllTasks().map(task => task.toJSON())
        };
    }

    // Convert plain object project format to Project object format
    // Populates the project with tasks
    static fromJSON(obj) {
        const project = new Project(obj.name);
        project.#id = obj.id;
        obj.tasks.forEach(taskData => {
            const task = Task.fromJSON(taskData, project);
            project.addTask(task);
        });
        return project;
    }
}

export { Project };
