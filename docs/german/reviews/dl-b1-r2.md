# Deutschland B1 (`geschichte`): review r2, historian fact-check

Reviewer: r2 (opus), historian fact-checker. Scope: `content/Guides/Deutschland/Deutschland - B1 - 01…14`. No files were edited.
Rules applied: GERMAN_SYLLABUS §2.7.10, §2.7.11, §9.0, §9.1, §9.3.
Date of check: 2026-10-31.

**URL check.** All 332 cited URLs were requested with curl and checked for soft 404s.
- Dead or unusable:
  - B1-01: archaeologie-online.de (Varusschlacht), which times out.
  - B1-13: laender-analysen.de/ukraine-analysen/255/…, which redirects to the homepage.
  - B1-14: the Bundesregierung page for the Merkel Sommerpressekonferenz, which redirects to the cvd login.
- Blocked for bots but the page exists:
  - B1-12: Bundesstiftung Aufarbeitung, Workuta.
- Exists now after an earlier timeout or 503:
  - B1-04: WZ, Prager Fenstersturz.
  - B1-08: 1914-1918-online, Ukraine.

## Summary

| File | Verdict | blocker | major | minor |
|---|---|---|---|---|
| 01 Германці й Рим | ready after fixes | 1 | 2 | 2 |
| 02 Священна Римська імперія | ready after fixes | 1 | 0 | 2 |
| 03 Гутенберг, Лютер | ready after fixes | 0 | 2 | 4 |
| 04 Тридцятилітня війна | ready after fixes | 0 | 1 | 5 |
| 05 Пруссія й Просвітництво | ready after fixes | 0 | 1 | 4 |
| 06 Наполеон, 1848 | ready after fixes | 0 | 2 | 4 |
| 07 Бісмарк, 1871 | ready after fixes | 0 | 1 | 5 |
| 08 Перша світова | ready after fixes | 0 | 2 | 6 |
| 09 Веймар | ready after fixes | 1 | 2 | 6 |
| 10 NS-Diktatur, Друга світова | ready (minor fixes) | 0 | 0 | 6 |
| 11 Голокост і памʼять | ready after fixes | 0 | 1 | 5 |
| 12 Поділ, Стіна | ready after fixes | 0 | 2 | 9 |
| 13 1989–1990 | ready after fixes | 0 | 2 | 8 |
| 14 ЄС і сьогодні | ready after fixes | 0 | 2 | 3 |
| **Total** | | **3** | **20** | **69** |

## Rulings on the author's open points (B1-10, B1-11)

1. **«УРСР 42,4 → 32 млн» (B1-10, line 99): confirmed. Keep it as written.**
   - The Deutsch-Ukrainische Historikerkommission portal says: «Laut Schätzungen von Mitarbeitern des Mychajlo-Ptucha-Instituts … von 42,4 Millionen am 22. Juni 1941 auf 32 Millionen am 8. Mai 1945».
   - The file already attributes the figure as an estimate and lists the causes (killings, front, famine, deportation, evacuation). That matters: the figure is a population decline, not a death toll.
   - Source: https://www.ukrainianhistoryportal.org/themenmodule/der-zweite-weltkrieg/die-ukraine-unter-deutscher-herrschaft-reichskommissariat-ukraine-und-generalgouvernement/
2. **«1,5 млн євреїв, убитих в Україні» (B1-11, line 52): confirmed as an estimate. Keep «близько».**
   - UINP's German-language page says: «Unter den sechs Millionen ausgerotteten Juden waren 1,5 Millionen ukrainische Juden». UINP gives a single figure with no range.
   - Optional: add that research estimates fall at roughly 1.4–1.6 million. The «майже в кожного населеного пункту був свій Бабин Яр» quote matches UINP's «Fast jede Siedlung hatte ihr eigenes „Babyn Jar“».
   - Source: https://uinp.gov.ua/informaciyni-materialy/ukrayinsko-nimecki-istorychni-dialogy/holocaust-in-der-ukraine
3. **Pogrom deaths in 1938, «близько 1300» (B1-11, line 44): major. Give a range.**
   - The two bpb pages the file cites disagree:
     - The older page 172172 says «Etwa 1.300 Personen starben … durch Gewalt, unmenschliche Haftbedingungen oder Suizid».
     - The newer page 542301, which the file cites for the synagogue count, says the Nazi tally was 91 and «Inzwischen geht die Forschung von über 1.500 Todesopfern aus».
   - Fix: «за оцінками bpb, від близько 1300 до понад 1500 загиблих (включно з тими, хто помер в ув'язненні або через самогубство); нацистський звіт називав 91».
   - The figures 1406 (synagogues and prayer rooms), 191 (synagogues set on fire), ≈30,000 (arrested) and >7,500 (shops) are confirmed by bpb 542301.
4. **«Досвід і персонал T4 згодом використали в таборах смерті» (B1-11, line 48): correct, but it needs a source and more precision. Minor.**
   - Gedenkort T4 confirms that T4 staff were later found in the «Vernichtungslager der „Aktion Reinhard“». Name the camps: Bełżec, Sobibór, Treblinka. Do not say «the death camps» in general.
   - Cite https://gedenkort-t4.eu/wissen/aktion-t4. It is already in the Джерела list but not linked to this claim.
   - Gedenkort T4 also confirms the six centres and «über 70 000» killed by August 1941.

---

## B1-01 Германці й Рим — від Арміна до Карла Великого
Verdict: ready after fixes
- [blocker] lines 422 (q07, marked correct) and 56 — «Музей і парк у Калькризе відкрили 2000 року».
  - Correct fact: only the park opened in 2000. The museum building opened on 21.04.2002. Excavations began in 1989; the Oberesch finds date from 1990.
  - Source: https://www.kalkriese-varusschlacht.de/en/about-us/funding-organizations.html
- [major] line 505 (reel) — «на німецькій ділянці був не суцільний мур».
  - Correct fact: the Raetian Limes had a continuous stone wall (the «Teufelsmauer») that replaced the palisade. Line 360, «keine hohe Mauer», is borderline for the same reason.
  - Source: https://www.limesmuseum.de/welterbe/welterbe-limes
- [major] line 515 — the archaeologie-online.de source is unreachable (timeouts on curl and WebFetch).
  - Effect: the claim at line 69 (reception of the myth after 1918 and under the Nazis) rests on one source only.
  - Fix: replace the link, for example with an LWL or Kalkriese page on the reception of the myth.
- [minor] line 46 — «близько 15 000 легіонерів» rests only on Kinderzeitmaschine.
  - Fix: give the usual range, 15,000–20,000 (three legions plus auxiliaries), with a scholarly source.
- [minor] line 52 — the Ukrainian vocative is «Квінтилію Варе».

Verified OK:
- Hermannsdenkmal 1838/1875, 26.57 m and 53.56 m.
- Suetonius Aug. 23 quote.
- Limes: 550 km, about 900 towers, about 120 forts, UNESCO 2005 (Limesmuseum).
- DWDS on «Kaiser».
- Karl der Große dates, 25.12.800.
- 843, 962, 375/376, 568, 751.
- Arminius killed about 21 AD.

## B1-02 Священна Римська імперія — імператори, курфюрсти, Ганза
Verdict: ready after fixes
- [blocker] lines 74, 347 and 372 (q04 answer key) — the modern Hansetag meets «раз на два роки / alle zwei Jahre».
  - Correct fact: the Internationaler Hansetag of the Städtebund DIE HANSE, founded in 1980 in Zwolle, is held every year. The 46th took place in 2026 in Stargard.
  - Source: https://www.hanse.org/
- [minor] lines 66 and 70 — Bruges 1235 and the Stalhof closing in 1603 match Planet Wissen only.
  - Other references give 1252/53 (the Flemish privileges) and 1598 (closure under Elizabeth I). Hedge these or add a second source.
- [minor] line 62 — the special status of Hamburg and Bremen «походить із цієї доби» is too loose.
  - Correct fact: imperial immediacy was formally secured for Bremen in 1646 and for Hamburg in 1768.

Verified OK:
- 2.2.962, 6.8.1806.
- Goldene Bulle: Nürnberg/Metz 1356 and its chapters; the seven electors.
- Lübeck 1143.
- First and last Hansetag 1356/1669; up to 200 cities; Novgorod 1494 (Planet Wissen).
- Hansemuseum 27.5.2015.

## B1-03 Гутенберг, Лютер і Реформація
Verdict: ready after fixes
- [major] lines 69, 354, 514 and 532 — «14 німецьких перекладів Біблії».
  - Correct fact: these were 14 High German printed editions, plus 4 Low German (18 in total). They mostly reproduce one translation, the Mentelin Bible of 1466.
  - Sources: https://www.die-bibel.de/ressourcen/wibilex/altes-testament/bibeluebersetzungen-christliche-deutsche ; https://www.bibelausstellung.de/home/navi1071_1517_luther-war-nicht-der-erste-bibeluebersetzer
- [major] line 57 — «серйозні історики кажуть: прибиття, найімовірніше, легенда».
  - Problem: this presents a contested question as consensus. It also contradicts the file's own pitfall at line 351 («Історики не мають остаточної відповіді»).
  - Fix: attribute the view (bpb: «sehr wahrscheinlich Legendenbildung»; Iserloh 1962) and say that the 2007 Rörer find reopened the debate.
- [minor] lines 54 and 509 — the Rörer note is quoted as «in valvis ecclesiarum».
  - Rörer's note very likely reads «in valvis templorum». «ecclesiarum» is the wording of the university statutes.
  - Check against the published transcription. The subagent did not check the note itself.
- [minor] line 61 — the Edict of Worms is dated 8 May 1521. Add that it was signed on 26 May 1521.
- [minor] line 73 — the Sendbrief quote is modernised (the original has «auff der gassen»). Say so.
- [minor] line 82 — «десятки тисяч» deaths in the Bauernkrieg is acceptable.
  - Optional: add the usual range of about 70,000–100,000 with a source.

Verified OK:
- B42: 1452–1455, about 180 copies, 49 surviving (Gutenberg-Stiftung).
- «Hier stehe ich» added by the printers (bpb).
- Septembertestament 1522, print run 3,000; full Bible 1534.
- Frankenhausen 15.5.1525.
- Fedorov 1574, Ostroh Bible 1581.

## B1-04 Тридцятилітня війна й Вестфальський мир
Verdict: ready after fixes
- [major] lines 62, 306, 319 and 480 — the population loss is given as one estimate, «16–17 → 10 млн».
  - Correct fact: the bpb APuZ article the file cites gives divergent estimates. Schmidt has 15–17 (possibly 21) million falling to 10–13 million; Gotthard has 16 → 10.
  - Fix: show this as a range, as §2.7.10 requires.
- [minor] line 62 — «кожен третій німець» is in quotation marks, but Planet Wissen only says «geht um ein Drittel zurück». Drop the quotation marks.
- [minor] line 30 — «майбутнього короля Богемії Фердинанда» is wrong. Ferdinand had been crowned in 1617.
- [minor] line 54 — the «десятиденна облога» of Magdeburg is too narrow. The city had been under blockade since autumn 1630 and besieged since spring 1631. Hedge this.
- [minor] line 46 — Christian IV acted as Kreisobrist of the Lower Saxon Circle (bpb), not as «офіцер».
- [minor] lines 105 and 111 — Zboriv is dated 28.08.1649 (Encyclopedia of Ukraine).
  - Check this. Many references give 18 (8 O.S.) August 1649. If both dates are confirmed, give both.

Verified OK:
- The four phases; Prague 1635; the 1.1.1624 cut-off; Nürnberg's population recovering only by 1850 (bpb).
- Magdeburg 20.5.1631, about 20,000 dead (GHDI).
- Diercke losses: rural −40 %, urban −25 %.
- IPO Art. I.
- Zhovti Vody, Korsun, Pyliavtsi.

## B1-05 Пруссія й Просвітництво — Фрідріх II, Кант
Verdict: ready after fixes
- [major] line 37 — «Його онук-тезка Фрідріх Вільгельм I» is wrong.
  - Correct fact: Friedrich Wilhelm I was the son of Friedrich III/I. His namesake grandfather was the Great Elector. Change to «Його син».
- [minor] line 58 — «за півроку після коронації»: Friedrich II was never crowned (there was only a Huldigung). Use «після вступу на престол».
- [minor] line 58 — «чудо дому Бранденбургів» needs context.
  - Friedrich coined «Mirakel des Hauses Brandenburg» in a letter of 1.9.1759, after Kunersdorf. It was only later applied to Elizabeth's death in 1762.
- [minor] line 50 — «мусять бути терпимими» means "must be tolerant". The original means the religions must be tolerated: use «треба терпіти всі віросповідання».
- [minor] lines 91 and 461 — «з 1589 року» (Clusius) is unsourced, and dates differ: Clusius 1588/89, Scholz in Breslau 1587.
  - SPSG gives Bavaria 1647 and Brandenburg in the 1650s. Hedge or cite.

Verified OK:
- The potato myth is correctly debunked (SPSG); 15 Kartoffelbefehle, the first in 1746.
- Kant: December 1784 and the quotes (Deutsches Textarchiv).
- 1701; Katte 1730; 31.5.1740; torture restricted 1740 and abolished 1754.
- Potsdam Edict 1685; Hubertusburg 15.2.1763; 1772 partition and Galicia.
- Mendelssohn.

## B1-06 Наполеон, романтизм і революція 1848 року
Verdict: ready after fixes
- [major] line 48 — «За LeMO, у цій битві зійшлося близько мільйона солдатів» (the Battle of the Nations) misstates the source.
  - Correct fact: LeMO says «weit über 500.000 Soldaten» and more than 90,000 dead and wounded.
  - Source: https://www.dhm.de/lemo/rueckblick/voelkerschlacht-bei-leipzig
- [major] line 561 — the Eichendorff link (chap140) redirects to the book index, and the poem is not on it.
  - Correct link to «Mondnacht»: https://projekt-gutenberg.org/authors/joseph-von-eichendorff/books/joseph-von-eichendorff-gedichte/chapter/141
- [minor] lines 74 and 540 (reel) — «спершу провалився» is not supported by the cited Grimmwelt page.
  - Fix: soften to «продавався повільно» or cite another source. Source: https://www.grimmwelt.de/en/journal/the-childrens-and-household-tales
- [minor] line 136 — the Holovna Ruska Rada «саморозпустилася під тиском влади» in 1851 (EoU); it was not dissolved by the authorities.
  - «200 000 підписів» is not on the cited EoU page. Add «близько» and a source.
- [minor] line 56 — the Karlsbad conference was in August 1819. The Bundesversammlung adopted the decrees on 20.9.1819.
- [minor] line 141 — «грудень 1845 – січень 1846» is only when the Cyril and Methodius Brotherhood was founded. It existed until the arrests of March 1847.

Verified OK:
- Berlin 18.3.1848: «gegen 14:30 zwei Schüsse», more than 250 dead (LeMO).
- Paulskirche 649/587 deputies; Gagern on 19 May (Bundestag).
- Schwarz-Rot-Gold «nicht eindeutig nachweisbar».
- Hambach 20–30 thousand; Wartburg about 500; 6.8.1806; Deutscher Bund 8.6.1815.
- Grimm 1812/1815/1825.

## B1-07 Бісмарк, 1871 і Німецька імперія
Verdict: ready after fixes
- [major] line 132 — the 2021 recognition of the Herero and Nama genocide needs three qualifiers:
  - Maas called it genocide «aus heutiger Perspektive»: politically and morally, not legally.
  - The 1.1 bn EUR is to be paid over 30 years.
  - The Joint Declaration was initialled only, not signed or ratified.
  - As written, it reads like an agreement in force. Source: https://www.bpb.de/kurz-knapp/hintergrund-aktuell/335257/
- [minor] lines 130 and 504 — «на початку жовтня» should be the exact date: von Trotha's order of 2.10.1904.
  - Source: https://www.bpb.de/kurz-knapp/hintergrund-aktuell/176142/
- [minor] line 136 — «75-річним канцлером» is wrong. Bismarck (born 1.4.1815) was 74 when he was dismissed on 20.3.1890.
- [minor] line 79 — there were 397 deputies only from 1874. In 1871 there were 382.
- [minor] line 30 — «Рейхстагу тоді ще не існувало (його створили 1871 року)» is wrong: the Reichstag of the Norddeutscher Bund existed from 1867.
- [minor] line 81 — «нечисленними меншинами» understates them. The Poles alone numbered about 2.5 million.

Verified OK:
- The «Eisen und Blut» quote matches the Bismarck-Stiftung text verbatim.
- Herero figures: 60–80 thousand, about 16,000 survived, about half the Nama (bpb).
- Ems 13.7 and Sedan; 18.1.1871; Reichstag opened 21.3.1871.
- Sozialistengesetz 1878–1890; insurance laws 1883/1884/1889.
- Berlin conference 1884/85; Ems Ukase 30.5.1876.
- The welfare-state and Kulturkampf points are framed as contested.

## B1-08 Перша світова війна
Verdict: ready after fixes
- [major] line 77 — «до 700 000 осіб» (hunger deaths) misstates the source.
  - Correct fact: LeMO says «rund 700.000»; another LeMO page says «rund 750.000»; research estimates range roughly from 420 to 760 thousand.
  - Fix: «за оцінками, близько 700 000 (оцінки різняться)». Source: https://www.dhm.de/lemo/kapitel/erster-weltkrieg/alltagsleben
- [major] line 92 (also line 555) — the account of the Central Rada and the hetmanate oversimplifies and has no date.
  - Correct fact: German troops broke up the Rada on 28.4.1918. On 29.4.1918 the Congress of Khliboroby proclaimed Skoropadskyi hetman, with German backing. Give the date.
- [minor] line 58 — the Thronrede of 4.8.1914 was given to the deputies in the Weißer Saal of the Berlin palace, not «в Рейхстазі». The wording of the quote also varies; mark it as a variant.
- [minor] line 94 — Ukrainians took power in Lviv on 1.11.1918. The name ZUNR was adopted on 13.11.1918.
- [minor] line 140 — Clark's book appeared as *The Sleepwalkers* in 2012; *Die Schlafwandler* was published in 2013.
- [minor] line 132 — the clause about the right and the social democrats is garbled.
  - Intended meaning: the treaty was rejected by everyone from the right to the SPD.
- [minor] line 136 — give the war dead as a range (soldiers about 9–10 million).
- [minor, technical] 26 lines (for example 16, 66 and 68), plus 11 lines in B1-09, contain the mojibake «Ê¼» instead of «ʼ».

Verified OK:
- LeMO: gas 1915 (180 t), Verdun, January strike 1918, Kiel.
- Bundesarchiv: Brest 9.2 and 3.3.1918.
- Versailles 28.6.1919, 237:138 vote, Art. 231, 132 bn gold marks.
- Scheidemann.
- «Dolchstoß» is correctly called a legend.

## B1-09 Веймарська республіка — свобода, криза, падіння
Verdict: ready after fixes
- [blocker] line 72 — «У лютому 1924 року Hitler засудили» is wrong.
  - Correct fact: the trial began on 26.2.1924. The verdict (5 years Festungshaft) came on 1.4.1924.
  - Source: https://www.dhm.de/lemo/kapitel/weimarer-republik/innenpolitik/hitler
- [major] line 61 — «15 листопада 1923 … 4,2 трильйона паперових марок = 4,20 Rentenmark» leaves out the dollar and has the wrong date.
  - Correct fact: the rate 1 USD = 4.2 trillion paper marks = 4.20 Rentenmark was set on 20.11.1923. On 15.11.1923 the Rentenmark was introduced at 1 RM = 1 trillion paper marks (LeMO).
- [major] lines 45, 95 and 535 — the constitution is given only as «липень 1919».
  - Correct fact: adopted on 31.7.1919 (262:75), signed on 11.8.1919 (Verfassungstag), in force from 14.8.1919.
- [minor] lines 59 and 367 — «у середині жовтня … 40 мільярдів»: LeMO puts this «wenig später» after 16 October, so late October.
- [minor] line 113 — only July 1932 (37.3 %) is given. Add September 1930 (18.3 %) and November 1932 (33.1 %, a fall), which supports the "not inevitable" argument.
- [minor] line 49 — «шістнадцять урядів» is LeMO's count; the usual count is about 20 cabinets for 1919–1933. Attribute it to LeMO or give both.
- [minor] lines 85, 506 and 523 — the Bauhaus closure skips a step.
  - Correct fact: the NSDAP-led Dessau council closed it in 1932. It moved to Berlin and closed under Nazi pressure in July 1933.
- [minor] line 40 — Luxemburg and Liebknecht «були вбиті 15 січня 1919»; use that wording and date instead of «загинули від рук бійців Freikorps».
- [minor] line 67 — Schacht was Währungskommissar in November 1923 and became Reichsbank president only on 22.12.1923.

Verified OK:
- LeMO inflation figures; 1 RM = 1 trillion marks on 15.11.1923.
- Hitler putsch: 4 police and 16 marchers dead.
- Women's suffrage 12.11.1918 / 19.1.1919; 37 women MPs.
- Art. 48.
- Ebert 10.12.1918; Hindenburg's «von hinten erdolcht», with the Dolchstoß called a legend.
- Dawes 1924, Young 1929; Bauhaus 1919/1925.

## B1-10 Нацистська диктатура й Друга світова війна
Verdict: ready (minor fixes only). Section rules §9.0 and §9.1 are met:
- 0 `[!reel]` and no emoji (the ✗ marks are order-quiz distractor syntax);
- quizzes test facts and chronology only;
- euphemisms (*Machtergreifung*, *Schutzhaft*, *Volksgemeinschaft*, «Röhm-Putsch», *Ostarbeiter*, *Gleichschaltung*) are explained as euphemisms;
- the myths «Гітлера обрали» and «saubere Wehrmacht» are explicitly refuted.

Findings:
- [minor] line 114 — «Україна з 2023 року відзначає 8 травня як День памʼяті та перемоги…» needs precision.
  - Correct fact: the law was adopted in May 2023, so the first observance under the new name was in 2024. From 2015, 8 May had already been marked as the День памʼяті та примирення.
  - Source: the cited UINP news page.
- [minor] line 106 — «Того ж вечора Штауфенберга … розстріляли»: it happened shortly after midnight, «in der Nacht zum 21. Juli 1944».
  - Source: https://www.gdw-berlin.de/ort-der-erinnerung/der-bendlerblock
- [minor] line 554 — the heading «Символи й заперечення — під забороною» cites only § 86a StGB, which covers symbols.
  - Denial is § 130 Abs. 3 StGB. Add it or change the heading. Source: https://www.gesetze-im-internet.de/stgb/__130.html
- [minor] line 86 — «Табори для радянських полонених здебільшого підпорядковувалися Вермахтові» is true (OKW), but the cited LeMO page does not say it.
  - Cite the bpb volume «Dimensionen eines Verbrechens», already listed, for this claim.
- [minor] line 78 — the secret protocol also assigned Finland and Bessarabia to the Soviet sphere. Bessarabia matters for Ukraine (1940).
  - Fix: «Польщу, Балтію, Фінляндію й Бессарабію». Source: https://www.dhm.de/lemo/kapitel/ns-regime/aussenpolitik/hitler-stalin-pakt-1939
- [minor] line 66 — the law of 31.3.1933 «розпустив ландтаги» needs precision.
  - Correct fact: the law re-formed the Landtage according to the Reichstag result of 5 March, without the KPD. The Landtage were abolished altogether on 30.1.1934 (Gesetz über den Neuaufbau des Reichs).

Verified OK:
- Cabinet of 30.1.1933 with 3 NSDAP members (Bundestag).
- NSDAP results 37.3 % / 33.1 % / 43.9 %; about 50,000 Hilfspolizei; KPD mandates annulled on 8.3.1933 on the basis of the Reichstagsbrandverordnung (LeMO Reichstagswahl 1933).
- 1 February dissolution of the Reichstag; § 1 text (1000dokumente).
- 444:94 and the Wels quote.
- «Röhm-Putsch» about 200 murdered; 2.8.1934 and the oath to Hitler (LeMO Jahreschronik 1934).
- Soviet POWs: 5.7 million captured, 3.3 million dead, about 2 million dead by February 1942 (LeMO Kriegsgefangenschaft).
- Distrikt Galizien 1.8.1941; RKU from 1.9.1941 with Koch and Rivne; Transnistria; the 42.4 → 32 million estimate (Historikerkommission portal).
- Babyn Yar 33,771, EM Nr. 101 of 2.10.1941.
- Kyiv 19.9.1941 / 6.11.1943; Ostarbeiter-Erlasse 20.2.1942.
- Elser 8.11.1939 / 9.4.1945; Scholl and Probst 22.2.1943; the 4th leaflet quote.
- Capitulation: Reims 7.5, Karlshorst, in force 8.5 at 23:01; Weizsäcker quote.
- Wehrmacht exhibitions 1995 / 2001: the bpb page confirms that the Bundestag rejected the Greens' motion to show the exhibition on 24.4.1997.

## B1-11 Голокост і культура памʼяті
Verdict: ready after fixes. Section rules are met: 0 reels, no emoji, no guess-the-number quizzes, euphemisms (*Endlösung*, *Sonderbehandlung*, *Umsiedlung*, «Euthanasie», *exekutiert*, «Reichskristallnacht») are explained, and all victim groups are named.

Findings:
- [major] line 44 (also the diagram at 118 and the sources at 531) — «близько 1300» pogrom deaths is attributed to bpb «за сучасними даними», but the newer bpb page the file cites says «über 1.500».
  - Fix: give the range «від ≈1300 до понад 1500 (оцінки bpb різняться); нацистський звіт — 91».
  - Source: https://www.bpb.de/kurz-knapp/hintergrund-aktuell/542301/novemberpogrom-1938/
- [minor] line 48 — the T4 personnel claim is correct but has no inline source. Name the Aktion Reinhard camps (Bełżec, Sobibór, Treblinka) and cite https://gedenkort-t4.eu/wissen/aktion-t4.
- [minor] lines 48 and 77 — the same group is given as «200 000–300 000» in the narrative (Gedenkort T4) and «250 000–300 000» in the victims list (USHMM).
  - Fix: name both sources at one point, or use one range throughout.
- [minor] line 91 — «Так виникло слово die Vergangenheitsbewältigung» (after the Auschwitz trial) is wrong.
  - Correct fact: the word was already in use in the mid-1950s, before 1963. Write «Тоді поширилося слово».
- [minor] lines 108 and 374 — «Станом на 2026 рік … 116 000 … понад 1860 громад … 31 країни» matches stolpersteine.eu, but the page has no reference date.
  - Fix: write «за даними проєкту (сайт, 2026)».
  - Also: «Ein Stein liegt immer vor dem Haus» overstates the rule. The project says «möglichst vor der letzten selbst gewählten Wohnadresse», with exceptions, so use «in der Regel».
  - Source: https://www.stolpersteine.eu/das-kunstdenkmal/schritte-zur-stolperstein-verlegung
  - The claim that relatives should not pay is confirmed («kein Geld von den Opfern oder den Angehörigen … verlangen»).

Verified OK:
- USHMM figures: 6 million Jews; Roma 250–500 thousand; 250–300 thousand disabled people incl. ≥10,000 children; 3.3 million Soviet POWs; about 1.8 million Poles; about 1,700 Jehovah's Witnesses; tens of thousands of political opponents.
- 1406 / 191 / 30,000 (bpb).
- 1.5 million murdered in Ukraine and «Fast jede Siedlung…» (UINP).
- T4: six centres, >70,000 (Gedenkort T4).
- EM 101 wording and 33,771.
- Wannsee 20.1.1942, 15 participants, 11 million in the protocol.
- Auschwitz: 1.1 million, about 1 million Jews, 70,000 Poles, 21,000 Roma, 15,000 Soviet POWs (Memorial).
- Auschwitz-Erlass 16.12.1942; Schmidt 17.3.1982.
- Frankfurt trial 20.12.1963–20.8.1965, 6 life sentences / 11 prison terms / 3 acquittals.
- Kniefall 7.12.1970; Herzog 3.1.1996; UN resolution 60/7 of 1.11.2005.
- Denkmal 25.6.1999 / 10.5.2005, 2711 stelae.
- Stolpersteine 96×96×100 mm.
- Yad Vashem statement of 1.3.2022.

## B1-12 Поділ — ФРН і НДР, Стіна
Verdict: ready after fixes
- [major] line 35 — «на Ялті домовлялися про три зони; Франція отримала власну зону пізніше» is wrong.
  - Correct fact: the three zones come from the London Protocol of 1944. At Yalta the Big Three agreed on a French zone, carved out of the US and UK zones.
  - Source: https://www.hdg.de/lemo/kapitel/nachkriegsjahre/befreiung-und-besatzung/alliierte-besatzung.html
- [major] line 78 — the internal Stasi figure for 1988, «близько 110 000» IM, is unsourced, and the cited bpb page does not contain it.
  - Fix: give the range 109,000 (Kowalczuk, «Stasi konkret», 2013) to 189,000 (Müller-Enbergs / BStU) and name both.
  - Source: https://www.bpb.de/themen/deutsche-teilung/stasi/219122/wer-war-taeter/
- [minor] lines 72 and 120 — «близько 50» deaths on 17 June 1953: the research standard is 55 documented deaths. Give «≈50–55».
  - Source: https://www.bpb.de/themen/deutsche-teilung/der-aufstand-des-17-juni-1953/152604/die-toten-des-volksaufstandes-vom-17-juni-1953/
- [minor] line 70 — «16 червня близько 80 будівельників» has no source. Remove the number or source it.
- [minor] lines 29, 84, 420 and 592 — «≈2,8 млн» refugees: bpb gives «2,7 bis 3 Millionen». Give the range. Line 144 («fast drei Millionen») does not match 2.8.
  - Source: https://www.bpb.de/kurz-knapp/hintergrund-aktuell/337560/1961-bau-der-berliner-mauer/
- [minor] lines 80 and 571 (reel) — «з січня 1992 року понад 3,4 мільйона громадян подали заяви» needs three fixes:
  - the Bundesarchiv counts 3,499,663 applications as of 31.12.2025, so «майже 3,5 млн»;
  - they are applications, not people;
  - the count starts from late 1990, not 1992.
  - Source: https://www.bundesarchiv.de/stasi-unterlagen-archiv/das-stasi-unterlagen-archiv-in-zahlen/
- [minor] lines 97 and 418 — «Nur noch sieben Übergänge» is placed in the night of 13 August. In fact 12 crossings stayed open that night; they were cut to 7 around 23 August.
- [minor] line 107 — the course gives no figure for deaths at the inner-German border, which §2.7.11 asks for. Add 327 deaths, 1949–1989 (FU Forschungsverbund SED-Staat, 2017).
- [minor] line 74 — Norilsk is not covered by the cited Vorkuta article. Vorkuta: strike from 19.7, crushed on 1.8.1953. Also fix the typo «у літку».
- [minor] line 41 — the social market economy and the currency reform date from June 1948, but the sentence follows one about 12.5.1949. Reword.
- [minor] line 37 — «одна партія» is imprecise, because the bloc parties still existed. Better: the SED held a monopoly on power.

Verified OK:
- 17 June figures (LeMO).
- Blockade 24.6.1948–12.5.1949.
- Wirtschaftswunder figures.
- Stasi: 91,000 staff, 1:180.
- 155 km of Wall; at least 140 Wall deaths (Chronik der Mauer); Gueffroy 5.2.1989.
- Ulbricht quote wording.
- Kennedy: about 450,000 listeners.
- Grundgesetz 8 May / 23 May; DDR 7.10.1949.
- Grundlagenvertrag 21.12.1972.

## B1-13 1989–1990 — мирна революція й обʼєднання
Verdict: ready after fixes
- [major] lines 107 and 529 — the black-market rate is placed too early.
  - Correct fact: right after the Wall fell, the black-market rate was about 1:20. The 1:8 rate belongs to early 1990, after the 1:5 official rate for savings came in.
  - Source: https://www.bundesregierung.de/breg-de/schwerpunkte/deutsche-einheit/d-mark-wird-zahlungsmittel-353940
- [major] line 599 — the laender-analysen.de/ukraine-analysen/255/… link is dead: it redirects to the homepage. Replace or remove it.
- [minor] line 55 — «2 жовтня — понад 20 000»: bpb says «bis zu / etwa 20.000».
- [minor] line 63 — «16 жовтня понад 120 000»: bpb says «mehr als 100.000».
  - Fix: «за оцінками, понад 100 000 (до 120 000)».
  - Sources for this and the item above: https://www.bpb.de/kurz-knapp/hintergrund-aktuell/295940/1989-die-erste-montagsdemonstration/ ; https://www.bpb.de/themen/deutsche-teilung/ddr-kompakt/521596/montagsdemos-in-leipzig/
- [minor] line 63 — Alexanderplatz on 4.11.1989: add the range of estimates, roughly 200,000 to 1 million, as §2.7.11 requires.
- [minor] lines 57, 124 and others — «щонайменше 70 000» on 9 October is correct (bpb), but add «за оцінками» at least once.
- [minor] line 73 — «До півночі відчинилися всі пункти пропуску» has no source; the cited Hertle text covers only Bornholmer Straße. Use «у ніч на 10 листопада».
- [minor] lines 75 and 580 (reel) — the Bundestag sequence on 9.11.1989 is compressed.
  - Correct fact: the session was interrupted at 20:22 and resumed at 20:46. The anthem was sung around 21:00, after Seiters' statement and the speeches.
  - Source: https://www.bundestag.de/webarchiv/textarchiv/2014/kw45_mauerfall-337756
- [minor] lines 576–577 (reel) — «Горбачов цього не казав» overstates it. LeMO says the catchphrase came from the interpreter's translation of what he did say, so use «так дослівно не казав».
- [minor] line 153 — UINP's name for the event is «Ланцюг злуки», not «Ланцюг єднання».
  - Source: https://uinp.gov.ua/istorychnyy-kalendar/sichen/21/1990-symvolichnyy-lancyug-zluky-ukrayinska-hvylya-vid-kyyeva-do-lvova
- [minor] line 70 — the Schabowski wording is correct. Optionally add that «unverzüglich» was prompted to him from the room and he repeated it (Chronik der Mauer transcript).

Verified OK:
- Hungary 2.5 / 19.8 / 11.9.1989; Genscher in Prague 30.9.1989.
- «Wir sind ein Volk» (Bundesregierung).
- Honecker 17/18.10.1989.
- Brandt's «zusammenwächst» interview, correctly marked as contested.
- Währungsunion exchange limits; Einigungsvertrag 31.8.1990; 23.8 vote 294:62:7.
- 2+4 Treaty 12.9.1990; Soviet troops gone by 31.8.1994.
- Treuhand figures (bpb); Volkskammer election 18.3.1990.
- Ukrainian events 1989–1991: event- and date-only, symmetric.

## B1-14 Німеччина в ЄС і сьогодні
Verdict: ready after fixes. Fast-moving figures are dated well. Findings:
- [major] line 514 — the Merkel source, the Bundesregierung page «Sommerpressekonferenz… 848300», now redirects (301) to the press-centre login at cvd.bundesregierung.de. It is not publicly readable.
  - Fix: replace it with a public transcript, for example bpb, germanhistorydocs.org or the Bundesregierung Mitschrift archive.
  - The quote wording itself is the well-known authentic text.
- [major] lines 47 and 513 — the text says «У лютому 2026 року МВС продовжило контроль ще на пів року», which is outdated as of the review date.
  - Correct fact: the cited Mediendienst page (as of 8.10.2026) confirms the February 2026 extension. It adds that the BMI plans, per media reports, to extend controls to mid-March 2027.
  - Fix: write «станом на жовтень 2026 …» and give the planned date.
  - Also: «З 16 вересня 2024 … на всіх кордонах» should say that this extended earlier controls (Austria since 2015; Poland, Czechia and Switzerland since October 2023).
  - Source: https://mediendienst-integration.de/fluechtlinge/fluechtlinge-in-deutschland/grenzkontrollen-und-zurueckweisungen/
- [minor] line 355 — «Etwa ein Viertel von ihnen waren Kinder und Jugendliche» is not on the cited Mediendienst page. Source it (BAMF / AZR) or drop it.
- [minor] line 83 — «12,4 млн … (14,9 %)»: Destatis gives 12.4 million but no percentage. 14.9 % is the author's calculation; write «≈ 15 %» or mark it as calculated.
- [minor] line 359 — «bis Ende 2025 rund 467.000»: correct, 467,081 as of 31.12.2025. Keep, and optionally add «laut AZR (Stichtag 31.12.2025)».

Verified OK:
- Kiel Institute Policy Brief 217 (10/2026): largest single donor in 2025–2026, about 80 % military, 31–42 bn EUR depending on method, 12th place relative to GDP.
- EEAS 17.7.2026: temporary protection extended to 4.3.2028; the military-obligations condition applies only to new applicants. Optionally add «лише для нових заявників».
- Mediendienst: 1,366,969 refugees as of 30.9.2026.
- Destatis: 58.6 % renewables (of grid feed-in), wind 30.0 %, PV 16.0 %, gas 16.1 %; population 83.5 million at the end of 2025, first decline since 2020.
- Duden: «Zeitenwende» in the Duden since the 17th edition (1973), so the reel is correct.
- Rome 25.3.1957 / 1.1.1958; Maastricht 7.2.1992 / 1.11.1993.
- Euro: 1.95583, 1.1.1999 / 2002 in 12 countries.
- Schengen: 14.6.1985 on a ship, 26.3.1995, 29 states in 2025.
- BAMF: 890,000 arrivals; 476,649 and 745,545 applications.
- Atomausstieg 30.6.2011 / 15.4.2023.
- Scholz quote, 100 bn, >2 %; GfdS 2022 and its top 10.
- Merz 6.5.2025, second round, 325 votes.
- EU anthem: 1972 / 1985.

---

## Worst issues (fix first)
1. B1-09, line 72: Hitler «засудили в лютому 1924». The verdict was on 1.4.1924.
2. B1-02, q04 answer key: the Hansetag «alle zwei Jahre». It is held every year.
3. B1-01, q07 answer key: Kalkriese museum «2000». The museum opened in 2002; only the park opened in 2000.
4. B1-05, line 37: Friedrich Wilhelm I called the «онук» of Friedrich I. He was his son.
5. B1-06, line 48: Völkerschlacht «близько мільйона солдатів», attributed to LeMO. LeMO says «weit über 500.000».

Also high on the list:
- B1-11: pogrom deaths need the range 1,300–1,500+.
- B1-12: Yalta and the zones.
- B1-13: timing of the black-market rate.
- B1-14: dead Merkel source and outdated border-control status.
