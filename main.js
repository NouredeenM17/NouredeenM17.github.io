// This event listener ensures that the code inside it runs
// after the HTML content has been fully loaded and parsed.
document.addEventListener('DOMContentLoaded', init);
var notes_manager;

  function init(){
        // Select all elements with the class 'column' and store them in the 'columns' variable
        const columns = document.querySelectorAll('.column');
        
        // Iterate over each column.
        columns.forEach(column => {
          
          column.addEventListener('dragover', function (e) {
            // Prevent the default behavior of the browser when a dragged element is over the column
            e.preventDefault();
          });
      
          column.addEventListener('drop', function (e) {
            // Prevent the default behavior of the browser when a dragged element is dropped on the column
            e.preventDefault();
            
            // Retrieve the note ID that was set during the dragstart event
            const noteId = e.dataTransfer.getData('text/plain');
            
            // Get the note object using the note ID
            const note = notes_manager.getNoteById(noteId);
      
            // Append the note element to the column where it was dropped
            column.appendChild(note.element);
          });
        });
      
        // Initializing notes manager object
        notes_manager = new NotesManager();

        // Add a default note
        var default_note = notes_manager.createNote("This is a note!");
        addNoteToColumn(default_note,'column1');
      }

      // Function to add a note to a specified column
      function addNoteToColumn(note ,columnId) {
        
        // Get the column element using the specified ID
        const column = document.getElementById(columnId);
        
      // Append the note element to the specified column
        column.appendChild(note.element);
      }

      // Function to open the popup for a specific column.
      function openNewNotePopup(columnId) {
        
        // Create popup element
        const popup = document.createElement('div');
        popup.classList.add('popup');
        
        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'X';
        closeButton.addEventListener('click', function () {
          document.body.removeChild(popup);
        });
    
        // Create text area element
        const textarea = document.createElement('textarea');

        // Create save button element
        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.addEventListener('click', () => {
          content = textarea.value;
          var newNote = notes_manager.createNote(content);
          document.body.removeChild(popup);
          addNoteToColumn(newNote, columnId);
        });
    
        popup.appendChild(closeButton);
        popup.appendChild(textarea);
        popup.appendChild(saveButton);
    
        document.body.appendChild(popup);
      }
  