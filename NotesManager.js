class NotesManager {
    constructor() {
      this.notes = [];
    }
  
    createNote(content) {
      const note = new Note(content);
      this.notes.push(note);
      return note;
    }
  
    getNoteById(noteId) {
      return this.notes.find(note => note.id === noteId);
    }
  }
  