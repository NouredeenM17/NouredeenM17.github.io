// This class is responsible for creating notes and managing them all, and managing their column names
class NotesManager {
  constructor() {
    this.notes = [];
  }

  // Creates a new note, adds it to the note array and returns it
  createNote(content, columnId, title) {
    const note = new Note(content, columnId, this, title);
    this.notes.push(note);
    this.saveNotesToLocalStorage();
    return note;
  }

  // Searches for a note with the specified note ID
  getNoteById(noteId) {
    return this.notes.find((note) => note.id === noteId);
  }

  removeNoteById(id) {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.saveNotesToLocalStorage();
  }

  buildDefaultNotes() {
    this.createNoteWithDelay("This is a task I want to do.", "Lorem Ipsum", "column1", 0);
    this.createNoteWithDelay("I am currently doing this task.", "Lorem Ipsum", "column2", 300);
    this.createNoteWithDelay("I just finished this task!", "Lorem Ipsum", "column3", 450);
  }

  createNoteWithDelay(title, content, columnId, delay) {
    setTimeout(() => {
      var note = this.createNote(content, columnId, title);
      const column = document.getElementById(columnId);
      column.appendChild(note.element);
    }, delay);
  }

  attachNotesToColumns() {
    this.notes.forEach((note) => {
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

  saveNotesToLocalStorage () {
    const serializedNotes = this.notes.map((note) => note.serialize());
    localStorage.setItem("nt_notes", JSON.stringify(serializedNotes));
  }

  loadNotesFromLocalStorage () {
    const storedNotes = localStorage.getItem("nt_notes");
    if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        this.notes = parsedNotes.map((noteData) => {
            const note = new Note();
            Object.assign(note, noteData);
            note.this = this;
            return note;
        });
        this.attachNotesToColumns();
    } else {
      this.buildDefaultNotes();
    }
  }
}
