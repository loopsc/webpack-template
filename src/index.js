import "./styles.css";
import render from "./modules/render";
import { list } from "./modules/projects-list";

document.addEventListener("DOMContentLoaded", () => {
    list.init()
    render();
});

