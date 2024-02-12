// This event listener ensures that the code inside it runs
// after the HTML content has been fully loaded and parsed.
document.addEventListener("DOMContentLoaded", init);
var notes_manager;
var column_titles = ["To do", "In Progress", "Done"];

function init() {
  // Builds the 4 columns
  buildColumns();

  // Initializing notes manager object
  notes_manager = new NotesManager();

  clearLocalStorage();
  notes_manager.loadNotesFromLocalStorage();
}

// Function to build columns
function buildColumns() {
  var body = document.body;

  for (var i = 0; i < column_titles.length; i++) {
    let column = document.createElement("div");
    column.id = "column" + (i + 1);
    column.className = "column";

    let editableTitle = document.createElement("div");
    editableTitle.className = "editable-header";

    let h3 = document.createElement("h3");
    h3.contentEditable = "false";
    h3.textContent = column_titles[i];
    editableTitle.appendChild(h3);
    column.appendChild(editableTitle);

    let button = document.createElement("button");
    button.className = "add-button";
    button.setAttribute("onclick", "openNewNotePopup('column" + (i + 1) + "')");
    button.textContent = "+";
    column.appendChild(button);

    body.appendChild(column);

    column.addEventListener("dragover", function (e) {
      // Prevent the default behavior of the browser when a dragged element is over the column
      e.preventDefault();
    });

    column.addEventListener("drop", function (e) {
      // Prevent the default behavior of the browser when a dragged element is dropped on the column
      e.preventDefault();

      // Retrieve the note ID that was set during the dragstart event
      const noteId = e.dataTransfer.getData("text/plain");
      const note = notes_manager.getNoteById(noteId);
      const newColumnId = column.id;

      // Update the note's columnId
      const noteInstance = notes_manager.notes.find(
        (note) => note.id === noteId
      );
      if (noteInstance) {
        noteInstance.updateColumnId(newColumnId);
      }

      // Append the note element to the column where it was dropped
      column.appendChild(note.element);
      notes_manager.saveNotesToLocalStorage();
    });

    setUpTitleEventListeners(h3);
  }
}

function setUpTitleEventListeners(title){

  var isEditing;

  // Double-click event handler
  title.addEventListener("dblclick", () => {
    title.contentEditable = true;
    title.focus(); // Set focus to the header for editing
    isEditing = true;
  });

  // Keydown event handler
  title.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent line break
      title.contentEditable = false;
      isEditing = false;
    }
  });

  // Click event handler for the entire document
  document.addEventListener('click', (event) => {
  if (isEditing && event.target !== title) {
      // Clicked outside the header while editing
      title.contentEditable = false;
      isEditing = false;
    }
  });
}

// Function to add a note to a specified column
function addNoteToColumn(note, columnId) {
  // Get the column element using the specified ID
  const column = document.getElementById(columnId);

  // Append the note element to the specified column
  column.appendChild(note.element);
}

// Function to open the popup for a specific column.
function openNewNotePopup(columnId) {
  // Create popup element
  const popup = document.createElement("div");
  popup.classList.add("popup");

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.innerText = "X";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(popup);
  });

  // Create title area element
  const titleArea = document.createElement("textarea");
  titleArea.classList.add("title-editor");

  // Create text area element
  const contentArea = document.createElement("textarea");
  contentArea.classList.add("text-editor");

  // Create save button element
  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.addEventListener("click", () => {
    content = contentArea.value;
    title = titleArea.value;
    var newNote = notes_manager.createNote(content, columnId, title);
    document.body.removeChild(popup);
    addNoteToColumn(newNote, columnId);
  });

  popup.appendChild(closeButton);
  popup.appendChild(titleArea);
  popup.appendChild(contentArea);
  popup.appendChild(saveButton);

  document.body.appendChild(popup);
}

function clearLocalStorage() {
  localStorage.removeItem("nt_notes");
  console.log("Local storage for notes cleared.");
}
