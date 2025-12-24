
console.log(localStorage.getItem("numPkmn"), localStorage.getItem("numTrainer"), localStorage.getItem("numEnergy"), localStorage.getItem("deckSize"));

const ctx = document.getElementById('compPiChart');
const ctx2 = document.getElementById('basicOpenDistrib');
const ctx3 = document.getElementById('muliDistrib');

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

new Chart(ctx2, {
    type: 'bar',
    data: {
    labels: [
        '0 Basics', '1 Basic', '2 Basics', '3 Basics', 
        '4 Basics', '5 Basics', '6 Basics', '7 Basics'],
    datasets: [{
        label: 'Probability',
        data: [
            numBasicOpeningHandProbability(0), numBasicOpeningHandProbability(1), numBasicOpeningHandProbability(2),
            numBasicOpeningHandProbability(3), numBasicOpeningHandProbability(4), numBasicOpeningHandProbability(5),
            numBasicOpeningHandProbability(6), numBasicOpeningHandProbability(7)
        ],
        backgroundColor: [
            'rgba(100, 100, 225, 0.9 )',
        ],
        borderWidth: 1
    }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Probability of oppening with n basics',

                font: {
                    size: 18,
                    weight: "bold",
                    family: "Roboto"
                }
            }
        }
    }
});

new Chart(ctx3, {
    type: 'bar',
    data: {
    labels: [
        '0 Mulligans', '1 Mulligan', '2 Mulligans', '3 Mulligans', '4 Mulligans'],
    datasets: [{
        label: 'Probability',
        data: [
            muliganProbability(0), muliganProbability(1), muliganProbability(2), muliganProbability(3), muliganProbability(4)
        ],
        backgroundColor: [
            'rgba(100, 100, 225, 0.9 )',
        ],
        borderWidth: 1
    }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Probability of n mulligans occuring',
                
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

let str = "__._%";

let totalCopiesField = document.getElementById("totalCopies");
totalCopiesField.addEventListener('change', updatePrizingText);

let prizedCopiesField = document.getElementById("prizedCopies");
prizedCopiesField.addEventListener('change', updatePrizingText);

let checkbox = document.getElementById("isBasic");
checkbox.addEventListener('change', updatePrizingText);

let prizingOutputText = document.getElementById("prizingOutput");

updatePrizingText();

function updatePrizingText()
{
    let totalCopies = Number(totalCopiesField.value);
    let prizedCopies = Number(prizedCopiesField.value);

    if(prizedCopies > totalCopies)
    {
        prizingOutputText.textContent = "Error: Cannot prize more copies than in the deck.";
        return;
    }

    prizingOutputText.textContent = prizeCopiesProbability(totalCopies, prizedCopies, checkbox.checked) * 100 + "%";
}

let startCopiesField = document.getElementById("startCopies");
startCopiesField.addEventListener('change', loneStartProbibility);

let startOutputText = document.getElementById("startOutput"); 

loneStartProbibility();
//////////////////////////////////////////////////////////////////////

//https://www.geeksforgeeks.org/javascript/factorial-of-a-number-using-javascript/
function fact(n) {
    let res = 1;
    for (let i = 1; i <= n; i++) 
    {
        res *= i;
    }
    return res;
}

function choose(m, n)
{
    return (fact(m))/(fact(n) * fact(m - n));
}

function numBasicOpeningHandProbability(desiredNumBasics)
{
    let size = Number(localStorage.getItem("deckSize"));
    let numBasics = Number(localStorage.getItem("numBasics"));

    let basicsInHandCombo = choose(numBasics, desiredNumBasics);
    let remainingCardsInHandCombo = choose(size - numBasics, 7 - desiredNumBasics);

    return (basicsInHandCombo * remainingCardsInHandCombo)/choose(size, 7);
}

function muliganProbability(numMuligans)
{
    if(numMuligans < 0) return 0;

    if(numMuligans == 0) return 1 - numBasicOpeningHandProbability(0);

    return (numBasicOpeningHandProbability(0)) * muliganProbability(numMuligans - 1);
}

//https://youtu.be/9QSuG5LKRyw?si=gRBvs1oOdvNhWumb
function prizeCopiesProbability(totalCount, numPrized, isBasic=false)
{
    let isTargetBasic = isBasic;
    let pValidHandGivenTargetsPrized = 1 - numBasicOpeningHandGivenPrizesProbability(0, numPrized, isTargetBasic);

    let waysArangeTargets = choose(totalCount, numPrized);

    let size = Number(localStorage.getItem("deckSize"));
    let waysRemaningPrizes = choose(size - totalCount, 6 - numPrized);
    
    let pPrizeTargets = (waysArangeTargets * waysRemaningPrizes)/choose(size, 6);

    //Return the probability that we prize all our targets and have a valid oppening hand
    return pPrizeTargets * pValidHandGivenTargetsPrized;
}

function numBasicOpeningHandGivenPrizesProbability(desiredNumBasics, numPrized, isTargetBasic)
{
    let size = Number(localStorage.getItem("deckSize")) - numPrized;
    let numBasics = Number(localStorage.getItem("numBasics")) - (isTargetBasic ? numPrized : 0);

    let basicsInHandCombo = choose(numBasics, desiredNumBasics);
    let remainingCardsInHandCombo = choose(size - numBasics, 7 - desiredNumBasics);

    return (basicsInHandCombo * remainingCardsInHandCombo)/choose(size, 7);
}

//https://youtu.be/Leyh4uuT95U?si=nY5-yYmF1Jf8OK8b
function loneStartProbibility()
{
    let numStartCopies = Number(startCopiesField.value);
    let size = Number(localStorage.getItem("deckSize"));

    let pSpecificStart = (numStartCopies * choose(size - 1, 7 - 1))/choose(size, 7);

    let pNoOtherBasics = numBasicOpeningHandGivenStartProbability(0);

    let pLoneStartGivenValidOpeningHand = (pSpecificStart * pNoOtherBasics)/muliganProbability(0);
    startOutputText.textContent = pLoneStartGivenValidOpeningHand * 100 + "%";
}

function numBasicOpeningHandGivenStartProbability(desiredNumBasics)
{
    let size = Number(localStorage.getItem("deckSize"));
    let numBasics = Number(localStorage.getItem("numBasics")) - 1;

    let basicsInHandCombo = choose(numBasics, desiredNumBasics);
    let remainingCardsInHandCombo = choose(size - numBasics, 7 - 1 - desiredNumBasics);

    return (basicsInHandCombo * remainingCardsInHandCombo)/choose(size, 7 - 1);
}
