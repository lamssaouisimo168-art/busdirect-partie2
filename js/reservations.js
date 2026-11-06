export const placesLibres = (trip) => trip.capacity - trip.reservations.length;

export const estComplet = (trip) => placesLibres(trip) === 0;