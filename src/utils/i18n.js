// Locale is read once from the browser at load — no manual switcher, per
// product decision (system language decides IT vs EN, nothing else).
export const locale = (typeof navigator !== 'undefined' && navigator.language || 'en')
  .toLowerCase()
  .startsWith('it')
  ? 'it'
  : 'en';

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale;
}

const strings = {
  'home.title': { it: 'I tuoi viaggi', en: 'Your trips' },
  'home.subtitle': {
    it: 'Crea un viaggio, condividi il link, decidete insieme dove stare.',
    en: 'Create a trip, share the link, decide together where to stay.',
  },
  'home.newTrip': { it: 'Nuovo viaggio', en: 'New trip' },
  'home.empty': {
    it: 'Nessun viaggio ancora. Creane uno e invita il gruppo.',
    en: 'No trips yet. Create one and invite the group.',
  },
  'home.nameLabel': { it: 'Nome del viaggio', en: 'Trip name' },
  'home.namePlaceholder': { it: 'Es. Grecia agosto 2026', en: 'E.g. Greece August 2026' },
  'home.dateFrom': { it: 'Dal', en: 'From' },
  'home.dateTo': { it: 'Al', en: 'To' },
  'home.creating': { it: 'Creo il viaggio…', en: 'Creating trip…' },
  'home.create': { it: 'Crea viaggio', en: 'Create trip' },

  'trip.notFoundTitle': { it: 'Viaggio non trovato', en: 'Trip not found' },
  'trip.notFoundBody': {
    it: 'Il link potrebbe essere sbagliato o il viaggio è stato rimosso.',
    en: 'The link might be wrong, or the trip was removed.',
  },
  'trip.change': { it: 'Cambia', en: 'Switch' },
  'trip.backToList': { it: 'Torna ai viaggi', en: 'Back to trips' },
  'trip.places': { it: 'Luoghi', en: 'Places' },
  'trip.people': { it: 'Persone', en: 'People' },

  'tripMenu.aria': { it: 'Opzioni viaggio', en: 'Trip options' },
  'tripMenu.rename': { it: 'Modifica', en: 'Edit' },
  'tripMenu.delete': { it: 'Elimina', en: 'Delete' },
  'tripMenu.renameTitle': { it: 'Modifica viaggio', en: 'Edit trip' },
  'tripMenu.renaming': { it: 'Salvo…', en: 'Saving…' },
  'tripMenu.renameSubmit': { it: 'Salva', en: 'Save' },
  'tripMenu.deleteTitle': { it: 'Elimina viaggio', en: 'Delete trip' },
  'tripMenu.deleteWarning': {
    it: 'Il viaggio, i suoi luoghi e i voti verranno eliminati per tutti. Non si può annullare.',
    en: "The trip, its places, and its votes will be deleted for everyone. This can't be undone.",
  },
  'tripMenu.deleteConfirmLabel': {
    it: 'Digita "{{name}}" per confermare',
    en: 'Type "{{name}}" to confirm',
  },
  'tripMenu.deleting': { it: 'Elimino…', en: 'Deleting…' },
  'tripMenu.deleteSubmit': { it: 'Elimina definitivamente', en: 'Delete permanently' },

  'places.cancel': { it: 'Annulla', en: 'Cancel' },
  'places.addPlace': { it: 'Aggiungi luogo', en: 'Add place' },
  'places.empty': {
    it: 'Nessun alloggio o luogo ancora. Aggiungi il primo candidato.',
    en: 'No stays or places yet. Add the first candidate.',
  },
  'places.topVoted': { it: 'Più votato', en: 'Top voted' },
  'places.sectionStays': { it: 'Alloggi', en: 'Stays' },
  'places.sectionPois': { it: 'Punti di interesse', en: 'Points of interest' },
  'places.openLink': { it: 'Apri link', en: 'Open link' },
  'places.removeConfirm': {
    it: 'Rimuovere "{{title}}" dal viaggio?',
    en: 'Remove "{{title}}" from the trip?',
  },
  'places.removeAria': { it: 'Rimuovi {{title}}', en: 'Remove {{title}}' },
  'places.editAria': { it: 'Modifica {{title}}', en: 'Edit {{title}}' },
  'places.editTitle': { it: 'Modifica luogo', en: 'Edit place' },
  'places.editSubmit': { it: 'Salva', en: 'Save' },
  'places.editSaving': { it: 'Salvo…', en: 'Saving…' },

  'people.empty': { it: 'Ancora nessuno in questo viaggio.', en: 'No one in this trip yet.' },
  'people.placeholder': { it: 'Aggiungi una persona al viaggio', en: 'Add a person to the trip' },
  'people.add': { it: 'Aggiungi', en: 'Add' },
  'people.you': { it: 'Tu', en: 'You' },

  'addPlace.stay': { it: 'Alloggio', en: 'Stay' },
  'addPlace.poi': { it: 'Punto di interesse', en: 'Point of interest' },
  'addPlace.typeAria': { it: 'Tipo di luogo', en: 'Place type' },
  'addPlace.nameLabel': { it: 'Nome', en: 'Name' },
  'addPlace.namePlaceholderStay': {
    it: 'Es. Appartamento centro storico',
    en: 'E.g. Old-town apartment',
  },
  'addPlace.namePlaceholderPoi': { it: 'Es. Spiaggia della Pelosa', en: 'E.g. Pelosa Beach' },
  'addPlace.priceLabel': { it: 'Prezzo (opzionale)', en: 'Price (optional)' },
  'addPlace.linkLabel': { it: 'Link (opzionale)', en: 'Link (optional)' },
  'addPlace.linkPlaceholder': { it: 'Airbnb, Booking, sito…', en: 'Airbnb, Booking, website…' },
  'addPlace.source.airbnb': { it: 'Link Airbnb riconosciuto', en: 'Airbnb link detected' },
  'addPlace.source.booking': { it: 'Link Booking riconosciuto', en: 'Booking link detected' },
  'addPlace.whereLabel': { it: 'Dove si trova', en: 'Where it is' },
  'addPlace.searchPlaceholder': { it: 'Cerca un indirizzo…', en: 'Search an address…' },
  'addPlace.searching': { it: 'Cerco…', en: 'Searching…' },
  'addPlace.pickOnMap': { it: 'Oppure scegli sulla mappa', en: 'Or pick on the map' },
  'addPlace.pickOnMapActive': { it: 'Tocca un punto sulla mappa…', en: 'Tap a spot on the map…' },
  'addPlace.submitting': { it: 'Aggiungo…', en: 'Adding…' },
  'addPlace.submit': { it: 'Aggiungi al viaggio', en: 'Add to trip' },
  'addPlace.hint': {
    it: 'Scegli chi sei qui sopra per poter aggiungere un luogo.',
    en: 'Pick who you are above to add a place.',
  },

  'identity.title': { it: 'Chi sei tu in questo viaggio?', en: 'Who are you on this trip?' },
  'identity.subtitle': {
    it: 'Scegli il tuo nome per aggiungere luoghi e votare. Serve solo su questo dispositivo.',
    en: 'Pick your name to add places and vote. Only used on this device.',
  },
  'identity.ariaLabel': { it: 'Scegli chi sei', en: 'Pick who you are' },
  'identity.namePlaceholder': {
    it: 'Non ci sei ancora? Scrivi il tuo nome',
    en: "Not here yet? Type your name",
  },
  'identity.nameAria': { it: 'Il tuo nome', en: 'Your name' },
  'identity.claim': { it: 'Sono io', en: "That's me" },

  'vote.hint': { it: 'Scegli chi sei per votare', en: 'Pick who you are to vote' },

  'modal.close': { it: 'Chiudi', en: 'Close' },

  'datePicker.prevMonth': { it: 'Mese precedente', en: 'Previous month' },
  'datePicker.nextMonth': { it: 'Mese successivo', en: 'Next month' },
  'datePicker.placeholder': { it: 'Seleziona data', en: 'Select date' },

  'errors.createTrip': {
    it: 'Non riesco a creare il viaggio. Controlla la connessione e riprova.',
    en: "Can't create the trip. Check your connection and try again.",
  },
  'errors.renameTrip': {
    it: 'Non riesco a rinominare il viaggio. Controlla la connessione e riprova.',
    en: "Can't rename the trip. Check your connection and try again.",
  },
  'errors.deleteTrip': {
    it: 'Non riesco a eliminare il viaggio. Controlla la connessione e riprova.',
    en: "Can't delete the trip. Check your connection and try again.",
  },
  'errors.addPerson': {
    it: 'Non riesco ad aggiungere la persona. Controlla la connessione e riprova.',
    en: "Can't add the person. Check your connection and try again.",
  },
  'errors.addPlace': {
    it: 'Non riesco ad aggiungere il luogo. Controlla la connessione e riprova.',
    en: "Can't add the place. Check your connection and try again.",
  },
  'errors.deletePlace': {
    it: 'Non riesco a rimuovere il luogo. Controlla la connessione e riprova.',
    en: "Can't remove the place. Check your connection and try again.",
  },
  'errors.editPlace': {
    it: 'Non riesco a salvare le modifiche. Controlla la connessione e riprova.',
    en: "Can't save the changes. Check your connection and try again.",
  },
  'errors.vote': {
    it: 'Non riesco a salvare il voto. Controlla la connessione e riprova.',
    en: "Can't save the vote. Check your connection and try again.",
  },
};

export function t(key, vars) {
  const entry = strings[key];
  let str = entry ? entry[locale] : key;
  if (vars) {
    for (const name in vars) str = str.replace(`{{${name}}}`, vars[name]);
  }
  return str;
}
