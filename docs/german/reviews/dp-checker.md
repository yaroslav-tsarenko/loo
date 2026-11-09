# Checker: «Deutsch Prüfungen» (12 файлів)

Дата: 2026-11-09. Режим: read-only, контент не змінено. Ціль W/L/S/Q — з `docs/GERMAN_SYLLABUS.md` §10.4, допуск ±20 %.

## Таблиця (факт / ціль)

| Файл | id | W | L | S | P | Q | pitfall | reel | diagram | fill/order | audio max (симв.) | Статус |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B1-01 | dp-b1-01 | 25/25 | 15/15 | 8/8 | 0 (без цілі) | 24/24 | 4 (≥3) | 3 (≥3) | 2 (≥1) | 5 (≥4) | 228 (≤300) | OK |
| B1-02 | dp-b1-02 | 20/20 | 15/15 | 8/8 | 0 (без цілі) | 25/24 | 4 (≥3) | 3 (≥3) | 2 (≥1) | 4 (≥4) | 226 (≤300) | OK |
| B1-03 | dp-b1-03 | 10/10 | 20/20 | 0/0 | 0 (без цілі) | 31/30 | 3 (≥3) | 3 (≥3) | 2 (≥1) | 4 (≥4) | 217 (≤300) | OK |
| B2-01 | dp-b2-01 | 25/25 | 15/15 | 8/8 | 0 (без цілі) | 24/24 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 6 (≥4) | 254 (≤300) | OK |
| B2-02 | dp-b2-02 | 20/20 | 15/15 | 8/8 | 0 (без цілі) | 24/24 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 4 (≥4) | 249 (≤300) | OK |
| B2-03 | dp-b2-03 | 10/10 | 20/20 | 0/0 | 0 (без цілі) | 30/30 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 4 (≥4) | 255 (≤300) | OK |
| C1-01 | dp-c1-01 | 30/30 | 15/15 | 10/10 | 0 (без цілі) | 24/24 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 4 (≥4) | 256 (≤300) | OK |
| C1-02 | dp-c1-02 | 30/30 | 15/15 | 6/6 | 0 (без цілі) | 24/24 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 5 (≥4) | 275 (≤300) | OK |
| C1-03 | dp-c1-03 | 25/25 | 15/15 | 8/8 | 0 (без цілі) | 24/24 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 4 (≥4) | 273 (≤300) | OK |
| C1-04 | dp-c1-04 | 10/10 | 20/20 | 0/0 | 0 (без цілі) | 30/30 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 4 (≥4) | 217 (≤300) | OK |
| C2-01 | dp-c2-01 | 22/25 | 15/15 | 8/8 | 0 (без цілі) | 24/24 | 4 (≥3) | 3 (≥3) | 2 (≥1) | 5 (≥4) | 279 (≤300) | OK (W 22 при цілі 25: у межах ±20 %, рішення лідера) |
| C2-02 | dp-c2-02 | 10/10 | 20/20 | 0/0 | 0 (без цілі) | 30/30 | 4 (≥3) | 3 (≥3) | 1 (≥1) | 4 (≥4) | 286 (≤300) | OK |

Сума: W 237 (ціль 240), L 200 (ціль 200), S 64 (ціль 64), Q 314 (ціль 312).

## Порушення

Порушень за полями чек-листа в 12 файлах немає.

## Команди

- `VAULT_PATH=content npx pnpm@10 content:check "Deutsch Prüfungen"`: «✅ Проблем немає» (12 із 12 файлів; 20 одиниць «без явного id» у виводі не належать до цих файлів: усі блоки тут мають id).
- `VAULT_PATH=content npx pnpm@10 diagram:check`: «842 схем, проблем: 0; ASCII-малюнків лишилось: 15». Усі 15 ASCII-малюнків у Next.js-посібниках; у «Deutsch Prüfungen» немає.

## Дублікати `[!word]` (Deutsch*, без артиклів, без регістру)

У 12 файлах дублів немає. Дублі з іншими файлами `content/Guides/Deutsch*` (усі пари): немає з файлами «Deutsch Prüfungen».

| Заголовок | Файл A (рядок, id) | Файл B (рядок, id) |
|---|---|---|
| arm («der Arm» / «arm») | Deutsch - A1 - 08. Сімʼя, люди й зовнішність.md, стор. 434, de-a1-familie-w42 | Deutsch - B1 - 01. Präteritum — оповідь у минулому.md, стор. 225, de-b1-praeteritum-w12 |
| bitte («bitte» / «die Bitte») | Deutsch - A1 - 02. Hallo — привітання, країни, мови, du і Sie.md, стор. 219, de-a1-hallo-w09 | Deutsch - B1 - 27. Письмо — особистий і офіційний лист, допис на форумі.md, стор. 232, de-b1-schreiben-w12 |
| dach («DACH» / «das Dach») | Deutschland - A2 - 01. Німецькомовний світ — DACH і сусіди.md, стор. 96, dl-a2-01-w01 | Deutsch - A1 - 17. Приголосні ch, r, h.md, стор. 181, de-a1-konsonanten-w08 |
| durchbrechen («durchbrechen (trennbar)» / «durchbrechen (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 154, de-b2-praefixverben-w05 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 161, de-b2-praefixverben-w06 |
| durchlaufen («durchlaufen (trennbar)» / «durchlaufen (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 224, de-b2-praefixverben-w15 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 231, de-b2-praefixverben-w16 |
| durchsetzen («durchsetzen (trennbar)» / «durchsetzen (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 238, de-b2-praefixverben-w17 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 245, de-b2-praefixverben-w18 |
| ihr («ihr (її, їхній)» / «Ihr») | Deutsch - A1 - 21. Присвійні артиклі — mein, dein, sein, ihr, unser.md, стор. 148, de-a1-possessiv-w04 | Deutsch - A1 - 21. Присвійні артиклі — mein, dein, sein, ihr, unser.md, стор. 169, de-a1-possessiv-w07 |
| laut («laut» / «der Laut») | Deutsch - A1 - 20. Квартира, кімнати й меблі — es gibt.md, стор. 420, de-a1-wohnung-w37 | Deutsch - A1 - 01. Alphabet, звуки й вимова літер.md, стор. 175, de-a1-alphabet-w04 |
| laut («laut» / «laut (прийменник, + Dat / Gen)») | Deutsch - A1 - 20. Квартира, кімнати й меблі — es gibt.md, стор. 420, de-a1-wohnung-w37 | Deutsch - C1 - 09. Прийменники писемної мови — angesichts, aufgrund, hinsichtlich.md, стор. 283, de-c1-genitiv-praep-w27 |
| laut («der Laut» / «laut (прийменник, + Dat / Gen)») | Deutsch - A1 - 01. Alphabet, звуки й вимова літер.md, стор. 175, de-a1-alphabet-w04 | Deutsch - C1 - 09. Прийменники писемної мови — angesichts, aufgrund, hinsichtlich.md, стор. 283, de-c1-genitiv-praep-w27 |
| leben («das Leben» / «leben») | Deutsch - A2 - 04. Біографія й життєві події.md, стор. 127, de-a2-lebenslauf-w07 | Deutsch - A1 - 07. Präsens — правильні дієслова.md, стор. 214, de-a1-praesens-w11 |
| lernen («das Lernen» / «lernen») | Deutsch - A1 - 06. Артикль і рід — der, die, das, ein, eine.md, стор. 394, de-a1-artikel-w29 | Deutsch - A1 - 07. Präsens — правильні дієслова.md, стор. 158, de-a1-praesens-w03 |
| morgen («der Morgen» / «morgen») | Deutsch - A1 - 12. Час, дні, місяці й дата.md, стор. 343, de-a1-zeit-w25 | Deutsch - A1 - 12. Час, дні, місяці й дата.md, стор. 444, de-a1-zeit-w39 |
| reich («das Reich» / «reich») | Deutschland - B1 - 02. Священна Римська імперія — імператори, курфюрсти, Ганза.md, стор. 128, dl-b1-02-w02 | Deutsch - B1 - 01. Präteritum — оповідь у минулому.md, стор. 232, de-b1-praeteritum-w13 |
| schaden («der Schaden» / «schaden») | Deutsch - B1 - 26. Установи й страхування — Ausländerbehörde, Jobcenter, Krankenkasse.md, стор. 264, de-b1-behoerden-w21 | Deutsch - A2 - 19. Займенники в усіх відмінках і порядок обʼєктів.md, стор. 198, de-a2-pronomen-w09 |
| schreiben («schreiben» / «das Schreiben») | Deutsch - A1 - 29. Читання й письмо — формуляр, оголошення, коротке повідомлення.md, стор. 228, de-a1-lesen-schreiben-w17 | Deutsch - C1 - 18. Регістр — du і Sie, Amtsdeutsch, розмовна й молодіжна мова.md, стор. 193, de-c1-register-w13 |
| sein («sein» / «sein») | Deutsch - A1 - 03. Особові займенники й дієслово sein.md, стор. 188, de-a1-sein-w01 | Deutsch - A1 - 21. Присвійні артиклі — mein, dein, sein, ihr, unser.md, стор. 141, de-a1-possessiv-w03 |
| umfahren («umfahren (trennbar)» / «umfahren (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 126, de-b2-praefixverben-w01 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 133, de-b2-praefixverben-w02 |
| umgehen («umgehen (trennbar)» / «umgehen (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 182, de-b2-praefixverben-w09 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 189, de-b2-praefixverben-w10 |
| umschreiben («umschreiben (trennbar)» / «umschreiben (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 196, de-b2-praefixverben-w11 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 203, de-b2-praefixverben-w12 |
| unterstellen («unterstellen (trennbar)» / «unterstellen (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 168, de-b2-praefixverben-w07 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 175, de-b2-praefixverben-w08 |
| vertrauen («vertrauen» / «das Vertrauen») | Deutsch - A2 - 20. Почуття, характер і стосунки.md, стор. 322, de-a2-gefuehle-w32 | Deutsch - B1 - 04. Стосунки, сімʼя й спільне життя.md, стор. 188, de-b1-beziehungen-w13 |
| zusammenleben («das Zusammenleben» / «zusammenleben») | Deutsch - B1 - 04. Стосунки, сімʼя й спільне життя.md, стор. 279, de-b1-beziehungen-w26 | Deutsch - B1 - 04. Стосунки, сімʼя й спільне життя.md, стор. 314, de-b1-beziehungen-w31 |
| übergehen («übergehen (trennbar)» / «übergehen (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 210, de-b2-praefixverben-w13 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 217, de-b2-praefixverben-w14 |
| übersetzen («übersetzen (trennbar)» / «übersetzen (untrennbar)») | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 140, de-b2-praefixverben-w03 | Deutsch - B2 - 21. Префіксальні дієслова — über-, um-, durch-, unter-.md, стор. 147, de-b2-praefixverben-w04 |

Усього пар: 25. Примітка: `durchbrechen`, `umfahren` та ін. у B2-21 — пари «trennbar / untrennbar» з одного файлу; вони мають різні значення, але за правилом брифа це дублі. Пари `der Arm` / `arm` та подібні (різна частина мови) теж перелічено, бо бриф вимагає кожну пару.

## Теми мокових тестів (читання / аудіювання)

- **B1-03** Lesen: Gemeinschaftsgarten; Repair-Café (Text A); Bodensee-Rundfahrt (Text B); sieben Kleinanzeigen; Leinenpflicht im Stadtpark (Leserbriefe); Coworking-Hausordnung. Hören: Arzt-Termin, Supermarkt-Angebote, Wetter, Nachricht des Kollegen, Schwimmbad; Markthalle und Kochkurs; Carsharing (Lea); Arbeitsalltag: Meetings, Homeoffice.
- **B2-03** Lesen: Mehrgenerationenhaus (Forum); langsames Brot; Lernen ohne Hörsaal; Foodsharing; Nutzungsbedingungen StadtRad. Hören: Alltag und Handwerker (Teil 1); Straßenmusikerin Ленц (Teil 2); Schuluniformen, Diskussion (Teil 3); Stadtbäume, Vortrag (Teil 4).
- **C1-04** Lesen: Tiefsee-Rohstoffe (Manganknollen); Bauen mit Pilzen (Myzel). Hören: Biber und Feuchtgebiete (Teil 1, 6, 7.1); Salzwiesen und Küstenschutz (Teil 3, 5, 7.2); Tourismus an den Salzwiesen (Teil 4); Pilzplatten-Startup (6.4, 7.3).
- **C2-02** Lesen: Orientierung und Smartphone (Kommentar); Rückkehr der Moore; Aussagen a–g (zu den Mooren); Sturmflut auf der Warft (Wenn das Meer kommt, Abschnitte A–E); Schreibwerkstätten (Anzeigen). Hören: Saatgut-Bibliothek; Kirchenumnutzung; verbundene Schrift; Uhrmacher-Lehrling; Wanderschäferei; Brettspiele (Gespräch); Unterwasserarchäologie am Bodensee (Interview).

**Перетин тем між мокими тестами:** точних збігів немає. Є часткові перетини, які варто подивитися рецензенту:
1. C1-04 (Salzwiesen als Küstenschutz, Hören 3 / 5 / 7.2) і C2-02 (Sturmflut auf der Warft, Lesen): обидва про прибережні повені й дамби. Тема спільна, тексти різні.
2. C2-02 «Die Rückkehr der Moore» і C1-04 Hören 1.3 (водно-болотні угіддя): обидва про вологі екосистеми, слабкий перетин.
3. B1-03 Lesen (Bodensee-Rundfahrt) і C2-02 Hören (Unterwasserarchäologie am Bodensee): спільна локація, різні теми.

## Перевірено без порушень

- ids: `dp-<level>-NN` збігається з іменем файлу; блоки мають схему `<id>-w/l/s/p/q NN`; без дублів у файлі й у всіх `Deutsch*`; номери йдуть 01..n за порядком появи.
- Картки іменників мають der/die/das і `forms:`; `forms:` дієслів починається з інфінітива.
- Frontmatter: title, id, level, icon (`px:`), tags, prerequisites, estimatedMinutes є; title збігається з §10.4; усі prerequisites резолвляться.
- Імена файлів без заборонених символів і за шаблоном.
- Кожен quiz має `**Пояснення:**`; quiz із `type: fill/order` ≥4 у кожному файлі.
- `[!listen]` audio ≤300 симв. (з мітками мовців): максимум 286 (C2-02).
- Апостроф: ASCII `'` або `’` між кирилічними літерами не знайдено.
- IPA `ɔɪ̯` не знайдено (`ɔʏ̯` — у межах правила).
- `[!pair]` = 0 у всіх файлах; §10.4 для P цілі не задає, тому P не оцінювано.

Скрипт перевірки: `/tmp/dpcheck/check.py` (поза репозиторієм).
