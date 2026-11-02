const trajets = document.getElementById("trajets");
let listeTrajets =[];

fetch("../data/trips.json")
    .then((response) => {
        return response.json();
    })
    .then((listeTrajets) =>{
     listeTrajets.forEach((trajet) =>{
      const carte =  document.createElement("div");
      carte.textContent = ` ${trajet.departure} → ${trajet.destination} | ${trajet.price} DH`
      trajets.appendChild(carte);

      carte.style.backgroundColor = "#D3C0B2";
carte.style.padding = "20px";
carte.style.borderRadius = "15px";
     })
    });