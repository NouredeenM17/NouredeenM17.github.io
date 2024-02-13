class Note {
  constructor(content, columnId, notesManager, title) {
    this.id = `note-${Date.now()}`;
    this.content = content || "";
    this.title = title || "Untitled";
    this.dateCreated = this.formatDate(new Date());
    this.notesManager = notesManager;
    this.columnId = columnId || "";
    this.element = this.createNoteElement();
  }

  // Creates the HTML element of the note
  createNoteElement() {
    const note = document.createElement("div");
    note.classList.add("note");
    note.setAttribute("draggable", "true");
    note.setAttribute("id", this.id);
    note.addEventListener("dragstart", this.handleDragStart.bind(this));
    note.addEventListener("click", (event) => {
      console.log(event.target);
      if (event.target !== deleteIcon && event.target !== deleteButton) {
        this.openNotePopup();
      }
    });

    // Create the delete button
    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add("material-symbols-outlined");
    deleteIcon.innerText = "delete";
    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener("click", this.deleteNote.bind(this));

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div");
    titleDiv.innerText = this.title;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content-div");
    contentDiv.innerText = this.content;

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date-created");
    dateDiv.innerText = `Created on: ${this.dateCreated}`;

    note.appendChild(deleteButton);
    note.appendChild(titleDiv);
    note.appendChild(contentDiv);
    note.appendChild(dateDiv);

    return note;
  }

  serialize() {
    // Convert the Note instance to a plain object for storage
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      dateCreated: this.dateCreated,
      columnId: this.columnId,
    };
  }

  deleteNote() {
    // Remove the note element from the DOM
    this.element.parentNode.removeChild(this.element);

    // Remove the note from the notesManager
    this.notesManager.removeNoteById(this.id);
  }

  handleDragStart(e) {
    e.dataTransfer.setData("text/plain", this.id);
  }

  updateColumnId(newColumnId) {
    this.columnId = newColumnId;
  }

  // Formats the date into string
  formatDate(date) {
    return date.toLocaleString();
  }

  // Function to open the popup for a specific column.
  openNotePopup() {
    // Create popup element
    const popup = document.createElement("div");
    popup.classList.add("popup");

    // Create popup overlay
    const overlay = document.createElement("div");
    overlay.classList.add("popup-overlay");

    // Create the close button
    const closeButton = document.createElement("button");
    const closeIcon = document.createElement("span");
    closeIcon.classList.add("material-symbols-outlined");
    closeIcon.innerText = "close";
    closeButton.appendChild(closeIcon);
    closeButton.addEventListener("click", function () {
      document.body.removeChild(overlay);
      document.body.removeChild(popup);
    });

    // Create title area element and place current title
    const titleArea = document.createElement("textarea");
    titleArea.classList.add("title-editor");
    titleArea.value = this.title;

    // Create text area element and place current content
    const textArea = document.createElement("textarea");
    textArea.classList.add("text-editor");
    textArea.value = this.content;

    // Create save button element
    const saveButton = document.createElement("button");
    const checkmarkIcon = document.createElement("span");
    checkmarkIcon.classList.add("material-symbols-outlined");
    checkmarkIcon.innerText = "done";
    saveButton.appendChild(checkmarkIcon);

    saveButton.addEventListener("click", () => {
      this.content = textArea.value;
      document.body.removeChild(overlay);
      document.body.removeChild(popup);
      this.updateNoteElementContent();
      this.notesManager.saveNotesToLocalStorage();
    });

    popup.appendChild(closeButton);
    popup.appendChild(titleArea);
    popup.appendChild(textArea);
    popup.appendChild(saveButton);

    document.body.appendChild(overlay);
    document.body.appendChild(popup);
  }

  updateNoteElementContent() {
    // Update the content in the note element
    const contentDiv = this.element.querySelector(".content-div");
    const titleDiv = this.element.querySelector(".title-div");

    if (contentDiv) {
      contentDiv.innerText = this.content;
    }

    if (titleDiv) {
      titleDiv.innerText = this.title;
    }
  }
}
