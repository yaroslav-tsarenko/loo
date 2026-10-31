# Review: Deutschland A2-06 … A2-10 (round 2, fresh reviewer)

Standard: `docs/GERMAN_SYLLABUS.md` §2 (incl. §2.6, §2.7), §9, §9.0 and table §9.2; `docs/german/LESSONS.md`.
Model: B1-13. Checked on 2026-10-31. I did not edit any chapter.

**Summary:** 0 blockers · 17 majors. Every chapter is **ready after fixes**.

How I checked:
- I grepped `[!word]` duplicates across `content/Guides/Deutsch*`. I found one duplicate: `die Mundart` (ch10, which A2-04 already owns).
- I checked every source link with curl and WebFetch.
- I checked stress, gender, plural and usage labels on duden.de for: parkieren, Trottoir, Spital, Jänner, Erdapfel, Znüni, Obers, Sackerl, Velo, Paradeiser, Matura, Melange, Kaffeehaus, Rosenmontag, Wiesn, Röstigraben and Automat.
- I counted the words in each Landeskunde-Text.

---

## A2-06. Свята II — Karneval, Ostern, Oktoberfest, Sankt Martin, Maibaum

**Verdict: ready after fixes** (4 major)

### Major
- [major] line 214 and line 109 — `die Wiesn` has `forms: — (зазвичай лише множина)`, and the example says *Auf **den** Wiesn trinkt man Bier*. Duden gives `die Wiesn; Genitiv: der Wiesn`: a feminine singular (Bavarian *Wiese*). «auf den Wiesn» is wrong, and it also contradicts the card's own note (*auf der Wiesn*). — Fix: `forms: die Wiesn (мн. рідко)`, and change the example to *Auf der Wiesn trinkt man Bier aus der Maß.*
- [major] line 301 — the `Tag der Deutschen Einheit` note says: «*Deutschen* — прикметник у давальному після *der*». This is a genitive (*der Tag **der** Einheit*), not a dative. The adjective declension is weak, as the note says. — Fix: «*der Deutschen Einheit* — родовий відмінок (Genitiv): «день (чого?) німецької єдності»; прикметник — слабка відміна».
- [major] lines 80 and 63 — the timeline step says Oktoberfest «закінчується на початку жовтня — разом із Tag der Deutschen Einheit». That reads as an every-year rule, but it is a coincidence of 2027. 2026 ran 19.9–4.10. The real rule (muenchen.de) is never stated:
  - the festival starts on the Saturday after 15 September;
  - it ends on the first Sunday of October;
  - if that Sunday is 1 or 2 October, it is extended to 3 October.

  — Fix: state the rule once in the narrative or in the pitfall at l. 384. In the diagram, write «2027: 18.9.–3.10. (3.10. — перша неділя жовтня)».
- [major] q10 (line 489) — the bank distractor *Wiese* also fits gap 1: «Das Oktoberfest findet auf der [[Wiese]] statt» is grammatical and plausible. That gives two defensible answers (LESSONS). — Fix: replace *Wiese* with *Wiesen* or *Theresienplatz*, or rephrase gap 1 so that only the compound fits (e.g. «auf der [[Theresienwiese]], kurz *Wiesn*, …» with *Wiese* removed).

### Minor
- [minor] line 360 — `[!speak]` s01 IPA has /ˈʁoːzn̩ˌmoːntaːk/. Duden stresses Ro|sen|**mọn**|tag, as the card at line 134 correctly has (/ˌʁoːzn̩ˈmoːntaːk/). — Fix: make s01 match the card.
- [minor] lines 29 and 464 — «2027 року Ostern **було** 28 березня»: 2027 is in the future. — Fix: «буде / припадає на».
- [minor] line 43 — «кордон між ними проходить по Benrather Linie» is overstated. The source is a city blog (Köln-Lotse). *Helau* is also the cheer in Mainz, far south of that line. *Daach/Daak* is not the maken/machen isogloss either. — Fix: «за місцевою традицією …» or drop the Benrather-Linie claim.
- [minor] lines 92–93 — the compare diagram puts «Fastnacht, Fasenacht, Fasnet · Швейцарія: Fasnacht» in the **Fasching** column. In AdA these are a separate third zone (west/south-west, CH). — Fix: give them their own column, or label the row «інші регіони».
- [minor] line 69 / line 395 — Weiberfastnacht «лютий–березень» / «im Februar oder im März». It can fall as early as 29 January (Easter on 22 March). — Fix: «кінець січня – початок березня».
- [minor] line 218 — `das Festzelt` /ˈfɛstˌtsɛlt/ uses ˌ in a 2-syllable compound. §2.7.1 allows ˌ only from 3 syllables. — Fix: /ˈfɛsttsɛlt/.
- [minor] line 500 — «сусіднє село **крадуть** Maibaum» does not agree. — Fix: «хлопці з сусіднього села крадуть Maibaum» / «сусіднє село краде».
- [minor] Ukrainian wording:
  - l. 57 «кльоцками» — use «кнедлями (Klöße)»;
  - l. 384 «Назва мовить про жовтень» — use «Назва вказує на жовтень»;
  - l. 384 «головна неділя припала на останню неділю вересня» is clumsy — use «з 1905 року головну неділю свята перенесли на останню неділю вересня»;
  - l. 410 «високий пункт» calques *Höhepunkt* — use «кульмінація»;
  - l. 109 «з маса-кухля» — use «з літрового кухля (Maß)».
- [minor] lines 394–399 — the Landeskunde-Text has 91 words. LESSONS gives A2 ≈ 100–140. — Fix: add 1–2 sentences, e.g. about Kostüme or the date of Rosenmontag.
- [minor] line 535 — the reel line «Дерево біля Zugspitze — близько 18 метрів» is an orphan fact with no point. — Fix: drop it or explain it.
- [minor] line 6 — the tags lack `skills` and `land` (compare A2-01…03, 07 and B1-13). — Fix: `[deutsch, landeskunde, skills, a2, land, feste, …]`.
- [minor] coordination — A2-27 «Свята й традиції» (de-a2-feste; not yet written) comes earlier in course order. Under §2.6.10a it will own *Ostern / Osterhase / Osterei / Karneval* if it cards them. — Fix: flag this to the A2-27 author, or plan to drop w10/w11 here.

### Verified
- Rosenmontag = Easter − 48 days. For 2027: Easter is 28.3, so Rosenmontag is 8.2. koeln.de confirms 8.2.2027.
- Aschermittwoch = Easter − 46 days. Easter falls between 22.3 and 25.4.
- Oktoberfest 2027 runs 18.9–3.10, and the end-date rule is as stated above (muenchen.de).
- The wedding was on 12.10.1810 and the horse race on 17.10.
- Since 1905 the main Sunday has been the last Sunday of September, and the festival lasts «in der Regel 16 Tage» (Historisches Lexikon Bayerns).
- Visitors: ≈ 6.5 million from 1990 and ≈ 6 million in 2011 (HLB).
- Beer prices: 3 Kreuzer 3 Pfennig in 1810; 10.70–11.50 € in 2018; 13.60–15.30 € in 2024 (HLB).
- Anstich since 1950 in the Schottenhamel tent (HLB).
- Rosenmontagszug (koeln.de):
  - start at 10:00;
  - ≈ 12,000 participants (the 2026 statistic says 11,500 — fine as «близько»);
  - 300 t of sweets and 300,000 Strüßjer.
- Duden: Rosenmontag (stress on *mon*), Wiesn (feminine singular).

---

## A2-07. Їжа й напої — регіональна кухня

**Verdict: ready after fixes** (2 major)

### Major
- [major] q08 (line 447) — the bank distractor *Frühstück* fits gap 1. «Zum Frühstück gibt es oft Brot, Käse und Wurst» is true in Germany, so the item has two defensible answers. — Fix: make gap 1 unambiguous, e.g. «Am Abend gibt es oft [[Abendbrot]]: Brot, Käse und Wurst», or swap the distractor for *Mittag*.
- [major] line 371 — «*Ich habe Hunger / Durst* … а не «я голодний»» marks correct German as wrong. *Ich bin hungrig / durstig* is standard, only less frequent (LESSONS: «Correct German marked as an error»). — Fix: «частіше кажуть *Ich habe Hunger*; *Ich bin hungrig* теж правильно, але звучить книжніше».

### Minor
- [minor] line 356 — the Cyrillic hint «перший склад «кьо»» for Currywurst breaks §2.7.1 (no umlauts in Cyrillic) and §2.7.17 (no «ьо»). — Fix: describe the sound instead: «[œ] — коротке «е» з губами, як для «о»».
- [minor] l. 41 «вуличка страва» — use «вулична страва».
- [minor] l. 70, 197, 200 «клецки», «клецка» are Russian. — Fix: «галушки» or «клецьки».
- [minor] l. 303 «в обіднику» is not a word — use «вдень / по обіді».
- [minor] l. 420 «пиють» — use «пʼють».
- [minor] l. 70 and l. 512 — «Швабія, а це весь Баден-Вюртемберг і баварська Швабія». Schwaben ≠ all of BW: Baden is not Swabia. If the g.g.A. specification defines its area that way, say so. — Fix: «зона захисту за специфікацією g.g.A. охоплює Баден-Вюртемберг і баварський округ Schwaben».
- [minor] l. 83 and l. 87 — the diagram labels Brotzeit/Vesper as «вечеря». In Bavaria Brotzeit is a cold snack at any time of day, often mid-morning. — Fix: label it «холодна закуска».
- [minor] l. 121 and l. 348 vs l. 115 — IPA consistency:
  - `die Brotzeit` /ˈbʁoːtˌtsaɪ̯t/ has ˌ in a 2-syllable word (§2.7.1);
  - s02 /ˈaːbn̩tbʁoːt/ and s03 /ˈkœʁivʊʁst/ drop the ˌ that the cards have.

  — Fix: unify the IPA.
- [minor] line 245 — `herzhaft` with `forms: herzhafter · am herzhaftesten`. §2.3 wants only irregular comparatives here, and the word is B1 rather than A2. — Fix: omit `forms:` and set `level: B1`.
- [minor] line 192 — a stray `> ` line glued to the next heading. — Fix: delete it.
- [minor] line 380 — «In Bayern trinkt man **dazu** ein Bier» comes right after Labskaus in Hamburg, so *dazu* has no logical referent. — Fix: «In Bayern trinkt man gern Bier.»
- [minor] line 71 — «Це страва моряків, бо інші продукти на кораблях довго не зберігалися»: the causality is muddled. — Fix: «бо солонина й картопля довго зберігалися на кораблях».
- [minor] q06 option «лише три види хліба: світлий, темний і жито» is near a joke distractor, and «жито» is a grain, not a bread type. — Fix: «понад 30 000 сортів» or «близько 300 сортів».
- [minor] line 29 — the Brotinstitut page now says «über 3.200 Brotspezialitäten» (counter: 3232). «Понад 3000» is still true, but quote the institute's own figure: «понад 3200 (Brotinstitut, 2026)».
- [minor] source DPMA (dpma.de) — curl returns ECONNREFUSED (the site blocks bots). The content is confirmed via the DPMA English page and the press. — Fix: check it in a browser, as the goethe.de exception (§2.6.9) allows.
- [minor] structure — §9.0 asks for a timeline `[!diagram]`. This chapter has flow and compare instead, which is acceptable for food. Just note the deviation.

### Verified
- Reinheitsgebot (Deutscher Brauer-Bund; Bundestag WD 5-3000-142/20):
  - 23.4.1516, Ingolstadt, issued by Wilhelm IV and Ludwig X;
  - ingredients Gerste, Hopfen, Wasser, with no yeast;
  - today in § 9 VorlBierG. That law was formally repealed in 2005, but § 9 still applies, so the chapter's wording is correct.
- Currywurst (DPMA via its English page, Tagesspiegel):
  - Herta Heuwer, 4.9.1949, Kantstraße / Kaiser-Friedrich-Straße;
  - «Chillup» registered on 21.1.1959.
- German bread culture entered the national register in 2014 (Brotinstitut / Deutsche UNESCO-Kommission). There are > 3000 varieties (3232).
- 13 Weinbaugebiete — consistent with DWI.
- Spätzle g.g.A. — Regulation 186/2012.

---

## A2-08. Побут і культурні коди — пунктуальність, сміття, тиша, неділя

**Verdict: ready after fixes** (2 major)

### Major
- [major] lines 109, 363, 382 and 432 — *zum **Pfandautomat***, *in den **Pfandautomat***. *Automat* is a weak (n-declension) noun. Duden gives *des Automaten*, and so: *zum Pfandautomaten*, *in den Pfandautomaten*. The error sits in an example, in the Landeskunde-Text, in q03 and in the q08 `order`. — Fix: change all four.
- [major] q12 (lines 477–478) — two problems:
  - The bank distractor *Ruhezeit* fits «Um 22 Uhr beginnt die [[Nachtruhe]]» (feminine, and semantically right), so there are two answers.
  - «Die Wohnung ist **leise**» is unnatural German, and it contradicts the chapter's own pitfall at l. 356 (*ruhig* for a place).

  — Fix: replace *Ruhezeit* with *Mittagsruhe* plus a cue such as «Um 22 Uhr (in der Nacht) …», or use *Ruhestörung*. Rewrite line 4 as «Die Wohnung ist ruhig, es gibt keinen [[Lärm]].»

### Minor
- [minor] line 72 — «порушення нічної тиші, яке можна записати в Hausordnung і навіть оштрафувати» is muddled. — Fix: «… порушення нічної тиші: Hausordnung його забороняє, а за § 17 LImschG NRW можливий штраф».
- [minor] line 148 — `die Biotonne` /ˈbi̯oːˌtɔnə/: Bio has two syllables [ˈbiːo]. — Fix: /ˈbiːoˌtɔnə/.
- [minor] lines 222 and 261 — the verb `forms:` lack the infinitive and person (`stört · störte · hat gestört`). A2-06 uses `er stellt auf · …` and §2.6.4 / LESSONS use `stören → störte → hat gestört`. — Fix: pick one format for the whole section.
- [minor] line 227 — `leise` (adj) is glossed «тихо, негучно» (adverbs). — Fix: «тихий, негучний; тихо».
- [minor] line 449 — q10 stem «ми маємо бути тихо» is ungrammatical Ukrainian. — Fix: «ми маємо поводитися тихо».
- [minor] q09 option «рівно 100 % разів» is a joke distractor (LESSONS). — Fix: «близько 80 %».
- [minor] lines 47–60 — the five waste streams are drawn as `layout: flow` with steps, though they are categories, not a sequence. `compare` or a plain table would fit better.
- [minor] coordination — A2-24 «Гроші…» lists *Pfand* and *Bargeld* in its syllabus content but cards neither, so there is no duplicate today. Ask the A2-24 author not to card them later; if they do, they own them (§2.6.10a).

### Verified
- Pfand: 25 ct for Einweg; usually 8 or 15 ct for Mehrweg; wine and spirits are exempt (BMUKN FAQ, Verbraucherzentrale).
- Nachtruhe (lexmea / § 17 LImschG):
  - § 9 LImschG NRW sets it at 22–6;
  - § 17(3) sets the fine at up to 5000 €, as the chapter says.
- TA Lärm: day 6–22, night 22–6.
- 32. BImSchV § 7: Sundays and holidays all day, weekdays 20–7.
- Art. 140 GG + Art. 139 WRV: wording correct.
- Ladenschluss has been a Land matter since 2006. Bavaria's BayLadSchlG of 25.7.2025 entered into force on 1.8.2025: weekdays 6–20 (IHK, gesetze-bayern.de).
- Bundesbank «Zahlungsverhalten 2023» (Bundesbank page):
  - cash 51 % of transactions (2021: 58 %);
  - by turnover: debit card 32 %, cash 26 %.
- Duden: Automat (n-declension).

---

## A2-09. Австрія — Відень, Габсбурги, австрійська німецька

**Verdict: ready after fixes** (3 major)

### Major
- [major] line 54 — the diagram step says «1955: Staatsvertrag … і **наступного року** — закон про нейтралітет». Both are 1955 (15.5 and 26.10), as the text, the pitfall and q05 say. — Fix: «а 26 жовтня того ж року — закон про нейтралітет».
- [major] content — the syllabus row (§9.2, A2-09) lists **Mozart**, but the chapter never mentions him. — Fix: add a short paragraph (Salzburg 1756, Vienna, *Die Zauberflöte*), a reel or a `[!listen]`, ideally with a sourced fact (Stiftung Mozarteum).
- [major] count — there are 10 `[!quiz]`. §9.0 (the binding Deutschland anatomy) requires **12–14 tests**: 1 predict + 3 on the Landeskunde-Text + practice. — Fix: add 2–4 items, e.g. a Mozart item and a `fill` on Staatsvertrag/Neutralität.

### Minor
- [minor] line 39 — two inaccuracies about the Habsburgs and the imperial crown:
  - «Згодом корона Священної Римської імперії майже без перерви лишалася в Габсбургів до 1806» skips 1282–1438, when Luxembourgs, Wittelsbachs and others held the crown.
  - Rudolf I was elected Roman-German **king** in 1273 and was never crowned emperor.

  — Fix: «з 1438 року (з короткою перервою 1742–1745) корона … лишалася в Габсбургів»; «1273 року Рудольфа обрали римсько-німецьким королем».
- [minor] AT vocabulary against Duden:
  - Jänner, Paradeiser, Erdapfel and Matura match Duden exactly.
  - **Obers**: Duden has «bayrisch, besonders ostösterreichisch», not just «AT».
  - **Sackerl**: Duden has «bayrisch, österreichisch», with no «umgangssprachlich»; the table at l. 74 says «розмовне».

  — Fix: correct the labels.
- [minor] card levels (§2.6.5) — Duden marks Paradeiser, Erdapfel, Matura and Kaffeehaus as Goethe **B1** vocabulary, but the cards say A2. — Fix: `level: B1`.
- [minor] line 161 — Melange: in Austria [meˈlãːʃ] (voiceless) is usual. — Fix: add to `note:` «AT часто [ʃ] на кінці».
- [minor] line 335 — the vocabulary list glosses *aufliegen*, but the text uses *liegen*. — Fix: drop the gloss or use *aufliegen* in the text.
- [minor] q06 (line 384) — «Österreichisch sagt man Jänner» is unnatural. — Fix: «In Österreich sagt man …».
- [minor] l. 318 «У Австрії теж зрозуміють» — use «В Австрії» (sentence start before a vowel).
- [minor] line 63 — the date «2011 року (10 листопада)» is not confirmed by unesco.at, which gives only 2011; the Stadt Wien press release is dated 11.11.2011. — Fix: drop the day or source it.
- [minor] line 431 — «Ostarrîchi-Park»: check the name and spelling. Wien Geschichte Wiki has «Ostarrichipark» (Wien 9).
- [minor] line 6 — the tags lack `skills`.

### Verified
- Ostarrichi: 1.11.996, Otto III, Freising, Neuhofen an der Ybbs.
- Habsburgs: 1273, 1278 Marchfeld (26.8, Dürnkrut/Jedenspeigen), 1282.
- End of the monarchy: Karl's renunciation on 11.11.1918; Republic on 12.11.1918.
- Staatsvertrag signed 15.5.1955 in the Belvedere.
- Neutrality law of 26.10.1955.
- Nationalfeiertag set by law in 1965.
- The Habsburgergesetz is constitutional law, and Art. 10 of the Staatsvertrag requires Austria to keep it.
- Viennese coffee-house culture entered the Austrian national inventory in **2011**. The quote about time, space and the bill matches unesco.at. The chapter correctly calls this a national list, not the international UNESCO list.
- Duden: Jänner, Paradeiser, Erdapfel, Matura, Kaffeehaus, Melange, Sackerl, Obers.

---

## A2-10. Швейцарія — чотири мови й пряма демократія

**Verdict: ready after fixes** (6 major)

### Major
- [major] lines 236–241 and 344 — `parkieren`: «uk: паркуватися (CH, AT)» and «note: Duden: «schweizerisch, österreichisch»». Duden says only **«schweizerisch»**; in Austria the word is *parken*. — Fix: «(CH)», «Duden: «schweizerisch»».
- [major] q06 (line 401) — «Er liegt im [[Spital]]» has no Swiss cue, so the bank word *Krankenhaus* is equally correct. That is two defensible answers; «mit dem Fahrrad» in line 1 is also defensible. — Fix: put a CH cue in every line («In Zürich liegt er im [[Spital]]»), or rephrase as «Schweizerisch sagt man: …».
- [major] line 152 — `[!word] die Mundart` duplicates the A2-04 card. Under §2.6.10a the lower number keeps the card. — Fix: delete the card here, keep the word in examples and renumber the ids **before publication**.
- [major] count — there are 10 `[!quiz]`, but §9.0 requires 12–14. — Fix: add 2–4, e.g. Landessprache vs Amtssprache, Bundesrat, 1. August.
- [major] lines 37, 112, 161, 163 and the reel at 453 — «рьоштівий рів» / «Рьоштіграбен» breaks §2.7.1 (no umlauts in Cyrillic) and §2.7.17 (no «ьо»). The «ш» also contradicts the card IPA /ˈʁøːsti…/. — Fix: «Röstigraben — «картопляний рів»» with no Cyrillic transcription.
- [major] Sources (line 464) — all four ch.ch links return **Error Page (404)**: Volksinitiative, Referendum, timelinevolksinitiative and fakultatives-referendum. The direct-democracy facts rest on them (§2.6.9: links must load). The `Rechtschreibleitfaden-2017` PDF (bk.admin.ch) is also 404. — Fix:
  - for the Referendum, link to Art. 139 / 141 BV on fedlex.admin.ch, the BK «Volksrechte» page or the parlament.ch Faktenblatt Referendum;
  - for the Rechtschreibleitfaden, use the current BK link.

### Minor
- [minor] lines 94 and 230 — «das Trottoir … CH, також AT». Duden says «schweizerisch, sonst veraltend oder landschaftlich»; in Austria the usual word is *Gehsteig*. Duden gives the plural as *Trottoire und Trottoirs*. — Fix: «CH (в AT і DE — застаріле / регіональне)».
- [minor] line 227 — Spital: «Duden: der або das Spital; у Швейцарії та Австрії кажуть das Spital». Duden has the reverse: «das, **schweizerisch auch: der** Spital», labelled «österreichisch, schweizerisch, landschaftlich». — Fix: correct the note.
- [minor] line 250 — `das Znüni` with `forms: — (без множини)`. Duden: «**der oder das** Znüni; Plural: die Znüni[s]». — Fix: `forms: die Znüni` and add «також der Znüni» to the note.
- [minor] card levels — Duden marks Velo, Trottoir and parkieren as Goethe B1. — Fix: `level: B1`.
- [minor] line 139 — `die Deutschschweiz` /ˈdɔʏ̯tʃˌʃvaɪ̯ts/ uses ˌ in a 2-syllable compound (§2.7.1). — Fix: drop the ˌ.
- [minor] line 43 — «завжди пишуть ss» and «правило» overstate the official rule. The Amtliches Regelwerk, § 25 E2, says «kann **immer** ss geschrieben werden» (may). «З 1970-х років» has no source. — Fix: «у Швейцарії й Ліхтенштейні ß заміняють на ss (правопис дозволяє це завжди; так пише федеральна адміністрація)»; source or drop «з 1970-х».
- [minor] line 338 — the Busse/Buße example is confusing at A2, because in Germany *Busse* is simply the plural of *Bus*. — Fix: use *Masse* (маса) vs *Maße* (міри), the classic example.
- [minor] line 35 — BFS shares are for the **permanent resident population aged 15+**, and people may name several main languages, so the shares add up to more than 100 %. — Fix: «серед мешканців від 15 років (можна назвати кілька мов)».
- [minor] line 64 / Landeskunde-Text — a referendum can also be requested by **8 cantons** (Art. 141 BV). This is optional at A2; one clause in the narrative is enough.
- [minor] Ukrainian:
  - l. 29 «ініціатива «відбувається»» — use «ініціатива вважається такою, що відбулася (zustande gekommen)»;
  - l. 432 «назву кантону» — use «назва кантону».
- [minor] q04 option «Strasze» is close to a joke distractor. — Fix: «Strase» plus «Strasße» (a real mixed spelling).
- [minor] line 213 — «Написання *Grüezi* — без -ß» says nothing, since the word has no s. — Fix: delete it.
- [minor] lines 348–351 — the Landeskunde-Text has 83 words, below A2 ≈ 100–140. — Fix: add 2 sentences, e.g. about Bern and the Bundesrat, or the Röstigraben.
- [minor] line 6 — the tags lack `skills`.

### Verified
- Languages (BFS Sprachen page, data year **2024**, Strukturerhebung, population 15+):
  - main language: German 61 %, French 23 %, Italian 8 %, Romansh 0.4 %;
  - spoken at home: Schweizerdeutsch 55 %, (Standard) Deutsch 12 %;
  - all of this as in the chapter.
- Volksinitiative: 100,000 signatures in 18 months. Referendum: 50,000 in 100 days (Art. 141 BV).
- The referendum period was extended from 90 to 100 days in **1996** (ZSR 2014; SRF).
- 26 cantons; Bundesverfassung of 12.9.1848.
- Bundesfeier: first held in 1891, annual from 1899 (HLS, «Bundesfeier», text checked).
- Romansh: Landessprache in 1938, Teilamtssprache in 1996 (HLS «Rätoromanisch»; 1938 confirmed, 1996 matches Art. 70 BV).
- Amtssprachen: Art. 70 BV, as stated.
- Duden: Velo (CH), Spital, Trottoir, parkieren (CH only), Znüni, Röstigraben («schweizerisch scherzhaft»).

**On the author's search-summary caveat:**
- These Swiss facts hold up against primary sources: language shares, 100,000/18 months, 50,000/100 days, 1848, 1891/1899, 1938.
- These do not: *parkieren* «österreichisch», *Trottoir* «AT», the *Spital* gender note, and *Znüni* «без множини».

---

## Cross-chapter
- [minor] Deutsch- and Deutschland-shared vocabulary: the language topics A2-27 (Feste) and A2-24 (Geld, Pfand) come earlier in course order. Agree with their authors who owns *Ostern / Osterhase / Osterei / Karneval / Pfand / Bargeld* before those topics are written.
- [minor] §9.0 pitfalls require «≥ 1 мовна пастка». All five chapters have one: 06 *zu Ostern*, 07 *satt*, 08 *leise/ruhig*, 09 gender of AT words, 10 Landessprache/CH words.
- Format checks with no issues:
  - ids run in reading order and are unique;
  - `speed: slow` is present in every `[!listen]` / `[!speak]`;
  - every `bank` has a distractor;
  - diagram colours follow §2.7.3 (yellow/pink/gray only).
- Counts against the table (±20 %):
  - W: 27 / 25 / 23 / 20 / 20 (ch10 is 19 after removing *Mundart*);
  - L 5 and S 3 everywhere;
  - reels 5 everywhere;
  - Q: 12 / 12 / 13 / **10** / **10** (§9.0 requires 12–14).
