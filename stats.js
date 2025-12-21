
console.log(localStorage.getItem("numPkmn"), localStorage.getItem("numTrainer"), localStorage.getItem("numEnergy"), localStorage.getItem("deckSize"));

const ctx = document.getElementById('myChart');

new Chart(ctx, {
    type: 'pie',
    data: {
    labels: ['Pokemon', 'Trainers', 'Energy'],
    datasets: [{
        label: '# of Cards',
        data: [localStorage.getItem("numPkmn"), localStorage.getItem("numTrainer"), localStorage.getItem("numEnergy")],
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
            