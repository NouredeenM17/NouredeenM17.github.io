// This class is responsible for creating notes and managing them all
class NotesManager {
    constructor() {
      this.notes = [];
    }
  
    // Creates a new node, adds it to the note array and returns it
    createNote(content) {
      const note = new Note(content);
      this.notes.push(note);
      return note;
    }

    // Searches for a note with the specified note ID 
    getNoteById(noteId) {
      return this.notes.find(note => note.id === noteId);
    }
  }
  