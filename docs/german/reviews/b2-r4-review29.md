# Review — B2-29 «Підсумок B2 — тест рівня» (`de-b2-review`)

File: `content/Guides/Deutsch/Deutsch - B2 - 29. Підсумок B2 — тест рівня.md`
Reviewer: opus (fresh agent, did not write the topic). Date: 2026-10-31.

**Verdict: ready after fixes.** No blockers. There are 5 majors: one order item with two correct orders, a wrong
comma in a correct answer, a Hören Teil 3 speaker who is never named, gaps in B2-01…28 coverage, and the
audio-length warnings. The rest are minors.

## What I checked, and against what

- **Structure.** Compared section by section with `Deutsch - B1 - 30`. The order matches: success, 2 diagrams,
  quiz blocks, Goethe-format section, dictation/listening, pairs, speak, pitfalls, checklist, reels, sources and
  summary.
- **Counts** against row B2-29 (W 0 · L 10 · S 6 · P 4 · Q 30, ±20 %):
  - quiz 35 (limit 24–36), OK;
  - listen 11 (limit 8–12), OK;
  - speak 6, pair 4, pitfall 4, reel 3, diagram 2, word 0 — all OK.
- **Quiz mix** (§2.6.6): 24 single/multi out of 35 (≥ 50 %) and 11 fill/order (≥ 4). OK.
- **Ids.** `q01–q35`, `l01–l11`, `s01–s06`, `p01–p04` are sequential in reading order and unique (§2.7.8). OK.
- **Diagram colours** (§2.7.3): compare uses yellow/pink, flow uses mint/orange/gray, and every node has a text label. OK.
- **Goethe B2 format.** Checked against the official online Modellsatz (bfu.goethe.de/b2_mod_2MX6/lesen.php and
  hoeren.php) and §10.2.
  - Lesen: 5 parts, 30 items, 65 min. Teil 3 is a newspaper article with 6 items, a/b/c.
  - Hören: 4 parts, 30 items. Teil 1 is heard once (5 texts × 2 items: Richtig/Falsch + a/b/c). Teil 2 is an
    interview, heard twice, 6 × a/b/c. Teil 3 is a radio conversation, heard once, 6 items «Wer sagt das?»
    (Moderator / two named guests). Teil 4 is a lecture, heard twice, 8 × a/b/c.
  - Schreiben 75 min (2 tasks). Sprechen ≈ 15 min + 15 min preparation.
  - The lesson's description at l.385 and l.653 is **correct**. See the minors below for what is missing.
- **IPA** against DWDS and Duden:
  - Technologie tɛçnoloˈɡiː, Kritik kʁiˈtiːk, Beamter bəˈʔamtɐ, Studie/Studium, Kritiker ˈkʁiːtikɐ: OK.
  - Interview: DWDS gives ˈɪntɐvjuː, so the lesson does not match (see minors).
  - Spot-checked in the speak lines, all OK: Nachfrage, Freitag, zentral, Minister, Anstieg, dankbar, Wohnung,
    Miete, Preise.
- **Coverage of B2-01…28.** Compared against the syllabus headings, then grepped the vocabulary used in this
  topic against earlier topics.
- **`content:check`** (`VAULT_PATH=content … check-guide.ts deutsch`) gives 4 warnings:
  - l08: 326 audio characters;
  - l09 and l10: 363 each;
  - l11: 471.
- **Sources.** curl returns 200 for all 6 links.
- **Facts:**
  - § 568 BGB requires written form for a tenancy termination: correct.
  - Erststimme / Zweitstimme, and who elects the chancellor and the president: correct.
  - Bastian Sick, «Der Dativ ist dem Genitiv sein Tod», 2004: correct.
  - The Pseudo-Anglizismen in q22 (Handy, Beamer, Oldtimer, Smoking): correct.

## Issues

### Major

- **[major] l.244–258 (q19) — two correct orders.**
  - Problem: the chunks `das / über / den / Witz / laut / lachende / Kind` also form *das **laut** über den Witz
    lachende Kind*, which is fully grammatical. `order` checks one exact sequence (CONTENT_SPEC §4.3.1), so a
    correct answer would be marked wrong.
  - Fix: make `laut lachende` one chunk, so the order is unique: `das / über / den / Witz / laut lachende / Kind`
    + `gelachte ✗`. Alternatively, drop *laut* (and «голосно» from the stem).

- **[major] l.228 (q17) — the correct answer has a wrong comma.**
  - Quoted line: `- [x] Wegen des Anstiegs der Preise, …`
  - Problem: after nominalisation there is no subordinate clause left, so a prepositional phrase takes no comma
    (*Wegen des Anstiegs der Preise kaufen viele weniger*). The option teaches a typical comma mistake. It is the
    model answer, and B2-10 trains exactly this.
  - Fix: remove the comma from all four options (`Wegen des Anstiegs der Preise …`). Add one sentence to the
    explanation: «після Nominalstil кома зникає, бо підрядного речення вже немає».

- **[major] l.491–515 (l09, l10) — Hören Teil 3: «Frau Sommer» is never named, the audio is duplicated, and the
  answer is c in both.**
  - Problem: the options are *der Moderator / Herr Brandt / Frau Sommer*, but the audio introduces only Herr Brandt.
    The learner gets to «C = Frau Sommer» only by elimination. In the real exam the guests are introduced by name
    (Modellsatz: Moderator, Frau Gerster, Frau Lücke). The two blocks also have identical audio (363 characters
    each, over the limit), and both have answer c.
  - Fix: split the discussion into two consecutive segments, one per question, as B2-14 does with its scenes.
    Character counts below are without the `A:/B:/C:` labels.
    - **l09** (≈ 280 characters):
      `A: Heute geht es um Radwege in der Innenstadt. Zu Gast sind Herr Brandt und Frau Sommer. Herr Brandt?`
      `B: Mehr Radwege sind längst überfällig. Die Autos blockieren die Stadt.`
      `A: Frau Sommer?`
      `C: Das sehe ich anders. Viele Geschäfte brauchen Parkplätze für ihre Kunden, sonst bleiben die Leute weg.`
    - **l10** (≈ 160 characters):
      `A: Herr Brandt, was sagen Sie dazu?`
      `B: Dank der Radwege kommen auch mehr Kunden zu Fuß oder mit dem Rad.`
      `C: Zugegeben, Herr Brandt, aber das gilt nicht für alle Geschäfte.`
    - Change the l10 title from «та сама дискусія» to «продовження дискусії». Optionally, to vary the answer key,
      ask in l10 «Хто вважає, що велодоріжки допомагають і магазинам?» (answer b, Herr Brandt). The concession
      *zugegeben* can then move into the explanation.

- **[major] l.479–524 (l08, l11) — audio over 300 characters (`content:check` warnings).**
  - How the course already does it: B2-13 keeps every `[!listen]` at ≤ 288 characters by splitting each lecture
    (Vortrag 1–3) into consecutive segments with a shared title prefix («Vortrag 2. …») and one question per
    segment. B2-14 does the same with short scenes of 2–4 `A:/B:` lines (≤ 232 characters).
  - Constraint: L for this topic is 10, with a ceiling of 12. Splitting every block would exceed it, so:
    - **l08 (Teil 2, 326 → ≈ 272): shorten, don't split.**
      `A: Frau Köhler, warum schlafen so viele Menschen schlecht?`
      `B: Ein Hauptgrund ist Dauerstress, aber auch das Handy im Bett. Wer abends Nachrichten liest, kommt schwer zur Ruhe.`
      `A: Was raten Sie?`
      `B: Legen Sie das Handy eine Stunde vor dem Schlafengehen weg und halten Sie feste Zeiten ein.`
      Update the quote in the explanation to match.
    - **l11 (Teil 4, 471): split into two blocks**, «Goethe B2, Hören Teil 4 (1/2)» and «(2/2)», following the
      B2-13 model:
      - (1/2), 246 characters: `Meine Damen und Herren, … wieder befüllt. Im Folgenden zeige ich, warum das die Umwelt schont.` Question:
        «Was bedeutet Mehrweg laut Redner?» with options a) Verpackungen werden recycelt · b) Flaschen und Becher
        werden gespült und wieder befüllt · c) Verpackungen werden kompostiert.
      - (2/2), 224 characters: `Dem stehen allerdings Kosten gegenüber, … möglichst oft wiederverwendet wird.` Keep the current main-idea
        question and its options.
    - Total after these changes: L = 12, the upper limit. If room is needed for anything else, remove the
      dictation l03 or l04: Konjunktiv I and the passive with a modal are already covered in quizzes.

- **[major] Coverage of B2-01…28 in the test: several topics have no test item.**
  - Not tested at all:
    - **B2-12** (regional pronunciation): no quiz and no listen; only a mention of *Moin / Servus / Grüezi* in the checklist;
    - **B2-20** (culture, reviews): nothing, although it is named in the success block (l.14) and in the checklist
      (*Rezension*);
    - **B2-24** (word formation): only one pitfall;
    - **B2-26** (speaking): only one speak line.
  - **B2-16** (science) and **B2-19** (economy) appear only in a pitfall (*Studie/Studium*, *Billion*).
  - Meanwhile some areas are over-represented:
    - B2-07 has 3 quizzes (q12–q14) plus l02 and s03;
    - Zustandspassiv is tested twice (line 3 of q02 and q03).
  - Fix: replace q03 (Zustandspassiv, already in q02) and q14 (or q13) with:
    - B2-20: «Фільм затягнутий» → *langatmig*, with distractors *kurzweilig / überzeugend / spannend*. Don't use
      *langweilig* as a distractor: it would also be correct;
    - B2-24: «Дискусія, яка не має сенсу» → *sinnlos*, with distractors *sinnhaft / sinnmäßig / unsinnlos*;
    - optionally B2-12 or B2-19 instead of one Teil 3 quiz: *-ig* pronounced [ɪk] in the south; *Rente / Steuer /
      Kredit*.
  - The count stays at 35.

### Minor

- **[minor] l.50 — stray `~geworden~` in a diagram `note:`.**
  - Problem: a single tilde is not strikethrough. Inside the YAML string it will show as literal `~geworden~`.
  - Fix: `note: "Perfekt: sein + Partizip II + worden. Не geworden: у пасиві Partizip II від werden — worden (B2-02)."`
    Or put «geworden» in quotation marks.

- **[minor] l.66 (q01) — wrong explanation for a distractor.**
  - Quoted: «*Er wird den Zug verpasst* — це пасив Präsens».
  - Problem: a passive has no accusative object (that would be *Der Zug wird verpasst*), so this sentence is
    simply ungrammatical.
  - Fix: «*Er wird den Zug verpasst* — неможлива форма: Partizip II без *haben*, а пасив був би *Der Zug wird verpasst*».

- **[minor] l.79–84 (q03) — option `ist … worden` doesn't fit a one-word gap.**
  - Fix: if q03 stays (see the major on coverage), use `ist worden` or drop it in favour of `hat`. Note that
    *Das Geschäft hat geöffnet* is just as correct for «відчинено», so if you add `hat`, it has to count as a
    correct answer. Simplest: delete q03.

- **[minor] l.242 (q18) — overstatement.**
  - Quoted: «*Gelachte* — неіснуючий Partizip II».
  - Problem: *gelacht* exists; it just can't be used as an attribute, because *lachen* is intransitive.
  - Fix: «*gelachte* — Partizip II від неперехідного *lachen* не вживається як означення».

- **[minor] l.291–298 (q23) — the article gives the answer away, and the explanation is too categorical.**
  - Problem: *Die ___* rules out *Termin* and *Moment* (both masculine). Also, *Abgabetermin* is a common German
    word for «deadline», so «Termin — конкретна дата зустрічі» is too narrow.
  - Fix: use a gap without an article, «Die Abgabe___ endet am Freitag» → *-frist*, or the stem
    «Wir haben eine ___ von zwei Wochen» with options *Frist / Termin / Zeitpunkt / Stunde*. In the explanation,
    add «*Termin* — дата (*Abgabetermin* — дата здачі), *Frist* — проміжок часу».

- **[minor] l.341 (q28) — `umfahrt` is a real form (*ihr umfahrt*), and the explanation doesn't mention it.**
  - Fix: add «*umfahrt* — Präsens для *ihr*, а після *hat* потрібен Partizip II».

- **[minor] l.327–334 (q27) — the stem doesn't trigger the calque, and the explanation contains a non-existent
  Ukrainian phrase.**
  - Problem: the stem says «Ухвалити рішення», which doesn't lead to *nehmen*. The explanation mentions «давати
    рішення», which doesn't exist in Ukrainian.
  - Fix: change the stem to «Прийняти рішення». In the explanation: «українське «прийняти» підказує *nehmen*,
    «зробити вибір» — *machen*; правильна сполука — *treffen*».

- **[minor] l.378 (q31) — *Hausmeister* ≠ «консьєрж».**
  - Fix: «усна розмова з завгоспом / двірником (*Hausmeister*)».

- **[minor] l.385 and l.653 — Hören duration missing, and the Teil 1 / Teil 3 Lesen format is simplified without
  saying so.**
  - Fixes:
    - add «Hören ≈ 40 хв» (§10.2);
    - at l07, note «у справжньому Teil 1 до кожного тексту два завдання: richtig / falsch і a / b / c»;
    - in the intro to the reading text, say «справжній текст Teil 3 удвічі–втричі довший і має 6 завдань».
  - Optional: make l07 two items, an R/F followed by a/b/c. That costs +1 L, so only if one dictation is removed.

- **[minor] l.388–392 — German style in the reading text.**
  - *sich zu Hause konzentrierter fühlen* is unidiomatic. Use *sich zu Hause besser konzentrieren können*.
    q33a already says it that way.
  - *feste Präsenztage … festzulegen* repeats *fest*. Use *Präsenztage für Teamtreffen festzulegen*.
  - *auch die Befürworter* doesn't say of what. Use *auch die Befürworter des Homeoffice*.
  - Also note: the topic and the «2–3 Tage im Büro» compromise repeat B2-13 Vortrag 2 almost word for word. That
    is acceptable for a review, but you could switch to another theme, e.g. the Vier-Tage-Woche, so the answers
    can't be recalled from memory.

- **[minor] l.408 (q33) — «економію однієї години»: the text says *über eine Stunde*.**
  - Fix: → «економію понад годину».

- **[minor] l.424 (q35) — broken Ukrainian.**
  - Quoted: «Технікою відповідь a — типова пастка на збіг слів.»
  - Fix: → «Відповідь a (*Technik*) — типова пастка: слово є в тексті, але з *weniger*».

- **[minor] l.472 (l07) — unidiomatic announcement.**
  - Problem: *Bitte füllen Sie sich rechtzeitig etwas Wasser ab* is unidiomatic for a building management notice.
  - Fix: *Bitte stellen Sie sich rechtzeitig einen Wasservorrat bereit.* Then change option b to *sich vorher
    Wasser bereitstellen*, or keep *vorher Wasser in Flaschen abfüllen* in both places.

- **[minor] l.20 — «Нових слів тут немає» is not true.**
  - Problem: *Präsenztag(e)*, *überprüfbar*, *Rohrbruch* and *verschwimmen* don't occur in any earlier topic
    (grep of `content/Guides/Deutsch`).
  - Fix: replace them (*Bürotage*, *leicht zu überprüfen* is already in q04, *ein kaputtes Rohr*, *nicht klar
    getrennt*). Or soften the sentence to «Нових правил немає; кілька слів можна вгадати з контексту».

- **[minor] l.562–563 (s02) — stress in *Interview*.**
  - Problem: DWDS gives ˈɪntɐvjuː, and Duden lists the stress on the 1st syllable as primary («auch: …ˈvjuː»). The
    IPA `ɪntɐˈvjuː` and the tip «наголос на останньому складі» present the secondary variant as the only one.
  - Fix: IPA `ˈɪntɐvjuː`, tip «наголос на першому складі (можливий і на -view)».

- **[minor] l.533 (p01) — [ç] called «легкий шиплячий».**
  - Problem: in Ukrainian, «шиплячі» are ш, ж, ч, so the description is misleading.
  - Fix: «ch = [ç], мʼякий звук, як «хь» з усмішкою».

- **[minor] l.603 — pitfall 3: «наголос на корені» is not true for *miss-*.**
  - Problem: *ˈmissverstehen*, *missverstanden* is stressed on *miss-* and still has no *ge-*.
  - Fix: «наголос зазвичай на корені (у *miss-* буває й на префіксі: *ˈmissverstehen*)».

- **[minor] l.627 — checklist B2-12.**
  - Problem: *Moin, Servus, Grüezi* are greetings, not pronunciation.
  - Fix: «розумію регіональну вимову (*-ig* як [ɪk] на півдні, *nich / ne* на півночі) і регіональні привітання
    (*Moin, Servus, Grüezi*)».

- **[minor] l.668 — «Nicos Weg (B2)».**
  - Problem: the DW course *Nicos Weg* covers A1–B1, and the course itself already links its B1 part from B1-06.
    The `niveau-b2` page is DW's general B2 overview, not Nicos Weg.
  - Fix: rename the link «DW Learn German — матеріали рівня B2».

- **[minor] l.291, 354, 385, 585, 624 — apostrophe ’ (U+2019) instead of ʼ (U+02BC)** (§2.7.13).
  - Affected: п’ятниця ×3, п’ять, з’єдную. In l.584, «м’яка» also uses U+2019.
  - Fix: replace all of them with ʼ.

- **[minor] l.543 (p03) — «у обох» → «в обох»** (euphony: before a vowel, after a vowel).

## Other checks: all OK
- **German grammar** in the remaining items (q02, q04–q16, q20–q22, q24–q26, q29–q32, q34, l01–l06, s01, s03–s06,
  diagrams, summary): OK. Every distractor is a typical mistake, and there is one defensible answer.
- **q08** («wusste» after *als ob*): defensible. The explanation is careful and doesn't call indicative after
  *als ob* an error.
- **Order items q05, q15, q30:** the order is unique because of capitalisation and the final period.
- **The «Ситуація» rule** (§2.7.4) and the explicit `type:` everywhere: OK. Hören uses `type: answer`, and choice
  appears only where the options are word-for-word German sentences.
