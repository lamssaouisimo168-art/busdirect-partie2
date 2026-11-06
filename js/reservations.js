export const placesLibres = (trip) => trip.capacity - trip.reservations.length;

export const estComplet = (trip) => placesLibres(trip) === 0;


export function retirerReservation(trip, siege) {
    const reservations = trip.reservations.filter((r) => r.seat !== siege);

    if (trip.waitingList.length === 0) {
        return { reservations, waitingList: trip.waitingList, attribue: null };
    }

    const [premier, ...reste] = trip.waitingList;

    return {
        reservations: [...reservations, { seat: siege, name: premier.name, phone: premier.phone }],
        waitingList: reste,
        attribue: { name: premier.name, seat: siege },
    };
}