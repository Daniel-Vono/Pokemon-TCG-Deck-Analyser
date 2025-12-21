
console.log(localStorage.getItem("numPkmn"), localStorage.getItem("numTrainer"), localStorage.getItem("numEnergy"), localStorage.getItem("deckSize"));

const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'pie',
    data: {
    labels: [
        'Basic Pokemon', 'Stage 1 Pokemon', 'Stage 2 Pokemon', 'Other Pokemon Stages', 
        'Items', 'Supporters', 'Tools', 'Stadiums', 
        'Basic Energy', 'Special Energy'],
    datasets: [{
        label: '# of Cards',
        data: [
            localStorage.getItem("numBasics"), localStorage.getItem("numS1s"), localStorage.getItem("numS2s"), localStorage.getItem("numSOther"),
            localStorage.getItem("numItems"), localStorage.getItem("numSupporters"), localStorage.getItem("numTools"), localStorage.getItem("numStadium"),
            localStorage.getItem("numEnergyB"), localStorage.getItem("numEnergyS")
        ],
        backgroundColor: [
            // Red for Pokemon
            'rgba(255, 100, 130, 0.9 )', 
            'rgba(255, 120, 150, 0.9 )', 
            'rgba(255, 140, 170, 0.9 )', 
            'rgba(255, 160, 190, 0.9 )', 

            // Blue for Trainers
            'rgba(54, 160, 240, 0.9)',
            'rgba(54, 180, 260, 0.9)',
            'rgba(54, 200, 280, 0.9)',
            'rgba(54, 220, 300, 0.9)',

            // Yellow for Energy 
            'rgba(255, 210, 90, 0.9)',
            'rgba(255, 230, 110, 0.9)'
        ],
        borderWidth: 1
    }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Pokémon Deck Card Catagory Composition',
                
                font: {
                    size: 18,
                    weight: "bold",
                    family: "Roboto"
                }
            }
        }
    }
});

let deck = JSON.parse(localStorage.getItem("deck"));

for (const card of deck){
    let img = document.createElement("img");

    // Set the source, width, 
    // height, and alt attributes
    img.src = card.image + "/low.webp"
    img.width = 100;
    img.height = 140;
    img.alt = card.name;

    // Append the image element
    // to the body of the document
    document.body.appendChild(img);
}


            