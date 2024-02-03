initialColor = document.getElementById("initial-color")
window.addEventListener("load", fillAnalogous, false)
initialColor.addEventListener("input", fillAnalogous, false)


function changeComplementaryColor(e) {
    let hslShelled = hexToHsl(e.target.value)
    complementaryColor.style.backgroundColor = hslShelledToHslValue(getComplementaryColor(hslShelled))
}

function hslShelledToHslValue(hslShelled) {
    return 'hsl(' + hslShelled.h + ', ' + hslShelled.s + '%, ' + hslShelled.l + '%)'
}

function analogous(hslShelled, degree) {
    let hslLess = {...hslShelled};
    let hslMore = {...hslShelled};

    hslMore.h = (hslShelled.h + degree) % 360
    hslLess.h = (360 + hslShelled.h - degree) % 360
    return {less: hslLess, more: hslMore}
}

function fillPartAnalogous(property) {
    if (!["less", "more"].includes(property)) {
        return console.error("a parameter property must be 'more' or 'less'")
    }
    let hslShelled = hexToHsl(initialColor.value)
    let analogousColors = analogous(hslShelled, 30)
    for (let i = 1; i < 7; i++) {
        document.getElementById(`analog-${property}${i}`).style.backgroundColor = hslShelledToHslValue(analogousColors[property]);
        analogousColors = analogous(analogousColors[property], 30)
    }
}

function fillAnalogous() {
    fillPartAnalogous("less")
    fillPartAnalogous("more")
    deleteOldMorellet()
    createMorellet()
}

function  deleteOldMorellet(){
  document.getElementById("morellet-less").innerHTML = "";
    document.getElementById("morellet-more").innerHTML = "";
}
function getComplementaryColor(hslShelled) {
    hslShelled.h = (hslShelled.h + 180) % 360
    return hslShelled
}

function hexToHsl(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return {h: h, s: s, l: l}
}

function createTransparentSpace(parentElement) {
    divTransparent = document.createElement("div")
    divTransparent.classList = "border transparent-space";
    parentElement.appendChild(divTransparent)
    return divTransparent
}

function createColorBorders(colShelled, parentElement) {
    divColor = document.createElement("div")
    divColor.classList = "border";
    divColor.style.borderColor = hslShelledToHslValue(colShelled);
    parentElement.appendChild(divColor)
    return divColor
}

function createBorder(colShelled1, colShelled2, parentElement) {
    for (let j = 0; j < 11; j++) {
        if (j % 2 === 1) {
            parentElement = createColorBorders(colShelled1, parentElement)
        } else {
            parentElement = createColorBorders(colShelled2, parentElement)
        }
    }
    return parentElement
}


function createMorellet() {
    createPartMorellet("less")
    createPartMorellet("more")
}

function createPartMorellet(property) {
    if (!["less", "more"].includes(property)) {
        return console.error("a parameter property must be 'more' or 'less'")
    }
    let parentElement = document.getElementById(`morellet-${property}`)
    let otherColShelled;
    let actualColShelled = getComplementaryColor(hexToHsl(initialColor.value));
    parentElement = createBorder(actualColShelled, actualColShelled, parentElement)
    parentElement = createTransparentSpace(parentElement);
    let i = 0;
    while (true) {
        otherColShelled = analogous(actualColShelled, 30)[property]
        parentElement = createBorder(actualColShelled, otherColShelled, parentElement)
        i++;
        if (i === 6) {
            break;
        } else {
            parentElement = createTransparentSpace(parentElement);
            actualColShelled = otherColShelled
        }
    }
    parentElement = createTransparentSpace(parentElement);
    createBorder(hexToHsl(initialColor.value), hexToHsl(initialColor.value), parentElement)
}
