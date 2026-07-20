/* ==========================================================
   lang.js gemini
========================================================== */
const szotar = {
    hu: {
        mainTitle: "AurumX Profit Szimuláció",
        subTitle: `Az AurumX Liquidity Vault szimulációjának segítségével kiszámíthatod, hogy
            <br><br>
            • mikorra érhető el számodra a beírt kezdőtőkéd befizetése esetén a kívánt fix havi jövedelmed,
            <br>
            • illetve mekkora kezdőtőkére van szükséged az adott a havi jövedelmed eléréséhez.`,
        lblKezdotoke: "Kezdőtőke ($)",
        lblHavikamat: "Havi kamat / hozam (%)",
        lblKivet: "Megkívánt havi kivét ($)",
        lblGrafikonHo: ". hó",
	lblListabeszur1: "Kezdőtőke",
	lblListabeszur2: "visszavéve!",
        btnSzamolas: "Számítás futtatása",
        btnTablamutat: "Részletes táblázat megtekintése",
        btnTablaelrejt: "Táblázat elrejtése",
        chartToke: "Záró Tőke ($)",
        chartKamat: "Havi Kamat ($)",
        lblKezdotokekivet: "Először a kiveszed a kezdőtőkédet?",
	lblHiba100: "Hiba: A kezdőtőke összege csak 100 többszöröse lehet! pl. 400, 500, 600...",
	lblHibapercent: "Hiba: A havi kamat mértéke 8% és 25% között kell, hogy legyen!",
	lblHibakivet: "Hiba: A megkívánt havi kivét összege nem lehet kisebb 1$-nál!",
        optNem: "Nem",
        optIgen: "Igen",
        cimIdo: "Hónap",
        cimNytoke: "Nyitó tőke ($)",
	cimZtoke: "Záró tőke ($)",
	cimHkamat: "Havi kamat ($)",
        resText: "A kezdőtőkéd segítségével az AurumX",
        // Stratégia szövegek
        stratIgen: "úgy, hogy közben a kezdőtőkét már biztonságosan kivontad,",
        stratNem: "",
        // Időtartam kiegészítő
        mulva: " múlva", // <-- ÚJ SOR (szóközzel az elején!)
        // Eredmény szöveg függvényként (dinamikus adatokkal) és a ${mulva} változót az ${idotartam} mögé tesszük)
        resElerte: (idotartam, mulva, strategia, kivet, toke) => 
        `A kezdőtőkéd segítségével az AurumX <strong>${idotartam}${mulva}</strong> ${strategia} lehetővé teszi minden hónapban az általad kívánt összeg (<strong>${kivet}</strong>) kivételét. <br><small style="color: #b3b3b3;">Ekkorra a tőkéd eléri a ${toke} összeget.</small>`,
        resNemElerte: (toke) => 
        `A megadott paraméterekkel a tőke nem érte el a kívánt szintet 50 év (600 hónap) alatt sem. <br><small style="color: #b3b3b3;">A tőkéd jelenleg ${toke} értéken áll.</small>`,
        // Időegységek formázása magyarul (mindig egyes szám)
        formazEvek: (evek) => `${evek} év`,
        formazHonapok: (honapok) => `${honapok} hónap`,
        esKotoszo: " és ",
        tabMonth: "Havi Kivét Tervező",
        tabStartCap: "Kezdőtőke Tervező",
        btnHelp: "Súgó / Info",
        helpTitle: "Útmutató az algoritmusokhoz",
        alertTitle: "Figyelem! Hiba",

        helpText: `Az <span style="color:#d4af37; font-weight:bold;">AurumX</span> Liquidity Vault <span style="color:#2ecc71;">(LV)</span> nyereségszimulációja és számításai kizárólag tájékoztató jellegűek. A pénzügyi termékek és a kriptovaluta-eszközök befektetési kockázatokkal járnak. A múltbeli teljesítmény <em>nem garantálja</em> a jövőbeli eredményeket. 
Az <span style="color:#d4af37; font-weight:bold;">AurumX és az AUR Labs</span> rendelkezik a hongkongi <span style="font-weight:bold;">SFC*</span> 4. és 9. típusú engedélyeivel, valamint az USA-beli <span style="font-weight:bold;">FinCEN**</span> hatóság <span style="font-weight:bold;">MSB***</span> regisztrációjával.

Az <span style="color:#2ecc71;">LV</span> nyereségszimuláció segítségével számszerű támpontot kaphat arról, hogy 
i) mikor érheti el a kívánt havi fix jövedelmet a megadott kezdőtőke befizetése után,
ii) mennyi kezdőtőkére van szüksége a kívánt havi jövedelem eléréséhez?

Vegye még figyelembe, hogy a szimuláció véletlenszám generátort alkalmazásával történik. Ennek következménye, hogy az algoritmus - <em><small>ugyanazokkal a bemeneti adatokkal is és a kezdőtőke kerekítése miatt</small></em> - különböző futások esetén egy-egy hónappal eltérő eredményt adhat.

A számítás során alkalmazott feltevések:
- A számolás az <span style="color:#d4af37; font-weight:bold;">AurumX</span>-ben jelenleg érvényes kamatos kamat alkalmazásával történik, tehát a havi jutalmak itt a szimulációban havonta újbóli lekötésre kerülnek.
- A kezdőtőke, az <span style="color:#2ecc71;">LV</span>-be befizetett összeg kizárólag a 100$ többszöröse lehet (100, 200, ..., 1000, ...)
- A havi kamatjutalom 180 napos lekötés esetén 8% és 15%, míg 360 napos lekötésnél  15% és 25% között ingadozhat az AurumX üzletmenetétől függően. Ezek a %-ok bármikor csökkenhetnek, amennyiben a cég elérte a Liquidity Vault eltervezett értékét. pl. 150.000.000 $-t.
- A havi kamatjutalom a valóságban véletlenszerűen alakul. Ezt a program úgy szimulálja, hogy az itteni érték a programban beállított értéktől +- irányban max. 20%-ban eltér.
- Az éles <span style="color:#2ecc71;">LV</span> applikációban bármelyik nap le lehet állítani a kamat napi lekötését. Ennek az a következménye, hogy a tőke ettől kezdve jóval lassabban növekszik.
- Amennyiben a hozam automatikus lekötésre van állítva, a következő történik: Minden nap végén a rendszer 45 vagy 90 napra leköti a napi hozamot. A mai lekötött hozam 45/90 napig 'kamatozik' és csak utána lehet felvenni. Ez mindaddig így megy, amíg a kezdőtőke automatikus lekötésre van állítva. Pl. a 22. napon a kamatos kamat jóváírást kikapcsolod. Ekkor már 21 csomagod van és a legelső csomag kitermelt hozamát a kezdés után 112 nap múlva tudod kikérni.
- Ha nincs kamatos kamat, tehát mindennapos hozam lekötés, akkor a hozam bármikor kivehető. Persze akkor ez a számítás nem felesleges!!!

<em>Mj: Helyezze a kurzort a grafikon görbéjére és meglátja annak koordinátáit</em>

*   Securities and Futures Commission
**  Financial Crimes Enforcement Network
*** Money Services Business`,

	disclaimerText: `Ezek a nyereségszimulációk és számítások kizárólag tájékoztató jellegűek és nem minősülnek hivatalos tanácsadásnak. A tartalom felhasználása saját felelősségre történik.`,
        btnOk: "Vissza a számoláshoz",
        lblKivantKivet: "Megkívánt havi kivét ($)",
        lblCelHonap: "Ettől a hónaptól szeretném elérni",
    	lblKiveszToke: "Először kiveszed a kezdőtőkédet?",
    	lblBtnSzamol: "Számítás indítása",
        lblSzuksegesToke: "Szükséges kezdőtőke:",
        lblKerekitettToke: "Felfelé kerekített kezdőtőke (indítási tőke):",	
        // Új hibaüzenet
	lblHibaKivetStart: "Hiba: A megkívánt kivétnek 0-nál nagyobbnak kell lennie!",
	lblHibaKamatStart: "A kamatnak 8% és 25% között kell lennie!",
        lblHibaHonapStart: "Hiba: A célhónapnak 0-nál nagyobbnak kell lennie!"
    },
    en: {
	mainTitle: "AurumX Profit Simulation",
        subTitle: `Using the AurumX Liquidity Vault Profit Simulation, you can calculate
            <br><br>
            • when will you be able to earn your desired fixed monthly income after depositing your specified initial capital,
            <br>
            • how much initial capital do you need to achieve your desired monthly income?`,
        lblKezdotoke: "Initial capital ($)",
        lblHavikamat: "Monthly interest / yield (%)",
        lblKivet: "Desired Monthly Withdrawal ($)",
        lblGrafikonHo: ". month",
	lblListabeszur1: "Initial capital",
	lblListabeszur2: "withdrawn!",
        btnSzamolas: "Run calculation",
        btnTablamutat: "View the detailed table",
        btnTablaelrejt: "Hide table",        
        chartToke: "Closing capital ($)",
        chartKamat: "Monthly interest ($)",
        lblKezdotokekivet: "Take out 1st the starting capital?",
	lblHiba100: "Error: The initial capital value must be a multiple of 100! e.g., 400, 500, 600...", 
        lblHibapercent: "Error: The monthly interest rate must be between 8% and 25%!",
	lblHibakivet: "Error: The required monthly withdrawal amount cannot be less than $1!",
	optNem: "No",
        optIgen: "Yes",
        cimIdo: "Month",
        cimNytoke: "Initial capital ($)",
	cimZtoke: "Closing capital ($)",
	cimHkamat: "Monthly interest ($)",
        resText: "With your initial investment, AurumX will allow you to withdraw the amount of your choice",
        // Stratégia szövegek angolul
        stratIgen: "while your initial capital has already been safely withdrawn,",
        stratNem: "",
        // Időtartam kiegészítő angolul (üres, mert a 'within' már szerepel a mondatban)
        mulva: "", // <-- ÚJ SOR
        // Eredmény szöveg angolul, itt nincs ${mulva}, mert a within már az adat elején ott van
        resElerte: (idotartam, mulva, strategia, kivet, toke) => 
        `With your initial investment, AurumX will allow you to withdraw your desired monthly amount (<strong>${kivet}</strong>) within <strong>${idotartam}</strong> ${strategia}. <br><small style="color: #b3b3b3;">By this time, your capital will reach ${toke}.</small>`,
        resNemElerte: (toke) => 
        `With the specified parameters, the capital did not reach the desired level even within 50 years (600 months). <br><small style="color: #b3b3b3;">Your capital currently stands at ${toke}.</small>`,
	// Időegységek formázása angolul (többes szám kezelésével)
	formazEvek: (evek) => evek === 1 ? "1 year" : `${evek} years`,
        formazHonapok: (honapok) => honapok === 1 ? "1 month" : `${honapok} months`,
        esKotoszo: " and ",
        tabMonth: "Monthly Withdrawal Planner",
	tabStartCap: "Initial Capital Planner",
        btnHelp: "Help / Info",
        helpTitle: "Guide to the algorithms",
        alertTitle: "Attention! Error",

        helpText: `The <span style="color:#d4af37; font-weight:bold;">AurumX</span> Liquidity Vault <span style="color:#2ecc71;">(LV)</span> profit simulations and calculations are for informational purposes only. Investing in financial products and cryptocurrency assets involves investment risks. Past performance <em>does not guarantee</em> future results. 
AurumX and AUR Labs hold Type 4 and Type 9 licenses from the Hong Kong Securities and Futures Commission, as well as a “Money Services Business” registration with the U.S. Financial Crimes Enforcement Network.

Please also note that the simulation uses a random number generator. As a result, the algorithm —<em><small>even with the same input data and due to the rounding of the initial capital</small></em>— may yield results that differ by one month in different runs.

Using the LV profit simulator, you can get a numerical estimate of 
i) when you can achieve your desired fixed monthly income after depositing the specified initial capital,
ii) how much initial capital you need to achieve your desired monthly income?
We emphasize once again that this is for informational and demonstration purposes only! The actual value of interest payments may differ from the assumed values at any time.
Assumptions used in the calculation:
- The calculation is based on the interest rate currently in effect in <span style="color:#d4af37; font-weight:bold;" >AurumX</span>, so the monthly returns in this simulation are reinvested each month.
- The initial capital, the amount deposited into the LV, can only be a multiple of $100 (100, 200, ..., 1000, ...)
- The monthly interest rate for a 180-day term ranges from 8% to 15%, while for a 360-day term, it can vary between 15% and 25%, depending on AurumX’s business operations. These percentages may decrease at any time if the company reaches the planned value of the Liquidity Vault. e.g., $150,000,000.
- The monthly interest reward is, in reality, random. The program simulates this such that the value displayed here deviates by a maximum of 20% in either direction from the value set in the program.
- In the live LV application, the daily interest lock-in can be disabled on any given day. As a result, the principal grows much more slowly from that point on.
- If the return is set to automatic locking, the following occurs: At the end of each day, the system locks the daily return for 45 or 90 days. Today’s locked return “accrues interest” for 45/90 days and can only be withdrawn afterward. This continues as long as the initial capital is set to automatic locking. For example, on the 22nd day, you turn off compound interest. At that point, you already have 21 packages, and you can withdraw the returns generated by the very first package 112 days after you started.
If there is no compound interest—that is, if daily returns are locked in—then the returns can be withdrawn at any time. Of course, in that case, this calculation isn’t necessary!!!

<em>Note: Hover your cursor over the curve on the graph to see its coordinates</em>

*   Securities and Futures Commission
**  Financial Crimes Enforcement Network
*** Money Services Business`,

        disclaimerText: `These profit simulations and calculations are for informational purposes only and do not constitute official advice. Use of this content is at your own risk.`,
        btnOk: "Back to the calculation",
        lblKivantKivet: "Desired Monthly Withdrawal ($)",
        lblCelHonap: "Target Month to Achieve From",
    	lblKiveszToke: "Withdraw Initial Capital First?",
    	lblBtnSzamol: "Start Calculation",
        lblSzuksegesToke: "Required Initial Capital:",
        lblKerekitettToke: "Rounded Up Initial Capital (Starting Capital):",
    // New error messages
    	lblHibaKivetStart: "Desired withdrawal must be greater than 0!",
    	lblHibaKamatStart: "Interest must be between 8% and 25%!",
        lblHibaHonapStart: "Target month must be greater than 0!"
    }
};