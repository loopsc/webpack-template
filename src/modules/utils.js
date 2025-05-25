/**
 *
 * @param {Form} form
 * @param {Dialog} dialog
 * Reset form. Close and remove dialog from DOM
 */
function handleFormClose(form, dialog) {
    form.reset();
    dialog.close();
    dialog.remove();
}

/**
 * Attaches an event to the 'esc' key that closes the dialog and form
 * @param {Dialog} dialog
 * @param {Form} form
 * @param {Reject} reject
 */
function attachEscapeHandler(dialog, form, reject) {
    dialog.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            handleFormClose(form, dialog);

            reject("Form closed. User canceled");
        }
    });
}

export { handleFormClose, attachEscapeHandler };
