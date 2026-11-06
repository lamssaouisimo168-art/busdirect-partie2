export let trajets = [];
export async function chargerTrajets(){
    const donnes = localStorage.getItem("trajets");
    if(donnes !== null){
        trajets = JSON.parse(donnes);
        return trajets;
    }
    else{
        try{
            const result = await fetch("./data/trips.json");
            trajets = await result.json();
            sauvegarder(trajets);
            return trajets;
        }
        catch{
            console.log("data not downloaded");
            return[];
        }
    }
    
}
export function sauvegarder(trajets){
    localStorage.setItem("trajets",JSON.stringify(trajets));
}
