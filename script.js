const enterBtn = document.getElementById("enterBtn");
enterBtn.addEventListener("click", enterDeck);

const decklistTextarea = document.getElementsByTagName("textarea")[0];

function enterDeck()
{
    var inputLines = decklistTextarea.value.split('\n'); 

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

    window.location.href = "stats.html"
}