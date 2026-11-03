import myJson from `./data.json` assert {type :`json`};
const result=new URLSearchParams(location.search)
const id=Number(result.get("id"))
console.log(id)
const wayTrajet = document.getElementById("wayTrajet");
wayTrajet.innerHTML = `Trajet : ${trajet.id} // Départ : ${trajet.departure} → Destination : ${trajet.destination}`;