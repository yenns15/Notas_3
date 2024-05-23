document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
  
    function deleteNote(_id) {
        console.log(_id);
        if (!_id || typeof _id !== 'string' || _id.length !== 24) {
            console.error("Invalid _id provided: ", _id);
            return;
        }
        fetch(`https://localhost:7061/api/notes/${_id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete note');
            }
            console.log('Note deleted successfully');
            // Eliminar la nota del DOM
            $(`#ct .note-item[data-note-id="${_id}"]`).remove();
        })
        .catch(error => console.error('Error deleting note:', error));
        
        
    }
    
    
    // Evento para eliminar una nota al hacer clic en el botón de eliminar
    $(".delete-note").off('click').on('click', function(event) {
        event.stopPropagation();
        const _id = $(this).attr('data-note-id'); // Obtener el _id de la nota
        if (_id && _id.length === 24) { // Asegurarse de que _id sea un string de 24 caracteres
            deleteNote(_id); // Llamar a la función para eliminar la nota del servidor
        } else {
            console.error("Invalid _id provided: ", _id);
        }
    });
    





  function favNote() {
      $(".fav-note").off('click').on('click', function(event) {
          event.stopPropagation();
          $(this).parents('.note-item').toggleClass('note-fav');
      });
  }

  function addLabelGroups() {
      $('.tags-selector .label-group-item').off('click').on('click', function(event) {
          event.preventDefault();
          /* Act on the event */
          var getclass = this.className;
          var getSplitclass = getclass.split(' ')[0];
          if ($(this).hasClass('label-personal')) {
              $(this).parents('.note-item').removeClass('note-social');
              $(this).parents('.note-item').removeClass('note-work');
              $(this).parents('.note-item').removeClass('note-important');
              $(this).parents('.note-item').toggleClass(getSplitclass);
          } else if ($(this).hasClass('label-work')) {
              $(this).parents('.note-item').removeClass('note-personal');
              $(this).parents('.note-item').removeClass('note-social');
              $(this).parents('.note-item').removeClass('note-important');
              $(this).parents('.note-item').toggleClass(getSplitclass);
          } else if ($(this).hasClass('label-social')) {
              $(this).parents('.note-item').removeClass('note-personal');
              $(this).parents('.note-item').removeClass('note-work');
              $(this).parents('.note-item').removeClass('note-important');
              $(this).parents('.note-item').toggleClass(getSplitclass);
          } else if ($(this).hasClass('label-important')) {
              $(this).parents('.note-item').removeClass('note-personal');
              $(this).parents('.note-item').removeClass('note-social');
              $(this).parents('.note-item').removeClass('note-work');
              $(this).parents('.note-item').toggleClass(getSplitclass);
          }
      });
  }

  $('.hamburger').on('click', function(event) {
      $('.app-note-container').find('.tab-title').toggleClass('note-menu-show');
      $('.app-note-container').find('.app-note-overlay').toggleClass('app-note-overlay-show');
  });
  $('.app-note-overlay').on('click', function(e) {
      $(this).parents('.app-note-container').children('.tab-title').removeClass('note-menu-show');
      $(this).removeClass('app-note-overlay-show');
  });
  $('.tab-title .nav-pills a.nav-link').on('click', function(event) {
      $(this).parents('.app-note-container').find('.tab-title').removeClass('note-menu-show');
      $(this).parents('.app-note-container').find('.app-note-overlay').removeClass('app-note-overlay-show');
  });

  var $btns = $('.list-actions').click(function() {
      if (this.id == 'all-notes') {
          var $el = $('.' + this.id).fadeIn();
          $('#ct > div').not($el).hide();
      }
      if (this.id == 'important') {
          var $el = $('.' + this.id).fadeIn();
          $('#ct > div').not($el).hide();
      } else {
          var $el = $('.' + this.id).fadeIn();
          $('#ct > div').not($el).hide();
      }
      $btns.removeClass('active');
      $(this).addClass('active');
  });

  function loadNotes() {
    fetch('https://localhost:7061/api/Notes')
    .then(response => response.json())
    .then(notes => {
        console.log(notes);
        // Iteramos sobre las notas y las actualizamos en el contenedor
        notes.forEach(note => {
            const id = note.id.$oid;
            const existingNote = $(`#ct .note-item[data-note-id="${note.id}"]`);
            if (existingNote.length > 0) {
                // La nota ya existe, actualizamos su contenido
                existingNote.find('.note-title').text(note.title);
                existingNote.find('.note-description').text(note.content);
            } else {
                // La nota no existe, la agregamos al contenedor al principio
                const html = `
                <div class="note-item all-notes" data-note-id="${note.id}">
                    <div class="note-inner-content">
                        <div class="note-content">
                            <p class="note-title">${note.title}</p>
                            <p class="meta-time">${note.createdAt}</p>
                            <div class="note-description-content">
                                <p class="note-description">${note.content}</p>
                            </div>
                            <svg class="feather feather-trash-2 delete-note" data-note-id="${note.id}"></svg>
                        </div>
                        <div class="note-action">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star fav-note"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 delete-note" data-note-id="${note.id}"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </div>
                        <div class="note-footer">
                            <div class="tags-selector btn-group">
                                <a class="nav-link dropdown-toggle d-icon label-group" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="true">
                                    <span>
                                        <div class="tags">
                                            <div class="g-dot-personal"></div>
                                            <div class="g-dot-work"></div>
                                            <div class="g-dot-social"></div>
                                            <div class="g-dot-important"></div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                        </div>
                                    </span>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right d-icon-menu">
                                    <a class="note-personal label-group-item label-personal dropdown-item position-relative g-dot-personal" href="javascript:void(0);"> Personal</a>
                                    <a class="note-work label-group-item label-work dropdown-item position-relative g-dot-work" href="javascript:void(0);"> Work</a>
                                    <a class="note-social label-group-item label-social dropdown-item position-relative g-dot-social" href="javascript:void(0);"> Social</a>
                                    <a class="note-important label-group-item label-important dropdown-item position-relative g-dot-important" href="javascript:void(0);"> Important</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
                const noteElement = $(html); // Create a jQuery object for the note element
                noteElement.find('.delete-note').off('click').on('click', function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    const _id = $(this).data('note-id');
                    deleteNote(_id);
                });
                $('#ct').prepend(noteElement); // Agregar la nota al principio del contenedor
                favNote();
                addLabelGroups();
            }
        });
    })
    .catch(error => console.error('Error loading notes:', error));
}

function addNote(title, description) {
    fetch('https://localhost:7061/api/Notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 'string', title: title, content: description })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("Note added successfully!");
        document.getElementById('n-title').value = '';
        document.getElementById('n-description').value = '';
        $('#notesMailModal').modal('hide');
        // Agregar la nueva nota al contenedor al principio
        loadNotes(); // Nota: esto debería ser suficiente para mostrar la nueva nota sin recargar la página
    })
    .catch(error => console.error('Error adding note:', error));
}





  $('#btn-add-notes').on('click', function(event) {
      $('#notesMailModal').modal('show');
      $('#btn-n-save').hide();
      $('#btn-n-add').show();
  });

  $('#btn-n-add').on('click', function(event) {
      const title = $('#n-title').val();
      const description = $('#n-description').val();
      addNote(title, description);
      event.preventDefault();
  });
});
