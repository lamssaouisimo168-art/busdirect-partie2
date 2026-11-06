export const placesLibres = (trip) => trip.capacity - trip.reservations.length;

export const estComplet = (trip) => placesLibres(trip) === 0;

export const estVIP = (numero) => numero >= 1 && numero <= 4;

export const prixSiege = (prix, numero) => (estVIP(numero) ? Math.round(prix * 1.1) : prix);

export const recetteTrajet = (trip) =>
    trip.reservations.reduce((total, r) => total + prixSiege(trip.price, r.seat), 0);

export const siegesLibres = (trip) => {
    const occupes = trip.reservations.map((r) => r.seat);
    return Array.from({ length: trip.capacity }, (_, i) => i + 1).filter((n) => !occupes.includes(n));
};

export const premierSiegeLibreNonVIP = (trip) => {
    const libres = siegesLibres(trip);
    return libres.find((n) => !estVIP(n)) ?? libres[0];
};