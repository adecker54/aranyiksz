/* ==========================================================
   app.js gemini
   Közös kezelő, grafikon motor és lokalizáció
========================================================== */

let financeChart = null;
let aktualisNyelv = "hu"; // Alapértelmezett nyelv

// 1. FORMÁZÓ FÜGGVÉNY
function formatUsd(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

// 2. NYELVVÁLTÓ MOTOR (Hibavédelemmel ellátva)
function nyelvValtas(lang) {
    aktualisNyelv = lang;
    const szovegek = szotar[lang];

    if (!szovegek) {
        console.error("Hiba: A választott nyelv nincs definiálva a szótárban!");
        return;
    }

    // Biztonságos elem-feltöltő segédfüggvény (ha egy ID hiányzik a HTML-ből, nem omlik össze a kód)
    const szovegBeallit = (id, tartalom) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.innerHTML = tartalom;
        } else {
            console.warn(`Figyelmeztetés: Nem található '${id}' azonosító a HTML-ben.`);
        }
    };

    // Szövegek behelyettesítése a szótárból
    szovegBeallit("mainTitle", szovegek.mainTitle);
    szovegBeallit("subTitle", szovegek.subTitle);
    szovegBeallit("lblKezdotoke", szovegek.lblKezdotoke);
    szovegBeallit("lblKivet", szovegek.lblKivet);
    szovegBeallit("lblHavikamat", szovegek.lblHavikamat);
    szovegBeallit("lblKezdotokekivet", szovegek.lblKezdotokekivet);
    szovegBeallit("optNem", szovegek.optNem);
    szovegBeallit("optIgen", szovegek.optIgen);
    szovegBeallit("btnSzamolas", szovegek.btnSzamolas);
    szovegBeallit("toggleBtn", szovegek.btnTablamutat);

    // Táblázat fejlécek fordítása
    szovegBeallit("cimIdo", szovegek.cimIdo);
    szovegBeallit("cimNytoke", szovegek.cimNytoke);
    szovegBeallit("cimHkamat", szovegek.cimHkamat);
    szovegBeallit("cimZtoke", szovegek.cimZtoke);

    // Kezdőtőke tervező feliratainak fordítása
    szovegBeallit('lblKivantKivetText', szovegek.lblKivantKivet);
    szovegBeallit('lblHavikamatText', szovegek.lblHavikamat);
    szovegBeallit('lblCelHonapText', szovegek.lblCelHonap);
    szovegBeallit('lblKiveszTokeText', szovegek.lblKezdotokekivet); // Itt a közös változót használtam!
    szovegBeallit('btnStartcapSzamol', szovegek.lblBtnSzamol);
    szovegBeallit('resSzuksegesLabel', szovegek.lblSzuksegesToke);
    szovegBeallit('resKerekitettLabel', szovegek.lblKerekitettToke);
    szovegBeallit('optStartcapNem', szovegek.optNem); // A meglévő optNem fordítást használjuk
    szovegBeallit('optStartcapIgen', szovegek.optIgen); // A meglévő optIgen fordítást használjuk
    szovegBeallit("disclaimerText", szovegek.disclaimerText); // a kezdőképernyőn levő figyelmeztetés
    // Ha már látható az eredmény, frissítsük a szöveget az új nyelvre a gombnyomás nélkül is
    if (document.getElementById("resultBox").style.display === "block") {
        szamolas_month();
    }
    // const langPack = szotar[aktualisNyelv];
    document.getElementById('btnTabMonth').innerText = szovegek.tabMonth;
    document.getElementById('btnTabStartCap').innerText = szovegek.tabStartCap;
    
    // a Help gomb a nyelvváltás után is tudja, mit kell tennie:
//    const helpGomb = document.getElementById('btnFixHelp');
//    if (helpGomb) {
//        helpGomb.onclick = function() {
//            mutatHelp();
//            document.getElementById('customAlert').style.display = 'block';
//        };
//    }

    if (window.financeChart && window.financeChart.data.datasets.length > 0) {
        // Ha van élő grafikon a képernyőn, nyelvváltáskor azonnal frissítjük a címkéit:
        if (typeof szotar !== 'undefined' && szotar[aktualisNyelv]) {
            window.financeChart.data.datasets[0].label = szotar[aktualisNyelv].chartToke || 'Záró Tőke';
            if (window.financeChart.data.datasets[1]) {
                window.financeChart.data.datasets[1].label = szotar[aktualisNyelv].chartKamat || 'Havi Kamat';
            }
            window.financeChart.update(); // Újrarajzolja a feliratokat az új nyelven!
        }
    }

}

    // Grafikon feliratok dinamikus nyelvi beállítása
    const labelToke = szotar[aktualisNyelv].chartToke || 'Záró Tőke';
    const labelKamat = szotar[aktualisNyelv].chartKamat || 'Havi Kamat';

// 3. DIAGRAM RAJZOLÓ
function frissitDiagram(cimkek, tokeAdatok, kamatAdatok) {
    const ctx = document.getElementById('myChart').getContext('2d');
    document.getElementById('chartWrapper').style.display = 'block';

    if (window.financeChart) {
        window.financeChart.destroy();
    }

    // NYELVI JAVÍTÁS: Dinamikusan a globális szovegek vagy szotar alapján határozzuk meg a feliratot
    let labelToke = 'Záró Tőke';
    let labelKamat = 'Havi Kamat';
    
    if (typeof szotar !== 'undefined' && szotar[aktualisNyelv]) {
        labelToke = szotar[aktualisNyelv].chartToke || szotar[aktualisNyelv].lblZarotoke || 'Záró Tőke';
        labelKamat = szotar[aktualisNyelv].chartKamat || szotar[aktualisNyelv].lblHavikamat || 'Havi Kamat';
    } else if (window.szovegek) {
        labelToke = window.szovegek.chartToke || 'Záró Tőke';
        labelKamat = window.szovegek.chartKamat || 'Havi Kamat';
    }

    // BIZTONSÁGI ELLENŐRZÉS: Csak akkor tekintjük érvényesnek a kamatadatokat, 
    // ha a tömb létezik, van eleme, ÉS az elemei nem mind nullák vagy üresek.
    const vanKamat = kamatAdatok && kamatAdatok.length > 0 && kamatAdatok.some(val => val !== 0 && val !== null);

    window.financeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: cimkek,
            datasets: [
                {
                    label: labelToke,
                    data: tokeAdatok,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 3,
                    tension: 0.2,
                    yAxisID: 'y'
                },
                {
                    label: labelKamat,
                    data: vanKamat ? kamatAdatok : [],
                    borderColor: '#2ecc71',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.2,
                    yAxisID: 'y1',
                    hidden: !vanKamat // Ha nincs kamatadat (Kezdőtőke), elrejtjük. Ha van (Kivét tervező), MEGJELENÍTJÜK!
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { color: '#2a2a2a' },
                    ticks: { color: '#b3b3b3' }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: '#2a2a2a' },
                    ticks: { color: '#d4af37' }
                },
                y1: {
                    type: 'linear',
                    display: vanKamat, // Csak akkor rajzolunk jobb oldali y tengelyt, ha van kamatvonal
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#2ecc71' }
                }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });
}

// 4. TÁBLÁZAT ELREJTÉS / MEGJELENÍTÉS
// app.js - 4. TÁBLÁZAT ELREJTÉS / MEGJELENÍTÉS
function toggleTable() {
    const container = document.getElementById('tableContainer');
    const btn = document.getElementById('toggleBtn');
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        // Fix szövegek helyett a szótárból olvassuk az elrejtést:
        btn.innerText = szotar[aktualisNyelv].btnTablaelrejt;
    } else {
        container.style.display = 'none';
        // A mutatást is a szótárból olvassuk:
        btn.innerText = szotar[aktualisNyelv].btnTablamutat;
    }
}



// 5. KEZDETI INDÍTÁS (Csak miután a HTML betöltődött)
document.addEventListener("DOMContentLoaded", function() {
    nyelvValtas("hu");
});
// Egyedi hibaablak megnyitása kétnyelvű fejléccel
//function sajatAlert(uzenet) {
//    document.getElementById("alertHeader").innerText = aktualisNyelv === "hu" ? "Figyelem!" : "Attention!";
//    document.getElementById("alertMessage").innerText = uzenet;
//    document.getElementById("customAlert").style.display = "block";
//}

// A sima hibaüzenetek megjelenítése (ezzel fog újra működni a validáció!)
function sajatAlert(szoveg) {
    const langPack = szotar[aktualisNyelv];
    document.getElementById("alertHeader").innerText = langPack.alertTitle;
    document.getElementById("alertMessage").innerText = szoveg;
    document.getElementById("customAlert").style.display = "block";
}

// A sima hibaüzenet ablak bezárása
function bezarAlert() {
    document.getElementById("customAlert").style.display = "none";
}

// Globális változó az aktuális fül követésére
let aktivTab = 'month';

function valtsTab(tabNev) {
// 1. KÉPERNYŐ TISZTÍTÁS A VALÓDI ID-K ALAPJÁN
    if (window.financeChart && typeof window.financeChart.destroy === 'function') {
        window.financeChart.destroy();
        window.financeChart = null;
    }

    // Elrejtjük a grafikont és a Kezdőtőke szöveges mezőjét
    if (document.getElementById('chartWrapper')) document.getElementById('chartWrapper').style.display = 'none';
    if (document.getElementById('startcap-eredmeny')) document.getElementById('startcap-eredmeny').style.display = 'none';
    
    // A Havi kivét szövegdoboza (resultBox class)
    const rBox = document.getElementById('resultBox') || document.querySelector('.result-box');
    if (rBox) rBox.style.display = 'none';

    // Táblázat teljes takarítása és elrejtése fülváltáskor
    const tBody = document.getElementById('tableBody');
    if (tBody) tBody.innerHTML = '';
    
    const tContainer = document.getElementById('tableContainer');
    if (tContainer) tContainer.style.display = 'none';

    // Gomb elrejtése alaphelyzetbe
    const toggleBtn = document.getElementById('toggleBtn');
    if (toggleBtn) toggleBtn.style.display = 'none';

    // 2. PANELEK ÉS GOMBOK AKTIVÁLÁSA
    const panelMonth = document.getElementById('panel-month');
    const panelStartcap = document.getElementById('panel-startcap');
    const btnMonth = document.getElementById('btnTabMonth');
    const btnStartCap = document.getElementById('btnTabStartCap');
    
if (tabNev === 'month') {
        if (panelMonth) panelMonth.style.display = 'block';
        if (panelStartcap) panelStartcap.style.display = 'none';

        // JAVÍTÁS: Fülváltáskor a gomb maradjon REJTVE! Majd a szamolas_month() gombja megmutatja.
        if (toggleBtn) toggleBtn.style.display = 'none'; 

        // A táblázat-konténer is legyen elrejtve[cite: 2]
        const tableWrapper = document.getElementById('tableContainer') || document.getElementById('tableWrapper');
        if (tableWrapper) tableWrapper.style.display = 'none';

        if (btnMonth) { btnMonth.style.background = '#d4af37'; btnMonth.style.color = '#000'; btnMonth.style.border = 'none'; }
        if (btnStartCap) { btnStartCap.style.background = '#222'; btnStartCap.style.color = '#888'; btnStartCap.style.border = '1px solid #333'; }

    } else if (tabNev === 'startcap') {
        if (panelMonth) panelMonth.style.display = 'none';
        if (panelStartcap) panelStartcap.style.display = 'block';

        // Kezdőtőkénél egyáltalán nem kell a gomb[cite: 2]
        if (toggleBtn) toggleBtn.style.display = 'none';

        // A táblázat-konténer kezdetben legyen elrejtve, a Kezdőtőke kalkuláció majd megnyitja
        const tableWrapper = document.getElementById('tableContainer') || document.getElementById('tableWrapper');
        if (tableWrapper) tableWrapper.style.display = 'none';

        if (btnMonth) { btnMonth.style.background = '#222'; btnMonth.style.color = '#888'; btnMonth.style.border = '1px solid #333'; }
        if (btnStartCap) { btnStartCap.style.background = '#d4af37'; btnStartCap.style.color = '#000'; btnStartCap.style.border = 'none'; }
    }
}

// JAVÍTÁS: A Help ablak megnyitása (CSAK a helpModalt nyitja meg, a customAlert-et NEM!)
// ÚJ, TISZTA HELP AUTOMATIZÁLÁS
function mutatHelp() {
    const langPack = szotar[aktualisNyelv];
    
    // Szövegek dinamikus betöltése
    document.getElementById("helpHeader").innerText = langPack.helpTitle;
    document.getElementById("helpBody").innerHTML = langPack.helpText;
    document.getElementById("helpCloseBtn").innerText = langPack.btnOk || "OK";
    
    // Csak a Help ablakot jelenítjük meg, semmi mást!
    document.getElementById("helpModal").style.display = "block";
}

// JAVÍTÁS: A Help ablak bezárása (és garantáljuk, hogy semmi más nem marad nyitva)
function bezarHelp() {
    document.getElementById("helpModal").style.display = "none";
}

//    alertBox.style.display = "block";

// Az oldal betöltésekor egyszer lefut, beállítva az összes kezdő feliratot:
nyelvValtas(document.getElementById('langSelect').value || 'hu');
valtsTab('month'); // Ez garantálja, hogy induláskor CSAK a Havi Kivét gomb legyen arany!