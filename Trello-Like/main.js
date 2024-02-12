// This event listener ensures that the code inside it runs
// after the HTML content has been fully loaded and parsed.
document.addEventListener("DOMContentLoaded", init);
var notesManager;
var columnTitles;
var defaultColumnTitles = ["To do", "In Progress", "Done"];

function init() {
  // Initializing notes manager object
  notesManager = new NotesManager();

  // Builds the 4 columns
  buildColumns();

  //clearLocalStorage();
  //notesManager.loadNotesFromLocalStorage();
}

// Function to build columns
function buildColumns() {

  // Clear existing columns
  const existingColumns = document.querySelectorAll('.column');
  existingColumns.forEach(column => {
    document.body.removeChild(column);
  });
  const existingAddColumnButtons = document.querySelectorAll('.add-column-button');
  existingAddColumnButtons.forEach(button => {
    document.body.removeChild(button);
  });
  const existingDeleteColumnButtons = document.querySelectorAll('.delete-column-button');
  existingDeleteColumnButtons.forEach(button => {
    document.body.removeChild(button);
  });
  

  var body = document.body;

  const storedColumnTitles = localStorage.getItem('nt_column_titles');
  console.log(storedColumnTitles);
  columnTitles = storedColumnTitles ? JSON.parse(storedColumnTitles) : defaultColumnTitles;

  for (var i = 0; i < columnTitles.length; i++) {
    let column = document.createElement("div");
    column.id = "column" + (i + 1);
    column.className = "column";

    let editableTitle = document.createElement("div");
    editableTitle.className = "editable-header";

    let h3 = document.createElement("h3");
    h3.contentEditable = "false";
    h3.textContent = columnTitles[i];
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
      const note = notesManager.getNoteById(noteId);
      const newColumnId = column.id;

      // Update the note's columnId
      const noteInstance = notesManager.notes.find(
        (note) => note.id === noteId
      );
      if (noteInstance) {
        noteInstance.updateColumnId(newColumnId);
      }

      // Append the note element to the column where it was dropped
      column.appendChild(note.element);
      notesManager.saveNotesToLocalStorage();
    });

    setUpTitleEventListeners(h3, i);
  }

  // Add a single "Add" button on the far right
  var addColumnButton = document.createElement("button");
  addColumnButton.className = "add-column-button";
  addColumnButton.setAttribute("onclick", "addNewColumn()");
  addColumnButton.textContent = "+";
  document.body.appendChild(addColumnButton);

  // Add a single "Delete" button on the far right
  var deleteColumnButton = document.createElement("button");
  deleteColumnButton.className = "add-column-button";
  deleteColumnButton.setAttribute("onclick", `deleteColumn(${columnTitles.length-1})`);
  deleteColumnButton.textContent = "X";
  document.body.appendChild(deleteColumnButton);

  notesManager.loadNotesFromLocalStorage();
}

function addNewColumn () {
  // Add a new column title at the end
  columnTitles.push("Untitled");

  // Save the updated column titles to local storage
  localStorage.setItem('nt_column_titles', JSON.stringify(columnTitles));

  // Rebuild columns with the updated titles
  buildColumns();
  
}

function deleteColumn (index) {
  // Check if the column has notes
  const columnId = "column" + (index + 1);
  const column = document.getElementById(columnId);
  if (column && column.children.length > 2) {
    alert("Cannot delete a column with notes.");
    return;
  }

  if (index === 0) {
    alert("Cannot delete the first column.");
    return;
  }

  // Delete the column title at the specified index
  columnTitles.splice(index, 1);

  // Save the updated column titles to local storage
  localStorage.setItem('nt_column_titles', JSON.stringify(columnTitles));

  // Rebuild columns with the updated titles
  buildColumns();
}

function setUpTitleEventListeners(title, columnIndex){

  var isEditing;
  var tempValue;

  // Double-click event handler
  title.addEventListener("dblclick", () => {
    tempValue = title.textContent;
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

      columnTitles[columnIndex] = title.textContent;
      localStorage.setItem('nt_column_titles', JSON.stringify(columnTitles));

    } else if (event.key === "Escape") {
      title.contentEditable = false;
      isEditing = false;
      title.textContent = tempValue;
    }
  });

  // Click event handler for the entire document
  document.addEventListener('click', (event) => {
  if (isEditing && event.target !== title) {
      // Clicked outside the header while editing
      title.contentEditable = false;
      isEditing = false;

      columnTitles[columnIndex] = title.textContent;
      localStorage.setItem('nt_column_titles', JSON.stringify(columnTitles));
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
    var newNote = notesManager.createNote(content, columnId, title);
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

    localStorage.removeItem('nt_column_titles');
    console.log('Column names in local storage cleared.');
}
