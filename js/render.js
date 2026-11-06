import { placesLibres, estComplet } from "./reservations.js";

export function carteTrajet(trip) {
    const { id, departure, destination, departureTime, arrivalTime, price, waitingList } = trip;
    const complet = estComplet(trip);

    const badge = complet
        ? `<span class="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm">Complet</span>`
        : `<span class="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">Disponible</span>`;

    return `
    <article class="bg-[#D3C0B2] rounded-2xl shadow-lg p-5 flex flex-col items-center gap-3 border-t-4 border-[#C35627] hover:shadow-2xl transition">
        <h3 class="text-xl font-extrabold text-[#C35627]">Trajet N°${String(id).padStart(2, "0")}</h3>
        <p class="text-lg font-bold text-gray-800">${departure} → ${destination}</p>
        <p class="text-gray-700">${departureTime} - ${arrivalTime}</p>
        <p class="text-lg font-bold">${price} DH</p>
        <p class="text-gray-700">Places libres : ${placesLibres(trip)}</p>
        <p class="text-gray-700">En attente : ${waitingList.length}</p>
        ${badge}
        <button type="button" data-id="${id}" class="bg-[#C35627] text-white font-bold rounded-xl px-8 py-3 hover:bg-[#A94720] transition shadow-md cursor-pointer">
            Ouvrir
        </button>
    </article>`;
}

export function optionsPassagers(trip) {
    return [...trip.reservations]
        .sort((a, b) => a.seat - b.seat)
        .map(
            (r) =>
                `<option value="${r.seat}">Siège ${String(r.seat).padStart(2, "0")} — ${echapper(r.name)}</option>`
        )
        .join("");
}

export function listeAttenteHTML(trip) {
    if (trip.waitingList.length === 0) {
        return `<li class="text-gray-600">Aucun passager en attente.</li>`;
    }

    return trip.waitingList
        .map(
            (p, index) => `
        <li class="flex items-center justify-between gap-2 bg-[#CCDCDB] rounded-xl p-3">
            <span class="font-semibold">${index + 1}. ${echapper(p.name)} — ${echapper(p.phone)}</span>
            <button type="button" data-index="${index}" class="bg-red-600 text-white font-bold rounded-lg px-3 py-1 hover:bg-red-700 transition">Retirer</button>
        </li>`
        )
        .join("");
}