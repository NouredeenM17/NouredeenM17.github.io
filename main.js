// This event listener ensures that the code inside it runs
// after the HTML content has been fully loaded and parsed.
document.addEventListener('DOMContentLoaded', init);

  function init(){
        const columns = document.querySelectorAll('.column');
        // Select all elements with the class 'column' and store them in the 'columns' variable.
      
        columns.forEach(column => {
          // Iterate over each column.
      
          column.addEventListener('dragover', function (e) {
            e.preventDefault();
            // Prevent the default behavior of the browser when a dragged element is over the column.
          });
      
          column.addEventListener('drop', function (e) {
            e.preventDefault();
            // Prevent the default behavior of the browser when a dragged element is dropped on the column.
      
            const noteId = e.dataTransfer.getData('text/plain');
            // Retrieve the data (note ID) that was set during the dragstart event.
      
            const note = notes_manager.getNoteById(noteId);
            // Get the note element using the retrieved ID.
      
            column.appendChild(note.element);
            // Append the note to the column where it was dropped.

            const addButton = column.querySelector('.add-button');
            addButton.addEventListener('click', function () {
            openNewNotePopup(column.id);
            });
          });
        });
      
        // Initializing notes manager object
        const notes_manager = new NotesManager();

        // Add a default note
        var test_note = notes_manager.createNote("This is a note!");
        addNoteToColumn(test_note,'column1');
      }

      function addNoteToColumn(note ,columnId) {
        // Function to add a new note to a specified column.
    
        const column = document.getElementById(columnId);
        // Get the column element using the specified ID.
    
        column.appendChild(note.element);
        // Append the note to the specified column.
      }

      function openNewNotePopup(columnId) {
        // Function to open the popup for a specific column.
    
        const popup = document.createElement('div');
        popup.classList.add('popup');
    
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.addEventListener('click', function () {
          document.body.removeChild(popup);
        });
    
        const popupContent = document.createElement('div');
        popupContent.innerText = `Add a note to ${columnId}`;
    
        popup.appendChild(closeButton);
        popup.appendChild(popupContent);
    
        document.body.appendChild(popup);
      }
  