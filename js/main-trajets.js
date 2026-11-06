import { chargerTrajets } from "./store.js";
import { estComplet, recetteTrajet } from "./reservations.js";
import { carteTrajet } from "./render.js";

const listeTrajetsEl = document.getElementById("listeTrajets");
const paginationEl = document.getElementById("pagination");
const searchBar = document.getElementById("searchBar");
const statutSelect = document.getElementById("statut");
const aucunResultat = document.getElementById("aucunResultat");
const statRecette = document.getElementById("statRecette");
const statPassagers = document.getElementById("statPassagers");
const statTrajets = document.getElementById("statTrajets");

const TAILLE_PAGE = 6;
let trajets = [];
let pageActuelle = 1;

function filtrerTrajets() {
    const recherche = searchBar.value.trim().toLowerCase();
    const statut = statutSelect.value;

    return trajets.filter((trip) => {
        const correspondVille =
            trip.departure.toLowerCase().includes(recherche) ||
            trip.destination.toLowerCase().includes(recherche);

        const correspondStatut =
            statut === "tous" ||
            (statut === "complet" && estComplet(trip)) ||
            (statut === "disponible" && !estComplet(trip));

        return correspondVille && correspondStatut;
    });
}

function afficherStats() {
    const passagers = trajets.reduce((total, trip) => total + trip.reservations.length, 0);
    const recette = trajets.reduce((total, trip) => total + recetteTrajet(trip), 0);

    statPassagers.textContent = passagers;
    statRecette.textContent = recette;
    statTrajets.textContent = trajets.length;
}

function afficherPagination(totalPages) {
    if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        return;
    }

    const classeBase = "px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed";

    let html = `<button type="button" data-page="${pageActuelle - 1}" ${pageActuelle === 1 ? "disabled" : ""} class="bg-white ${classeBase}">Précédent</button>`;

    for (let i = 1; i <= totalPages; i++) {
        const actif = i === pageActuelle;
        html += `<button type="button" data-page="${i}" ${actif ? 'aria-current="page"' : ""} class="${actif ? "bg-[#C35627] text-white" : "bg-white"} ${classeBase}">${i}</button>`;
    }

    html += `<button type="button" data-page="${pageActuelle + 1}" ${pageActuelle === totalPages ? "disabled" : ""} class="bg-white ${classeBase}">Suivant</button>`;

    paginationEl.innerHTML = html;
}

function afficher() {
    const resultats = filtrerTrajets();
    const totalPages = Math.max(1, Math.ceil(resultats.length / TAILLE_PAGE));
    if (pageActuelle > totalPages) pageActuelle = totalPages;

    const debut = (pageActuelle - 1) * TAILLE_PAGE;
    const trajetsPage = resultats.slice(debut, debut + TAILLE_PAGE);

    listeTrajetsEl.innerHTML = trajetsPage.map(carteTrajet).join("");
    aucunResultat.classList.toggle("hidden", resultats.length > 0);
    afficherPagination(totalPages);
}

searchBar.addEventListener("input", () => {
    pageActuelle = 1;
    afficher();
});

statutSelect.addEventListener("change", () => {
    pageActuelle = 1;
    afficher();
});

paginationEl.addEventListener("click", (event) => {
    const bouton = event.target.closest("[data-page]");
    if (!bouton) return;
    pageActuelle = Number(bouton.dataset.page);
    afficher();
});

listeTrajetsEl.addEventListener("click", (event) => {
    const bouton = event.target.closest("[data-id]");
    if (!bouton) return;
    window.location.href = `cabine.html?id=${bouton.dataset.id}`;
});

async function init() {
    trajets = await chargerTrajets();
    afficherStats();
    afficher();
}

init();