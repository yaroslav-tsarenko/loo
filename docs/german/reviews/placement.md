# Review: placement bank «Deutsch A1 → C2» (252 items)

> **Lead's note (added after the review): key positions must be rebalanced, and this is required.** The UI does
> **not** shuffle option order for single and multi quizzes. Only `order` and `fill` exercises are shuffled
> (`QuizInline.tsx`). Rebalancing key positions is therefore a content fix in the bank files. It applies above all
> to A1, where the key is never option 1, and to A2/B1, where it is option 2 in 28 and 25 of 42 items. Spread the
> keys roughly evenly over positions 1–4 in every file, as B2–C2 already do (11/10/10/11). This overrides the «only
> matters if the UI does not shuffle» wording in the "Applies to all files" section below.

I did not edit any files.

**Overall:**
- 3 wrong or double keys are confirmed against DWDS: B1-v02, C1-v09 and B2-g06.
- About 8 more items have a second answer that can be defended. They need a fix before release.
- The calibration problem is mostly C2 grammar: most of those items are B1/B2 content.
- The format is good: ids, 4 options, one `[x]` per item, `diff` spread close to 10/22/10, and every audio under 300 characters.

**`content:check Deutsch`** exits 1 with 137 problems. All of them are `broken-link` warnings in `Guides/Deutsch/_guide.md` (lessons not written yet). There are no warnings for `_placement` (no `placement-bank`, no `thin-placement`). Some audio is right at the limit:
- b1-l07 is about 299 spoken characters (336 with speaker labels).
- b1-l03 is about 286.

**Split inconsistency (not an error):**
- A1–B1 use 14/12/8/8; B2–C2 use 15/13/7/7. Both add up to 42.
- §13 itself says «граматика 14 · лексика 12 · читання 7 · аудіювання 7», which adds up to 40, not 42. The doc contradicts its own «42 питання». Pick one split and fix §13.

**Applies to all files:**
- **[minor] key position.**
  - In A1 the key is never option 1.
  - In A2 it is option 2 in 28 of 42 items; in B1, 25 of 42.
  - This only matters if the UI does not shuffle options. I could not confirm a shuffle in `placement.ts`; please check the renderer.
- **[minor] length cue.** In 8–9 items per file at C1/C2 the key is clearly the longest option, mostly in reading. Examples: c1-r02/r03/r04/r06/r07, c2-r01/r02/r03/r05/r07. Lengthen the distractors.

---

### A1 — verdict: good, 2 fixes

- **[major] de-pl-a1-g02** — *werde* is also correct: «Ich werde 20 Jahre alt» means "I'm turning 20". Fix: replace *werde* with *bist*.
- **[major] de-pl-a1-v11** — *mehr* fits too: «Kaffee trinke ich mehr» is grammatical and makes sense. Fix: options *lieber / gerner / besser / mehr gern* («gerner» is the real learner error).
- **[minor] a1-v05** — the explanation contradicts itself («читають «дві з половиною» і плутаються з 3:30»). «пів до третьої» is not normal Ukrainian. Write: *halb drei* = «пів на третю» = 2:30. The trap is reading it as English *half three* (3:30).
- **[minor] a1-l04** — same «пів до четвертої» wording. Use «пів на четверту».
- **[minor] a1-r06** — *3. OG* is the 4th floor in Ukrainian counting, because *EG* is «перший поверх». The explanation says «третій поверх»; correct it. The ad abbreviations (2-Zi.-Whg., OG, warm) are more A2 than A1, but diff 2 is acceptable.
- **[minor] a1-r03** — the text gives "18 Uhr" in digits, so the achtzehn/acht trap in the explanation never comes up. Lower to diff 1.
- **[minor] a1-r05** — the distractor «die Mutter von Max und Herr Müller» is ambiguous. Use «die Frau von Herrn Müller».
- **[minor] a1-v07** — «Українське орудний відмінок» → «Український орудний відмінок».
- **[minor] a1-v08** — this is verb agreement (grammar) filed under vocabulary.
- **[minor] a1-r01** — the explanation's «Rauchen схоже на «рахувати» чи «рух»» is not a real confusion; drop it.
- **[minor] a1-g12** — *war gefahren* is grammatical (Plusquamperfekt), though not natural with only «Gestern». Acceptable; the explanation already covers it.

### A2 — verdict: needs 2 fixes

- **[blocker] de-pl-a2-l07** — two answers are true. The question is «Was haben sie nach dem Museum gemacht?», and the train back «am Abend» also happened after the museum. The explanation itself says so. Fix: «Was haben sie **direkt** nach dem Museum gemacht?» or «Wo haben sie gegessen?».
- **[major] de-pl-a2-v07** — the key contradicts the stem. DWDS: *umtauschen* means swapping for an equivalent item, not getting a refund. «umtauschen und mein Geld zurück» is self-contradictory. Corrected stem: «Das Handy ist kaputt. Ich möchte es ___. Haben Sie das gleiche Modell noch einmal?» Key: *umtauschen*; options *wechseln / tauschen / verändern*.
- **[minor] a2-g01** — the explanation says «war … gegessen — Plusquamperfekt», but that is wrong: it is *hatte gegessen*. The item is also A1 content (Perfekt with haben). Better to replace it with Präteritum of modals or haben: «Gestern ___ ich keine Zeit» — *hatte / habe / hätte / war*. Präteritum of sein/haben/modals, *ob*/indirect questions and Futur from §5 are missing.
- **[minor] a2-g03** — «angerufft» is not a real error. The real learner error is *angeruft* (weak-verb ending).
- **[minor] a2-g07** — the explanation is wrong: Ukrainian does mark «де/куди» («в офісі» / «в офіс»). Rephrase.
- **[minor] a2-g09** — «wass» is a silly distractor. Use *weil* or *wenn*.
- **[minor] a2-v02** — «her und hin» and «oben und unten» are weak distractors.
- **[minor] a2-v05** — «українська «фамілія»» is a Russianism. Write «розмовне (русизм) «фамілія»».
- **[minor] a2-v12** — *gekannt* can be read as making sense («we knew each other in 2015»). Make it an event: «…2015 in Wien **auf einer Party** ___».
- **[minor] a2-r03** — the explanation admits «33 — випадкове число». Use 27 instead (a minute-arithmetic slip).
- **[minor] a2-r06** — the explanation says «нових доріг»; it should be «велодоріжок».

### B1 — verdict: 1 blocker, 3 major; known gap confirmed

- **[blocker] de-pl-b1-v02** — *Grundmiete* is also correct. DWDS: Grundmiete is a synonym of (Netto)Kaltmiete. Fix: replace it with *Untermiete* (a real distractor). Also cut the explanation's «учні часто шукають зайвий сенс».
- **[major] de-pl-b1-g07** — *darüber* can be defended: «Ich freue mich darüber, dass du uns bald besuchst» means being glad about the news. Fix: «Ich freue mich schon ___ die Ferien im Juli.» Options *auf / über / für / an*.
- **[major] de-pl-b1-g14** — TeKaMoLo is a tendency, not a rule. «Ich fahre mit dem Zug morgen nach Berlin» is fine with focus on the train. Fix: change the prompt to «Обери нейтральний порядок слів», or replace the item with a *nicht*-position item (see gap items below).
- **[major] de-pl-b1-v10** — the article gives the answer away. «Beim» excludes *Vorspeise*, *Vorlesung* and *Verhandlung* (all feminine). Fix: «Nach der Bewerbung wurde ich zu einem ___ eingeladen.» Options *Vorstellungsgespräch / Mitarbeitergespräch / Arbeitsamt / Anschreiben*.
- **[major] de-pl-b1-v09** — «in der Nachricht» refers to a text that isn't there. Add context: «Die **aktuellen** Zahlen zeigen, dass die Mieten steigen. — Was bedeutet «aktuell»?»
- **[minor] b1-g13** — «Das Haus ist 1950 gebaut» is borderline acceptable as Zustandspassiv in colloquial use. Add an agent: «… 1950 von einer Kölner Firma gebaut».
- **[minor] b1-v06** — «die blaue ___» excludes the masculine options *Eimer* and *Sack*; the explanation even says so. Use feminine distractors: *Kiste / Box / Dose*.
- **[minor] b1-g04** — cleaner with a Präteritum main clause: «…, ging ich spazieren».
- **[minor] b1-r05** — single-use PET bottles (25 ct) are recycled, not reused. Write «recycelt werden».
- **[minor] b1-v12** — «innerhalb einer Zeit von» is clumsy but possible. Replace *Zeit* with *Weile*.
- **[minor] b1-v01** — «кауція» is a rare word in Ukrainian; just use «застава».
- **[minor] reading length** — 29–55 words, below the English B1 bank (44–82). b1-r02 has 29.
- **[minor] b1-l03** — the explanation says «очікувала»; B's gender is unknown.

**Known gap confirmed.** Also missing: modal particles, *ohne/statt … zu*, relative *wo/was*. I suggest replacing g01 (A2-level), g14 and g08 (a second relative-pronoun item). Proposed items:

```
> [!quiz] Ich habe ___ Zeit noch Lust, heute ins Kino zu gehen.
> level: B1 · skill: grammar · diff: 2 · id: de-pl-b1-g15
> - [x] weder
> - [ ] entweder
> - [ ] sowohl
> - [ ] nicht
>
> **Пояснення:** «ні … ні» — **weder … noch**: *Ich habe weder Zeit noch Lust.* *Entweder* йде в парі з *oder*, *sowohl* — з *als auch*; «nicht … noch» — калька з «ні».

> [!quiz] Je länger ich in Berlin wohne, ___ besser gefällt mir die Stadt.
> level: B1 · skill: grammar · diff: 2 · id: de-pl-b1-g16
> - [x] desto
> - [ ] dann
> - [ ] als
> - [ ] mehr
>
> **Пояснення:** «чим … тим» — **je + Komparativ …, desto (umso) + Komparativ**. «Dann» — калька з «то»; *als* — після вищого ступеня в порівнянні.

> [!quiz] Je mehr du übst, desto ___.
> level: B1 · skill: grammar · diff: 3 · id: de-pl-b1-g17
> - [x] besser sprichst du
> - [ ] besser du sprichst
> - [ ] du sprichst besser
> - [ ] sprichst du besser
>
> **Пояснення:** після *desto + Komparativ* — інверсія: *desto besser* займає перше місце, дієслово друге, підмет після нього.

> [!quiz] Gestern hat mir ein ___ beim Umzug geholfen.
> level: B1 · skill: grammar · diff: 2 · id: de-pl-b1-g18
> - [x] Bekannter
> - [ ] Bekannte
> - [ ] Bekannten
> - [ ] Bekannt
>
> **Пояснення:** прикметник як іменник (*bekannt → der Bekannte*) відмінюється як прикметник: після *ein* у Nominativ чол. роду — **-er** (*ein Bekannter*, але *der Bekannte*).

> [!quiz] Ich wünsche dir alles ___ zum Geburtstag!
> level: B1 · skill: grammar · diff: 3 · id: de-pl-b1-g19
> - [x] Gute
> - [ ] Gutes
> - [ ] Guten
> - [ ] gute
>
> **Пояснення:** після *alles* — слабке закінчення **-e** і велика літера: *alles Gute*; але *etwas / nichts Gutes*.
```

Key note for g16: I deliberately left out *umso*, because it is also correct.

### B2 — verdict: 1 blocker, 3 major; too much A2/B1 content

- **[blocker] de-pl-b2-g06** — DWDS lists *trotzdem* as a concessive conjunction: «er kam, trotzdem er erkältet war» (ugs.). So «Trotzdem er seit Tagen Fieber hatte…» is acceptable colloquially, and the explanation's «неможливий» is false. Fix: replace *Trotzdem* with *Trotz*. Better still, replace the whole item: *obwohl* is A2/B1 content.
- **[blocker] de-pl-b2-g14** — *sein* is also correct: «Der Antrag hätte bis Montag eingereicht **sein** müssen» (Zustandspassiv with a deadline) is natural German. Fix: replace *sein* with *haben*.
- **[major] de-pl-b2-g11** — «Das Problem kann sich leicht lösen» is grammatical (it can solve itself). Fix: replace *kann* with *hat*.
- **[major] de-pl-b2-g15** — «Als wir ankamen, wurde die Tür schon abgeschlossen» works too (they were already locking it). Fix: «… ___ die Tür schon **seit einer Stunde** abgeschlossen.»
- **[major] de-pl-b2-l01** — this is A2-level and copies the A2-l06 / B1-l05 scenario (cinema, exam tomorrow). Replace it with a B2 item, e.g. a talk-show disagreement or lecture hedging.
- **[major] calibration**
  - g08 (*in einem kleinen Haus*) and g10 (*bei starkem Regen*, diff 3) are A2 adjective declension.
  - Missing: *als ob*, *zu … als dass*, Futur II, Nominalisierung, two-part connectors (*zwar … aber*, *sowohl … als auch*), and subjective *wollen*/*müssen*.
  - g05 (*nicht zu lösendes*, a Gerundiv) is C1 by §8.1; diff 3 is acceptable.
  - Replace g08 with an *als ob* item: «Er tut so, als ob er nichts ___» — *wüsste / weiß / wusste / gewusst*.
- **[minor] b2-g01** — the explanation says «habe — Konjunktiv I», but in a *wenn*-clause it is Indikativ Perfekt.
- **[minor] b2-g03** — the explanation says «студія сама щось публікує»; it should be «дослідження». The Russian-style «студія» is wrong for *Studie*.
- **[minor] b2-g10** — the explanation says «Starker — Nominativ чи Genitiv жін. роду». It should be «Nominativ чол. роду або Genitiv/Dativ жін. роду».
- **[minor] b2-g02** — *ist renoviert gewesen* (Zustandspassiv Perfekt) is barely possible. Acceptable.
- **[minor] b2-g04** — the stem prefix «Zeitungsbericht, Norm der indirekten Rede:» is clumsy. Use «(Pressestil)».
- **[minor] b2-r06** — the explanation says «сказано нічого»; it should be «не сказано нічого».
- **[minor] reading length** — 28–64 words is short for B2. r05 has 28 and r07 has 38.
- **[minor] b2-v10** — DWDS confirms «in Zweifel stellen» isn't listed, so the distractor is fine. The spelling *infrage* is now preferred.

### C1 — verdict: 1 blocker, 4 major

- **[blocker] de-pl-c1-v09** — DWDS gives *unterbauen*, sense 2: «etw. durch stichhaltige Argumente stützen, untermauern», e.g. «eine These wissenschaftlich unterbauen». So two answers are correct. Fix: replace *unterbauen* with *unterstellen* (a real *unter-* confusion).
- **[major] de-pl-c1-v01** — DWDS shows *führen zu … Ergebnissen*, and «Die Studie führt zu dem Ergebnis, dass…» is common. Fix: replace *führt* with *zieht* (interference from *einen Schluss ziehen*).
- **[major] de-pl-c1-g14** — «die bis Freitag eingereichten Unterlagen» works too. Fix: «Die bis spätestens Freitag ___ Unterlagen liegen uns noch nicht vor.»
- **[major] de-pl-c1-g09** — «Bezogen auf Ihr Schreiben…» is widely used in letters. Fix: replace *Bezogen* with *Bezug genommen*. DWDS allows both *bezugnehmend* and *Bezug nehmend*.
- **[major] de-pl-c1-g15** — «Wie stark er sich auch bemühte» is acceptable. Fix: replace *stark* with *mehr* (confusion with *je mehr*).
- **[minor] c1-g10** — in colloquial reported speech the Indikativ («sie sagte, sie war … gewesen») is common. Add «(Protokoll)» to the stem.
- **[minor] c1-g02, g05, g06** — B1-level content (Genitiv -s; particles *ja*/*denn*). g06 at diff 3 is overrated; make it diff 1.
- **[minor] c1-g13** — the explanation's «вимагає Dativ-підмета» is muddled. Write: «Vorgangspassiv тут: *Uns sind die Unterlagen zugeschickt worden*».
- **[minor] c1-r03** — the explanation says «суд тут не згадується», but the text names «das zuständige Verwaltungsgericht».
- **[minor] c1-r05** — Germany has no *Geschworene*. Use «Richtern und Schöffen».
- **[minor] c1-r06** — «ironія» mixes Latin and Cyrillic letters (the only such case in the bank). Write «іронія».
- **[minor] c1-l06** — it repeats the r05 topic (memory reconsolidation), which gives the answer away. Change the topic.
- **[minor] c1-v08** — the explanation calls *sich zutragen* «застаріле»; it is «книжне».
- **[minor] c1-l04** — the explanation mixes «Б» and «B».
- **[minor] c1-r02** — «розмовляють довідкою» is an unnatural phrase.

### C2 — verdict: grammar is mis-pitched; 1 blocker-level key, 3 major

- **[blocker] de-pl-c2-g05** — *ist* is also correct: «Dem Angeklagten ist ein faires Verfahren zugesichert» (Zustandspassiv). Fix: «Dem Angeklagten ___ gestern vom Gericht ein faires Verfahren zugesichert.» Also, the explanation calls it «безособовий пасив», but it has a subject. And it is B1 content at C2.
- **[major] de-pl-c2-v13** — «sich wie ein Flächenbrand ausbreiten» is a common comparison. DWDS has no exact entry, so this is a judgement call, but the explanation's «не порівняння» is false. Fix: replace *Flächenbrand* with *Strohfeuer*.
- **[major] de-pl-c2-g12 / g13** — *womit* after a noun and *auf was* are colloquial (*womit* also older literary usage). The explanation itself calls *auf was* «розмовні». Fix: replace *womit* with *mit den*, and *auf was* with *auf den*.
- **[major] calibration**
  - g08 (*ohne … zu*), g10 (*wessen*), g11 (*bestreiten, dass*), g12, g13, g15 (*Kaum hatte*) and g01 (*als dass*, B2 by §7) are B1/B2 content.
  - The §13 C2 targets are almost absent: stylistic word order and emphasis, Konjunktiv in legal, literary and instruction style, Schachtelsatz.
  - Replace at least 4 items. Examples:
    - «Man ___ 200 g Mehl und zwei Eier» — *nehme / nimmt / nähme / nehmt*
    - «___ es, wie es wolle» — *Sei / Wäre / Ist / Werde*
    - a Vorfeld-emphasis choice («Gelesen hat er das Buch nie»)
    - a Schachtelsatz verb-cluster item («…, dass er das Buch hat lesen wollen»)
  - Vocabulary: 6 of 13 items are well-known proverbs (v01–v06). Replace 2–3 with more euphemism, Amtsdeutsch or false-friend items.
- **[minor] c2-v02** — «ранок мудріший за вечір» is a calque of a Russian proverb and means something else. Use «Хто рано встає, тому Бог дає».
- **[minor] c2-v01** — the proverb doesn't rhyme, so the explanation's «римований ритм» is wrong.
- **[minor] c2-v09** — «облажатися» is surzhyk-style slang. Use «напартачити, схибити».
- **[minor] c2-r06** — the explanation says the last sentence is the «іронічна похвала», but that is the 5th sentence (about *Konsequenz*). Also «комплементом» → «компліментом».
- **[minor] c2-l05** — the key «machen Entscheidungen oft unzufriedener» is odd German. Use «machen Menschen mit ihren Entscheidungen oft unzufriedener».
- **[minor] c2-l06** — the key «ironisch über ihre eigene Überzeugungskraft» misses the point. Better: «Sie gibt ironisch zu, Überzeugungen zu verkaufen, die sie selbst nicht teilt — und dass das gut ankommt.»
- **[minor] c2-g14** — «Nicht nur er kam zu spät…» is grammatical (focus on *er*), though it clashes with the second clause. Acceptable.
- **[minor] c2-v04** — DWDS: «wo gehobelt wird, (da) fallen Späne»; «fliegen» belongs only to «dass die Späne fliegen». The key is correct and the distractor fine.

---

### What I verified, and against what

- **Every item** (all 252, read in full): key, distractors, register and the Ukrainian explanation. Standards: GERMAN_SYLLABUS §1.1, §4–§8 (level grammar lists), §8.4 and §13; LANGUAGE_COURSE «Банк вступного тесту»; the English `_placement/B1.md` format.
- **Script checks:**
  - skill and diff counts per file;
  - reading word counts (A1 2–36, A2 9–40, B1 29–55, B2 28–64, C1 131–141, C2 149–178);
  - spoken audio length (max ≈299; the limit is `MAX_AUDIO_CHARS = 300` in `src/content/blocks/listen/definition.ts`, speaker labels excluded);
  - key-position and length-cue stats;
  - a Latin/Cyrillic mixing scan (found only C1-r06).
- **DWDS lookups (27 entries):**
  - **Caused findings:**
    - *Grundmiete* = Nettokaltmiete (B1-v02 blocker)
    - *unterbauen*, sense 2 = untermauern (C1-v09 blocker)
    - *trotzdem* as a concessive conjunction (B2-g06)
    - *umtauschen* = swap for an equivalent item (A2-v07)
    - *Ergebnis*: *führen zu … Ergebnissen* (C1-v01)
    - *Flächenbrand* (C2-v13)
  - **Keys confirmed:**
    - *bezugnehmend / Bezug nehmend* (both allowed)
    - *in Zweifel ziehen* (not *stellen*)
    - *Späne fallen*
    - *wie ein Lauffeuer*
    - *mit Ach und Krach*
    - *Zahlen schönen* (Jargon)
    - *um Kopf und Kragen reden*
    - *ins Stocken geraten*
    - *Kritik an jmdm. üben*
    - *unter Beweis stellen* (no *bringen*)
    - *stattgeben*
    - *Mist bauen*
    - *eine Hypothese aufstellen* (no *stellen*)
    - *Rücksicht nehmen auf*
    - *Personal/Stellen abbauen*
    - *in die Länge ziehen*
    - *den Kürzeren ziehen*
    - *Kaution / Monatsmiete*
    - *sparsam* (neutral-positive)
  - **Not retrieved:** Duden returned 404 and the DWDS corpus returned 403. The *womit*/*auf was* register and *sich freuen über* + future rest on standard grammar knowledge, not a fetched source.
- **Not verified:** whether the UI shuffles option order. `placement.ts` shuffles the item order, but I didn't find an option shuffle.
