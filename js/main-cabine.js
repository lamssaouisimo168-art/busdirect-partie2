import { chargerTrajets } from "./store.js";
import { placesLibres, recetteTrajet } from "./reservations.js";
import { planBus } from "./render.js";

const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

const infosTrajet = document.getElementById("infosTrajet");
const planBusEl = document.getElementById("planBus");
const contenuCabine = document.getElementById("contenuCabine");

let trajets = [];
let trip;

function afficherCabine() {
    const { departure, destination, departureTime, arrivalTime, price } = trip;

    infosTrajet.innerHTML = `
        <p class="text-xl">Trajet N°${String(trip.id).padStart(2, "0")} : ${departure} → ${destination}</p>
        <p>${departureTime} - ${arrivalTime} | ${price} DH</p>
        <p>Places libres : ${placesLibres(trip)} | Recette : ${recetteTrajet(trip)} DH</p>`;

    planBusEl.innerHTML = planBus(trip);
}

async function init() {
    trajets = await chargerTrajets();
    trip = trajets.find((t) => t.id === id);

    if (!trip) {
        infosTrajet.textContent = "Trajet introuvable";
        contenuCabine.classList.add("hidden");
        return;
    }

    afficherCabine();
}

init();