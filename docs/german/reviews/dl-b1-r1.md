# Review: Deutschland B1 (`geschichte`), chapters 01–14 (round 1, reviewer r1)

Reviewer: fresh `opus` agent, following `docs/german/BRIEF-reviewer.md`. Nothing was edited.

**Focus of this round:** German correctness (gender, plural, IPA in Duden notation, examples), quizzes with two defensible answers or joke distractors, Ukrainian quality (Russianisms, surzhyk, process wording), card levels, level fit for B1, the recurring mistakes in `docs/german/LESSONS.md`, and GERMAN_SYLLABUS §2.6, §2.7, §9.0 and §9.3. Facts belong to the other reviewer. A fact is flagged here only when it looks plainly wrong.

**Totals (counted per chapter; the section-wide notes only summarise them): 3 blockers, 26 majors, 137 minors.** The 3 blockers are one mechanical fault that occurs in three files.

## Applies to several chapters

- **[blocker] 08, 09, 12 — broken apostrophe encoding.**
  - Every Ukrainian apostrophe in these three files is stored as the mojibake `Ê¼`: the bytes `C3 8A C2 BC`, which is `ʼ` (U+02BC) encoded twice. It renders as «перемирÊ¼я», «звÊ¼язок», «обÊ¼єднання».
  - Counts: 08 has 28, 09 has 14, 12 has 21.
  - Fix: replace every `Ê¼` with `ʼ` (U+02BC), then re-grep for `Ê`.
- **[major] 01–07 — `bank:` repeats the answers.**
  - Per CONTENT_SPEC §222 and `src/content/blocks/quiz/exercise.ts` (`bank: [...words, ...extra]`, no dedupe), `bank:` must list **only the extra distractors**. The answers are added automatically.
  - Chapters 01–07 list the answers as well, so every answer chip appears twice. Example: 01-q08 shows «Niederlage» ×2.
  - Chapters 08–14 and the model B1-13 do it correctly.
  - Affected: 01-q08, 02-q08, 03-q08, 04-q08, 05-q10, 06-q09, 07-q09.
  - Fix: keep only the distractors, e.g. `bank: Mythos, Provinz`.
- **[minor] 05, 06, 07 — wrong apostrophe (§2.7.13).** These files use `’` (U+2019) instead of `ʼ`: 05 has 13, 06 has 9, 07 has 20. Fix: replace `’` with `ʼ` inside Ukrainian words.
- **[minor] Source names inside the narrative read as process notes.** Examples: «за bpb», «(Tagesspiegel)», «Орієнтири з LeMO», «у запису Otto-von-Bismarck-Stiftung», «(так озаглавлює тему Planet Wissen)», «У розділі ти зустрінеш лише те…». Sources belong in «Джерела». In the text, keep at most «за оцінками» and «за даними дослідників». This matters most in 01, 04, 07, 08 and 09.
- **[minor] Proper names are not declined.**
  - 07–12 keep Latin-script names inside Ukrainian syntax: «призначив Hitler рейхсканцлером», «відставки Ulbricht», «візит Kennedy».
  - 10 and 13 use Cyrillic and decline («Гітлера», «Гінденбург»).
  - Party abbreviations are also mixed: SPD/NSDAP in 07–09, СДПН/НСДАП/КПН in 10, SED next to СЄПН in 12–13.
  - Fix: one convention for the whole section. Recommended: Cyrillic, declined, with the German form once in brackets.
- **[minor] «рейх» and «райх» are mixed.** 10 and 11 write «райхскомісар» and «Райху», while 07–10 write «рейхсканцлер» and «рейхспрезидент». Fix: «рейх-» throughout.
- **[minor] The right answer often gives itself away by length.** The correct option is the long, hedged one, while the distractors are short. Examples: 04-q07, 06-q07, 07-q11, 07-q12, 10-q13, 13-q14. Fix: lengthen the distractors or shorten the key.
- Checked and fine:
  - `[!word]` duplicates were grepped across `content/Guides/Deutsch*` by exact header and by lemma. There are no duplicates. The only near-match is der Franke (01) vs der Franken (A2-10), which are different words.
  - All block ids are unique and in reading order.
  - There is no `speed:` anywhere.
  - Quiz counts are 13–14 per chapter.
  - Card counts are within ±20 % of §9.3.
  - Reels: 5 per chapter, and none in 10 and 11.
  - Every Landeskunde text is 120–166 words.
  - Every chapter has at least one language pitfall.

---

## dl-b1-01. Германці й Рим

**Verdict: ready after fixes.**

- [major] line 428 — `bank:` repeats the answers (see above). — Fix: `bank: Mythos, Provinz`.
- [major] line 72 — The sentence has no grammatical subject: «2005 року Limes разом з іншими пограничними спорудами … вніс до списку Світової спадщини ЮНЕСКО». — Fix: «2005 року ЮНЕСКО внесла Limes … до списку Світової спадщини». Also replace «пограничними» with «прикордонними».
- [minor] line 127 — «памʼятник Арміну» is the wrong case. — Fix: «памʼятник Армінію».
- [minor] line 241 — The heading «Міф і память» is missing the apostrophe. — Fix: «памʼять».
- [minor] line 372 — «висока мур» has the wrong gender. — Fix: «високий мур».
- [minor] line 466 — «державa» ends in a Latin `a`. — Fix: retype it in Cyrillic.
- [minor] line 16 «прослідкувати» and line 352 «Невірно:» are Russianisms. — Fix: «простежити», «Неправильно:».
- [minor] line 88 «за Verdun-договором» and «внуки» (line 98 has «онуками»). — Fix: «за Верденським договором 843 року», «онуки».
- [minor] line 349 — «приставка «німецької нації»» uses a grammar term. — Fix: «додаток «німецької нації»».
- [minor] line 225 — The note «не плутай з *überwinden*» is not a real confusion. — Fix: drop it or replace it with «*erobern* ≠ *besiegen*: territory vs. enemy».
- [minor] line 248 — «інше слово — *der Mythus*» is wrong: it is a variant, not another word. — Fix: «застарілий варіант: *der Mythus*».
- [minor] line 438 — The explanation says Mythos and Provinz don't fit «ні за родом». *Provinz* is feminine and fits the *die* gaps by gender. — Fix: «не підходять за змістом».
- [minor] q07 option «Битва точно відбулася в 90 році н. е.» and q13 option «Гуни прийшли … лише після Карла Великого» are joke distractors. — Fix: use real confusions, e.g. «Битва відбулася біля Детмольда, де стоїть памʼятник» or «Готи були германським плем'ям, яке збудувало Limes».
- Verified:
  - Cards: Germane, Römer, Stamm (pl. Stämme), Fürst (Fürsten, weak), Franke (weak), Schlacht, Hinterhalt (Hinterhalte), Legion /leˈɡi̯oːn/, Sieg /ziːk/, Niederlage, erobern /ɛɐ̯ˈʔoːbɐn/ (§2.7.18), Mythos (Mythen), Denkmal (Denkmäler), Völkerwanderung.
  - Article, plural and IPA match Duden/DWDS.

## dl-b1-02. Священна Римська імперія

**Verdict: ready after fixes.**

- [major] line 414 — `bank:` repeats the answers. — Fix: `bank: Krone, Zoll`.
- [major] line 55 — «курфюрства (*Kurländer*)» is wrong. *der Kurländer* means a native of Courland (Kurland). — Fix: *die Kurfürstentümer* (or *die Kurlande*).
- [major] line 338 — «а не ~~die Kaufmänner~~ (така форма існує, але … рідко)» strikes out a form that Duden lists as rare but correct (LESSONS: correct German marked as an error). — Fix: drop the strikethrough and write «зазвичай *die Kaufleute*; *Kaufmänner* — рідко».
- [minor] line 145 — The Goldene Bulle card has `forms: die Goldenen Bullen`, which is odd for a unique document with `pos: phrase`. — Fix: omit `forms:` (§2.7.9 allows that for phrases) or write `— (без множини)`.
- [minor] line 133 — The note «*-reich* … «багатий на…» (*wasserreich*), не плутай із *reich* — «багатий»» is self-contradictory: *-reich* **is** *reich*. — Fix: «не плутай *das Reich* (імперія) з прикметником *reich* (багатий; *wasserreich*)».
- [minor] line 323 — The tip «Schiff — … довге ff в кінці» is wrong: German has no long consonants. — Fix: «ff — звичайне [f]; подвоєння показує, що і коротке».
- [minor] line 244 — «коґґе», neuter («Коґґе було»), is not the Ukrainian term. — Fix: «ког (когг)», masculine, here and in lines 113 and 324.
- [minor] line 54 — «рішення приймають» is a calque; the text elsewhere says «ухвалювали». — Fix: «ухвалюють».
- [minor] line 66 — «Lübeck, засноване» mixes the gender with German. — Fix: «Любек, заснований».
- [minor] line 328 — The pitfall title says «не «Священна»», but the body never explains it. — Fix: add one sentence, or shorten the title to «не Німеччина».
- [minor] line 345 — The Landeskunde text switches from Präteritum («war nie ein Staat») to historic present («1356 treffen sich»). — Fix: use one tense; at B1, Präteritum.
- [minor] line 123 — The IPA starts with the article (/das ˈhaɪ̯lɪɡə…/). In 01 w20 the article is left out. — Fix: be consistent; drop it.
- [minor] q06 option «Золота булла створила Ганзу» and q11 option «Hanse існувала лише один рік» are joke distractors. — Fix: e.g. «Булла дозволила обирати короля всім князям» / «Бо Hanse не мала спільної мови».
- Verified:
  - Kurfürst /ˈkuːɐ̯fʏʁst/ (weak), Reichstag, Reichsstadt (Reichsstädte), Papst (Päpste), Krone, Herrscher, Macht (Mächte), Hanse /ˈhanzə/, Städtebund (Städtebünde), Kaufmann (Kaufleute), Handel, Kontor /kɔnˈtoːɐ̯/ (Kontore), Zoll (Zölle).
  - All are correct.

## dl-b1-03. Гутенберг, Лютер і Реформація

**Verdict: ready after fixes.**

- [major] line 436 — `bank:` repeats the answers. — Fix: `bank: Konfession, Letter`.
- [minor] line 344 — `ˌyːbɐˈzɛtst` puts `ˌ` in a verb, which §2.7.1/§2.7.18 allow only in compound nouns. — Fix: /yːbɐˈzɛtst/.
- [minor] lines 186 and 360 — The strikeout «не ~~die Thesis~~» is misleading: Duden has *die Thesis* (prosody, philosophy). It is also not a mistake Ukrainians make. — Fix: drop the strikeout, or write «у значенні «теза» — лише *die These*».
- [minor] line 135 — «*der Druck* (мн. *die Drucke*) — також «тиск»» mixes up two plurals. — Fix: «*die Drucke* — відбитки; у значенні «тиск» — *die Drücke*».
- [minor] line 222 — /pʁɔtɛˈstant/ differs from Duden [protɛsˈtant]. — Fix: /pʁotɛsˈtant/.
- [minor] lines 211, 123, 360 — The terms are inconsistent: «євангелічний», «євангельськими» and «євангельський неоднозначне». The note on line 213 («не те саме, що *orthodox*») is pointless. — Fix: «євангелічний (лютеранський)» throughout, and drop the *orthodox* remark.
- [minor] line 80 — «Після 1524 року (початок — у Штюлінгені)» is illogical, and «священників» is a Russianism. — Fix: «Улітку 1524 року (початок — у Штюлінгені)», «священиків».
- [minor] line 63 — «приховуваний під захистом курфюрста» uses a Russian-style participle. — Fix: «Там, під захистом курфюрста, Лютер…».
- [minor] line 351 — «сучасних подій свідчень немає» is garbled. — Fix: «свідчень сучасників немає».
- [minor] line 119 — «Чи прибивав він тези до дверей, історики сперечаються» is ungrammatical. — Fix: «Чи прибив він тези до дверей — про це історики сперечаються».
- [minor] line 369 — The Landeskunde text has «…nicht die erste deutsche Bibel gemacht, denn es gibt schon vorher viele Übersetzungen», a tense clash. «den Psalm 23» is also unnatural. — Fix: «denn es gab schon vorher …», «Psalm 23».
- [minor] line 421 — «збереглося всі» is ungrammatical; the 18/4 and 1800/490 options are filler. — Fix: «збереглися всі», and use plausible confusions (e.g. «близько 49 надруковано, збереглося 180»).
- Verified:
  - Buchdruck, Letter (Lettern), Druckerpresse, Flugschrift /ˈfluːkʃʁɪft/, Reformation, Reformator (stress shift in the plural correct), These /ˈteːzə/, Ablass /ˈaplas/ (Ablässe), Mönch /mœnç/, Konfession, Bibel (Bibeln), Bauer (weak, Bauern), Aufstand (Aufstände).
  - All are correct.

## dl-b1-04. Тридцятилітня війна

**Verdict: ready after fixes.**

- [major] line 387 — `bank:` repeats the answers. — Fix: `bank: Zersplitterung, Kleinstaaterei`.
- [major] q09, line 404 — The distractor «Місто взяли швидким штурмом за один день» can be defended: the storm of 20 May did take a single day. — Fix: «Місто здалося без облоги одразу після підходу військ».
- [major] line 105 (fact, plainly wrong) — «Зборівський договір … (28 серпня)». The standard date is 18 (8) серпня 1649 (Encyclopedia of Ukraine: *Treaty of Zboriv*, 18 August 1649). It recurs in lines 111 and 449. — Fix: «18 серпня 1649 року», after checking the source.
- [minor] line 54 (fact, likely wrong) — «після десятиденної облоги». The siege of Magdeburg lasted from late March / early April to 20 May 1631. — Fix: «після кількатижневої облоги», after checking GHDI.
- [minor] lines 231/235 — The IPA /ˈklaɪ̯nʃtaːtəˌʁaɪ̯/ puts the main stress on *Klein*, while the note says «наголос на кінцевому -ei». — Fix: make them agree (Duden: main stress on *-rei*).
- [minor] line 290 — The tip «префікс un- ненаголошений» is wrong: the prefix is *unter-*, and *un-* is a different, stressed prefix. — Fix: «префікс unter- тут невідокремлюваний і ненаголошений».
- [minor] line 176 — `verlieren → verlor → verloren` drops *hat* (§2.6.4). — Fix: «verlieren → verlor → hat verloren».
- [minor] line 163 — «не плутай з *die Wüste* … (від того самого кореня)» contradicts itself. — Fix: «пор. *die Wüste* — пустеля».
- [minor] line 125 — «Das Reich zerfiel in etwa dreihundert Territorien» is translated «складалася», which misses *zerfiel* («розпалася»). — Fix: «Імперія розпалася приблизно на триста територій».
- [minor] line 319 — «von 16 bis 17 Millionen auf rund zehn Millionen» is an ambiguous *von…bis/auf*. — Fix: «von etwa 16 oder 17 Millionen auf rund zehn Millionen».
- [minor] line 321 — «Neben Katholiken und Lutheranern sind sie jetzt die dritte anerkannte Konfession»: people are not a confession. — Fix: «Ihr Bekenntnis ist jetzt die dritte anerkannte Konfession».
- [minor] lines 254 and 257 — The euphony is wrong: «у Аугсбурзі», «в Вестфалії». — Fix: «в Аугсбурзі», «у Вестфалії».
- [minor] line 54 «германістична збірка GHDI» and line 70 «Перший артикул». — Fix: «збірка документів GHDI», «Перша стаття».
- [minor] line 111 — The table cell «...» is a placeholder. — Fix: «—» or a real 1649 event.
- [minor] q03 «Bei einem Erdbeben» / «Bei der Reformation», q04 «Nur in Prag starben Menschen» and q11 «Бо війна тривала лише рік» are joke distractors; q03 becomes trivial. — Fix: e.g. «An der Kälte im Winter» / «Bei einer Überschwemmung» → «Im Kampf in großen Schlachten».
- [minor] line 46 — «втрутився як офіцер Нижньосаксонського округу» is wrong: he was *Kreisoberst*, the head of the Circle. — Fix: «як голова (Kreisoberst) Нижньосаксонського округу».
- Verified:
  - Söldner /ˈzœldnɐ/, plündern, verwüsten /fɛɐ̯ˈvyːstn̩/, Verlust (Verluste), Pest, Seuche /ˈzɔʏ̯çə/, Hungersnot (Hungersnöte), Bevölkerung, Frieden/Friede, Gesandte (adjectival declension).
  - All are correct.

## dl-b1-05. Пруссія й Просвітництво

**Verdict: ready after fixes.**

- [major] line 464 — `bank:` repeats the answers. — Fix: `bank: Verfassung, Eroberung`.
- [major] line 37 (fact, plainly wrong) — «Його онук-тезка Фрідріх Вільгельм I». Friedrich Wilhelm I was the **son** of Friedrich III./I., and not his namesake. — Fix: «Його син Фрідріх Вільгельм I».
- [major] lines 50, 306 and 310 — «Die Religionen müssen alle toleriert werden» is translated «мусять бути терпимими», which means *tolerant* or *bearable*, not *tolerated*. — Fix: «Усі релігії треба терпіти»; in l02, «що всі віросповідання треба терпіти». Also «*toleriert werden* — «щоб їх терпіли»».
- [major] lines 359 and 461 — «охоронюваних солдатами «королівських» картопляників»: a *картопляник* is a potato dish. — Fix: «про картопляні поля, які нібито охороняли солдати».
- [major] lines 87 and 452 — «думав і писав по-французьки» / «писав по-французьки» is a Russianism listed in LESSONS. — Fix: «французькою».
- [minor] lines 37–38 — There is no blank line between paragraphs, so they render as one, and line 37 ends with a stray space. — Fix: insert a blank line.
- [minor] lines 342–343 — /faˈsɔŋ/ «кінцевий носовий [ɔŋ]» does not match Duden [faˈsõː]. — Fix: /faˈsõː/; mention AT [faˈsoːn] in the tip.
- [minor] line 336 — The tip «Verstandes … «ше-ШТАН-дес»» has the wrong first syllable. — Fix: «фер-ШТАН-дес».
- [minor] line 299 — «sa-PE-re AU-de» has the wrong Latin stress (*sápere*). — Fix: «SA-pe-re AU-de».
- [minor] line 277 — /ˈɡuːtsˌhɛʁ/ puts `ˌ` in a two-syllable word (§2.7.1). — Fix: /ˈɡuːtshɛʁ/. Also line 257: no `ˌ` in an adjective (/ˈziːbn̩jɛːʁɪɡə/), as in 04 w01.
- [minor] line 219 — «слабка відміна: *des Untertanen*» is overstated; Duden gives *des Untertans*, also *-en*. — Fix: «род. *des Untertans* / *des Untertanen*».
- [minor] line 267 — `erobern (erobert · eroberte · hat erobert)` is the wrong format, and *erobern* is already carded in 01. — Fix: «*erobern* (див. B1-01)».
- [minor] line 105 — «з **kategorischer Imperativ**» is not in the base form. — Fix: «*der kategorische Imperativ*».
- [minor] line 182 — «*das Motto* (розм.)» is wrong: *Motto* is not colloquial. — Fix: «синонім — *das Motto*».
- [minor] line 58 «за півроку після коронації» (Friedrich II was never crowned), and «чудом дому Бранденбургів». — Fix: «після вступу на престол», ««чудом Бранденбурзького дому»».
- [minor] line 441 — «Цьоллера» is mistransliterated. — Fix: «Цельнера (Zöllner)».
- [minor] line 483 — In «з того часу її зараховують до великих держав», *її* points to Silesia. — Fix: «Пруссію зараховують…».
- [minor] line 471 — The gap «sich der eigenen [[Vernunft]] zu bedienen» clashes with the Kant quote the chapter teaches (*Verstand*). — Fix: change the sentence to «In der Aufklärung galt die [[Vernunft]] mehr als die Tradition».
- [minor] line 415 — «teilen Teile Polens» is clumsy. — Fix: «teilen Polen zum ersten Mal».
- [minor] q03 option «Preußen bekam Frankreich» and q04 options «Man glaubt nur an die Kirche» / «…lernt alle Gesetze auswendig» are joke distractors. The q03 stem uses *bekam*, which the explanation warns against. — Fix: stem «Was passierte am Ende mit Schlesien?»; distractor «Preußen musste Schlesien teilen».
- Verified:
  - Aufklärung /ˈaʊ̯fklɛːʁʊŋ/, Verstand, Vernunft, Unmündigkeit, Wahlspruch (Wahlsprüche), Philosoph (weak), Aufsatz (Aufsätze), Absolutismus /apzoluˈtɪsmʊs/, Toleranz, Zensur /tsɛnˈzuːɐ̯/ (Zensuren), Gutsherr (weak, Gutsherren).
  - All are correct.

## dl-b1-06. Наполеон, романтизм і 1848

**Verdict: ready after fixes.**

- [major] line 474 — `bank:` repeats the answers. — Fix: `bank: Sehnsucht, Aufstand, Burschenschaft`.
- [major] line 208 — `uk: бурше́нші; студентська корпорація`: «бурше́нші» is not a Ukrainian word. — Fix: «буршеншафт — студентське товариство (корпорація)».
- [minor] line 250 — «наголос на другому складі» is wrong: in ba-ri-**ka**-de the stress is on the third syllable. — Fix: «на третьому складі (-ка-)».
- [minor] line 253 — /ˈmɛʁtsʁevolutsi̯oːn/ is a long compound without `ˌ`, and the plural is given for a name; 08 w16 has `ˌ`. — Fix: /ˈmɛʁtsʁevoluˌtsi̯oːn/; `forms: — (як назва, без множини)`.
- [minor] line 304 — `forms: er scheitert · scheiterte · ist gescheitert` does not start with the infinitive (LESSONS). — Fix: «scheitern → scheiterte → ist gescheitert».
- [minor] line 377 — «Das Deutsche Reich (1871–1918)» clashes with 02 line 329 («1871–1945»). — Fix: «(1871–1945; Kaiserreich — 1871–1918)».
- [minor] line 58 — «майорів **schwarz-rot-goldene** прапор» puts a German inflected adjective on a Ukrainian noun. — Fix: «майорів чорно-червоно-золотий прапор (*schwarz-rot-gold*)».
- [minor] lines 30, 52, 188 (and 07 line 188) — «вільний союз» reads as «free union». — Fix: «нещільний (слабкий) союз держав».
- [minor] line 107 — Gagern's archaic word order «Wir sollen schaffen eine Verfassung» is a trap for learners. — Fix: add a note: «стара риторика; сьогодні — *Wir sollen eine Verfassung schaffen*».
- [minor] lines 19, 535 — «Holovna Ruska Rada» is Latin transliteration in Ukrainian prose. — Fix: «Головна Руська Рада».
- [minor] line 48 «повернулися проти нього», line 52 «Німецька частина вирішення», line 38 «Франц II зі Священної Римської імперії». — Fix: «виступили проти нього», «Для Німеччини результатом став…», «останній імператор Священної Римської імперії Франц II».
- [minor] line 84 — «за загальною й рівною системою більшості» is unclear. — Fix: «за загальним і рівним виборчим правом, мажоритарною системою».
- [minor] q12 repeats q02 (who could vote). — Fix: turn q12 into another item, e.g. «Чому парламент прозвали «професорським»?».
- [minor] q02 option «Nur die Abgeordneten des Königs» is a non-option. — Fix: «Nur Männer mit viel Geld und Land».
- Verified:
  - Revolution, Rheinbund, Besatzung (Besatzungen), Völkerschlacht, Burschenschaft /ˈbʊʁʃn̩ʃaft/, Flagge, Romantik /ʁoˈmantɪk/, Sehnsucht (Sehnsüchte), Volkslied (Volkslieder), Parlament, Abgeordnete /ˈapɡəʔɔʁdnətə/ (§2.7.18, adjectival declension), Verfassung, Wahlrecht.
  - All are correct.

## dl-b1-07. Бісмарк і Kaiserreich

**Verdict: ready after fixes.**

- [major] line 471 — `bank:` repeats the answers. — Fix: `bank: Kolonie, Bündnis, Schutzgebiet`.
- [minor] lines 157, 388, 444 — «Männer über 25 Jahren» means «older than 25». The right was given from 25 *(vollendetes 25. Lebensjahr)*. — Fix: «Männer ab 25 Jahren».
- [minor] line 235 — `forms: er entlässt · entließ · hat entlassen` does not start with the infinitive. — Fix: «entlassen → entließ → hat entlassen (er entlässt)».
- [minor] line 242 — /ɪndʊstʁialiˈziːʁʊŋ/ is missing the non-syllabic i̯. — Fix: /ɪndʊstʁi̯aliˈziːʁʊŋ/.
- [minor] line 365 — `ˌ` in numerals (ˈaɪ̯nʊntˌfɪʁtsɪç) breaks §2.7.1. — Fix: drop the `ˌ`.
- [minor] line 366 — «v на початку слова ([f])» is wrong: Bevölkerung does not start with v. — Fix: «v → [f]».
- [minor] line 79 (fact) — «Депутатів було 397» holds only from 1874; in 1871 there were 382. — Fix: «спершу 382, з 1874 року — 397».
- [minor] line 81 — Calling the Poles (≈ 2.5–3 million) «нечисленні меншини» is overstated. — Fix: «з національними меншинами».
- [minor] line 114 — «внески по хворобі» is a calque. — Fix: «дві третини внесків на страхування від хвороби сплачували самі робітники».
- [minor] line 480 — «збігається з однина» has the wrong case. — Fix: «з одниною».
- [minor] line 491 — «щодо політики Бісмарка щодо робітників» repeats «щодо». — Fix: «…означає вислів «Zuckerbrot und Peitsche» у політиці Бісмарка щодо робітників?».
- [minor] lines 526, 537 — «Вільгельм I.» copies the German ordinal dot into Ukrainian. — Fix: «Вільгельм I».
- [minor] q03 option «Alle Menschen zogen aufs Land» is a joke distractor. — Fix: «Viele Menschen wanderten nach Amerika aus, deshalb sank die Bevölkerung».
- Verified:
  - Kaiserreich, Reichsgründung, Bundesstaat, Reichskanzler, Gesetz (Gesetze), Sozialdemokrat (weak), Kulturkampf, Bündnis /ˈbʏntnɪs/ (Bündnisse), Eisenbahn, Arbeiter, Kolonie (Kolonien [koloˈniːən]), Schutzgebiet, Völkermord.
  - All are correct.

## dl-b1-08. Перша світова війна

**Verdict: not ready.** The blocker is mechanical; one replace fixes it.

- [blocker] lines 16, 66, 68, 78, 90, 98, 116, 117, … — 28 × mojibake `Ê¼` (see the section-wide notes). — Fix: replace them with `ʼ`.
- [minor] line 331 — «Радіоповідомлення, лютий 1917 року» is an anachronism: German public radio started in 1923. — Fix: «Газетна замітка, лютий 1917 року».
- [minor] line 378 — `~~den Krieg gegen Russland erklären~~` strikes out wording the same line calls only «неприродно» (LESSONS: strike out only real errors). — Fix: drop the strikethrough.
- [minor] line 58 — «Так почалася Burgfrieden» has the wrong gender: *der Burgfrieden* is masculine. — Fix: «почався Burgfrieden («фортечний мир»)».
- [minor] line 132 — «Німці називали договір Diktat і Schandfrieden, і це відкидали праві й соціал-демократи» is garbled, and «Розмір репарацій повідомили» is unidiomatic. — Fix: «Договір відкидали всі політичні табори — від правих до соціал-демократів; його називали…», «Розмір репарацій визначили».
- [minor] line 80 «революційний потенціал це не зняло», line 128 «Тиждень до того», line 396 «британська флота». — Fix: «цього не зняло», «За тиждень до того», «британський флот».
- [minor] line 16 «прослідкувати», line 35 «Європа поділена» (tense). — Fix: «простежити», «Європа була поділена».
- [minor] line 329 — «*Schweigen die Waffen* — «замовкла зброя»» has a tense mismatch with the present-tense audio. — Fix: «замовкає зброя».
- [minor] line 148 — «In Verdun kämpfte man…» means *in the town*. — Fix: «Um Verdun kämpfte man …».
- [minor] line 539 — «флотське командування» is unidiomatic. — Fix: «морське командування».
- [minor] q03 option «Reis aus den Kolonien» is a weak distractor. — Fix: «Brot aus Weizen».
- Verified:
  - Krieg, Weltkrieg, Attentat (Attentate), Kriegserklärung /ˈkʁiːksʔɛɐ̯ˌklɛːʁʊŋ/, Mobilmachung, Mittelmächte, Entente /ãˈtãːt/, Schützengraben (Schützengräben), Stellungskrieg, Giftgas, Waffenstillstand (Waffenstillstände), Abdankung, Friedensvertrag (Friedensverträge).
  - All are correct.

## dl-b1-09. Веймарська республіка

**Verdict: not ready.** The blocker is mechanical.

- [blocker] lines 18, 55, 72, 76, 134, 147, 298, … — 14 × mojibake `Ê¼`. — Fix: replace them with `ʼ`.
- [major] line 307 — «30 серпня 1924 року Rentenmark замінила Reichsmark» is backwards (plainly wrong). — Fix: «Reichsmark замінила Rentenmark».
- [major] lines 115–125 — The compare diagram uses `blue`, `violet`, `red` and `green` for causes, symptoms and remedies. §2.7.3 reserves these for gender and plural. — Fix: use yellow, pink and gray.
- [major] lines 68, 98, 147, 224, 398 — «ренточна марка» is not the Ukrainian term. — Fix: «рентна марка (Rentenmark)».
- [major] lines 144, 180, 182 — «президент імперії (Веймарська республіка)» is self-contradictory, and 10 uses «рейхспрезидент». — Fix: «рейхспрезидент».
- [minor] lines 338–340 — `stand` /ʃtaːnt/ and the tip «stand — [ʃtaːnt]» give the wrong length; the Präteritum of *stehen* has a short vowel. — Fix: /ʃtant/.
- [minor] line 264 — «*die Krise* … z перед голосним = [z]» names the wrong letter. — Fix: «s перед голосним = [z]».
- [minor] line 227 — «~~Rente~~ тут не «пенсія»» uses strikethrough for something that is not an error. — Fix: «*Rente* тут не «пенсія»».
- [minor] line 243 — «Те саме — *die Zwanzigerjahre*» is wrong: one is a decade, the other a period. — Fix: «пор. *die Zwanzigerjahre* — двадцяті роки».
- [minor] line 220 — «складове слово» should be «складне слово». — Fix: as given.
- [minor] line 45 «Reichspräsident обирали народ», «недовіряли»; q14 «Це був назва»; line 98 «папірових». — Fix: «обирав», «не довіряли», «Це була назва», «паперових».
- [minor] line 72 «оголосив … та оголосив», «в фортеці». — Fix: «проголосив «національну революцію» й оголосив…», «у фортеці».
- [minor] line 84 — «їхнім наслідуванням ставали і секретарки» is unidiomatic. — Fix: «їх наслідували й секретарки».
- [minor] line 367 — In the Landeskunde text, «die lange als sicher gelten» is the wrong tense (should be *galten*), and «verlieren das Vertrauen» is repeated in the same paragraph. — Fix: «galten»; drop one repeat.
- [minor] lines 55 vs. 08 line 132 — The reparations figure is dated «у квітні 1921» here and «у травні 1921» in 08. — Fix: unify («у квітні–травні 1921 року, Londoner Ultimatum»).
- [minor] q14 option «Його заснували нацисти в Берліні 1933 року» is a joke distractor. — Fix: «Його заснували в Дессау 1925 року».
- Verified:
  - Weimarer Republik, Demokratie (Demokratien), Putsch (Putsche), Dolchstoßlegende, Ruhrbesetzung, Inflation, Währungsreform, Bauhaus, Weltwirtschaftskrise, Arbeitslosigkeit, Notverordnung /ˈnoːtfɛɐ̯ˌʔɔʁdnʊŋ/, Koalition.
  - All are correct.

## dl-b1-10. Нацистська диктатура й Друга світова

**Verdict: ready after fixes.**

- [major] cards — Card levels drift (§2.6.5, §2.7.7, LESSONS).
  - These general words are all marked `B1`, though they are B2 or higher: Diktatur, Propaganda, Überfall, Kriegsgefangene, Widerstand, Flugblatt, Kapitulation, Befreiung.
  - Realia such as Machtübernahme, Gleichschaltung and Wehrmacht may stay at B1 (§2.7.7).
  - Fix: set the real CEFR level (mostly B2; Kriegsgefangene, Kapitulation B2–C1).
- [minor] line 476 — The bank distractors *Wiedervereinigung* and *Währungsunion* are from another era and implausible (LESSONS). — Fix: use *Bücherverbrennung, Volksgemeinschaft*.
- [minor] line 237 — The note «*Der Weltkrieg* — мн. *die Weltkriege*» repeats card 08 w02. The card *der Zweite Weltkrieg* comes close to duplicating it. — Fix: drop the note; keep the card only for the declension pattern, or remove it.
- [minor] line 558 (overstated) — «сотні тисяч вивезених «остарбайтерів» з кожної області» does not match the chapter's own figure of 2–2.4 million in total. — Fix: «понад 2 мільйони вивезених «остарбайтерів»».
- [minor] line 173 — «нацистське самоназвання» is a Russianism. — Fix: «нацистська самоназва».
- [minor] line 97 — «Зі сучасної території України» has the wrong preposition form. — Fix: «З сучасної території».
- [minor] line 264 — The example says «Riwne», the narrative says «Rowno». — Fix: one form plus a gloss («Rowno, heute Riwne»).
- Verified:
  - Machtübernahme /ˈmaxtʔyːbɐˌnaːmə/, Ermächtigungsgesetz, Gleichschaltung, Schutzhaft, Konzentrationslager (Pl. = Sg., KZs), Bücherverbrennung, Volksgemeinschaft, Überfall (Überfälle), Vernichtungskrieg, Zwangsarbeit /ˈtsvaŋsʔaʁbaɪ̯t/, Ostarbeiter, Widerstand (Widerstände).
  - All are correct.
  - Tone and §9.1 requirements (no reels, `[!important]` blocks) are met.

## dl-b1-11. Голокост і культура памʼяті

**Verdict: ready after fixes.**

- [major] cards — Card levels drift. These general words are marked `B1`, though they are B2 or higher: Antisemitismus, Synagoge, Deportation, Ghetto, Täter, Überlebende, Zeitzeuge, Gedenkstätte, Gedenktag. — Fix: B2 (Antisemitismus, Deportation B2–C1). Holocaust, Shoah, Novemberpogrom and Stolperstein may stay at B1 as realia.
- [minor] line 443 — The bank distractors *Mauerfall* and *Treuhand* are implausible. — Fix: *Konzentrationslager, Zeitzeuge*. Each fits a gap grammatically but not in meaning, so check every gap.
- [minor] line 479 — «процес домігся генпрокурор» has the wrong case. — Fix: «процесу домігся генпрокурор».
- [minor] line 410 — The q05 items mix noun phrases («Boykott jüdischer Geschäfte in ganz Deutschland», «Wannsee-Konferenz in Berlin») with full sentences. — Fix: make them all sentences («Die NSDAP organisiert einen Boykott…»).
- [minor] line 42 — «закон про громадянство Райху». — Fix: «Рейху» (see the section-wide notes).
- Verified:
  - Holocaust /ˈhoːlokaʊ̯st/ (Duden also gives final stress), Shoah /ʃoˈaː/, Synagoge /zynaˈɡoːɡə/, Novemberpogrom (Duden allows *das/der Pogrom*), Ghetto (Ghettos), Einsatzgruppe, Massenerschießung, Opfer (neuter, Pl. Opfer), Überlebende (adjectival declension), Zeitzeuge (weak), Erinnerungskultur, gedenken + Gen.
  - All are correct.

## dl-b1-12. Поділ — ФРН і НДР, Стіна

**Verdict: not ready.** The blocker is mechanical.

- [blocker] lines 37, 70, 72, 74, 84, 107, … — 21 × mojibake `Ê¼`. — Fix: replace them with `ʼ`.
- [major] line 325 — «*die Stachel* (мн. *die Stacheln*) — колючка» has the wrong gender. — Fix: «*der Stachel* (мн. *die Stacheln*)».
- [major] lines 45–60 — The compare diagram uses `blue`, `red` and `green` for BRD/DDR (§2.7.3). — Fix: use yellow, pink and gray.
- [minor] line 297 — The note «З великої літери «Die Mauer» — Берлінська стіна» confuses learners: all German nouns are capitalised. — Fix: «українською — «Стіна» з великої».
- [minor] line 228 — `forms: die Gastarbeiter (жін. die Gastarbeiterin …)` breaks §2.6.2: the feminine form belongs in `note:`. — Fix: move it.
- [minor] lines 195 and 202 — The cross-reference «*Die Verfassung* (B1-09)» is wrong: the card is in B1-06. — Fix: «(B1-06)».
- [minor] line 139 (fact) — «Am 23. Mai 1949 trat das Grundgesetz in Kraft». It was proclaimed on 23 May and came into force with the end of that day (Art. 145), i.e. on 24 May. — Fix: «Am 23. Mai 1949 wurde das Grundgesetz verkündet».
- [minor] lines 404, 420 — «nennt die Mauer „antifaschistischen Schutzwall“» is an unnatural accusative without an article. — Fix: «nennt die Mauer einen „antifaschistischen Schutzwall“».
- [minor] line 74 «у літку», line 109 «отримав кулі», line 140 «постачали Берліну все необхідне». — Fix: «влітку», «був поранений кулями», «постачали Берлін усім необхідним».
- [minor] line 41 — «Саме тоді … разом із валютною реформою запровадили соціальну ринкову економіку» puts it in May 1949, but the reform was in June 1948. — Fix: «Ще 1948 року разом із валютною реформою…».
- [minor] line 573 — The reel title «Будинок у Сході, тротуар у Заході» uses the wrong prepositions. — Fix: «Будинок на Сході, тротуар на Заході».
- [minor] q09 repeats l04 with the same numbers (9 000 / 91 000 / 910 000 / 189 000). — Fix: use different distractors or ask about the IM count.
- Verified:
  - Besatzungszone, Blockade /blɔˈkaːdə/, Luftbrücke (Luftbrücken), Grundgesetz, DDR /deːdeːˈʔɛʁ/, SED, Stasi /ˈʃtaːzi/, Spitzel (Pl. = Sg.), Überwachung /yːbɐˈvaxʊŋ/, Volksaufstand (Volksaufstände), Flucht, Mauer (Mauern), Schießbefehl (Schießbefehle).
  - All are correct, except *Stachel* in the note on line 325.

## dl-b1-13. 1989–1990 (model lesson)

**Verdict: ready after fixes.**

- [major] quiz mix — There are only 3 fill/order items (q05 order, q08 fill, q13 order); §2.6.6 requires at least 4. The model lesson itself breaks the rule. — Fix: turn one single into a fill, e.g. q10 → «Löhne und Renten wurden [[1:1]] umgestellt; Ersparnisse über dem Freibetrag [[2:1]]».
- [minor] lines 252–254 — `zusammenwachsen /tsuˈzamənˌvaksn̩/`: §2.7.18 says separable verbs take no `ˌ`, and `forms: er wächst zusammen …` does not start with the infinitive. — Fix: /tsuˈzamənvaksn̩/; «zusammenwachsen → wuchs zusammen → ist zusammengewachsen».
- [minor] line 538 — «троє священників» is a Russianism. — Fix: «троє священиків».
- [minor] line 574 — «Панєвропейський» has no apostrophe, while line 49 has «Панʼєвропейський». — Fix: «Панʼєвропейський» in both.
- [minor] q12 option «3 жовтня — день народження Гельмута Коля» is a joke distractor. — Fix: «3 жовтня 1990 року в Москві підписали «Два плюс чотири»».
- Verified:
  - Wende (Wenden), Friedensgebet, Montagsdemonstration, Ausreise, Bürgerrechtler, Pressekonferenz, unverzüglich (Duden: both stresses), Grenzübergang /ˈɡʁɛntsʔyːbɐˌɡaŋ/, Mauerfall, Runder Tisch (declension), Beitritt + Dat, Treuhand /ˈtʁɔʏ̯hant/, Ostalgie /ɔstalˈɡiː/, Ossi/Wessi.
  - All are correct.

## dl-b1-14. Німеччина в ЄС і сьогодні

**Verdict: ready after fixes.**

- [minor] line 297 — `[[58,6|58,6 %|58,6 Prozent]] Prozent` ends in the literal «Prozent», so the variants would read «58,6 Prozent Prozent». — Fix: `[[58,6]] Prozent`.
- [minor] line 169 — «g тут вимовляють як [ŋ], «ШЕН-ген»» contradicts itself: the hint shows [n]+[ɡ], and [ŋ] comes from *ng*, not from *g*. — Fix: «ng = [ŋ], без окремого [ɡ]: «ШЕҤ-ен»» (or simply «як у *lang*»).
- [minor] line 327 — /ˈtsaɪ̯tn̩vɛndə/ has no `ˌ`, while w18 has /ˈtsaɪ̯tn̩ˌvɛndə/. — Fix: be consistent.
- [minor] line 335 — The tip implies only [ukʁaˈiːnə]; Duden also gives [uˈkʁaɪ̯nə]. — Fix: «стандартно «у-кра-І-не»; Duden допускає й «у-КРАЙ-не»; неправильно — «У-край-не»».
- [minor] line 63 — «ціни на струм» is a Germanism: *Strom* means electricity, *струм* means current. — Fix: «ціни на електроенергію».
- [minor] line 304 — The heading «В Ausländerbehörde» mixes the languages. — Fix: «У відомстві у справах іноземців (Ausländerbehörde)».
- [minor] line 47 — «Німеччина перевіряє на всіх своїх сухопутних кордонах» lacks an object. — Fix: «проводить перевірки на всіх…».
- [minor] line 350 — «Так само жила й D-Mark» is unidiomatic. — Fix: «Так само й з D-Mark: *zwanzig Mark*».
- [minor] q07 option «Запровадження євро як єдиної валюти в Україні» and the q08 bank distractors *Mauerfall* and *Ostalgie* are joke or implausible. — Fix: «Відмову від Шенгену» / bank *Asyl, Bundeswehr* (check each gap).
- Verified:
  - Europäische Union, Gründungsmitglied (-glieder), Mitgliedstaat, Binnenmarkt (Binnenmärkte), Währung, Freizügigkeit, Flüchtling (masculine also for women), Geflüchtete (adjectival declension), Asyl /aˈzyːl/, Integration, Energiewende /enɛʁˈɡiːˌvɛndə/, Atomausstieg /aˈtoːmˌʔaʊ̯sʃtiːk/, Sondervermögen (Pl. = Sg.), Bundeswehr.
  - All are correct.
  - *schaffen* (weak) vs *schaffen* (strong) is explained correctly.

---

## Sources used for spot checks

- Duden online and DWDS entries: Thesis, Kaufmann, Kurländer, Stachel, Fasson, Barrikade, Kleinstaaterei, Untertan, Pogrom, Ukraine, Holocaust, unverzüglich.
- CONTENT_SPEC §222 and `src/content/blocks/quiz/exercise.ts` (`parseFill`), for how `bank:` works.
- Encyclopedia of Ukraine, *Treaty of Zboriv*.
- Grundgesetz, Art. 145.
- The file bytes were checked with `xxd` and `grep`.
