import { chargerTrajets, sauvegarder } from "./store.js";
import { placesLibres, recetteTrajet, estComplet, premierSiegeLibreNonVIP } from "./reservations.js";
import { planBus, optionsSieges } from "./render.js";
import { validerPassager, estValide } from "./validators.js";

const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

const infosTrajet = document.getElementById("infosTrajet");
const planBusEl = document.getElementById("planBus");
const contenuCabine = document.getElementById("contenuCabine");

const formReserver = document.getElementById("formReserver");
const fieldsetReserver = document.getElementById("fieldsetReserver");
const nomReserver = document.getElementById("nomReserver");
const telReserver = document.getElementById("telReserver");
const siegeReserver = document.getElementById("siegeReserver");
const erreurNomReserver = document.getElementById("erreurNomReserver");
const erreurTelReserver = document.getElementById("erreurTelReserver");
const messageReserver = document.getElementById("messageReserver");

let trajets = [];
let trip;
const minuteurs = {};

function afficherMessage(element, texte, type = "succes") {
    clearTimeout(minuteurs[element.id]);
    element.textContent = texte;
    element.className =
        type === "erreur"
            ? "mt-3 p-3 rounded-xl bg-red-100 text-red-700 font-bold"
            : "mt-3 p-3 rounded-xl bg-green-100 text-green-700 font-bold";

    minuteurs[element.id] = setTimeout(() => {
        element.textContent = "";
        element.className = "hidden";
    }, 3000);
}

function afficherCabine() {
    const { departure, destination, departureTime, arrivalTime, price } = trip;

    infosTrajet.innerHTML = `
        <p class="text-xl">Trajet N°${String(trip.id).padStart(2, "0")} : ${departure} → ${destination}</p>
        <p>${departureTime} - ${arrivalTime} | ${price} DH</p>
        <p>Places libres : ${placesLibres(trip)} | Recette : ${recetteTrajet(trip)} DH</p>`;

    planBusEl.innerHTML = planBus(trip);

    siegeReserver.innerHTML = `<option value="">Premier siège libre</option>${optionsSieges(trip)}`;
    fieldsetReserver.disabled = estComplet(trip);
}

function afficherErreursReserver({ erreurNom, erreurTel }) {
    erreurNomReserver.textContent = erreurNom;
    erreurTelReserver.textContent = erreurTel;
}

formReserver.addEventListener("submit", (event) => {
    event.preventDefault();

    const nom = nomReserver.value.trim();
    const tel = telReserver.value.trim();

    const erreurs = validerPassager(nom, tel, trip);
    afficherErreursReserver(erreurs);
    if (!estValide(erreurs)) return;

    const siege = siegeReserver.value !== "" ? Number(siegeReserver.value) : premierSiegeLibreNonVIP(trip);

    trip.reservations = [...trip.reservations, { seat: siege, name: nom, phone: tel }];
    sauvegarder(trajets);

    formReserver.reset();
    afficherCabine();
    afficherMessage(messageReserver, "Réservation confirmée");
});

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