import data from "../data/trips.json" with {type:"json"}
const result = new URLSearchParams(location.search);
const id=Number(result.get("id"))
const trajet = data.find(t => t.id === id);
const nomReservation = document.getElementById("nomReservation");
const siegeChoisi = document.getElementById("sieges");
const button = document.querySelector('[type="submit"]');
const wayTrajet = document.getElementById("wayTrajet");
const searchBar = document.getElementById("searchBar");
const regexName = /^[A-Za-zÀ-ÿ]+\s+[A-Za-zÀ-ÿ]+$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.com$/; 
const message = document.getElementById("messageAffiche");
const btnReservation = document.getElementById("btnReserver");
const btnSupprimer = document.getElementById("btnSupprimer");
const btnModifier = document.getElementById("btnModifier");
let reservation = [];

//lier l ID avec l'adresse:

if(trajet === undefined){
    wayTrajet.innerHTML = "trajet introuvable"


   
}else{
    wayTrajet.innerHTML = `
     <div class="bg-[#CCDCDB] p-5 rounded-xl text-center shadow-md">
    Trajet : ${trajet.id} 
    <br>Départ : ${trajet.departure}
    <br>Destination : ${trajet.destination}
    <br>Heur de départ : ${trajet.departureTime}
    <br> Prix : ${trajet.price} DH 
    <br> Capacité : ${trajet.capacity} places
    `;
 trajet.reservation.forEach((reservation) =>{
        const siege = document.getElementById(`siege-${reservation.seat}`);
        if(siege){
            siege.classList.remove("bg-[#BAC8B1]");
            siege.classList.add("bg-red-500");
            siege.innerHTML = reservation.name;
        }
    });
}


// chercher les trajets avec la barre de recherche en utilisant lD des trajets 
function afficheMessage(texte, type){
    message.textContent = texte;
    message.className = type ==="erreur"
        ?"p-3 rounded bg-red-100 text-red-700 font-bold"
        : "p-3 rounde-cl bg-green-100 text-green-700 font-bold";
setTimeout(() => {message.textContent = ""; message.className = ""; },3000);
}


function reserver(){
    const {name , email} = lireFormulaire();
    if(!valider(nom , email))return;

    reservation.push({id: Date.now(), nom , email});
    afficherMessage("Reservation ajouté ")
}

function modifier(id){
    const{nom, email,tel} = lireFormulaire();
    if(!valider(nom, email )) return;


    const r = reservation.find(r=> r.id === id );
    r.nom = nom;
    r.email = email;

    afficherMessage("Réservation modifiée")
}


function supprimer(id){
    reservations = reservations.filter(r=> r.id !==id);
    afficherMessage("Réservation supprimée")
}

btnReserver.addEventListener("click", (e) =>{
    e.preventDefault();
    reserver();
})

btnReserver.addEventListener("click", (e) =>{
    e.preventDefault();
    modifier();
})


btnReserver.addEventListener("click", (e) =>{
    e.preventDefault();
    supprimer();
})


button.addEventListener("click" , function(e){
    e.preventDefault();

    const nom = nomReservation.value.trim();
    const email = document.getElementById("email")
    


    if(!regexName.test(nom)){
        afficheMessage("Le nom besoin deux mots(nom+ prénom)");
        return;
    }
    if(!regexEmail.test(email)){
        afficheMessage("Email est incorrect(besoin la form email@email.com)")
        return;
    }
    if(!regexTel.test(tel)){
        afficheMessage("Numeéro besoin la form de 06 ou 07");
    }
   
});
 
