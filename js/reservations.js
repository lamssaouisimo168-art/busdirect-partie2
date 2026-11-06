export const placesLibres = (trip) => trip.capacity - trip.reservations.length;

export const estComplet = (trip) => placesLibres(trip) === 0;

export const estVIP = (numero) => numero >= 1 && numero <= 4;

export const prixSiege = (prix, numero) => (estVIP(numero) ? Math.round(prix * 1.1) : prix);

export const recetteTrajet = (trip) =>
    trip.reservations.reduce((total, r) => total + prixSiege(trip.price, r.seat), 0);