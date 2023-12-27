class Note {
    constructor(content) {
      this.id = `note-${Date.now()}`;
      this.content = content || '';
      this.dateCreated = new Date();
      this.element = this.createNoteElement();
    }
  
    createNoteElement() {
      const note = document.createElement('div');
      note.classList.add('note');
      note.setAttribute('draggable', 'true');
      note.setAttribute('id', this.id);
      note.addEventListener('dragstart', this.handleDragStart.bind(this));
  
      const contentDiv = document.createElement('div');
      contentDiv.innerText = this.content;
  
      const dateDiv = document.createElement('div');
      dateDiv.innerText = `Created on: ${this.formatDate(this.dateCreated)}`;
  
      note.appendChild(contentDiv);
      note.appendChild(dateDiv);
  
      return note;
    }
  
    handleDragStart(e) {
      e.dataTransfer.setData('text/plain', this.id);
    }
  
    formatDate(date) {
      // Add your date formatting logic here
      return date.toLocaleString();
    }

    getNodeObject(node_id){
      return
    }
  }
  