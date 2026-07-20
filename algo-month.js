/* ==========================================================
   algo-month.js gemini
========================================================== */

function szamolas_month() {
    const kezdoTokeAlap = parseFloat(document.getElementById('kezdotoke').value);
    let toke = kezdoTokeAlap;
    const kivantKivet = parseFloat(document.getElementById('kivet').value);
    const haviKamatSzazalek = parseFloat(document.getElementById('kamat').value);
    const tokeVisszavetOpzio = document.getElementById('tokeVisszavet').value;

    // BEMENETI ADATOK ELLENŐRZÉSE (VALIDÁCIÓ)
    if (kezdoTokeAlap % 100 !== 0 || isNaN(kezdoTokeAlap)) {
        sajatAlert(szotar[aktualisNyelv].lblHiba100);
        return;
    }

    if (haviKamatSzazalek < 8 || haviKamatSzazalek > 25 || isNaN(haviKamatSzazalek)) {
        sajatAlert(szotar[aktualisNyelv].lblHibapercent);
        return;
    }

    if (kivantKivet < 1 || isNaN(kivantKivet)) {
        sajatAlert(szotar[aktualisNyelv].lblHibakivet);
        return;
    }

    const haviKamatLab = haviKamatSzazalek / 100;
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    // --- 0. HÓNAP SZÁMÍTÁSA (BEÉPÍTVE A MATEKBA ÉS A LISTÁBA) ---
    let nyitoToke0 = toke;
    
    // Ugyanaz a kamatszámítás és ingadozásfaktor, mint a ciklusban
    const ingadozasfaktor0 = 1 + (Math.random() * 0.4 - 0.2);
    const aktualisHaviKamatSzazalek0 = haviKamatSzazalek * ingadozasfaktor0;
    const aktualisHaviKamatLab0 = aktualisHaviKamatSzazalek0 / 100;
    
    let haviKamatOsszeg0 = nyitoToke0 * aktualisHaviKamatLab0;
    toke = nyitoToke0 + haviKamatOsszeg0; // A 0. hónap végére nő a tőke a kamattal

    // A grafikon tömbök inicializálása a 0. hónap értékeivel (CSAK A SZÁMÉRTÉK!)
    let chartLabels = ['0' + szotar[aktualisNyelv].lblGrafikonHo];
    let chartTokeData = [toke];
    let chartKamatData = [haviKamatOsszeg0];

    // A 0. hónap elhelyezése a táblázat elején - Bold és Fehér
    let row0 = `<tr style="border-bottom:1px solid #333; font-weight:bold; color:#fff;">
        <td style="padding:8px; text-align:center;">0.</td>
        <td style="padding:8px;">${formatUsd(nyitoToke0)}</td>
        <td style="padding:8px;">+${formatUsd(haviKamatOsszeg0)} <small style="color:var(--text-gray);">(${aktualisHaviKamatSzazalek0.toFixed(1)}%)</small></td>
        <td style="padding:8px; color:#d4af37;">${formatUsd(toke)}</td>
    </tr>`;
    tableBody.innerHTML += row0;

    let honap = 0;
    let elerte = false;
    let maxHonap = 600;
    
    let tokeMegenvanVisszaveve = false; 
    const celTokeAVisszavetelhez = kezdoTokeAlap * 2;

    if (tokeVisszavetOpzio === "NEM" && toke * haviKamatLab >= kivantKivet) {
        elerte = true;
    }

    // --- SZIMULÁCIÓS CIKLUS AZ 1. HÓNAPTÓL ---
    while (!elerte && honap < maxHonap) {
        honap++;
        let nyitoToke = toke; // Az előző hónap zárója lesz a nyitó

        const ingadozasfaktor = 1 + (Math.random() * 0.4 - 0.2);
        const aktualisHaviKamatSzazalek = haviKamatSzazalek * ingadozasfaktor;
        const aktualisHaviKamatLab = aktualisHaviKamatSzazalek / 100;

        let haviKamatOsszeg = nyitoToke * aktualisHaviKamatLab;
        toke = nyitoToke + haviKamatOsszeg;

        let megjegyzes = "";
        if (tokeVisszavetOpzio === "IGEN" && !tokeMegenvanVisszaveve) {
            if (toke >= celTokeAVisszavetelhez) {
                toke = toke - kezdoTokeAlap; 
                tokeMegenvanVisszaveve = true;
                megjegyzes = ` <strong style="color:#e74c3c;">${szotar[aktualisNyelv].lblListabeszur1} $${kezdoTokeAlap} ${szotar[aktualisNyelv].lblListabeszur2}</strong>`;
            }
        }

        // Normál adatsor a listába - Csak számérték és indexpont a hónapnál, szürkébb színnel
        let row = `<tr style="border-bottom:1px solid #222;">
            <td style="padding:8px; text-align:center; color:#888;">${honap}.</td>
            <td style="padding:8px;">${formatUsd(nyitoToke)}</td>
            <td style="padding:8px;">+${formatUsd(haviKamatOsszeg)} <small style="color:var(--text-gray);">(${aktualisHaviKamatSzazalek.toFixed(1)}%)</small>${megjegyzes}</td>
            <td style="padding:8px; font-weight:bold; color:#d4af37;">${formatUsd(toke)}</td>
        </tr>`;
        tableBody.innerHTML += row;

        // Grafikon címke formázása - Csak a tiszta számérték stringként
        chartLabels.push(honap + szotar[aktualisNyelv].lblGrafikonHo);
        chartTokeData.push(toke);
        chartKamatData.push(haviKamatOsszeg);

        if (tokeVisszavetOpzio === "NEM") {
            if (nyitoToke * haviKamatLab >= kivantKivet) elerte = true;
        } else {
            if (tokeMegenvanVisszaveve && (nyitoToke * haviKamatLab >= kivantKivet)) elerte = true;
        }
    }

    const evek = Math.floor(honap / 12);
    const maradekHonapok = honap % 12;
    
    let idotartamSzoveg = "";
    const langPack = szotar[aktualisNyelv];
    
    if (evek > 0) {
        idotartamSzoveg += langPack.formazEvek(evek);
    }
    if (maradekHonapok > 0 || evek === 0) {
        if (evek > 0 && maradekHonapok > 0) {
            idotartamSzoveg += langPack.esKotoszo;
        }
        idotartamSzoveg += langPack.formazHonapok(maradekHonapok);
    }

    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const toggleBtn = document.getElementById('toggleBtn');

    if (elerte) {
        let strategiaSzoveg = tokeVisszavetOpzio === "IGEN" ? langPack.stratIgen : langPack.stratNem;

        resultText.innerHTML = langPack.resElerte(
            idotartamSzoveg, 
            langPack.mulva, 
            strategiaSzoveg, 
            formatUsd(kivantKivet), 
            formatUsd(toke)
        );
    } else {
        resultText.innerHTML = langPack.resNemElerte(formatUsd(toke));
    }

    frissitDiagram(chartLabels, chartTokeData, chartKamatData);
    resultBox.style.display = 'block';
    toggleBtn.style.display = 'block';
    document.getElementById('tableContainer').style.display = 'none';
    toggleBtn.innerText = szotar[aktualisNyelv].btnTablamutat;
}
