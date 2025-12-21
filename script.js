//import TCGdex from '@tcgdex/sdk'

const enterBtn = document.getElementById("enterBtn");
enterBtn.addEventListener("click", enterDeck);

const decklistTextarea = document.getElementsByTagName("textarea")[0];

const setAbbreviationToTCGdex = new Map();
setAbbreviationToTCGdex.set('SVP', "svp");
setAbbreviationToTCGdex.set('SVE', "hgss1");
setAbbreviationToTCGdex.set('SVI', "sv01");
setAbbreviationToTCGdex.set('PAL', "sv02");
setAbbreviationToTCGdex.set('OBF', "sv03");
setAbbreviationToTCGdex.set('MEW', "sv03.5");
setAbbreviationToTCGdex.set('PAR', "sv04");
setAbbreviationToTCGdex.set('PAF', "sv04.5");
setAbbreviationToTCGdex.set('TEF', "sv05");
setAbbreviationToTCGdex.set('TWM', "sv06");
setAbbreviationToTCGdex.set('SFA', "sv06.5");
setAbbreviationToTCGdex.set('SCR', "sv07");
setAbbreviationToTCGdex.set('SSP', "sv08");
setAbbreviationToTCGdex.set('PRE', "sv08.5");
setAbbreviationToTCGdex.set('JTG', "sv09");
setAbbreviationToTCGdex.set('DRI', "sv10");
setAbbreviationToTCGdex.set('BLK', "sv10.5b");
setAbbreviationToTCGdex.set('WHT', "sv10.5w");

setAbbreviationToTCGdex.set('MEP', "mep");
setAbbreviationToTCGdex.set('MEE', "hgss1");
setAbbreviationToTCGdex.set('MEG', "me01");
setAbbreviationToTCGdex.set('PFL', "me02");
setAbbreviationToTCGdex.set('ASC', "me02.5");
//https://api.tcgdex.net/v2/en/cards/

let numBasics = 0;
let numS1s = 0;
let numS2s = 0;
let numSOther = 0;

let numItems = 0;
let numSupporters = 0;
let numTools = 0;
let numStadium = 0;

let numEnergyB = 0;
let numEnergyS = 0;

function enterDeck()
{
    var inputLines = decklistTextarea.value.split('\n');
    /*console.log(inputLines);

    let cataStartIdxs = [0];
    cataStartIdxs.push(inputLines.indexOf("") + 1);
    cataStartIdxs.push(inputLines.lastIndexOf("") + 1);

    let cataVals = [];
    for(let i = 0; i < 3; i++)
    {
        let line = inputLines[cataStartIdxs[i]];
        let strNum = line.substring(line.indexOf(" ") + 1);
        cataVals.push(parseInt(strNum));
    }

    localStorage.setItem("numPkmn", cataVals[0]);
    localStorage.setItem("numTrainer", cataVals[1]);
    localStorage.setItem("numEnergy", cataVals[2]);
    localStorage.setItem("deckSize", cataVals[0] + cataVals[1] + cataVals[2]);

    console.log(localStorage.getItem("numPkmn"), localStorage.getItem("numTrainer"), localStorage.getItem("numEnergy"), localStorage.getItem("deckSize"));
    */
    (async () => 
    {
        await storeCardsInDeck(inputLines);

        saveCardCategoryCounts();

        window.location.href = "stats.html";
    })();
}

async function storeCardsInDeck(inputLines)
{
    let deck = []

    for (const element of inputLines) {

        let firstChar = Array.from(element)[0];

        if(firstChar < '0' || firstChar > '9' || element == "")
        {
            continue;
        }

        card = await parseCard(element, firstChar);

        updateCardCategoryCounts(card.category, Number(firstChar));

        deck.push(card);
    }
    deck = deck.filter(card => card != null);

    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("uniqueCardCount", deck.length);
}

async function parseCard(element, quantity)
{
    const tcgdex = new TCGdex('en');

    let lineData = element.split(' ');

    //Convert the set abbreviation on the card to a format the TCGdex API can understand
    let set = setAbbreviationToTCGdex.get(lineData[lineData.length - 2]);
    
    //Store the padded set number of the card, but point to a HGSS energy if an energy card is found
    let cardNumber = "";
    if(set == "hgss1")
    {
        cardNumber = String(Number(lineData[lineData.length - 1]) + 114).padStart(3, '0');
    }
    else
    {
        cardNumber = String(lineData[lineData.length - 1]).padStart(3, '0');
    }

    let accessStr = set + "-" + cardNumber;
    
    let card = await tcgdex.fetch('cards', accessStr);
    if(card == null)
    {
        console.log("Error:", element);
    }
    
    card.quantityInDeck = Number(quantity);
    
    console.log(card.name);

    return card;
}

function updateCardCategoryCounts(category, count)
{
    switch(category)
    {
        case "Pokemon":
            switch(card.stage)
            {
                case "Basic":
                    numBasics += count;
                    break;
                
                case "Stage1":
                    numS1s += count;
                    break;

                case "Stage2":
                    numS2s += count;
                    break;

                default:
                    numSOther += count;
                    break;
            }
            break;
        
        case "Trainer":
            switch(card.trainerType)
            {
                case "Item":
                    numItems += count;
                    break;
                
                case "Supporter":
                    numSupporters += count;
                    break;

                case "Tool":
                    numTools += count;
                    break;

                case "Stadium":
                    numStadium += count;
                    break;
            }
            break;

        case "Energy":
            console.log(card.energyType);
            switch(card.energyType)
            {
                case "Normal":
                    numEnergyB += count;
                    break;
                
                case "Special":
                    numEnergyS += count;
                    break;
            }
            break;
    }
}

function saveCardCategoryCounts()
{
    localStorage.setItem("numBasics", numBasics);
    localStorage.setItem("numS1s", numS1s);
    localStorage.setItem("numS2s", numS2s);
    localStorage.setItem("numSOther", numSOther);

    localStorage.setItem("numItems", numItems);
    localStorage.setItem("numSupporters", numSupporters);
    localStorage.setItem("numTools", numTools);
    localStorage.setItem("numStadium", numStadium);

    localStorage.setItem("numEnergyB", numEnergyB);
    localStorage.setItem("numEnergyS", numEnergyS);

    localStorage.setItem("numPkmn", numBasics + numS1s + numS2s + numSOther);
    localStorage.setItem("numTrainer", numItems + numSupporters + numTools + numStadium);
    localStorage.setItem("numEnergy", numEnergyB + numEnergyS);
    localStorage.setItem("deckSize", Number(localStorage.getItem("numPkmn")) + Number(localStorage.getItem("numTrainer")) + Number(localStorage.getItem("numEnergy")));
}