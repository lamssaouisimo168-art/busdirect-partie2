const REGEX_TEL = /^0[67]\d{8}$/;

const memeTexte = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

function personnesDuTrajet(trip, ignorerSiege) {
    const reservations = trip.reservations.filter((r) => r.seat !== ignorerSiege);
    return [...reservations, ...trip.waitingList];
}

export function validerNom(nom, trip, ignorerSiege = null) {
    if (nom.trim() === "") return "Le nom du passager est obligatoire.";

    const dejaPresent = personnesDuTrajet(trip, ignorerSiege).some((p) => memeTexte(p.name, nom));
    if (dejaPresent) return "Ce nom est déjà présent sur ce trajet.";

    return "";
}

export function validerTelephone(tel, trip, ignorerSiege = null) {
    const numero = tel.trim();

    if (!REGEX_TEL.test(numero)) return "Le téléphone doit avoir 10 chiffres commençant par 06 ou 07.";

    const dejaUtilise = personnesDuTrajet(trip, ignorerSiege).some((p) => p.phone === numero);
    if (dejaUtilise) return "Ce numéro est déjà utilisé sur ce trajet.";

    return "";
}

export function validerPassager(nom, tel, trip, ignorerSiege = null) {
    return {
        erreurNom: validerNom(nom, trip, ignorerSiege),
        erreurTel: validerTelephone(tel, trip, ignorerSiege),
    };
}

export const estValide = ({ erreurNom, erreurTel }) => erreurNom === "" && erreurTel === "";