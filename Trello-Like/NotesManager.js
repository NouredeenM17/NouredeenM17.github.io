// This class is responsible for creating notes and managing them all
class NotesManager {
    constructor() {
      this.notes = [];
    }
  
    // Creates a new note, adds it to the note array and returns it
    createNote(content, columnId) {
      const note = new Note(content, columnId, this);
      this.notes.push(note);
      this.saveToLocalStorage();
      return note;
    }

    // Searches for a note with the specified note ID 
    getNoteById(noteId) {
      return this.notes.find(note => note.id === noteId);
    }

    removeNoteById(id){
      this.notes = this.notes.filter(note => note.id !== id);
      this.saveToLocalStorage();
    }
    
    // Save notes to local storage
  saveToLocalStorage() {
    const serializedNotes = this.notes.map(note => note.serialize());
    localStorage.setItem('notes', JSON.stringify(serializedNotes));
  }

  // Load notes from local storage
  loadFromLocalStorage() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      const parsedNotes = JSON.parse(storedNotes);
      this.notes = parsedNotes.map(noteData => {
        const note = new Note();
        Object.assign(note, noteData);
        note.notes_manager = this;
        return note;
      });
      this.attachNotesToColumns();
    } else {
      this.buildDefaultNotes();
    }
  }

  buildDefaultNotes(){
    this.createNoteWithDelay("This is a task I want to do.", 'column1', 0);
    this.createNoteWithDelay("Still figuring this out..", 'column2', 150);
    this.createNoteWithDelay("I am currently doing this task.", 'column3', 300);
    this.createNoteWithDelay("I just finished this task!", 'column4', 450);
  }

  createNoteWithDelay(content, columnId, delay){
    setTimeout(()=> {
      var note = this.createNote(content,columnId);
      const column = document.getElementById(columnId);
      column.appendChild(note.element);
    }, delay);
  }

  attachNotesToColumns(){
    notes_manager.notes.forEach(note => {
      console.log(note);

      const column = document.getElementById(note.columnId);
      if (column) {
        // Recreate the note element based on the stored data
        note.element = note.createNoteElement();
        column.appendChild(note.element);
      } else {
        console.error(`Column with ID '${note.columnId}' not found.`);
      }
    });
  }
}
  