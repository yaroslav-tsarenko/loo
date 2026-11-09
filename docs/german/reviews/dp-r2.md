# Review r2 — Deutsch Prüfungen C1/C2 (dp-c1-01 … dp-c2-02)

Reviewer: opus, round 2. Scope: the six C1/C2 exam-guide files. Rules: GERMAN_SYLLABUS §2.6, §2.7, §10; LESSONS.md. Nothing in content/ was edited.
Facts checked 2026-11-09 against: testdaf.de (Aufbau, Auswertung, demo PDFs, Regeln für den Prüfungstag 2026, FAQ Ergebnisse, TestDaF-PO); RO-DT with DSH-MPO (HRK 04.11.2025 / KMK 27.11.2025); Goethe C1 Modellsatz (April 2026) + DB 01.09.2025; Goethe C2 DB 01.09.2025, Modellsatz (März 2026), Literaturliste (Dez. 2025); telc C1 Hochschule Handbuch (4. Aufl. 2015) + telc Prüfungsregularien (ab 15.04.2025); osd.at ZC1 + ÖSD-Prüfungsordnung ab 01.08.2026; anerkennung-in-deutschland.de (Berlin, Lehrkraft, C2).

## Summary

| File | Verdict | Blocker | Major | Minor |
|---|---|---|---|---|
| C1-01 TestDaF | ready after fixes | 0 | 3 | 14 |
| C1-02 DSH | ready after fixes | 0 | 1 | 10 |
| C1-03 Goethe C1 / telc C1 H / ÖSD C1 | ready after fixes | 0 | 1 | 10 |
| C1-04 TestDaF mock | ready after fixes | 0 | 1 | 10 |
| C2-01 Goethe C2 GDS | ready after fixes | 0 | 1 | 13 |
| C2-02 C2 mock | ready after fixes | 0 | 2 | 9 |

## Cross-file issues (fix consistently)

1. **[major] Topic recycling C1-04 ↔ C2-02.** C1-04 (Hören: Salzwiesen lecture — Eindeichung, Wiedervernässung, Kohlenstoff speichern; Lesetext 2: Myzel as Dämmstoff/Verpackung, «Nischenprodukt») and C2-02 Lesen T2 «Die Rückkehr der Moore» (Entwässerung → CO₂ → Wiedervernässung → Schilf for «Dämmplatten, Verpackungen», «Nischenware») share the same arc; C2-02 T3 (Hallig, Landunter) also reuses the setting «Salzwiesen / Deich / Meeresspiegel». C1-04 line 32 claims its topics appear «ніде в курсі». Rule (§2.6 п. 10a by analogy; LESSONS «own tasks must not copy»): the lower number (C1-04 = 504) keeps the topic. Fix: replace C2-02 T2 with an unrelated article (drop the Moor/Wiedervernässung cards with it); in T3 replace «über die Kante der Salzwiesen» → «über die Uferkante». Then C1-04 line 32 becomes true.
2. **[major] TestDaF «kombiniertes Zertifikat» (since 12.05.2026)** missing in C1-01 (lines 163, 794, 914) and C1-02 (line 144, q22). Use one shared wording: «з 12.05.2026 — комбінований сертифікат: найкращі частини з цифрових спроб за ≤ 6 міс., 29 €, визнання — на розсуд вишу». Source: https://www.testdaf.de/de/teilnehmende/mein-testdaf/faq/faq-ergebnisse-und-zertifikat/
3. **[minor→major in C2-01] RO-DT § 8 (2) exemptions** should be stated identically wherever mentioned: exempt — (a) HZB-equivalent school certificate, (b) Goethe-Zertifikat C2: GDS, (c) ÖSD C2, (d) KMK list of foreign certificates, (e) telc Deutsch C1 Hochschule. Not exempt: Goethe C1, ÖSD C1, telc C1/C2. DSD II is a regular proof under § 2, not a § 8 exemption. Add to C1-02 (gap) and C2-01 Landeskunde (major). Source: https://www.goethe.de/pro/relaunch/prf/rahmenordnung/Rahmenordnung-ueber-Deutsche-Sprachpruefungen-fuer-das-Studium-an-deutschen-Hochschulen.pdf (§ 8)
4. **[minor] Card notes «наголос на -tion»** in compounds whose IPA stresses Text- (C1-02 w18, C1-03 w14) — same fix in both.
5. **[minor] «стоп по годиннику» → «стоп за годинником»** (C2-01 lines 68, 722; C2-02 line 17).
6. **[minor] Copies of official topics:** C1-01 library opening hours (TestDaF demo Sprechen), C1-03 s06 Ersatztermin (ÖSD Modellsatz Aufgabe 1), C2-01 w22 «Zukunft der Zeitung» (Goethe C2 Modellsatz Sprechen T2). Replace all three.

Mock/example topics across the six files (for future recycling checks): C1-01 — sign language lecture, night trains, exam-centre check-in; C1-02/C1-03 — see per-file notes; C1-04 — Manganknollen, Myzel, Biber, Salzwiesen; C2-02 — Navi apps, Moore, Hallig, Schreibwerkstätten, Saatgutbibliothek, Kirchenumnutzung, Schreibschrift, Uhrmacher, Wanderschäfer, Spieleabende, Pfahlbauten Bodensee.

---

## Deutsch Prüfungen - C1 - 01. TestDaF — чотири частини й TDN 3–5

Verdict: ready after fixes. The format, scale and exam-day facts are accurate. The fixes are two current-state facts (the combined certificate, and "TDN 4 × 4 = any programme" put too absolutely) and one topic that copies an official demo task.

- [major] lines 163, 794 (q15), 914 (Підсумок) — Since 12.05.2026 the digital TestDaF has a **Kombiniertes Zertifikat**: the best result in each part from digital exams taken within ≤ 6 months (from November 2025 on), €29, made in the g.a.s.t. portal. Each university decides whether to accept it. The text says only "перескласти лише Schreiben не можна" and "окремої перездачі частини … немає". That is still literally true, since the whole test is always retaken, but it hides a real option. Fix: add one sentence to line 163 and to the q15 explanation: "Після повторного складання можна замовити комбінований сертифікат із найкращих результатів по частинах (≤ 6 міс., 29 €, визнання — на розсуд вишу)". q15's answer stays correct. Source: https://www.testdaf.de/de/teilnehmende/mein-testdaf/faq/faq-ergebnisse-und-zertifikat/ and the news item "Digitaler TestDaF: Kombiniertes Zertifikat" (testdaf.de, 08.04.2026).
- [major] lines 69, 910 (Підсумок: "Для будь-якої програми потрібно TDN 4 в усіх частинах"), also 29 — This is too absolute and contradicts the file's own line 88. RO-DT § 4 (4) makes TDN 4 × 4 valid "unter Berücksichtigung von § 1 (3 und 4)". A university can set lower requirements (TDN 3 in Schreiben for Informatik) or higher ones (TDN 5 for Übersetzen). Fix line 910: "TDN 4 в усіх частинах за RO-DT відкриває будь-яку програму; виш може вимагати менше або більше по окремих частинах". Diagram note at line 69: "TDN 4 × 4 — стандарт RO-DT". Source: RO-DT § 1 (3)–(5), § 4 (4) https://www.goethe.de/pro/relaunch/prf/rahmenordnung/Rahmenordnung-ueber-Deutsche-Sprachpruefungen-fuer-das-Studium-an-deutschen-Hochschulen.pdf ; https://www.testdaf.de/de/hochschulen/der-testdaf-und-hochschulen/nachweis-der-deutschkenntnisse-fuer-das-studium/
- [major] lines 523–530 (l12), 849–858 (q21) — The "Maßnahmen kritisieren" example (a library closes at weekends; counter-proposal "Öffnungszeiten nur verkürzen") repeats the official demo's Sprechen task "Maßnahmen kritisieren": changed opening hours of the Universitätsbibliothek. LESSONS says own tasks must not copy a Modellsatz topic. Fix: choose another measure, e.g. the city abolishes the night bus line or raises the semester-ticket price. Source: https://www.testdaf.de/fileadmin/testdaf/downloads/Demo_Version_digitaler_TestDaF/Beispielaufgaben_Demo-Version_digitaler_TestDaF_Sprechen.pdf
- [minor] line 117 — "Розраховуй на те, що кожен фрагмент прозвучить лише раз: так у тренувальних матеріалах". The official demo states it outright: "Sie hören jeden Text einmal." Fix: state it as a fact and cite the demo PDF; the paper TestDaF played text 3 twice. Source: https://www.testdaf.de/fileadmin/testdaf/downloads/Demo_Version_digitaler_TestDaF/Beispielaufgaben_Demo-Version_digitaler_TestDaF_Hoeren.pdf
- [minor] line 109 / q23 (869–876) — The demo sets the short-answer limit: "Schreiben Sie pro Feld maximal 2 Wörter". Fix: add "не більше 2 слів на поле" to line 109 (same source as above).
- [minor] line 166 — The fee is fully missing. Fix: "у Німеччині цифровий TestDaF — 210 € (паперовий 215 €); в інших країнах — за ціновою групою (напр. Каїр 155 €), станом на 2026". Source: https://www.testdaf.de/de/teilnehmende/mein-testdaf/faq/faq-allgemein/ . Also add review fees to line 164: 40 € for one part, 15 € for each further part, 85 € for all four, refunded if the result changes. Add validity too: "Das TestDaF-Zertifikat ist unbegrenzt gültig" (some universities want a recent one). Source: FAQ Ergebnisse (URL above).
- [minor] line 407 (l01 audio) — "Uhren … und Handys kommen ausgeschaltet in Ihre Tasche". An ordinary wristwatch is not "switched off", and under rule 9 bags go into a separate room or the corner of the exam room, not under the desk. Fix: "Uhren und Handys – ausgeschaltet – legen Sie bitte zu Ihren Taschen in die Ecke." Source: Regeln für den Prüfungstag 2026, items 9–11 https://www.testdaf.de/fileadmin/testdaf/downloads/Dokumente/8.6_Regeln_fuer_den_Pruefungstag_2026.pdf
- [minor] line 806 (q17) — "Zwar sind Nachtzüge langsamer als Flugzeuge, das will ich gar nicht bestreiten." *Zwar* without a following *aber* clause sounds unfinished. Fix: add "… Dafür sparen sie aber eine Hotelnacht." *einräumen* stays the only defensible answer.
- [minor] line 172 — "Zurück zur vorherigen Aufgabe kann man nicht." This ellipsis without *gehen* is spoken style, so it is a weak model sentence. Fix: "Man kann nicht zur vorherigen Aufgabe zurückkehren."
- [minor] line 651 — "nachweisen, dass er der Sprache gewachsen ist" is awkward. Fix: "…, dass er den sprachlichen Anforderungen des Studiums gewachsen ist".
- [minor] line 655 — "Weil diese Werte ausdrücklich festgelegt sind, müssen Hochschulen sie nicht jedes Mal neu begründen." RO-DT does not say this; it is an invented rationale. Fix: delete it, or replace with § 7 (1): the universities recognise these exams as proof.
- [minor] line 885 (q24 explanation) — "Словник у Schreiben — це правило DSH". The DSH-MPO allows a monolingual paper dictionary for the whole written exam (and for preparing the oral Kurzvortrag), not only for Schreiben. Fix: "одномовний паперовий словник дозволено в письмовій DSH". Source: RO-DT, Anlage 1 § 10 (pp. 15–17 of the PDF above).
- [minor] line 397 (w30 note) — The TestDaF-PO § 1 (5) frames it as "länger dauernde oder ständige körperliche Behinderung", with a medical certificate on request. "чи хворобою" is broader than the source. Fix: "для людей з тривалим або постійним фізичним обмеженням; атестат можуть вимагати" (RO-DT, Anlage 2 § 1 (5)).
- [minor] line 666 (q02) — "студієнколеги" is a non-standard transliteration (St = «шт»). Fix: "Studienkollegs (підготовчі коледжі при вишах)".
- [minor] line 781 (q14) — "з запасом" → "із запасом" (euphony rule, з + з).
- [minor] line 821 — "приїхати відпочилішим" is awkward. Fix: "приїхати більш відпочилим".
- [minor] line 486 (l08) — Early bilingual acquisition sits close to the official demo Hören topic "Mehrsprachigkeit" (Universität Potsdam). It is not a copy, but the author may want to move the point to Mimik or Dolmetschen. Optional.

Verified:
- Task list, items per task, media, part times (55/40/60/35), ≥ 200 / ≈ 100–150 words, the seven Sprechen times (sum 11:45 ≈ 12 min), fixed order, no going back, Erprobungsaufgaben: all match https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/
- 0–20 scale; bands 0–4 / 5–9 / 10–15 / 16–20; total 0–80; short answers rated by Beurteilende; Schreiben criteria (q09): https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/auswertung-des-digitalen-testdaf/ . Gesamtwert on the certificate: TestDaF-PO § 2 and Anhang 1a.
- Exam-day rules, edition December 2025: same document as at registration plus portal update; late arrival after the Einführung means no entry; only the ID on the desk; paper from the supervisor, own pen; all wristwatches, smartwatches and in-ear headphones banned; ringing phone means exclusion; no leaving the building or going to the Mensa; no sharing content. All correct (PDF above).
- Hören played once: demo PDF ("Sie hören jeden Text einmal"); results ≈ 3 weeks digital / ≈ 6 weeks paper; "500 Testzentren in 100 Ländern": https://www.testdaf.de/de/teilnehmende/mein-testdaf/testdaf-termine-und-anmeldung/
- RO-DT as amended by HRK 04.11.2025 / KMK 27.11.2025. § 4 (3)–(6): TDN 3 = Eingangsstufe, skalierte Punktwerte, "unter TDN 3", TDN 5 above the required level. § 8 (2) exemptions: HZB, Goethe C2 GDS, ÖSD C2, foreign certificates under the KMK decision of 1995, telc C1 Hochschule; Goethe C1 not listed. § 6 (6) DSD II free of charge. TestDaF-PO § 4 (one Prüfungstermin), § 7 (beliebig oft), § 8 (keine Hilfsmittel), § 9 (1) (no fee if withdrawn before the Anmeldefrist ends), § 10 (4 weeks, Verwaltungspauschale). All statements in lines 29, 151–166, Landeskunde and q02–q04, q13, q15, q22, q24 match, except as flagged above.
- ALTE audits 2007 / 2012 / 2017 and Q-Mark for the paper version until April 2028; differentiated-requirements example (Informatik TDN 3 Schreiben, Übersetzen TDN 5): https://www.testdaf.de/de/hochschulen/der-testdaf-und-hochschulen/nachweis-der-deutschkenntnisse-fuer-das-studium/
- IPA, all 30 cards against Duden notation: Teilprüfung, Prüfungsentgelt [ʔɛnt], uneingeschränkt, Studierfähigkeit, Erprobungsaufgabe, Kurzantwort, Headset [ˈhɛtsɛt], Beurteilende [bəˈʔʊʁ…], Prüfungsbeauftragte, Nachteilsausgleich and the rest are correct. ʔ / ˌ follow §2.7.18. speak s01–s10 IPA (zuerst [tsuˈʔeːɐ̯st], durchdacht, Armbanduhr [ˌʔuːɐ̯]) is correct. Forms and plurals (Skalen/Skalas, Testzentren) match Duden.
- Counts: W 30 / L 15 / S 10 / Q 24, exactly as in the table. Ids are unique and in reading order. No duplicate [!word] in content/Guides/Deutsch* (grep without article). No ASCII or ’ apostrophes. Audio ≤ 300 characters. Landeskunde is 369 words (C1 range 350–450).
- Quizzes: q01–q24 each have one defensible answer. The q20 order has a single order and a valid ✗ distractor (CONTENT_SPEC). The q21 bank holds only distractors.

## Deutsch Prüfungen - C1 - 04. Пробний тест TestDaF — читання й аудіювання

Verdict: ready after fixes. The German is clean and natural. Each item has one defensible answer, and the score estimate is clearly labelled «орієнтовно ± один рівень». The main fix is the false claim that the topics are unique, because Salzwiesen also appear in C2-02.

- [major] line 32 — "тексти й завдання написано … на теми, яких більше ніде в курсі немає" is false. C2-02 Lesen Teil 3 (Reportage "Wenn das Meer kommt", around line 216) is set on the Salzwiesen at a storm flood. C2-02 Teil 2 "Die Rückkehr der Moore" also repeats this file's wetland-restoration / Kohlenstoff-speichern angle (l07, l13). Fix: under the course order the lower number keeps the topic (C1-04 = 504 < C2-02 = 602), so C2-02 should change its setting, e.g. to a Hallig or a Wattführung without Salzwiesen. Otherwise soften this line to "на теми, яких немає в мовних темах курсу". The caller decides; the issue is also flagged for the C2-02 review.
- [minor] lines 561–568 and 60 — The rounding rule is not stated. The diagram rounds 13 × 20 : 18 = 14.4 to "≈ 14", but 14 × 20 : 18 = 15.6, which normal rounding makes 16 = TDN 5, while the table puts L = 14 in TDN 4. Fix: add "округлюй униз" under the table. Also add L = 14–15 to the borderline list at line 571 ("L = 8–9, 14–15").
- [minor] lines 269, 283 (q13), 656 (q27) — The text never says that Myzel insulates well. "dämmen zwar **ebenfalls** gut" only presupposes it, so "beide" rests on an inference. Fix: add a clause to paragraph 2, "Myzelplatten dämmen ähnlich gut wie herkömmliche Materialien", and keep *ebenfalls* as the signal. In the q13/q27 explanations the truncated quote "*Mineralwolle dämmen zwar ebenfalls gut*" reads as a verb-agreement error. Quote "*Herkömmliche Dämmstoffe wie Mineralwolle dämmen zwar ebenfalls gut*".
- [minor] lines 227–231 (q09) — Options a and b are "als …" phrases, but the correct option c is a full Konjunktiv-I sentence ("Ihre Motive seien umstritten."). The odd form gives the answer away. Fix: "als Verhalten mit umstrittenen Motiven".
- [minor] line 384 (l04) — The accepted variant "Storche" is a wrong plural. "Orthografie muss erkennbar sein" does not need an explicit wrong form in the key. Fix: drop `|Storche`, or explain in the explanation that a slight misspelling is usually tolerated.
- [minor] lines 345 / 500 — The fill shows "Jagd wegen des Fells", and the l14 explanation says "Полювання згадувалося в 1.1", but the audio only says "vor allem wegen seines Fells". Fix: audio "… fast ausgerottet, vor allem durch die Jagd auf sein Fell."
- [minor] lines 604–608 (q22) — Distractors "За правильні відповіді в TestDaF не дають балів" and "У TestDaF немає рівня TDN 4" are joke distractors (LESSONS). Fix: use real misconceptions, e.g. "Пробний тест складніший за справжній" or "Hören у пробному тесті не можна слухати один раз".
- [minor] line 191 (q05) — The order task about Myzel comes before Lesetext 2 and pre-teaches its content (Stroh, teurer), which helps with 5.x and 7.1. Fix: give Aufgabe 2 its own small topic, or move it after Lesetext 2.
- [minor] line 175 — "бути, являти собою" is a calque of Russian «являть собой». Fix: "бути, становити".
- [minor] line 24 (q01) — "трохи більше півтори хвилини" → "трохи більше ніж півтори хвилини".
- [minor] line 561 — "за таблицею, складеною за межами шкали" is ambiguous ("поза шкалою"). Fix: "складеною на основі меж шкали testdaf.de".

Verified:
- 7 Lesen types (5/4/7/4/7/4/3 items, 34, ≈ 55 min) and 7 Hören types with media (5/4/2/6/4/5/4 = 30, ≈ 40 min), no going back, no Hilfsmittel: https://www.testdaf.de/de/teilnehmende/der-digitale-testdaf/aufbau-des-digitalen-testdaf/ ; TestDaF-PO § 8. "jeder Text nur einmal" is correct per the official demo (Hören PDF above).
- Bands 0–4 / 5–9 / 10–15 / 16–20; Testsätze equalised in difficulty: Auswertung page and the Nachweis page. q20 (13 → 14.4 → TDN 4) and q21 are arithmetically right. The warning box labels the result «орієнтир, ± один рівень».
- German: every sentence of Lesetext 1 (Manganknollen; Konjunktiv I reported speech, *Zwar … aber* across sentences) and Lesetext 2 (Myzel) is grammatical and natural, as are all 20 audio texts, all quiz stems and all options. Facts are plausible and hedged: nodule growth "wenige Millimeter in einer Million Jahren"; ISA; the companies' moratorium; the beaver is Europe's largest rodent.
- One defensible answer per item, checked by trying each wrong option: q02–q04 (reflexive frame / *dar* / direct object), q06–q19, l06–l20 (l09 "beide" and l11 "keiner" are sound). The q05 order is unique, with a valid ✗ line.
- IPA, all 10 cards: zutreffen, Bearbeitungszeit [bəˈʔaʁ…], Distraktor [dɪsˈtʁaktoːɐ̯], Signalwort [zɪˈɡnaːl], Testsatz, Lesetext, hochrechnen, Richtwert, Selbsteinschätzung [ˈzɛlpstʔaɪ̯n…], Dämmstoff are correct. Verb forms start with the infinitive. https://www.dwds.de/wb/Distraktor returns 200.
- Counts: W 10 / L 20 / S 0 / Q 30, exactly as in the table. Ids are unique and in reading order. No duplicate [!word] across content/Guides/Deutsch*. No wrong apostrophes. Audio ≤ 300 characters.
- Official topics compared, demo Lesen: Spinnenangst, Sprachstörungen, Hygiene, KI, Landleben, Tourismus, Haustiere. Demo Hören: Jobmesse, Schulnoten, Ländliche Regionen, Zoos, Gesichtserkennung, Mehrsprachigkeit, Zufriedenheit. No overlap with the mock. The paper Modelltests 1–2 were not checked.

Mock and example topics, for the recycling check:
- C1-04 Lesen: Lesetext 1 deep-sea mining of manganese nodules (Tiefseebergbau / Manganknollen, ISA); Lesetext 2 building with mycelium (Myzel-Dämmstoff vs Mineralwolle); Aufgabe 1 nodules; Aufgabe 2 mycelium.
- C1-04 Hören: beavers return as landscape shapers (Dr. Tobias Rau; Biber, Dämme, Feuchtgebiete, Reviere, Uferstreifen); farmer Bernd Sauer and the Bibermanagement; lecture on salt marshes (Dr. Insa Petersen; Salzwiesen, Queller, Zugvögel, Eindeichung, Renaturierung, Meeresspiegel, Nordsee); Nele and Jan on visitor access to salt marshes (Stege, Führungen, Parkplatz am Deich, Fördermittel); start-up founder Lisa Kern on mycelium packaging; Hören 7 sentences on Biber, Salzwiesen, Myzel.
- C1-01 examples: sign-language lecture (Dr. Ilse Brandt: Gebärdensprachen, Gehörlosenschulen, Spracherwerb, Gebärdensprache im Beruf, Dolmetscher); night trains (Petra Hahn, Liegewagen); Lea and Tarik on sign language as an elective; the city library closing at weekends (Maßnahmen kritisieren); exam-centre check-in.

---

## Deutsch Prüfungen - C1 - 02. DSH — Hörverstehen, Leseverstehen, наукові структури

Verdict: ready after fixes (one major, the rest minor). Every DSH number in the file matches the RO-DT / DSH-MPO 2025.

- [major] line 144 (table «Перескладання»), line 802 (q22 distractor) and line 804 (q22 explanation) — «TestDaF перескладають лише повністю» is incomplete as of 2026. Since 12.05.2026, digital TestDaF candidates can order a **kombiniertes Zertifikat**: the best result per part across several digital exams taken within at most 6 months. Digital exams from November 2025 onward count, the fee is 29 €, and «Die Anerkennung … obliegt der jeweiligen Hochschule». The q22 distractor stays false, because you still sit all four parts each time. Fix: table cell → «скільки завгодно, щоразу всі 4 частини; з 12.05.2026 — комбінований сертифікат (найкращі частини з цифрових спроб за ≤ 6 міс., визнання — на розсуд вишу)»; add the same sentence to the q22 explanation (https://www.testdaf.de/de/teilnehmende/mein-testdaf/faq/faq-ergebnisse-und-zertifikat/ ; news 08.04.2026: https://www.testdaf.de/de/ueber-testdaf/arbeiten-mit-gast/aktuelles/neuigkeiten/detail/?tx_news_pi1%5Baction%5D=detail&tx_news_pi1%5Bcontroller%5D=News&tx_news_pi1%5Bnews%5D=41&cHash=6cfe2afd5eff070a19dad5705f398f5b).
- [minor] line 60 — «одна неправильна закінчівка — і відповідь не зараховано». «закінчівка» is not standard Ukrainian, and the all-or-nothing scoring is not in the MPO, which says only «Die Bewertung … erfolgt nach sprachlicher Richtigkeit» (§ 10 (4) 2e). Fix: «Оцінюють лише правильність: помилка в закінченні коштує бала». The same overstatement is in reel line 826 («бал знімають за кожне закінчення»): soften it the same way.
- [minor] line 66 — «Але тоді центр мусить запропонувати обидва формати…» reads as if it applies to the written electronic exam too. MPO § 4 (3) requires the choice only for the oral **Fernprüfung**. Fix: «Якщо центр пропонує усну частину онлайн, він мусить запропонувати й очну в той самий період».
- [minor] line 147 — «TestDaF — коли … хочеш однаковий результат для кількох вишів у різних землях» implies DSH is not portable, which contradicts line 43 and l15 (RO-DT § 7: a registered DSH is recognised by all universities). Fix: «TestDaF — коли складаєш удома, до приїзду».
- [minor] line 124 — heading «дві різні задачі»: «завдання» is more natural.
- [minor] line 158 — «eine kurze Grafik mit einem Begleittext»: «kurze Grafik» is an odd collocation. MPO § 11 b: «ein kurzer … Text und bzw. oder ein Schaubild». Fix: «Grundlage … ist ein kurzer Text mit einer Grafik».
- [minor] line 159 — «Mit der DSH-2 hat man die Zulassung … in der Tasche» / «вступ … в кишені» overstates it. DSH-2 is the language proof *for* admission (RO-DT § 3 (6)), not admission itself. Fix: «… hat man den Sprachnachweis für alle Studiengänge in der Tasche» — «… мовний доказ для будь-якої програми в кишені».
- [minor] line 292 (w18 note «наголос на -tion») contradicts the IPA /ˈtɛkstpʁodʊkˌtsi̯oːn/, where the compound's primary stress is on Text-. Fix: «у Produktion наголос на -tion; у складному слові головний — на Text-».
- [minor] line 513 — s02 IPA /tsuˈzamənˌfasn̩t/: zusammenfassend comes from a separable verb, and §2.7.18 says no ˌ there. Fix: /tsuˈzamənfasn̩t/.
- [minor] line 728 — q15 stem «Висвітлені містом вулиці»: «висвітлені» suggests «covered (in the media)». Fix: «Освітлені містом вулиці стали безпечнішими».
- [minor] content gap (suggest adding after line 147) — the DSH-vs-TestDaF section never says who needs neither. RO-DT § 8 (2) exempts: (a) a school certificate equivalent to the German HZB, (b) Goethe-Zertifikat C2: GDS, (c) ÖSD C2, (d) the KMK list of foreign certificates, (e) telc Deutsch C1 Hochschule. Not exempt: Goethe C1 and ÖSD C1. One line plus a link to C1-03 is enough (RO-DT PDF, p. 8).

Verified:
- RO-DT i. d. F. HRK 04.11.2025 / KMK 27.11.2025 and DSH-MPO (HRK 29.09.2025, KMK HSA 20.11.2025, SchulKo 27.11.2025): https://www.goethe.de/pro/relaunch/prf/rahmenordnung/Rahmenordnung-ueber-Deutsche-Sprachpruefungen-fuer-das-Studium-an-deutschen-Hochschulen.pdf (downloaded and extracted).
  - Correct in the file: HV 5500–7000 chars, played twice, 10 + 40 min; LV+WS 90 min, 4500–6000 chars; TP ≈ 250 words, 70 min; written part ≤ 4 h; ≥ 2 Themenbereiche; monolingual paper dictionary; weights 2 : 2 : 1 : 2; 57 / 67 / 82 % in both parts; oral exam compulsory and not exemptible (new), ≤ 20 min + 20 min prep, Kurzvortrag ≤ 5 + Gespräch ≤ 15, no group exams.
  - Also correct: electronic Präsenz written exam and oral Fernprüfung with mandatory choice; § 3 (8) no binding effect; § 7 recognition; § 8 MPO local retake rule; Empfehlung field on the certificate; § 11 (3) RO-DT applies directly until the local PO is updated.
- Diagram and q05 arithmetic: 460 : 7 = 65.7 % → DSH-1. Correct.
- DAAD: 2–3 semesters at home or Studienkolleg; 2 semesters → FSP; «in fast jedem Bundesland» — matches https://www.daad.de/de/in-deutschland-studieren/voraussetzungen/ueberblick/. RO-DT § 5 FSP-Deutsch also matches.
- testdaf.de: «über 500 Testzentren in 100 Ländern» (home page; the FAQ says ≈ 550); no aids allowed; scores 0–20 per part (RO-DT Anlage 2).
- IPA, 12 cards checked against Duden/DWDS conventions, all OK: Rahmenordnung, Studienkolleg (plural Kollegs / Kollegien, DWDS), Feststellungsprüfung, Hochschulzugang, Prüfungsvorsitzende, paraphrasieren, Partizipialattribut, Passiversatzform, Funktionsverbgefüge, Relativsatz, Bezugswort, gewichten, einsprachig.
- Counts and ids:
  - Counts against the table: W 30 · L 15 · S 6 · Q 24.
  - Ids: unique and in reading order.
  - Audio: every block ≤ 300 chars (max 279).
  - Apostrophes: no ' or ’ in Cyrillic.
  - Landeskunde: 363 words (C1 range 350–450).
  - Duplicate [!word] across content/Guides/Deutsch*: none (grep without article).
- Quizzes:
  - Bank in q13 has real distractors only.
  - q15 order has one solution.
  - No second defensible answer found in q01–q24.

## Deutsch Prüfungen - C1 - 03. Goethe C1, telc C1 Hochschule і ÖSD C1

Verdict: ready after fixes (one major, the rest minor). Goethe C1 (April 2026 Modellsatz + DB 01.09.2025) and ÖSD figures match the sources exactly.

- [major] line 65, q10 (line 631 option b, line 635 explanation), summary line 801, sources line 791 — the telc retake window «протягом наступного календарного року» / «innerhalb des folgenden Kalenderjahres» comes from the 2015 Handbuch (4. Auflage) and is outdated. The current **telc Prüfungsregularien (gültig ab 15.04.2025)**, § 7 (3), say: «… kann die Mündliche Prüfung oder die Schriftliche Prüfung innerhalb von zwölf Monaten nach Ablegen der ersten Prüfung (Datum der Ausstellung des Ergebnisbogens) wiederholt werden. Eine Wiederholung einzelner Subtests ist nicht gestattet … Der Wunsch nach Anrechnung … muss dem Prüfungszentrum bei der Prüfungsanmeldung mitgeteilt werden.» Annex 1 lists C1 as eligible; Annex 2 gives the fee for later Anrechnung (40 €). Fix: «протягом 12 місяців від дати Ergebnisbogen; про зарахування складеної частини (Anrechnung) скажи центру під час реєстрації», with the quote in q10 replaced. Add the source: https://www.telc.net/fileadmin/user_upload/pdfs/AGB_Pruefungsordnung/9994-P00-150010.pdf . In line 33 / line 791, label the Handbuch «4. Auflage 2015».
- [minor] line 628 — q10 stem «разом — 61 %» does not match 64 % / 55 %. Max points are 166 written and 48 oral, so 0.64·166 + 0.55·48 = 132.6 / 214 ≈ 62 % (telc Handbuch, table p. 24). Fix: «разом — 62 %».
- [minor] line 393 — l08 fill `[[Flüsse|Flüssen]]` accepts the ungrammatical «speist die Flüssen». Fix: `[[Flüsse]]`.
- [minor] line 73 and pitfall line 505 — the ÖSD Schreiben minimum is incomplete. The Gesamtbogen has two rules: Schreiben 1 + 2 together max 30 / **min 15** («wenn beide Aufgaben bestanden»), and each task min 7. 7 + 7 = 14 passes neither. Fix: «Schreiben 30 (мін. 15; кожне завдання ≥ 7 з 15)» (https://osd.at/wp-content/uploads/2026/08/ZC1-GB_Ver.2.0_05_06_26.pdf).
- [minor] lines 74, 103, 116, q14 (line 671), q16 explanation (line 689) — «ÖSD — лише індивідуально». This holds under the ZC1 Durchführungsbestimmungen (Stand 10/2023, still the version linked on osd.at): «als Einzelprüfung». However, the new general **ÖSD-Prüfungsordnung gültig ab 01.08.2026** says the oral exam «wird entweder als Einzelprüfung … oder als Paarprüfung … durchgeführt». Fix: «за чинними Durchführungsbestimmungen ZC1 — індивідуально» in q16, and add the PO to the sources (https://osd.at/wp-content/uploads/2026/08/OSD-Prufungsordnung_gueltig-ab-01.08.2026.pdf). The same PO confirms the rest of what the file says about ÖSD: two modules for C1 (four modules only for B1 and C2); a Gesamtzertifikat when both modules are passed within a year at the same centre; no expiry date on the certificate (relevant to line 168); unlimited retakes.
- [minor] line 795 — the source is the 2018 Modellsatz Sprechen; osd.at now links a 2026 Modellsatz (MA/SA/LV). The format is unchanged, so only the link needs updating: https://osd.at/wp-content/uploads/2026/08/ZC1-Modellsatz-Homepage-MA.pdf .
- [minor] lines 128, 491 (s06) and q19 (line 714) — «sich entschuldigen + Ersatztermin» echoes the ÖSD Modellsatz Aufgabe 1 almost exactly (a missed exam, a call to the professor, persuading them to give an «Ersatztermin»). The file's own l10 scenario is a missed dorm-contract deadline, so s06 does not even fit it. Fix: make s06 match l10 («Wäre es vielleicht möglich, die Frist um eine Woche zu verlängern?»); keep the Ersatztermin card example but leave out the exam-absence framing.
- [minor] line 346 — l04 «Teil 3» has two speakers. The Modellsatz overview gives «(Radio-)Diskussion mit drei Personen». Fix: add a moderator line, or say «уривок із дискусії трьох осіб».
- [minor] line 262 — «Im Teil 1 schreiben Sie…» → «In Teil 1 …», the Modellsatz wording.
- [minor] line 235 (w14 note «наголос на -tion») contradicts the IPA /ˈtɛkstʁekɔnstʁʊkˌtsi̯oːn/, where primary stress is on Text-. Fix as in C1-02 w18.
- [minor] line 33 — telc is cited as «Handbuch (4-те видання)» with no year. Fix: «Handbuch, 4. Auflage 2015 + Prüfungsregularien від 15.04.2025». The telc.net page itself gives no pass or retake rules.

Verified:
- Goethe C1 Modellsatz «Stand April 2026», downloaded (https://www.goethe.de/pro/relaunch/prf/materialien/C1_modular/c1-modular_modellsatz.pdf):
  - Lesen: 8 + 7 + 8 + 7 items, 65 min, 10/20/20/15 recommended; Teil 3 «Zwei Sätze passen nicht», a–j; Teil 4 a–c + 0.
  - Hören: 6 + 9 + 8 + 7 items, ≈ 40 min. Teil 1 once (60 s reading time); Teil 2 twice, stimmt / stimmt nicht / dazu wird nichts gesagt; Teil 3 in four sections, each once; Teil 4 twice; 3 min transfer.
  - Schreiben: ≈ 230 + ≈ 120 words, 75 min (50 + 25), four Sprachfunktionen; the E = 0 rule is quoted verbatim.
  - Sprechen: ≈ 5 min Vortrag + ≈ 2 min Fragen, ≈ 5 min Diskussion, ≈ 20 min per pair, 20 min prep for pair and single exam.
- Goethe C1 Durchführungsbestimmungen, Stand 01.09.2025 (https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C1.pdf): ≈ 180 min written, a pause ≥ 15 min between modules, recommended order L → H → S, pair ≈ 20 / single ≈ 15 min (single only in Ausnahmefällen), ×3.33 table (18 → 60, 15 → 50), Lesen transfer ≈ 5 min, Hören ≈ 3 min.
- telc C1 Hochschule Handbuch, 4. Auflage 2015:
  - Lesen: 12 + 12 + 22 + 2 = 48; Sprachbausteine 22 × 4er-MC = 22; 90 min; ≈ 2200 words.
  - Pause 20 min.
  - Hören: 8 texts / 10 statements, each played once; 10 × 3er-MC; 10 notes from a ≈ 10-min lecture; 8 + 20 + 20.
  - Schreiben: ≥ 350 words, 48 points, 70 min.
  - Mündlich: 1A / 1B / 2 = 6 + 4 + 6 + 32; ≈ 16 min per pair; 20 min prep.
  - Pass: 60 % overall and in both parts.
- telc.net (https://www.telc.net/en/language-examinations/certificate-exams/german/telc-german-c1-university/): digital / hybrid / paper; can be taken as a partial exam.
- ÖSD ZC1 DB 10/2023: 90 / ≈ 40 / 90 = ≈ 220 min; pause ≥ 15 min after Hören; monolingual dictionaries only, checked for notes; Einzelprüfung; ≈ 1 + 5 + 5 + 10 min; 20 min prep; Interlokutor.
- ÖSD Gesamtbogen Vers. 2.0: minima 10 / 10 / 15 (7 + 7) / 18; 42 / 70; grade bands 100–88 / 87–75 / 74–60.
- ÖSD ZC1 page: digital since 1.1.2024.
- ÖSD About us (https://osd.at/en/about-us/): groundwork from 1992, first exams 1995 at 7 centres, > 100 000 candidates a year, ≈ 400 centres, double reading, pluricentric.
- telc Handbuch p. 3: telc gGmbH is a 100 % subsidiary of the DVV.
- RO-DT § 8 (2): q01, q24, the diagram and l15 are correct.
- IPA, 15 cards checked, all OK: modular, Gesamtprüfung, Mindestpunktzahl, Ausnahmefall, anerkennen (Präteritum «erkannte an / anerkannte» — Duden), Prüfungsanbieter, Volkshochschule, Bewertungskriterium, Gesamtbogen (plural Bögen), Globalverstehen, Detailverstehen, Meinungsäußerung, Kurzreferat, Telefonat, Ersatztermin, Bildunterschrift; [!speak] s01–s08 also OK.
- Counts and ids:
  - Counts against the table: W 25 · L 15 · S 8 · Q 24.
  - Ids: unique and in reading order.
  - Audio: every block ≤ 300 chars (max 273).
  - Landeskunde: 377 words.
  - Duplicate [!word] cards: none.
  - Apostrophes: OK.
- Quizzes:
  - Banks in q17 / q18 hold real distractors only, and every distractor fails grammatically.
  - q19 / q20 order quizzes have one solution each.
  - Topics are not copied from the Goethe Modellsatz. Its topics are city tours, parents' phone use, managers, internet privacy, books about the sea, handwriting, the future of housing and EU family policy; the file uses games, napping, rooftop gardens and water towers.

## Facts for other files (C1-01, C1-04, C2-01, C2-02)

- **RO-DT § 8 (2) exemptions (i. d. F. HRK 04.11.2025 / KMK 27.11.2025, p. 8):**
  - (a) a school-leaving certificate equivalent to the German HZB;
  - (b) **Goethe-Zertifikat C2: GDS** (older KDS / GDS / ZOP certificates at the university's discretion);
  - (c) **ÖSD C2**;
  - (d) foreign certificates on the KMK list of 02.06.1995 (Ziffer 3, 4th indent);
  - (e) **telc Deutsch C1 Hochschule**.
- Not listed in § 8: Goethe C1, ÖSD C1, telc Deutsch C1 / C2. DSD II is **not** an exemption: it is one of the four regular proofs in § 2 (DSH, TestDaF, FSP-Deutsch, DSD II). The text says § 8 exemptions «gelten als Nachweis … gemäß § 3 Abs. 5, § 4 Abs. 5 …».
- **So Goethe C2 GDS does exempt from DSH / TestDaF (§ 8 (2) b).** § 8 (3) also lets local rules exempt e.g. graduates in Germanistik.
- **TestDaF (RO-DT § 4 + Anlage 2):**
  - TDN 4 in all four parts = proof for all programmes.
  - TDN 5 lies above the level required for admission.
  - Below TDN 3 the certificate says «unter TDN 3».
  - The digital TestDaF also shows scaled points 0–20 per part and a total of 0–80.
  - All parts are compulsory and equally weighted; no aids.
- **TestDaF kombiniertes Zertifikat:** from 12.05.2026; digital only; best part results from exams within ≤ 6 months; digital exams from Nov 2025 count; 29 €; recognition is up to the university. The ordinary retake is still the full test, «so oft wie notwendig». Sources: testdaf FAQ Ergebnisse (https://www.testdaf.de/de/teilnehmende/mein-testdaf/faq/faq-ergebnisse-und-zertifikat/) and the news of 08.04.2026.
- **ÖSD PO from 01.08.2026:** ÖSD C2 (and B1) are offered in **four modules** taken separately; all other levels in two. The oral exam can be single or in pairs.
- **Goethe C1 Hören transfer = 3 min** (DB 01.09.2025 and Modellsatz). For C2, compare against the C2 DB yourself.
- **DSH-MPO 2025 for C2-01 (DSH-3):** DSH-3 = ≥ 82 % in **both** the written and the oral part. A university may require DSH-3 for particular purposes (RO-DT § 3 (7)).

---

## Deutsch Prüfungen - C2 - 01. Goethe-Zertifikat C2 — Großes Deutsches Sprachdiplom.md

Verdict: ready after fixes. There are no blockers. The format and scoring facts are very accurate: every number I checked matches the current Durchführungsbestimmungen (DB) and the Modellsatz.

- [major] line 582–590 (Landeskunde) — The text leaves out the most common practical use of the GDS. RO-DT § 8 Abs. 2 (b) exempts GDS holders from DSH and TestDaF. At C1 level only telc Deutsch C1 Hochschule exempts (§ 8 Abs. 2 (e)); Goethe C1 does not. Line 582 lists DSH-2 and TDN 4 for universities, so readers may conclude they need a DSH even with C2. The prose is also short: 381 words, against the C2 norm of 450–600 (LESSONS). Fix: add a paragraph of about 70–90 words. Content: «Wer das GDS bestanden hat, ist nach der Rahmenordnung (RO-DT, § 8) vom Nachweis durch DSH oder TestDaF befreit; auf C1-Niveau gilt das nur für telc Deutsch C1 Hochschule, nicht für das Goethe-Zertifikat C1.» Add one practice quiz on it and the source link. (https://www.goethe.de/pro/relaunch/prf/rahmenordnung/Rahmenordnung-ueber-Deutsche-Sprachpruefungen-fuer-das-Studium-an-deutschen-Hochschulen.pdf, § 8 Abs. 2 b, e)
- [minor] line 76 / line 827 (reel) — The time plan doesn't add up. The Modellsatz times 25 + 20 + 25 + 10 already make 80 minutes. The DB says to plan ≈ 5 minutes of transfer *innerhalb der Prüfungszeit*. So «25/20/25/10 + 5 хв на бланк» and «стоп-сигнал на 70-й хвилині» together leave 0 minutes for the transfer. Fix: either say «познач одразу в Antwortbogen» or give a working plan, e.g. 23/18/23/10 + 5–6 min transfer, with the stop for Teil 4 at minute 64–65. (DB 01.09.2025 § 2 Nr. 1: «ca. 5 Minuten innerhalb der Prüfungszeit»; Modellsatz Lesen T1–T4 «Dauer: 25/20/25/10 Minuten»)
- [minor] line 138, line 380, line 809 (q23) — The 3-minute Hören transfer is correct: DB German text «3 Minuten» and Modellsatz «drei Minuten». But the DB's English column says «approximately five minutes». q23 calls the German version «вирішальна» without explaining why. Fix: add one sentence in the «День іспиту» list: «В англійській колонці DB помилково стоїть ≈ 5 хв; маємо орієнтуватися на німецький текст і Modellsatz: 3 хв». Give the basis: DB, the clause «ist die deutsche Fassung maßgeblich» (p. 10–11). (https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C2_neu.pdf)
- [minor] line 345 (w22 example) — «Gesprächsrunde über die Zukunft der Zeitung» is the official Modellsatz Sprechen Teil 2 topic «Hat die gedruckte Zeitung eine Zukunft?». That breaks the rule «own tasks must not copy a Modellsatz topic» (LESSONS). Fix: use another topic, e.g. «… über die Viertagewoche».
- [minor] line 586 — The Berlin C2 requirement is correct (anerkennung-in-deutschland.de, updated 11.08.2026: «Sprachniveau C2», no certificate needed at Antragstellung; proof before the Ausgleichsmaßnahme or at Einstellung). The text implies that this proof must be the Goethe certificate. Fix: add «oder durch die kostenlose Sprachprüfung der Senatsverwaltung (2-mal im Jahr)». (https://www.anerkennung-in-deutschland.de/de/interest/finder/result?location=47619&profession=575&nationality=Drittstaat&arrangement=Ja&whereabouts=null)
- [minor] line 584 — «denn sie verlangt Textsorten, Zeitdruck und eine Präzision, die im Alltag selten vorkommen» has two problems. An exam does not *verlangen* Zeitdruck, and «sie» could refer to either the native speaker or the exam. Fix: «denn die Prüfung verlangt Textsorten und eine Präzision, die im Alltag selten vorkommen — und das unter Zeitdruck.»
- [minor] line 608 (q03 explanation) — The quote reorders the words of the text («längst nicht jede Muttersprachlerin würde …»). Fix: quote it as written: «würde längst nicht jede Muttersprachlerin die Prüfung ohne Vorbereitung bestehen».
- [minor] line 476 (l13 audio) — «Am Geld weniger als man denkt.» A comma is required before a comparative clause with a finite verb. Fix: «weniger, als man denkt». (Duden, Komma bei Vergleichssätzen mit «als»)
- [minor] line 442 (l10 audio) — Within one narrated audio, «Ganz so schwarz sehe ich das nicht, sagt die Moderatorin» is followed by Konjunktiv II «hätten». TTS will read the moderator speaking about herself in the third person. Fix: «Die Moderatorin sieht das nicht ganz so schwarz: Viele Zuschauer hätten sonst gar keine Untertitel.»
- [minor] line 504 (s02) — «mich als Lehrerin anerkennen lassen» is understandable but not the usual phrasing. Fix: «weil ich meinen Lehramtsabschluss anerkennen lassen möchte». Adjust the IPA.
- [minor] line 511 (s03) — «in drei Schritte gliedern» is unidiomatic. Fix: «in drei Teile gliedern» (IPA /taɪ̯lə/).
- [minor] line 639 (q07) — «Яка найменша сума … дає 60 балів» is inaccurate: 12 gives 62. Fix: «… дає щонайменше 60 балів».
- [minor] lines 68, 722; also C2-02 line 17 — «стоп по годиннику» uses Russian-influenced preposition usage. Fix: «стоп за годинником».
- [minor] Слухаємо — All 15 `[!listen]` blocks are `type: answer`. §2.4 п. 6 expects a choice → dictation → answer/fill progression. Fix (optional): turn 1–2 instruction recordings (l01, l03) into `dictation`, e.g. «Sie hören jeden Ausschnitt einmal».

Verified:
- DB C2, Stand 01.09.2025 (https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_C2_neu.pdf). Times: Lesen 80, Hören ca. 35, Schreiben 80, ≈ 195 in total. Sprechen is individual, ≈ 15 min plus 15 min preparation. Recommended order L–H–S, which the centre may change. Breaks of at least 15 min.
- DB transfer and Sprechen rules: Lesen transfer ≈ 5 min within the 80; Hören transfer 3 min (German) vs ≈ 5 min (English column); the German version prevails. Notes from the preparation may be used. Einführungsgespräch 2–3 min, not graded (§ 5 also calls it «Einleitungsgespräch»). The second examiner takes the non-chosen position.
- DB scoring: Schreiben T1 is 10 × 2/1/0; T2 is 5 criteria × 0–4, × 4. Two raters, mean, rounded up. Drittbewertung condition as stated. Sprechen raw × 2,5, mean rounded at 0,5, no intermediate values. Prädikate 100–90 / 89–80 / 79–70 / 69–60 / 59–0. Pass is 60 per module. Modules may be retaken as often as the centre allows. Digital format: changes allowed until submission; Sprechen tasks on paper. Online: no headphones of any kind, 360° view, one monitor. Literature tasks are prepared with LMU; «sechste Stufe … kompetente Sprachverwendung».
- Modellsatz, «Aktualisiert: März 2026» (https://www.goethe.de/pro/relaunch/prf/materialien/C2/c2_modellsatz.pdf). Multipliers: Lesen ×4/×3/×3/×3 (10/6/6/8 items), Hören ×2/×4/×5 (15/5/10). Hören T1 and T2 «einmal», T3 «zweimal». All instruction quotes in the file match. «Sie können mit jedem Teil beginnen»; «keinen Bleistift»; dictionaries not allowed.
- Modellsatz criteria: Schreiben T2 «Gültig ab 01.01.2026», with «*Wird ein Kriterium mit 0 Punkten bewertet … insgesamt 0 Punkte», «Textumfang weniger als 50 %», and for literature topics «Inhaltsaspekt 2 fehlt bzw. nicht angemessen» → E. Sprechen rule «Aufgabenerfüllung mit E → 0» per part. Two Leistungsbeispiele. The Strukturen descriptor wording matches w13.
- Literaturliste, Stand Dezember 2025 (https://www.goethe.de/pro/relaunch/prf/Literaturliste_C2/Goethe_Zertifikat_C2_Literaturliste.pdf): 2026 Haas, «Junger Mann»; Krien, «Die Liebe im Ernstfall». 2027 Boie, «Dunkelnacht»; Köhlmeier, «Frankie». The list applies per calendar year of the exam date.
- RO-DT 2025 § 8 (2) b/e: GDS and telc C1 Hochschule exempt; Goethe C1 does not. DSH-MPO allows a monolingual paper dictionary (Leseverstehen, Kurzvortrag), so q10's «на DSH правила інші» is correct. StAG § 10 Abs. 4 B1.
- Counts: W 22 (table 25, −12 %), L 15, S 8, Q 24, all within ±20 %. Ids are unique and in reading order. All audio ≤ 300 characters. No duplicate `[!word]` in content/Guides/Deutsch*, checked without the article.
- IPA and grammar spot-check, 14 cards: Mittelwert and Flickenteppich (from C2-02) checked against DWDS IPA; Spektrum (Spektren / Spektra), Statement (n.), Prüfling and Engpass against DWDS grammar; Sprachdiplom, Durchführungsbestimmung, Inhaltsaspekt (ʔ), stichpunktartig, Gesprächsrunde, Drittbewertung, Regelverstoß and Leipzig against Duden conventions. All OK.
- Arithmetic in q06, q07, q14, the diagram and the reels is correct. Order quizzes q13 and q24 each have one order. The q11 and q12 banks hold only real distractors.

## Deutsch Prüfungen - C2 - 02. Пробний тест C2 — читання й аудіювання.md

Verdict: ready after fixes. The format mirrors the GDS correctly, and the weighted, approximate score table is correct and labelled as approximate. The main issues are one ambiguous Hören item and topic recycling from C1-04.

Mock topics in C2-02:
- Lesen T1: navigation apps and spatial memory.
- Lesen T2: peatlands (Moore) — drainage, CO₂, Wiedervernässung, Paludikultur.
- Lesen T3: a Hallig during Landunter, i.e. storm surge, Warft, Salzwiesen, sea level.
- Lesen T4: writing workshops.
- Hören T1: seed library; church conversions; Schreibschrift; watchmaker apprenticeships; travelling shepherds.
- Hören T2: board-game evenings.
- Hören T3: underwater archaeology of the Bodensee pile dwellings.

None of these copies a Modellsatz topic. The Modellsatz topics are: Lesen — teacher's commentary, Bioenergie, risk management, jobs at international organisations; Hören — SOEX used clothing, Einrichtungsstile, urban heat island.

- [major] lines 147–156 (Lesen T2 «Die Rückkehr der Moore») together with line 217–233 (T3) — This recycles C1-04, inside the same exam guide.
  - C1-04 Hören 3.2 (line ≈ 413) covers wetlands that were drained or diked for farming and are now flooded again because they store carbon («weil die Wiesen Kohlenstoff speichern»).
  - C1-04 Lesetext 2 «Bauen mit Pilzen» (line ≈ 266) covers a bio-material «als Dämmstoff oder Verpackung» that is still a «Nischenprodukt», where the outlook depends on market and regulation.
  - C2-02 T2 repeats both arcs almost one to one: drainage → CO₂ source → rewetting → farming conflict → Schilf for «Dämmplatten, Verpackungen» → «Nischenware, Abnehmer rar».
  - T3 then returns to the C1-04 lecture's setting: North Sea coast, Salzwiesen, Deich, sea-level rise.

  Two of the four C2 Lesen texts therefore sit in the same field as C1-04. A learner who did C1-04 gets T2 answers d, b and e from background knowledge. Fix: replace T2 with an unrelated informative article (e.g. history of the Pfandsystem, sleep research, or the economics of local newspapers) and remove the Moor/Wiedervernässung cards with it. T3 alone is acceptable as a human-interest reportage, but see the next item.
- [minor] line 217, line 221 (T3) — The Hallig reportage is a different genre and theme from the C1-04 lecture (everyday life during Landunter vs. ecology of salt marshes). It still reuses the C1-04 setting words «Salzwiesen», «Deich» and sea-level rise. If T2 stays as it is, replace the Salzwiesen mention («über die Kante der Salzwiesen» → «über die Uferkante»). Then the overlap is only the North Sea coast.
- [minor] line 217, line 639 (w07 note) — «kleinen Inseln ohne schützenden Deich» and «маленький острів без дамби» are overstated. Hooge and Langeneß have low summer dikes (Sommerdeiche), and Landunter happens over them. The reel at line 746 says it correctly («немає високих дамб»). Fix: «kleinen Inseln, die höchstens ein niedriger Sommerdeich umgibt» and «без високої (зимової) дамби». Related: line 229 «an einigen Stellen wird darüber nachgedacht» understates a running state programme. The Warftverstärkungsprogramm has existed since 2016, with Hanswarft, Treuberg and Norderwarft completed. Fix: «… werden nach und nach verstärkt». (https://www.nationalpark-wattenmeer.de/wissensbeitrag/verstaerkte-warften/ ; https://taz.de/!5512020 ; https://www.schleswig-holstein.de/DE/fachinhalte/K/kuestenschutz_fachplaene/5_Halligen/1_Einleitung/1_0_0_Einleitung)
- [major] line 418–424 (l10) — The statement «Ein Schäfer sieht seine Hauptaufgabe heute in der Landschaftspflege» has two defensible answers. The audio says only what he is **paid for**: «nicht mehr für das Fleisch …, sondern dafür, dass seine Schafe das Gras kurz halten». Being paid for X is not the same as seeing X as his main task. «Ja» is an inference, which is exactly the trap the pitfall at line 585 warns against. Fix: «Ein Schäfer wird heute vor allem für die Landschaftspflege bezahlt.» (Ja).
- [minor] line 55 (diagram note) — «Час пропорційний іспитові» is false. Pro rata the exam would give about 15/17/17/6 min for 6/5/4/5 items; the plan has 12/7/10/5. Fix: «Час — орієнтовно стиснутий з 25 / 20 / 25 / 10 хв: тексти тут коротші».
- [minor] line 458 (l13 explanation) — «Про Handy він нічого не каже, тож «обидва» не підходить» gives the wrong reason. «Beide» is excluded because Felix disagrees («Das sehe ich anders»), not because he skips the phone. Fix: «Фелікс прямо заперечує: Das sehe ich anders — для нього головне виграш».
- [minor] line 81 (T1 Kommentar) — «eine Fähigkeit, die sich nur durch Gebrauch erhält, ganz ähnlich wie ein Muskel, der nicht beansprucht wird» is a broken comparison: an unused muscle is exactly what does *not* survive. Fix: «… ganz ähnlich wie ein Muskel, der ohne Beanspruchung erschlafft.»
- [minor] line 356 (l02 audio) — In «nur etwa jede dritte Ausleihe kam zurück» the loan does not «come back»; the seeds do. Fix: «brachte nur etwa jeder dritte Nutzer Samen zurück». The statement and answer stay as they are.
- [minor] line 664 (q24) — The stem «Mit welchem Satz relativiert der Kommentator die Forderung nach Verzicht?» is inaccurate: the Faltplan sentence mocks the nostalgia behind the demand, it doesn't «relativieren» it. Fix: «Mit welchem Satz macht der Kommentator die Rückkehr zum Stadtplan lächerlich?»
- [minor] line 756 (Джерела) — The DWDS «Wiedervernässung» link opens a search page («Suche nach »Wiedervernässung««), not a dictionary entry, which breaks §2.7.12. Fix: drop it or link a real entry, e.g. DWDS «vernässen», or the BfN/UBA page on Moorschutz.
- [minor] line 730–735 (q30) — Only «Lieber» is capitalised, so the first chunk gives itself away. The distractor «lassen ✗» is a fragment of the correct chunk «lassen wir», not a real learner error. Fix: lower-case all chunks, e.g. «lieber / lassen wir / vieles / im Boden.», and use a real error as the distractor, e.g. «wir lassen ✗» (verb-second violation after lieber).

Verified:
- The GDS structure the mock copies matches the Modellsatz März 2026. Lesen: T1 Kommentar a–d; T2 Aussagen → Abschnitte, two extra; T3 Reportage, one paragraph extra; T4 Anzeigen, one ad can match several statements. Hören: T1 Ja/Nein once, T2 Person 1 / 2 / beide once, T3 a/b/c twice.
- Coefficients: Lesen T1–T4 are 40/6, 18/5, 18/4 and 24/5; Hören T1–T3 are 30/10, 20/4 and 50/6. The q22 sum is 73 and q23 is ≈ 64. All results are labelled «орієнтовний / орієнтир, а не прогноз».
- Bodensee: the UNESCO «Prähistorische Pfahlbauten um die Alpen» date of 2011 is correct (https://www.unesco.de/staette/praehistorische-pfahlbauten-um-die-alpen/, 200). Dendrochronology to the year is correct. Oxygen-poor sediment as the reason for preservation is correct.
- Every German sentence in the 5 texts, 20 listens and 30 quizzes was checked for grammar and logic. Fixes are listed above; everything else is correct C2 German.
- Lesen T3 gaps 12–15 each have exactly one fitting paragraph (tried every option in every gap). T2 and T4 items each have one answer. The q27 and q28 banks hold real distractors disambiguated by glosses, and q29 has one order.
- Counts: W 10, L 20, S 0, Q 30, matching the table. Ids are unique and in reading order. All audio ≤ 300 characters. No duplicate `[!word]` (Umweg, Moor, Sturmflut, Engpass, Saatgut, etc. grepped without the article).
- IPA and grammar: Saatgut and Flickenteppich checked against DWDS IPA; Engpass (Engpässe) and lotsen (lotst) against DWDS grammar; Ortskenntnis, Umweg [k], Moor /moːɐ̯/, Wiedervernässung, Sturmflut and Warft (DE/NDS «Wurt») against Duden conventions. All OK.
- Ukrainian is natural apart from «стоп по годиннику» (line 17), and the apostrophe is ʼ throughout. Glossing is inconsistent: «латана ковдра» (line 384) vs the card's «клаптикова ковдра»; unify it.
