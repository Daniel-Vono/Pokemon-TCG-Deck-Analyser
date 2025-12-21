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

function enterDeck()
{
    var inputLines = decklistTextarea.value.split('\n');
    console.log(inputLines);

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
    
    (async () => 
    {
        await storeCardsInDeck(inputLines);

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

        deck.push(await parseCard(element));
    }
    deck = deck.filter(card => card != null);

    localStorage.setItem("deck", JSON.stringify(deck));
    localStorage.setItem("uniqueCardCount", deck.length);
}

async function parseCard(element)
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
    
    card.quantityInDeck = Number(firstChar);
    
    console.log(card.name);

    return card;
}