import { chargerTrajets } from "./store.js";
const trajets = document.getElementById("trajets");
let listeTrajets =[];
let pageActuelle = 1;
let taillePage = 6;


  chargerTrajets().then((listeTrajets) => {
    listeTrajets.forEach((trajet) => {
     const carte = document.createElement("div");

carte.className = "bg-[#CCDCDB] rounded-2xl shadow-lg p-5 flex flex-col items-center gap-4 border-t-4 border-[#C35627] hover:shadow-2xl transition";
carte.innerHTML = `
    <h1 class="text-xl font-extrabold text-[#C35627]">
        Trajet : ${trajet.id}
    </h1>

    <h2 class="text-lg font-bold text-gray-800">
        ${trajet.departure} → ${trajet.destination}
    </h2>

    <p class="text-lg font-bold">
        ${trajet.price} DH
    </p>

    <p class="text-gray-600">
        Capacité : ${trajet.capacity} places
    </p>

`;
        
        carte.style.backgroundColor = "#D3C0B2";
       
        carte.style.alignItems = "center";
        carte.style.borderRadius = "15px";
        carte.style.fontWeight = "bold";
        carte.style.display = "flex";
        carte.style.flexDirection = "column";
        const button = document.createElement("button");
       button.textContent = "Réserver";
button.className = "bg-[#C35627] text-white font-bold rounded-xl px-8 py-3 hover:bg-[#A94720] transition shadow-md cursor-pointer";;
        button.addEventListener("click", function(){
           window.location.href = `cabine.html?id=${trajet.id}`;
        })
      carte.appendChild(button);
        
         trajets.append(carte);
   }) })
    ;




