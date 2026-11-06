import { placesLibres, estComplet, estVIP, prixSiege } from "./reservations.js";

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

function echapper(texte) {
    return String(texte).replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
}

function siegeHTML(trip, numero) {
    const reservation = trip.reservations.find((r) => r.seat === numero);
    const num = String(numero).padStart(2, "0");
    const vip = estVIP(numero);
    const badgeVIP = vip
        ? ` <span class="bg-yellow-600 text-white rounded px-1 text-xs">VIP</span>`
        : "";
    const base = "rounded-xl border-2 p-2 text-center text-xs sm:text-sm font-bold break-words";

    if (reservation) {
        return `<div data-seat="${numero}" class="bg-red-500 text-white ${base}">
            ${num}${badgeVIP}<br>${echapper(reservation.name)}
        </div>`;
    }

    const couleur = vip ? "bg-amber-300" : "bg-green-400";
    return `<div data-seat="${numero}" class="${couleur} ${base}">
        ${num}${badgeVIP}<br>${prixSiege(trip.price, numero)} DH
    </div>`;
}

export function planBus(trip) {
    const rangs = Math.ceil(trip.capacity / 4);
    let html = "";

    for (let rang = 0; rang < rangs; rang++) {
        const base = rang * 4;
        html += `<div class="grid grid-cols-[1fr_1fr_0.4fr_1fr_1fr] gap-2 mb-2">
            ${siegeHTML(trip, base + 1)}
            ${siegeHTML(trip, base + 2)}
            <div aria-hidden="true"></div>
            ${siegeHTML(trip, base + 3)}
            ${siegeHTML(trip, base + 4)}
        </div>`;
    }

    return html;
}