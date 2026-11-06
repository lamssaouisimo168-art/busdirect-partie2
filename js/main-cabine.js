import { chargerTrajets, sauvegarder } from "./store.js";
const result = new URLSearchParams(location.search);
const id = Number(result.get("id"));
const nomReservation = document.getElementById("nomReservation");
const siegeChoisi = document.getElementById("sieges");
const button = document.querySelector('[type="submit"]');
const wayTrajet = document.getElementById("wayTrajet");
const searchBar = document.getElementById("searchBar");
const regexName = /^[A-Za-zÀ-ÿ]+\s+[A-Za-zÀ-ÿ]+$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.com$/; 
const btnReserver = document.getElementById("btnReserver");
const btnSupprimer = document.getElementById("btnSupprimer");
const btnModifier = document.getElementById("btnModifier");
const siegeReservation = document.getElementById("siegeModification");
const siegeSuppression = document.getElementById("siegeSuppression");
const siegeModification = document.getElementById("siegeModification");
let  idSelections = null;
let timer;



let trajet;
chargerTrajets().then((liste)=>{
    trajet = liste.find(t=> t.id === id);


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
    <br>Capacité : ${trajet.capacity} places
    </div>`;
      }

    trajet.reservations.forEach((r) => {
        const siege = document.getElementById(`siege-${r.seat}`);

        if (siege) {
            siege.classList.remove("bg-[#BAC8B1]");
            siege.classList.add("bg-red-500");
            siege.textContent = r.name;
        }
    });

});




function afficherMessage(texte, type){
    message.textContent = texte;
   message.className = type === "erreur" ? "p-3 rounded-xl bg-red-100 text-red-700 font-bold" : "p-3 rounded-xl bg-green-100 text-green-700 font-bold";
timer = setTimeout(() => { message.textContent = ""; message.className = "hidden"; }, 3000);
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







const formulaire = document.getElementById("Réserver");
const nomPassager = document.getElementById("name");
const seatSelect = document.getElementById("seat-number");
const message = document.getElementById("message");
function sauvegarderReservations(){
    localStorage.setItem("reservations", JSON.stringify(reservations));
}
formulaire.addEventListener("submit",function(event){
event.preventDefault();
let nom = nomPassager.value.trim();
let siege = seatSelect.value;

if(nom === ""){
message.textContent = "Entrer le nom du passager";
return;
}
for(let reservation of reservations){
if(reservation.nom.toLowerCase() === nom.toLowerCase()){
message.textContent = "Ce passager est déjà réservé";
return;
}
if(reservation.siege == siege && siege !== ""){
message.textContent = "Ce siège est déjà réservé";
return;
}}
if(siege === ""){
siege = 1;
while(reservations.find(function(reservation){
return reservation.siege == siege;
})){
siege++;
}}

if(siege > 20){
message.textContent = "Tous les sièges sont réservés";
return;
}

let place = document.querySelector('[data-seat="' + siege + '"]');
if(!place) return;

reservations.push({nom: nom, siege: Number(siege)}
);
sauvegarderReservations();

place.classList.remove("bg-green-400");
place.classList.add("bg-red-500");
place.textContent = "Siège " + siege + " " + nom;
message.textContent = "Réservation réussie";
setTimeout(function(){
message.textContent = "";
},3000);
afficherPassanger();
formulaire.reset();
});







const formModifier = document.getElementById("Modifier");
const ancienNom = document.getElementById("name2");
const nouveauNom = document.getElementById("new-name");
const nouveauSiege = document.getElementById("new-seat");

formModifier.addEventListener("submit",function(event){
event.preventDefault();
let trouve = false;

for(let reservation of reservations){
if(reservation.nom.toLowerCase() === ancienNom.value.trim().toLowerCase()){
let nom = nouveauNom.value.trim() || reservation.nom;
let siege = nouveauSiege.value || reservation.siege;

for(let autre of reservations){
if(autre !== reservation && autre.nom.toLowerCase() === nom.toLowerCase()){
message.textContent = "Ce nom existe déjà";
setTimeout(function(){message.textContent = "";},3000);
return;
}
if(autre !== reservation && autre.siege == siege){
message.textContent = "Ce siège est déjà réservé";
setTimeout(function(){message.textContent = "";},3000);
return;
}
}

let anciennePlace = document.querySelector('[data-seat="' + reservation.siege + '"]');
let nouvellePlace = document.querySelector('[data-seat="' + siege + '"]');

anciennePlace.classList.remove("bg-red-500");
anciennePlace.classList.add("bg-green-400");
anciennePlace.textContent = "Siège " + reservation.siege;

reservation.nom = nom;
reservation.siege = Number(siege);

nouvellePlace.classList.remove("bg-green-400");
nouvellePlace.classList.add("bg-red-500");
nouvellePlace.textContent = "Siège " + siege + " " + nom;

message.textContent = "Modification réussie";
setTimeout(function(){message.textContent = "";},3000);
formModifier.reset();
trouve = true;
break;
}
}

if(!trouve){
message.textContent = "Passager introuvable";
setTimeout(function(){message.textContent = "";},3000);
}
});


const formAnnuler = document.getElementById("Annuler");
const passangerAnnuler =document.getElementById("passenger-delete");
const messageModifier = document.getElementById("message");
const messageAnnuler = document.getElementById("message");


function afficherPassanger(){
    ancienNom.innerHTML = '<option value ="">choisir un passager</option>';
    passangerAnnuler.innerHTML = '<option value="">Sélectionner un passager</option>';

    for(let reservation of reservations){
        let option = document.createElement("option");
        option.value = reservation.nom;
        option.textContent = reservation.nom;
        ancienNom.appendChild(option);

        let option2 = document.createElement("option");
        option2.value = reservation.nom;
        option2.textContent = reservation.nom;
        passangerAnnuler.appendChild(option2); 
    }
}
afficherPassanger()



formAnnuler.addEventListener("submit",function(event){
    event.preventDefault();
    let nom= passangerAnnuler.value;
    let index = reservations.findIndex(function(reservation){
        return reservation.nom===nom;
    });
    if(index ===-1){
        message.textContent = "choisir un passager";
        setTimeout(function(){message.textContent="";},3000);
        return;
    }
    let siege = reservations[index].siege;
    reservations.splice(index,1);
    let place= document.querySelector('[data-seat="' + siege + '"]');
    place.classList.remove("bg-red-500");
    place.classList.add("bg-green-400");
    place.textContent="siège "+ siege;
    message.textContent = "Ticket supprimé";
    afficherPassanger();
    formAnnuler.reset();
    setTimeout(function(){
        message.textContent = "";
    },3000);
});





















