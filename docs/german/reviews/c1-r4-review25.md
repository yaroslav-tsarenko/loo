# Review — C1-25 «Підсумок C1 — тест рівня» (`de-c1-review`)

File: `content/Guides/Deutsch/Deutsch - C1 - 25. Підсумок C1 — тест рівня.md`
Reviewer: opus (fresh agent, did not write the topic). Date: 2026-11-09.

**Verdict: ready after fixes.** No blockers. One major: the Lesen Teil 3 item q33 has a second defensible
answer. Everything else is minor. Most of the minors are wording, or rules stated too absolutely. The Goethe C1
format description matches the official Modellsatz. All IPA in the pairs and the speak lines is correct.

## What I checked, and against what

- **Structure.** Compared section by section with B2-29. The order matches: success, 2 diagrams, 4 quiz blocks,
  Goethe Lesen, dictation/listening, Goethe Hören, pairs, speak, pitfalls, checklist, reels, sources and summary.
- **Counts** against row C1-25 (W 0 · L 10 · S 6 · P 4 · Q 30, ±20 %):
  - quiz 35 (limit 24–36), OK;
  - listen 12 (limit 8–12), OK, at the ceiling;
  - speak 6, pair 4, word 0, OK.
- **Quiz mix** (§2.6.6): 29 single/multi out of 35, and 6 fill/order (q02, q08, q10, q21, q25, q30). OK.
- **Ids** (§2.7.8): `q01–q35`, `l01–l12`, `p01–p04` and `s01–s06` follow reading order and are unique.
- **`type:`** is explicit everywhere. `choice` (l01–l03) is used only where the options are the audio sentences
  word for word. Hören uses `answer` (§2.7.4). No `speed:` (B1+). OK.
- **`[!pair]` `say:`** matches a header word in all 4 pairs, and no header has an article. OK.
- **Apostrophes:** no U+2019 and no `'` in the Ukrainian text. OK.
- **Diagram colours** (§2.7.3). The compare diagram uses yellow/pink. The flow diagram uses orange/gray for the
  verb brackets and the other fields, and every node has a text label. OK.
- **`content:check`** (`VAULT_PATH=content npx tsx scripts/check-guide.ts deutsch`): no warnings for this file.
  The only warnings are the expected C2 broken links in `_guide.md`.
- **Audio length** (labels stripped): the maximum is 226 characters (l06), and every block is ≤ 300. OK.
- **Listening-only facts.** No task depends on regional sounds. *heuer* (q15) is a reading quiz, and l09–l12 are
  standard German. See the minor on l10/l11 for the two items that rely on a voice.
- **Coverage of C1-01…24.** Every topic has at least one item:
  - 01: q01, q02, l03 · 02: q03 · 03: q04, q05, q31, l05 · 04: q09, s04 · 05: q10, q11, l02 · 06: q07, q08, l01;
  - 07: q12 · 08: q13, q33 · 09: q06, l04 · 10: q14, s03 · 11: q15 · 12: q16, l06–l12 · 13: q17 · 14: q18;
  - 15: q19, s05 · 16: q20 · 17: q21 · 18: q22 · 19: q23 · 20: q24, q25 · 21: q26, q32–q35 · 22: q27, s06;
  - 23: q28 · 24: q29, q30.
  - I grepped the key items against their source topics: fernmündlich (C1-18), Feuilleton / Glosse / Leitartikel
    (C1-21), Desinformation (C1-23), Mahnverfahren (C1-20), heuer / Topfen / Billett (C1-11), the q29/q30
    compounds (C1-24), and einen Bären aufbinden, zielstrebig / verbissen, Nichteinhaltung, Prozentpunkt and
    der Einfachheit halber. All were found.
- **Goethe C1 format.** I downloaded the official Modellsatz PDF (goethe.de, `c1-modular_modellsatz.pdf`, Vs0.2) and
  read the overview table on p. 6 and the candidate sheets.
  - **Lesen** 65 min, no dictionary.
    - Teil 1: popular-science / informative article, gap text, 4-option MC, 8 items.
    - Teil 2: magazine article, 3-option MC, 7 items.
    - Teil 3: «Kommentar oder Reportage», 8 gaps filled from 10 sentences (2 are left over), 8 items.
    - Teil 4: three expert contributions a/b/c, 7 statements, 2 of which fit nobody (0). 7 items.
    - Total 30 = 8 + 7 + 8 + 7.
  - **Hören** ≈ 40 min.
    - Teil 1: podcast about new books, heard once, 6 items «zu welchem Buch».
    - Teil 2: radio interview, heard twice, 9 items «stimmt / stimmt nicht / dazu wird nichts gesagt».
    - Teil 3: discussion with 3 people, 4 sections each heard once, 2 items each = 8 items, a/b/c.
    - Teil 4: Vortrag, heard twice, 7 items a/b/c.
  - **Schreiben** 75 min: forum post ca. 230 words (suggested 50 min) and e-mail ca. 120 words (25 min).
  - **Sprechen** ≈ 20 min per pair, 20 min preparation. Vortrag ca. 5 min plus ca. 2 min of questions, then a
    discussion of ca. 5 min.
  - Result: lines 359, 460, 656 and 680 are **correct**. See the minors for what is missing or imprecise.
- **IPA** against DWDS and de.wiktionary (Duden notation):
  - Hypothek hypoˈteːk (DWDS); Hypothese hypoˈteːzə (Wiktionary ˌhypoˈteːzə);
  - kindlich ˈkɪntlɪç; kindisch ˈkɪndɪʃ;
  - Erörterung ɛɐ̯ˈʔœʁtəʁʊŋ; Erläuterung ɛɐ̯ˈlɔʏ̯təʁʊŋ (DWDS writes ɔɪ̯; the course uses ɔʏ̯ by rule);
  - entgegnen ɛntˈɡeːɡnən; entgegen ɛntˈɡeːɡn̩ (DWDS);
  - in the speak lines: angesichts ˈanɡəzɪçts (DWDS), Verfügung fɛɐ̯ˈfyːɡʊŋ, Zustimmung ˈtsuːʃtɪmʊŋ,
    Vorschlag ˈfoːɐ̯ʃlaːk, ruhig ˈʁuːɪç, Projekt pʁoˈjɛkt, bedenken bəˈdɛŋkn̩;
  - the rest of s01–s06 (haben, Ihnen, gern, zur, hohen, Kosten, gelegt, gesagt, geschrieben, wird, schon,
    klappen, sehr, Frist, knapp, gefunden) is standard and correct.
  - **All 4 pair headers and all 6 speak IPA lines are correct.** The only problems are in the pair tips (see below).
- **gemäß** (q06 and pitfall 1): DWDS says «Grammatik: mit Dativ». *gemäß des Vertrags* is a known
  Papierdeutsch / hypercorrect form that the standard doesn't accept, so «гіперкорекція» is fair. *entsprechend +
  Dativ*, *entgegen + Dativ* and *zuliebe + Dativ* are also correct.
- **q21 calques.**
  - *ein Risiko nehmen*: an anglicism (*take a risk*). The standard collocations are *ein Risiko eingehen* and
    *ein Risiko auf sich nehmen / in Kauf nehmen*. «nehmen» alone in the gap is not standard written German.
    Sports journalism does use *Risiko nehmen* without an article, but the C1 written-register item stands.
  - *Schlüsse machen*: not a collocation. The standard is *Schlüsse ziehen*, and *Schluss machen* means «to stop,
    to break up».
  - *Aufsehen getroffen*: impossible.
  - So the item has **one defensible answer per gap**. The bank forms match the gap forms (infinitive, infinitive,
    participle) and don't give the answer away. See the minor on the wording of the explanation.
- **Order quizzes.**
  - q08 has a single valid order: *Sollte es Probleme geben, wenden Sie sich an mich.* The capital letter, the
    comma chunk and the final period fix it, and *Sollten ✗* is a real agreement mistake.
  - q25 has a single valid order. Its decoy *Abmahnung* is a good false friend.
- **Twain reel.**
  - *A Tramp Abroad* was published in 1880, with *The Awful German Language* as Appendix D. The *Mädchen / Rübe*
    joke is Twain's.
  - The speech *Die Schrecken der deutschen Sprache* was given in German in Vienna, at the Concordia press club,
    in 1897. Sources disagree on the day: 31 Oct 1897 (Mark Twain Encyclopedia, de/en Wikipedia, DAAD brochure)
    vs 21 Nov 1897 (the 1910 Harper *Speeches*, Projekt Gutenberg). The reel says only «1897 року у Відні», which
    is correct. Don't add a day.
- **Sources.** curl returns 200 for all 8 links, including both goethe.de PDFs and bfu.goethe.de/c1mod.
- **German** in the reading texts (Bäume, Handyverbot, Autofreie Innenstadt), all audio, the diagrams, the
  pitfalls and the summary: grammatical and idiomatic. I found no case, gender or word-order errors.

## Issues

### Major

- **[major] l.386–392 (q33) — Lesen Teil 3 has a second defensible answer.**
  - Quoted: `- [ ] Außerdem sparen die Schulen dadurch viel Geld.`
  - Problem: placed in the gap, the text reads *Befürworter verweisen auf Studien … konzentrierter arbeiten.
    Außerdem sparen die Schulen dadurch viel Geld. Doch ein Verbot allein …* This is cohesive:
    - *Außerdem* adds a second pro argument;
    - *dadurch* points back to the ban;
    - *Doch* then counters the whole pro side.
    
    The option is odd only in content, and that is world knowledge, not textual logic. The explanation's claim
    «не повʼязаний ні з тим, що перед пропуском, ні з тим, що після» is therefore not true. In Goethe Teil 3 the
    key has to follow from cohesion.
  - Fix: replace it with a sentence that breaks the cohesion with *Doch …* or with the first sentence, for
    example `Die Debatte darüber ist daher längst beendet.` This contradicts *erhitzt derzeit die Gemüter*, and
    *Doch* can't follow a closed debate. Update the explanation to match: «третій суперечить першому реченню:
    дебати тривають».

### Minor

- **[minor] l.16 — «по одному завданню з кожної з чотирьох частин» is not accurate.**
  - Problem: Lesen Teil 4 has 2 items, and Hören Teil 2, Teil 3 and Teil 4 have 2 each.
  - Fix: «по одному-два завдання з кожної з чотирьох частин».

- **[minor] l.359 — the Lesen description leaves out two format details the learner needs.**
  - Fix: «Teil 3 — коментар із 8 пропусками й 10 реченнями (два зайві)»; «Teil 4 — дописи трьох фахівців a / b / c,
    7 тверджень, два з яких не належать нікому (0)».
  - Optional: label the Teil 4 options `a, b, c oder 0` as in the Modellsatz, not `A, B, C`.

- **[minor] l.373 (q31) — the claim about Teil 1 is too narrow.**
  - Problem: in the Modellsatz, the Teil 1 items test fixed phrases (*mithilfe von*) and lexis (*erfahren,
    erfüllen*), but also relative pronouns (*die*), prepositions (*im Umgang*), adverbs (*umgekehrt*) and
    connectors (*Entsprechend*).
  - Fix: «У Teil 1 пропуски перевіряють лексику, сталі сполуки, прийменники, сполучники й відносні займенники».

- **[minor] l.460 — Hören Teil 1 «три книжки, вистави чи фільми».**
  - Problem: the Modellsatz has «einen Podcast über neue Bücher», and the target is «Einzelinformationen in einer
    Sendung (Rezension)». Performances and films are not attested.
  - Fix: «подкаст-рецензія на три нові книжки (6 завдань: до якої книжки належить твердження)».

- **[minor] l.509 (l10) and l.512 (l11) — two things only a voice can tell.**
  - l10: the audio never names B. The learner knows B = Frau Yilmaz only if the TTS gives label B the same voice
    in l09 and l10, or by elimination.
    - Fix: start the l10 audio with `A: Herr Roth?` … then `A: Frau Yilmaz, Ihre Antwort?` before B's line. That
      adds about 25 characters, still ≤ 300.
  - l11 and l12 say «доповідачки». Whether the TTS voice is female isn't guaranteed, and the explanation repeats it.
    - Fix: «доповідач(ка)» or «за доповіддю».
  - l11 stem: «нова наука» is unidiomatic.
    - Fix: «Як пояснюють прокрастинацію новіші дослідження?»
  - Also, l09 and l10 are tagged «Тема C1-11», but they contain nothing fast or regional.
    - Fix: tag them C1-12.

- **[minor] l.421–446, l.528, l.216 — items recycle earlier sentences, so answers can be recalled rather than
  heard.**
  - l01 repeats q07 word for word, l03 repeats q02 line 1, and s01 starts with the same clause.
  - l12 repeats q16's structure: *Kritiker … sei … Das greift jedoch zu kurz*.
  - The Lesen text «Bäume gegen die Hitze» and the critic-plus-«greift zu kurz» pattern are also the core of the
    C1-12 lecture (Bäume, Verdunstung, «Kritiker behaupten, Bäume seien zu teuer»).
  - This is acceptable in a review, but it lowers the diagnostic value. B2-29 got the same note.
  - Fix:
    - give l01 a different main clause (e.g. *Sollten Sie verhindert sein, sagen Sie bitte ab.* / *Wenn Sie …* /
      *… sagen wir bitte ab.*);
    - give l12 a different reported objection (e.g. *Kritiker halten dagegen, das Problem werde überschätzt. Dem
      ist entgegenzuhalten, dass …*). *Dem ist entgegenzuhalten* is also in C1-12.

- **[minor] l.20 — «усе, що трапиться, ти вже бачив(ла)» is not true (same issue as in B2-29).**
  - Problem: these words occur in no earlier topic (grep of `content/Guides/Deutsch`):
    - *Neuerscheinungen* (l06);
    - *aufbürden* (q17);
    - *Gefühlsregulation* (l11);
    - *gegensteuern* (l12);
    - *unverzichtbar* (Teil 4 text).
  - Fix: replace them (*neue Bücher*, *jemandem etwas aufhalsen* is also new, so simply «переклав на мене
    роботу» without German, *Umgang mit Gefühlen*, *etwas dagegen tun*, *unbedingt nötig*). Or soften to
    «Нових правил немає; кілька слів зрозумієш із контексту».

- **[minor] l.66 (q01) — the right-to-left reading order is listed wrongly.**
  - Problem: going right to left from the noun, the order is *beschlossenen* → *im März* → *von der Regierung*.
    The explanation gives *beschlossenen → von der Regierung → im März*.
  - Fix: «*beschlossenen* (що зроблено) → *im März* (коли) → *von der Regierung* (ким)».

- **[minor] l.123 (q07) — the explanation is too absolute.**
  - Quoted: «*Würden Sie Fragen haben* … у функції умови не вживаються».
  - Problem: V1 conditionals with *würde* do occur (*Würde er anrufen, wäre ich froh*). They are clumsy and unreal
    in meaning, not impossible (LESSONS: «Rules stated too absolutely»).
  - Fix: «*Würden Sie Fragen haben* — громіздко й теж нереальна умова; *Sollen Sie* умови не виражає».

- **[minor] l.168 (q11) — the case explanation for *entgegnen* is imprecise.**
  - Problem: *entgegnen* does take an accusative, namely the content of the reply: *jemandem etwas entgegnen*,
    *er entgegnete nichts*. The explanation suggests it has no accusative at all.
  - Fix: «*entgegnen* (jemandem etwas) — «відповісти, заперечити»; в Akkusativ стоїть сама відповідь (*er entgegnete
    nichts / er entgegnete, dass …*), а не закид, на який відповідають».

- **[minor] l.225 (q17) — «вішати локшину на вуха» is a calque of Russian «вешать лапшу на уши».**
  - Fix: «українською — «наплести небилиць», «набрехати з три короби»».

- **[minor] l.265 (q21) — the explanation of the calques is slightly too flat.**
  - Fix: «*Ein Risiko nehmen* — калька з англійського *take a risk*; у писемній мові — *eingehen* (або *auf sich
    nehmen*, *in Kauf nehmen*). *Schlüsse machen* — калька з «робити висновки» (а *Schluss machen* — «закінчити,
    розійтися»)».
  - Do the same in pitfall 2 (l.604). This keeps learners from thinking *nehmen* is never possible with *Risiko*.

- **[minor] l.295 (q24) — «тема виділяється жирним».**
  - Problem: DIN 5008 allows bold for the Betreff but doesn't require it. The comma and small-letter rule after the
    salutation comes from orthography (Duden), not from DIN 5008 alone.
  - Fix: «тему можна виділити жирним, але без слова *Betreff* і без крапки; після звертання — кома, і текст іде з
    малої (правило правопису)».

- **[minor] l.308 (q25) — the dunning sequence is presented as fixed.**
  - Problem: the law doesn't require several reminders. Default can start after one Mahnung, or 30 days after the
    invoice (§ 286 BGB).
  - Fix: add «у діловій практиці зазвичай» before the list. The order itself stays unique.

- **[minor] l.344 (q29) — «Kraftfahrzeug (автомобіль)».**
  - Problem: a Kfz is any motor vehicle, including motorcycles and lorries.
  - Fix: «*Kraftfahrzeug* (механічний транспортний засіб, *Kfz*)».

- **[minor] l.451 (l04) — dictation of *aufgrund*.**
  - Problem: Duden also allows *auf Grund*. If the checker compares strings, a correct spelling may be marked wrong.
  - Fix: add to `explain:` «(допустимо й *auf Grund*)». Alternatively, switch to *angesichts* / *infolge*, which
    have only one spelling.

- **[minor] l.532 — pair intro «з різним наголосом» doesn't fit these pairs.**
  - Problem: in all four pairs, both words have the same stress, as the tips themselves say.
  - Fix: «схожі довгі слова, що різняться кінцем слова, суфіксом чи одним звуком».

- **[minor] l.552 (p04) — «entgegnen має три склади» suggests a contrast that isn't there.**
  - Problem: *entgegen* [ɛntˈɡeːɡn̩] also has three syllables (ent-ge-gen). The real difference is the ending:
    [-ɡnən] vs [-ɡn̩].
  - Fix: «entgegnen закінчується на [-ɡnən]: після [ɡ] одразу [n], потім ще склад -nen; entgegen — на [-ɡn̩] зі
    складотворчим [n̩]. Наголос в обох — на -ge-».

- **[minor] l.561 (s01 `uk:`) — «я охоче до Ваших послуг» is ungrammatical Ukrainian.**
  - Fix: «Якщо у Вас виникнуть питання, я охоче на них відповім» or «…, я завжди до Ваших послуг».

## Other checks: all OK
- **One defensible answer:**
  - q01–q05, q09, q12–q15, q18–q20, q22, q23, q26–q32, q34, q35 and l01–l12 each have exactly one.
  - q06: *gemäß dem* is correct and *gemäß des* is wrong; *der Einfachheit halber* is a postposition.
  - q10: the hints exclude *hätte* and *werden*.
  - q16: the literal reading of «zu kurz» is a good trap.
  - q23: *um 25 Prozent* is correct as relative growth.
- **Open fills q02, q10 and q30:** the glosses make each gap unique (*einzureichenden*, *unterschätzendes*, *habe /
  können*, *würden*, *entkalkt / ergraut / begrünen*).
- **Pitfalls:** all four are real mistakes Ukrainians make. *wegen dem* is correctly described as colloquial, not
  wrong.
- **Ukrainian:** apart from s01 and q17, it is natural. *проєкт* follows the 2019 spelling. No surzhyk found.
- **Checklist** items map to C1-01…24.
