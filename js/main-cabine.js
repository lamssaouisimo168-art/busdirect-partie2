import { chargerTrajets, sauvegarder } from "./store.js";
import {
    placesLibres,
    recetteTrajet,
    estComplet,
    premierSiegeLibreNonVIP,
    retirerReservation,
} from "./reservations.js";
import { planBus, optionsSieges, optionsPassagers, listeAttenteHTML } from "./render.js";
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

const formModifier = document.getElementById("formModifier");
const passagerModifier = document.getElementById("passagerModifier");
const nomModifier = document.getElementById("nomModifier");
const telModifier = document.getElementById("telModifier");
const siegeModifier = document.getElementById("siegeModifier");
const erreurNomModifier = document.getElementById("erreurNomModifier");
const erreurTelModifier = document.getElementById("erreurTelModifier");
const messageModifier = document.getElementById("messageModifier");

const formAnnuler = document.getElementById("formAnnuler");
const passagerAnnuler = document.getElementById("passagerAnnuler");
const messageAnnuler = document.getElementById("messageAnnuler");

const formAttente = document.getElementById("formAttente");
const fieldsetAttente = document.getElementById("fieldsetAttente");
const nomAttente = document.getElementById("nomAttente");
const telAttente = document.getElementById("telAttente");
const erreurNomAttente = document.getElementById("erreurNomAttente");
const erreurTelAttente = document.getElementById("erreurTelAttente");
const listeAttenteEl = document.getElementById("listeAttente");
const messageAttente = document.getElementById("messageAttente");

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

function afficherErreurs(elementNom, elementTel, { erreurNom, erreurTel }) {
    elementNom.textContent = erreurNom;
    elementTel.textContent = erreurTel;
}

function afficherListes() {
    const options = optionsPassagers(trip);

    passagerModifier.innerHTML = `<option value="">Choisir un passager</option>${options}`;
    passagerAnnuler.innerHTML = `<option value="">Choisir un passager</option>${options}`;

    nomModifier.value = "";
    telModifier.value = "";
    siegeModifier.innerHTML = `<option value="">Choisir un passager d'abord</option>`;

    listeAttenteEl.innerHTML = listeAttenteHTML(trip);
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
    fieldsetAttente.disabled = !estComplet(trip);

    afficherListes();
}

formReserver.addEventListener("submit", (event) => {
    event.preventDefault();

    const nom = nomReserver.value.trim();
    const tel = telReserver.value.trim();

    const erreurs = validerPassager(nom, tel, trip);
    afficherErreurs(erreurNomReserver, erreurTelReserver, erreurs);
    if (!estValide(erreurs)) return;

    const siege = siegeReserver.value !== "" ? Number(siegeReserver.value) : premierSiegeLibreNonVIP(trip);

    trip.reservations = [...trip.reservations, { seat: siege, name: nom, phone: tel }];
    sauvegarder(trajets);

    formReserver.reset();
    afficherCabine();
    afficherMessage(messageReserver, "Réservation confirmée");
});

passagerModifier.addEventListener("change", () => {
    const siege = Number(passagerModifier.value);
    const passager = trip.reservations.find((r) => r.seat === siege);

    if (!passager) {
        nomModifier.value = "";
        telModifier.value = "";
        siegeModifier.innerHTML = `<option value="">Choisir un passager d'abord</option>`;
        return;
    }

    nomModifier.value = passager.name;
    telModifier.value = passager.phone;
    siegeModifier.innerHTML = optionsSieges(trip, siege);
    siegeModifier.value = String(siege);
});

formModifier.addEventListener("submit", (event) => {
    event.preventDefault();

    const ancienSiege = Number(passagerModifier.value);
    if (!trip.reservations.some((r) => r.seat === ancienSiege)) {
        afficherMessage(messageModifier, "Choisissez un passager à modifier.", "erreur");
        return;
    }

    const nom = nomModifier.value.trim();
    const tel = telModifier.value.trim();

    const erreurs = validerPassager(nom, tel, trip, ancienSiege);
    afficherErreurs(erreurNomModifier, erreurTelModifier, erreurs);
    if (!estValide(erreurs)) return;

    const nouveauSiege = Number(siegeModifier.value);

    trip.reservations = trip.reservations.map((r) =>
        r.seat === ancienSiege ? { ...r, name: nom, phone: tel, seat: nouveauSiege } : r
    );
    sauvegarder(trajets);

    afficherCabine();
    afficherMessage(messageModifier, "Réservation modifiée");
});

formAnnuler.addEventListener("submit", (event) => {
    event.preventDefault();

    const siege = Number(passagerAnnuler.value);
    if (!trip.reservations.some((r) => r.seat === siege)) {
        afficherMessage(messageAnnuler, "Choisissez un passager à annuler.", "erreur");
        return;
    }

    const resultat = retirerReservation(trip, siege);
    trip.reservations = resultat.reservations;
    trip.waitingList = resultat.waitingList;
    sauvegarder(trajets);

    afficherCabine();

    if (resultat.attribue) {
        const { name, seat } = resultat.attribue;
        afficherMessage(messageAnnuler, `${name} a obtenu le siège ${String(seat).padStart(2, "0")}`);
    } else {
        afficherMessage(messageAnnuler, "Réservation annulée");
    }
});

formAttente.addEventListener("submit", (event) => {
    event.preventDefault();

    const nom = nomAttente.value.trim();
    const tel = telAttente.value.trim();

    const erreurs = validerPassager(nom, tel, trip);
    afficherErreurs(erreurNomAttente, erreurTelAttente, erreurs);
    if (!estValide(erreurs)) return;

    trip.waitingList = [...trip.waitingList, { name: nom, phone: tel }];
    sauvegarder(trajets);

    formAttente.reset();
    afficherCabine();
    afficherMessage(messageAttente, `Ajouté en liste d'attente (position ${trip.waitingList.length})`);
});

listeAttenteEl.addEventListener("click", (event) => {
    const bouton = event.target.closest("[data-index]");
    if (!bouton) return;

    const index = Number(bouton.dataset.index);
    trip.waitingList = trip.waitingList.filter((_, i) => i !== index);
    sauvegarder(trajets);

    afficherCabine();
    afficherMessage(messageAttente, "Passager retiré de la liste d'attente");
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