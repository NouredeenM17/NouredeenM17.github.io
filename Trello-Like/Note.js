class Note {
    constructor(content, columnId, notes_manager) {
      this.id = `note-${Date.now()}`;
      this.content = content || '';
      this.dateCreated = new Date();
      this.notes_manager = notes_manager;
      this.columnId = columnId || '';
      this.element = this.createNoteElement();
    }
  
    // Creates the HTML element of the note
    createNoteElement() {
      const note = document.createElement('div');
      note.classList.add('note');
      note.setAttribute('draggable', 'true');
      note.setAttribute('id', this.id);
      note.addEventListener('dragstart', this.handleDragStart.bind(this));

      // Create the delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.addEventListener('click', this.deleteNote.bind(this));

      // Create the edit button
      const editButton = document.createElement('button');
      editButton.innerText = 'Edit';
      editButton.addEventListener('click', this.openNotePopup.bind(this));

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content-div');
      contentDiv.innerText = this.content;
  
      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date-created');
      dateDiv.innerText = `Created on: ${this.formatDate(this.dateCreated)}`;

      note.appendChild(deleteButton);
      note.appendChild(editButton);
      note.appendChild(contentDiv);
      note.appendChild(dateDiv);
  
      return note;
    }

    serialize() {
      // Convert the Note instance to a plain object for storage
      return {
        id: this.id,
        content: this.content,
        dateCreated: this.dateCreated,
        columnId: this.columnId,
      };
    }
  
    deleteNote() {
      // Remove the note element from the DOM
      this.element.parentNode.removeChild(this.element);

      // Remove the note from the notes_manager
      this.notes_manager.removeNoteById(this.id);
    }

    handleDragStart(e) {
      e.dataTransfer.setData('text/plain', this.id);
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
      const popup = document.createElement('div');
      popup.classList.add('popup');
      
      // Create the close button
      const closeButton = document.createElement('button');
      closeButton.innerText = 'X';
      closeButton.addEventListener('click', function () {
        document.body.removeChild(popup);
      });
  
      // Create text area element and place current content
      const textarea = document.createElement('textarea');
      textarea.classList.add('text-editor');
      textarea.value = this.content;

      // Create save button element
      const saveButton = document.createElement('button');
      saveButton.innerText = 'Save';
      
      saveButton.addEventListener('click', () => {
        this.content = textarea.value;
        document.body.removeChild(popup);
        this.updateNoteElementContent();
        notes_manager.saveToLocalStorage();
      });
  
      popup.appendChild(closeButton);
      popup.appendChild(textarea);
      popup.appendChild(saveButton);
  
      document.body.appendChild(popup);
    }

    updateNoteElementContent() {
      // Update the content in the note element
      const contentDiv = this.element.querySelector('.content-div');
      
      if (contentDiv) {
        contentDiv.innerText = this.content;
      }
    }

  }
  