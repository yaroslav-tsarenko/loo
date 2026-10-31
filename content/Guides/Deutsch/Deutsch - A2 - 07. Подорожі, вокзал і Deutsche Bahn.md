---
title: Подорожі, вокзал і Deutsche Bahn
id: de-a2-reisen
level: A2
icon: px:map
tags: [deutsch, a2, vocabulary, reisen, bahn]
prerequisites: ["[[Deutsch - A1 - 24. Місто, транспорт і дорога — Imperativ]]", "[[Deutsch - A2 - 06. Прийменники з Dativ і з Akkusativ]]"]
estimatedMinutes: 45
---

# Подорожі, вокзал і Deutsche Bahn

> [!success] Після цієї теми ти зможеш
> - купити квиток і спитати про колію, відправлення й пересадку: *Eine Fahrkarte nach Köln, hin und zurück, bitte.*;
> - розуміти оголошення на вокзалі: *Verspätung, Gleisänderung, Zug fällt aus*;
> - забронювати житло й розповісти про поїздку в Perfekt;
> - орієнтуватися в тому, як працює Deutsche Bahn, і що таке Deutschlandticket.

## Передбач

> [!quiz] Як сказати: «Мені квиток до Гамбурга, туди й назад»?
> level: A2 · type: single · id: de-a2-reisen-q01
> - [ ] Ich möchte ein Fahrkarte nach Hamburg, hin und zurück.
> - [ ] Ich möchte eine Fahrkarte zu Hamburg, hin und zurück.
> - [x] Ich möchte eine Fahrkarte nach Hamburg, hin und zurück.
> - [ ] Ich möchte eine Fahrkarte nach Hamburg, zurück und hin.
>
> **Пояснення:** *die Fahrkarte* — жіночий рід: *eine Fahrkarte*. До міста — *nach Hamburg*. Вираз *hin und zurück* має сталий порядок слів.

## На вокзалі

У Німеччині більшість подорожей потягом організовує **Deutsche Bahn (DB)**: далекі маршрути (*Fernverkehr*: ICE, IC) і місцеві (*Nahverkehr*: RE, RB, S-Bahn). Квиток купують в автоматі, на сайті чи в застосунку DB Navigator. На табло шукаєш: **Zug** (номер і напрямок), **Abfahrt** (відправлення), **Gleis** (колія) та **Verspätung** (запізнення).

> [!diagram] Від квитка до пункту призначення
> ```yaml
> layout: flow
> nodes:
>   - { id: a, label: "1. Verbindung suchen", text: "знайти маршрут", note: "DB Navigator, Fahrplan", tone: yellow }
>   - { id: b, label: "2. Fahrkarte kaufen", text: "купити квиток", note: "Automat, App, Schalter", tone: pink }
>   - { id: c, label: "3. Gleis finden", text: "знайти колію", note: "Anzeigetafel: Gleis 7", tone: yellow }
>   - { id: d, label: "4. Einsteigen", text: "сісти в потяг", note: "Wagen, Sitzplatz, Reservierung", tone: pink }
>   - { id: e, label: "5. Umsteigen · Ankunft", text: "пересадка й прибуття", note: "Anschluss, Ankunft", tone: gray }
> edges:
>   - { from: a, to: b, label: "потім" }
>   - { from: b, to: c, label: "потім" }
>   - { from: c, to: d, label: "потім" }
>   - { from: d, to: e, label: "потім" }
> steps:
>   - { focus: a, note: "Спершу знаходиш маршрут: Verbindung — це сполучення з пересадками. Вказуєш звідки, куди й коли." }
>   - { focus: b, note: "Квиток: Fahrkarte. Просто в один бік — «einfach», туди й назад — «hin und zurück». Можна купити Deutschlandticket на місяць." }
>   - { focus: c, note: "На табло — номер колії: Gleis 7. Слово Bahnsteig — сама платформа, Gleis — колія з номером." }
>   - { focus: d, note: "Місце: Sitzplatz. Якщо резервував — Reservierung. Не забудь Fahrkarte для контролю." }
>   - { focus: e, note: "Якщо пересадка: Anschluss. Якщо потяг запізнюється — Verspätung — Anschluss може бути втрачено." }
> ```
> Кольори тут лише чергують кроки (жовтий — підготовка, рожевий — рух).

### Німеччина, Австрія, Швейцарія

Слова на вокзалі можуть відрізнятися. Норма — німецька (DE), у `note:` карток — варіанти:

> [!diagram] Вокзал: DE і CH
> ```yaml
> layout: compare
> columns: { de: "DE · Deutsche Bahn (DB)", ch: "CH · SBB (Schweiz)" }
> nodes:
>   - { id: d1, col: de, label: "квиток", text: "die Fahrkarte · das Ticket", tone: gray }
>   - { id: d2, col: de, label: "платформа", text: "der Bahnsteig", tone: gray }
>   - { id: d3, col: de, label: "туди й назад", text: "Hin- und Rückfahrt", tone: gray }
>   - { id: c1, col: ch, label: "квиток", text: "das Billett", tone: gray }
>   - { id: c2, col: ch, label: "платформа", text: "das Perron", tone: gray }
>   - { id: c3, col: ch, label: "туди й назад", text: "retour", tone: gray }
> steps:
>   - { focus: [d1, c1], note: "У Німеччині Fahrkarte (також Ticket), у Швейцарії — Billett." }
>   - { focus: [d2, c2], note: "Німецьке Bahnsteig у Швейцарії називають Perron." }
>   - { focus: [d3, c3], note: "Hin- und Rückfahrt у швейцарському варіанті — retour (Retourbillett). Австрія (ÖBB) загалом користується тією ж лексикою, що й Німеччина." }
> ```
> Для іспиту й спілкування в Німеччині вживай німецький варіант; швейцарські слова корисно впізнавати.

## Приклади

- Eine Fahrkarte nach Köln, bitte. Einfach oder hin und zurück? — Квиток до Кельна, будь ласка. В один бік чи туди й назад?
- Von welchem Gleis fährt der Zug nach Berlin ab? — З якої колії відправляється потяг до Берліна?
- Der Zug hat zwanzig Minuten Verspätung. — Потяг запізнюється на двадцять хвилин.
- Ich habe meinen Anschluss verpasst. — Я не встиг на пересадку.
- Wo muss ich umsteigen? — Де мені пересідати?
- Wir haben ein Doppelzimmer für zwei Nächte gebucht. — Ми забронювали двомісний номер на дві ночі.
- Der Zug nach München ist ausgefallen. — Потяг до Мюнхена скасовано.
- Ich habe einen Sitzplatz am Fenster reserviert. — Я зарезервував місце біля вікна.
- Gilt das Deutschlandticket auch im ICE? — Nein, nur im Nahverkehr. — Чи діє Deutschlandticket в ICE? — Ні, лише в місцевому транспорті.
- Wir sind um 18 Uhr in Hamburg angekommen. — Ми прибули до Гамбурга о 18:00.

## Слова

> [!word] das Gleis
> ipa: /ɡlaɪ̯s/ · pos: noun · level: A2 · id: de-a2-reisen-w01
> uk: колія
> forms: die Gleise
> example: Der Zug fährt von **Gleis** 7 ab. — Потяг відправляється з колії 7.
> note: Gleis 7 — номер колії; CH: Gleis (також Perron для платформи). Не «Plattform».

> [!word] der Bahnsteig
> ipa: /ˈbaːnʃtaɪ̯k/ · pos: noun · level: A2 · id: de-a2-reisen-w02
> uk: платформа
> forms: die Bahnsteige
> example: Der Zug steht am **Bahnsteig** 3. — Потяг стоїть біля платформи 3.
> note: CH: das Perron; AT: Bahnsteig. Кінцеве g = [k]: ‘банштайк’.

> [!word] die Verspätung
> ipa: /fɛɐ̯ˈʃpɛːtʊŋ/ · pos: noun · level: A2 · id: de-a2-reisen-w03
> uk: запізнення
> forms: die Verspätungen
> example: Der Zug hat zehn Minuten **Verspätung**. — Потяг запізнюється на десять хвилин.
> note: -ung → die. Verspätung haben — запізнюватися (про транспорт).

> [!word] der Anschluss
> ipa: /ˈanʃlʊs/ · pos: noun · level: A2 · id: de-a2-reisen-w04
> uk: пересадка (сполучення); підключення
> forms: die Anschlüsse
> example: Ich habe meinen **Anschluss** verpasst. — Я не встиг на пересадку.
> note: ss після короткої голосної; Anschluss erreichen / verpassen.

> [!word] verpassen
> ipa: /fɛɐ̯ˈpasn̩/ · pos: verb · level: A2 · id: de-a2-reisen-w05
> uk: пропустити; не встигнути
> forms: verpassen → verpasste → hat verpasst
> example: Ich habe den Zug **verpasst**. — Я пропустив потяг.
> note: ver- ненаголошене — Partizip без ge-. Не «verlieren».

> [!word] das Deutschlandticket
> ipa: /ˈdɔʏ̯tʃlantˌtɪkət/ · pos: noun · level: A2 · id: de-a2-reisen-w06
> uk: Deutschlandticket (місячний квиток на регіональний транспорт)
> forms: die Deutschlandtickets
> example: Mit dem **Deutschlandticket** fahre ich überall im Nahverkehr. — З Deutschlandticket я їжджу скрізь місцевим транспортом.
> note: з 1.1.2026 — 63 € на місяць; не діє в ICE / IC.

> [!word] die Hin- und Rückfahrt
> ipa: /ˈhɪn ʊnt ˈʁʏkˌfaːɐ̯t/ · pos: noun · level: A2 · id: de-a2-reisen-w07
> uk: поїздка туди й назад
> forms: die Hin- und Rückfahrten
> example: Eine **Hin- und Rückfahrt** nach Köln, bitte. — Квиток до Кельна й назад, будь ласка.
> note: коротко: hin und zurück. CH: retour. Просто в один бік — einfach.

> [!word] die Unterkunft
> ipa: /ˈʊntɐˌkʊnft/ · pos: noun · level: A2 · id: de-a2-reisen-w08
> uk: житло (на час подорожі)
> forms: die Unterkünfte
> example: Wir suchen eine günstige **Unterkunft**. — Ми шукаємо недороге житло.
> note: ü у множині: Unterkünfte. kunft — [kʊnft].

> [!word] buchen
> ipa: /ˈbuːxn̩/ · pos: verb · level: A2 · id: de-a2-reisen-w09
> uk: бронювати; замовляти
> forms: buchen → buchte → hat gebucht
> example: Ich habe ein Hotelzimmer **gebucht**. — Я забронював номер у готелі.
> note: ch після u = [x]. Іменник: die Buchung.

> [!word] der Fahrplan
> ipa: /ˈfaːɐ̯plaːn/ · pos: noun · level: A2 · id: de-a2-reisen-w10
> uk: розклад руху
> forms: die Fahrpläne
> example: Laut **Fahrplan** kommt der Zug um 8 Uhr an. — За розкладом потяг приїжджає о 8:00.
> note: plan довге a: [plaːn].

> [!word] die Abfahrt
> ipa: /ˈapˌfaːɐ̯t/ · pos: noun · level: A2 · id: de-a2-reisen-w11
> uk: відправлення
> forms: die Abfahrten
> example: Die **Abfahrt** ist um 9:15 Uhr. — Відправлення о 9:15.
> note: від abfahren (ab- наголошений). Протилежне: die Ankunft.

> [!word] die Ankunft
> ipa: /ˈankʊnft/ · pos: noun · level: A2 · id: de-a2-reisen-w12
> uk: прибуття
> forms: die Ankünfte
> example: Die **Ankunft** in Hamburg ist um 12:40 Uhr. — Прибуття до Гамбурга о 12:40.
> note: від ankommen; ü у множині.

> [!word] der Fahrkartenautomat
> ipa: /ˈfaːɐ̯kaʁtn̩ʔaʊ̯toˌmaːt/ · pos: noun · level: A2 · id: de-a2-reisen-w13
> uk: автомат з продажу квитків
> forms: die Fahrkartenautomaten
> example: Am **Fahrkartenautomaten** kann ich mit Karte zahlen. — В автоматі можна платити карткою.
> note: AT та CH також Fahrscheinautomat / Billettautomat. Довге складне слово: Fahrkarte + Automat.

> [!word] der Schalter
> ipa: /ˈʃaltɐ/ · pos: noun · level: A2 · id: de-a2-reisen-w14
> uk: віконце (каса); перемикач
> forms: die Schalter
> example: Am **Schalter** gibt es Fahrkarten. — У касі є квитки.
> note: у DB: Reisezentrum. sch- = «ш».

> [!word] reservieren
> ipa: /ʁezɛʁˈviːʁən/ · pos: verb · level: A2 · id: de-a2-reisen-w15
> uk: резервувати
> forms: reservieren → reservierte → hat reserviert
> example: Ich habe einen Platz **reserviert**. — Я зарезервував місце.
> note: -ieren → Partizip без ge-; наголос -vie-.

> [!word] die Reservierung
> ipa: /ʁezɛʁˈviːʁʊŋ/ · pos: noun · level: A2 · id: de-a2-reisen-w16
> uk: резервування; бронь
> forms: die Reservierungen
> example: Die **Reservierung** kostet 5 Euro. — Резервування коштує 5 євро.
> note: Sitzplatzreservierung = резервування місця.

> [!word] der Sitzplatz
> ipa: /ˈzɪtsˌplats/ · pos: noun · level: A2 · id: de-a2-reisen-w17
> uk: сидяче місце
> forms: die Sitzplätze
> example: Haben Sie einen **Sitzplatz** gefunden? — Ви знайшли місце?
> note: tz = [ts].

> [!word] der Zuschlag
> ipa: /ˈtsuːˌʃlaːk/ · pos: noun · level: A2 · id: de-a2-reisen-w18
> uk: доплата
> forms: die Zuschläge
> example: Für das Einzelzimmer zahlt man einen **Zuschlag**. — За одномісний номер беруть доплату.
> note: кінцеве g = [k]. Zuschlag буває й у поїзді, і в готелі.

> [!word] der Fernverkehr
> ipa: /ˈfɛʁnfɛɐ̯ˌkeːɐ̯/ · pos: noun · level: A2 · id: de-a2-reisen-w19
> uk: далекі перевезення
> forms: — (без множини)
> example: ICE und IC gehören zum **Fernverkehr**. — ICE та IC належать до далеких перевезень.
> note: «Fern-» = далекий. Протилежне: Nahverkehr.

> [!word] der Nahverkehr
> ipa: /ˈnaːfɛɐ̯ˌkeːɐ̯/ · pos: noun · level: A2 · id: de-a2-reisen-w20
> uk: місцеві перевезення
> forms: — (без множини)
> example: Das Deutschlandticket gilt im **Nahverkehr**. — Deutschlandticket діє в місцевому транспорті.
> note: ö: Bus, Straßenbahn, U-Bahn, S-Bahn, RB, RE.

> [!word] der ICE
> ipa: /iːtseːˈʔeː/ · pos: noun · level: A2 · id: de-a2-reisen-w21
> uk: ICE (швидкісний потяг DB)
> forms: die ICE
> example: Der **ICE** nach Berlin fährt jede Stunde. — ICE до Берліна їде щогодини.
> note: Intercity-Express; множина — ICE (або ICEs). Також: IC, EC; AT: Railjet; CH: IC / ICN.

> [!word] die S-Bahn
> ipa: /ˈɛsˌbaːn/ · pos: noun · level: A2 · id: de-a2-reisen-w22
> uk: міська електричка
> forms: die S-Bahnen
> example: Die **S-Bahn** fährt alle zehn Minuten. — Міська електричка їде кожні десять хвилин.
> note: на відміну від U-Bahn, їздить і за межі міста.

> [!word] die Verbindung
> ipa: /fɛɐ̯ˈbɪndʊŋ/ · pos: noun · level: A2 · id: de-a2-reisen-w23
> uk: сполучення; маршрут
> forms: die Verbindungen
> example: Gibt es eine **Verbindung** nach Wien? — Чи є сполучення до Відня?
> note: на сайті DB: Verbindung suchen.

> [!word] ausfallen
> ipa: /ˈaʊ̯sˌfalən/ · pos: verb · level: A2 · id: de-a2-reisen-w24
> uk: скасовуватися
> forms: er fällt aus · fiel aus · ist ausgefallen
> example: Der Zug ist **ausgefallen**. — Потяг скасовано.
> note: з sein. Обʼяви: «Der Zug fällt aus».

> [!word] die Störung
> ipa: /ˈʃtøːʁʊŋ/ · pos: noun · level: A2 · id: de-a2-reisen-w25
> uk: збій; несправність
> forms: die Störungen
> example: Wegen einer **Störung** hat der Zug Verspätung. — Через збій потяг запізнюється.
> note: від stören (carded). Technische Störung — технічна несправність.

> [!word] der Streik
> ipa: /ʃtʁaɪ̯k/ · pos: noun · level: A2 · id: de-a2-reisen-w26
> uk: страйк
> forms: die Streiks
> example: Wegen des **Streiks** fahren heute keine Züge. — Через страйк сьогодні потяги не їздять.
> note: ei = [aɪ̯]; Bahnstreik.

> [!word] die Auskunft
> ipa: /ˈaʊ̯sˌkʊnft/ · pos: noun · level: A2 · id: de-a2-reisen-w27
> uk: довідка; інформація
> forms: die Auskünfte
> example: Wo ist die **Auskunft**? — Де довідка?
> note: pl. Auskünfte; на вокзалі: Information / Reisezentrum.

> [!word] das Gepäck
> ipa: /ɡəˈpɛk/ · pos: noun · level: A2 · id: de-a2-reisen-w28
> uk: багаж
> forms: — (без множини)
> example: Mein **Gepäck** ist schwer. — Мій багаж важкий.
> note: ein Stück Gepäck, zwei Koffer. Не «Gepäcke».

> [!word] der Reisepass
> ipa: /ˈʁaɪ̯zəˌpas/ · pos: noun · level: A2 · id: de-a2-reisen-w29
> uk: закордонний паспорт
> forms: die Reisepässe
> example: Bitte zeigen Sie Ihren **Reisepass**. — Покажіть, будь ласка, ваш паспорт.
> note: скорочено: Pass. Для країн ЄС — також Personalausweis.

> [!word] die Fahrt
> ipa: /faːɐ̯t/ · pos: noun · level: A2 · id: de-a2-reisen-w30
> uk: поїздка; їзда
> forms: die Fahrten
> example: Die **Fahrt** dauert drei Stunden. — Поїздка триває три години.
> note: Gute Fahrt! = Щасливої дороги! Від fahren (carded).

> [!word] der Zugbegleiter
> ipa: /ˈtsuːkbəˌɡlaɪ̯tɐ/ · pos: noun · level: A2 · id: de-a2-reisen-w31
> uk: провідник; контролер
> forms: die Zugbegleiter
> example: Der **Zugbegleiter** kontrolliert die Fahrkarten. — Провідник перевіряє квитки.
> note: жін. форма: die Zugbegleiterin. Кінцеве g у Zug = [k].

> [!word] das Abteil
> ipa: /apˈtaɪ̯l/ · pos: noun · level: A2 · id: de-a2-reisen-w32
> uk: купе
> forms: die Abteile
> example: Wir sitzen im selben **Abteil**. — Ми сидимо в одному купе.
> note: наголос на -teil.

> [!word] die Klasse
> ipa: /ˈklasə/ · pos: noun · level: A2 · id: de-a2-reisen-w33
> uk: клас
> forms: die Klassen
> example: Ich fahre zweiter **Klasse**. — Я їду другим класом.
> note: erste Klasse / zweite Klasse; у школі — клас (учні).

> [!word] gültig
> ipa: /ˈɡʏltɪç/ · pos: adj · level: A2 · id: de-a2-reisen-w34
> uk: дійсний
> example: Die Fahrkarte ist drei Tage **gültig**. — Квиток дійсний три дні.
> note: -ig = [ɪç]. ü коротке.

> [!word] besetzt
> ipa: /bəˈzɛtst/ · pos: adj · level: A2 · id: de-a2-reisen-w35
> uk: зайнятий
> example: Dieser Platz ist leider **besetzt**. — Це місце, на жаль, зайняте.
> note: протилежне: frei. Partizip від besetzen.

> [!word] das Einzelzimmer
> ipa: /ˈaɪ̯ntsl̩ˌtsɪmɐ/ · pos: noun · level: A2 · id: de-a2-reisen-w36
> uk: одномісний номер
> forms: die Einzelzimmer
> example: Ich möchte ein **Einzelzimmer**. — Я хочу одномісний номер.
> note: einzeln — окремий.

> [!word] das Doppelzimmer
> ipa: /ˈdɔpl̩ˌtsɪmɐ/ · pos: noun · level: A2 · id: de-a2-reisen-w37
> uk: двомісний номер
> forms: die Doppelzimmer
> example: Wir haben ein **Doppelzimmer** gebucht. — Ми забронювали двомісний номер.
> note: pp = [p], подвоєна літера лише на письмі.

> [!word] die Übernachtung
> ipa: /ˌyːbɐˈnaxtʊŋ/ · pos: noun · level: A2 · id: de-a2-reisen-w38
> uk: ночівля
> forms: die Übernachtungen
> example: Eine **Übernachtung** kostet 80 Euro. — Одна ночівля коштує 80 євро.
> note: Übernachtung mit Frühstück — ночівля зі сніданком.

> [!word] übernachten
> ipa: /ˌyːbɐˈnaxtn̩/ · pos: verb · level: A2 · id: de-a2-reisen-w39
> uk: ночувати
> forms: übernachten → übernachtete → hat übernachtet
> example: Wir haben in einer Jugendherberge **übernachtet**. — Ми ночували в молодіжному гостелі.
> note: Partizip без ge-: übernachtet. Наголос на -nach-.

> [!word] die Jugendherberge
> ipa: /ˈjuːɡn̩tˌhɛʁbɛʁɡə/ · pos: noun · level: A2 · id: de-a2-reisen-w40
> uk: молодіжний гостель
> forms: die Jugendherbergen
> example: Die **Jugendherberge** ist günstig. — Молодіжний гостель недорогий.
> note: у Німеччині мережею керує DJH (Deutsches Jugendherbergswerk).

> [!word] die Ferienwohnung
> ipa: /ˈfeːʁi̯ənˌvoːnʊŋ/ · pos: noun · level: A2 · id: de-a2-reisen-w41
> uk: апартаменти для відпустки
> forms: die Ferienwohnungen
> example: Wir mieten eine **Ferienwohnung**. — Ми знімаємо апартаменти для відпустки.
> note: Ferien — канікули (pl.).

> [!word] der Aufenthalt
> ipa: /ˈaʊ̯fʔɛntˌhalt/ · pos: noun · level: A2 · id: de-a2-reisen-w42
> uk: перебування; зупинка
> forms: die Aufenthalte
> example: In Köln haben wir zehn Minuten **Aufenthalt**. — У Кельні в нас десять хвилин стоянки.
> note: у документах: Aufenthaltstitel — дозвіл на проживання.

> [!word] verreisen
> ipa: /fɛɐ̯ˈʁaɪ̯zn̩/ · pos: verb · level: A2 · id: de-a2-reisen-w43
> uk: поїхати у подорож
> forms: verreisen → verreiste → ist verreist
> example: Wir sind im Sommer **verreist**. — Влітку ми їздили у подорож.
> note: Perfekt з sein (рух), але без ge-.

> [!word] das Reisebüro
> ipa: /ˈʁaɪ̯zəbyˌʁoː/ · pos: noun · level: A2 · id: de-a2-reisen-w44
> uk: туристичне агентство
> forms: die Reisebüros
> example: Im **Reisebüro** buchen wir den Urlaub. — У турагентстві ми бронюємо відпустку.
> note: büro: [byˈʁoː], наголос на останньому складі.

> [!word] der Stau
> ipa: /ʃtaʊ̯/ · pos: noun · level: A2 · id: de-a2-reisen-w45
> uk: затор
> forms: die Staus
> example: Auf der Autobahn gibt es einen **Stau**. — На автобані затор.
> note: AT та CH також Stau; im Stau stehen — стояти в заторі.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · speed: slow · id: de-a2-reisen-l01
> audio: Der Zug nach München hat zwanzig Minuten Verspätung.
> - [ ] Der Zug nach München ist ausgefallen.
> - [x] Der Zug nach München hat zwanzig Minuten Verspätung.
> - [ ] Der Zug nach München fährt von Gleis zwanzig ab.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-reisen-l02
> audio: Eine Fahrkarte nach Köln, hin und zurück, bitte.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · speed: slow · id: de-a2-reisen-l03
> audio: Ich habe meinen Anschluss verpasst.

> [!listen] Послухай оголошення. Що змінилося?
> level: A2 · type: answer · speed: slow · id: de-a2-reisen-l04
> audio: Achtung am Gleis fünf! Der Zug nach Berlin fährt heute von Gleis neun ab. Bitte beachten Sie die Änderung.
> - [ ] Потяг запізнюється.
> - [x] Потяг відправляється з іншої колії (9 замість 5).
> - [ ] Потяг скасовано.

> [!listen] Послухай діалог на вокзалі. Який квиток купує жінка?
> level: A2 · type: answer · speed: slow · id: de-a2-reisen-l05
> audio: A: Guten Tag. Ich möchte eine Fahrkarte nach Hamburg.
> audio: B: Einfach oder hin und zurück?
> audio: A: Hin und zurück, bitte. Wann fährt der nächste Zug?
> - [ ] Лише в один бік.
> - [x] До Гамбурга й назад.
> - [ ] Лише назад.

> [!listen] Послухай діалог. Що Пауль забронював?
> level: A2 · type: answer · speed: slow · id: de-a2-reisen-l06
> audio: A: Hallo, Paul! Wie war dein Urlaub?
> audio: B: Super! Wir haben eine Ferienwohnung gebucht und eine Woche in Österreich übernachtet.
> - [x] Апартаменти для відпустки на тиждень.
> - [ ] Номер у готелі на ніч.
> - [ ] Квитки на потяг.

## Вимова

Наголос у складних словах — на **першому** складнику: *Fáhrkarte, Báhnhof, Fáhrplan, Gléisänderung*. Слова на *-ung* мають наголос перед суфіксом: *VerSPÄtung*, *ReserVIErung*. Кінцеве *-g* у *Zug*, *Bahnsteig* читаємо як [k].

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-reisen-s01
> text: Von welchem Gleis fährt der Zug ab?
> ipa: /fɔn ˈvɛlçəm ɡlaɪ̯s fɛːɐ̯t deːɐ̯ tsuːk ap/
> tip: Gleis — gl- + ai [aɪ̯] + s. Zug — кінцеве g = [k]: «цук».
> uk: З якої колії відправляється потяг?

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-reisen-s02
> text: Der Zug hat Verspätung.
> ipa: /deːɐ̯ tsuːk hat fɛɐ̯ˈʃpɛːtʊŋ/
> tip: Verspätung — наголос на -SPÄ-, ä довге [ɛː], sp- = «шп».
> uk: Потяг запізнюється.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-reisen-s03
> text: Ich möchte einen Platz reservieren.
> ipa: /ɪç ˈmœçtə ˈaɪ̯nən plats ʁezɛʁˈviːʁən/
> tip: möchte — ö + ch [ç]. reservieren — наголос -VIE-: «ре-зер-ВІ-рен».
> uk: Я хочу зарезервувати місце.

> [!speak] Скажи вголос
> level: A2 · speed: slow · id: de-a2-reisen-s04
> text: Wo muss ich umsteigen?
> ipa: /voː mʊs ɪç ˈʊmˌʃtaɪ̯ɡn̩/
> tip: umsteigen — наголос на um-, st- = «шт».
> uk: Де мені пересідати?

## Типові помилки українців

> [!pitfall] «Ich habe den Zug verloren» — verpassen, не verlieren
> Українською можна «втратити потяг», «упустити». Німецьке *verlieren* означає «загубити» (ключ, гроші, гру), а потяг, який поїхав без тебе, — *verpassen*: ***Ich habe den Zug verpasst.*** Те саме з пересадкою: *den Anschluss verpassen*.

> [!pitfall] «Der Zug hat ausgefallen», «Der Zug hat abgefahren»
> Дієслова руху й зміни стану беруть *sein*: ***Der Zug ist ausgefallen***, ***Der Zug ist abgefahren***, ***Wir sind angekommen***. Квиток — *haben* (*gekauft*), а потяг сам «їде» й «прибуває».

> [!pitfall] «Einfach» — не «просто»
> На касі *einfach* означає «в один бік»: ***Einfach oder hin und zurück?*** Це не «просто» й не «легко». Туди й назад — *hin und zurück* (CH — *retour*). Квиток називаємо *die Fahrkarte* і кажемо *eine Fahrkarte*, не *ein Fahrkarte*.

> [!pitfall] «Plattform 5», «Ich warte auf Plattform»: Gleis, Bahnsteig
> Номер на табло — це **Gleis** (колія): *Der Zug fährt von Gleis 5 ab.* Сама платформа — *Bahnsteig*; у Швейцарії *Perron*. Слово *Plattform* для залізниці зазвичай не вживають.

## Ситуація: на вокзалі

> [!listen] Послухай розмову біля каси. Що хоче пасажир?
> level: A2 · type: answer · speed: slow · id: de-a2-reisen-l07
> audio: A: Guten Morgen. Ich brauche eine Fahrkarte nach München, bitte.
> audio: B: Einfach oder hin und zurück?
> audio: A: Nur einfach. Und haben Sie auch eine Sitzplatzreservierung?
> audio: B: Ja, das kostet fünf Euro extra. Der Zug fährt von Gleis sieben.
> - [ ] Квиток туди й назад без резервування.
> - [x] Квиток в один бік до Мюнхена з резервуванням.
> - [ ] Лише резервування місця без квитка.

> [!speak] «Мені квиток до Мюнхена, в один бік, будь ласка.»
> level: A2 · speed: slow · id: de-a2-reisen-s05
> text: Ich brauche eine Fahrkarte nach München, einfach, bitte.
> ipa: /ɪç ˈbʁaʊ̯xə ˈaɪ̯nə ˈfaːɐ̯kaʁtə naːx ˈmʏnçn̩ ˈaɪ̯nfax ˈbɪtə/
> tip: München — ü коротке, ch = [ç]. einfach — ch = [x] після a.
> uk: Мені квиток до Мюнхена, в один бік, будь ласка.

> [!speak] «Потяг запізнюється. Я не встиг на пересадку.»
> level: A2 · speed: slow · id: de-a2-reisen-s06
> text: Der Zug hat Verspätung. Ich habe meinen Anschluss verpasst.
> ipa: /deːɐ̯ tsuːk hat fɛɐ̯ˈʃpɛːtʊŋ ɪç ˈhaːbə ˈmaɪ̯nən ˈanʃlʊs fɛɐ̯ˈpast/
> tip: Anschluss — ss [s], u коротке. verpasst — наголос на -PASST.
> uk: Потяг запізнюється. Я не встиг на пересадку.

## Landeskunde: Pünktlichkeit der Bahn

Die Deutsche Bahn ist für viele Menschen wichtig, aber nicht immer pünktlich. Im Jahr 2025 waren im Fernverkehr nur 60,1 Prozent der Züge pünktlich, ein Jahr davor 62,5 Prozent. Als pünktlich gilt bei der Bahn ein Zug, der weniger als sechs Minuten zu spät kommt. Im Regionalverkehr ist die Lage besser: 88,7 Prozent der Züge waren 2025 pünktlich. Viele Reisende kaufen das Deutschlandticket. Es kostet seit Januar 2026 63 Euro im Monat und gilt für Busse und Regionalzüge in ganz Deutschland, aber nicht für ICE und IC. In Österreich fahren die ÖBB, in der Schweiz die SBB.

> [!quiz] Wie viel Prozent der Fernverkehrszüge waren 2025 pünktlich?
> level: A2 · type: single · id: de-a2-reisen-q02
> - [ ] 88,7 Prozent.
> - [ ] 62,5 Prozent.
> - [x] 60,1 Prozent.
> - [ ] 63 Prozent.
>
> **Пояснення:** у тексті: *im Fernverkehr nur 60,1 Prozent*. 62,5 % — це 2024 рік, 88,7 % — регіональний рух, 63 — ціна Deutschlandticket.

> [!quiz] Wo gilt das Deutschlandticket?
> level: A2 · type: multi · id: de-a2-reisen-q03
> - [x] In Bussen
> - [x] In Regionalzügen
> - [ ] Im ICE
> - [ ] Im IC
>
> **Пояснення:** *gilt für Busse und Regionalzüge … aber nicht für ICE und IC*.

> [!quiz] Wie viele Minuten Verspätung sind bei der Bahn noch „pünktlich“?
> level: A2 · type: single · id: de-a2-reisen-q04
> - [ ] Bis zu drei Minuten.
> - [x] Weniger als sechs Minuten.
> - [ ] Bis zu fünfzehn Minuten.
> - [ ] Gar keine Verspätung.
>
> **Пояснення:** *Als pünktlich gilt … ein Zug, der weniger als sechs Minuten zu spät kommt.*

## Практика

> [!quiz] Яке речення правильне?
> level: A2 · type: multi · id: de-a2-reisen-q05
> - [x] Der Zug ist ausgefallen.
> - [x] Ich habe meinen Anschluss verpasst.
> - [ ] Der Zug hat ausgefallen.
> - [ ] Ich habe den Zug verloren.
>
> **Пояснення:** *ausfallen* — з *sein*; потяг, який ти не встиг, — *verpassen*, а не *verlieren*.

> [!quiz] Заповни пропуск: «Die Fahrkarte ist drei Tage ___.»
> level: A2 · type: single · id: de-a2-reisen-q06
> - [ ] besetzt
> - [x] gültig
> - [ ] frei
> - [ ] einfach
>
> **Пояснення:** про термін дії — *gültig*. *Besetzt* — про зайняте місце, *frei* — про вільне.

> [!quiz] Заповни пропуски: на вокзалі
> level: A2 · type: fill · bank: Abteil, gebuchen · id: de-a2-reisen-q07
>
> ```text fill
> Der Zug fährt von [[Gleis]] 5 ab.
> Ich habe ein Hotelzimmer [[gebucht]].
> Der Zug hat 15 Minuten [[Verspätung]].
> Wir müssen in Köln [[umsteigen]].
> ```
>
> **Пояснення:** *Gleis* (з номером), *gebucht* (Partizip від *buchen*), *Verspätung haben*, *umsteigen*. *Gebuchen* — типова помилка; *Abteil* — купе, не колія.

> [!quiz] Заповни пропуски: розмова біля каси
> level: A2 · type: fill · bank: auf, aus · id: de-a2-reisen-q08
>
> ```text fill
> A: Eine Fahrkarte nach Köln, bitte.
> B: Einfach oder [[hin]] und [[zurück]]?
> A: Hin und zurück. Wann fährt der nächste Zug [[ab]]?
> ```
>
> **Пояснення:** сталий вираз *hin und zurück*, відокремлюване *abfahren*: *fährt … ab*. Прийменники *auf* і *aus* до цього виразу не підходять.

> [!quiz] Заповни пропуски: Perfekt
> level: A2 · type: fill · bank: haben, hat · id: de-a2-reisen-q09
>
> ```text fill
> Der Zug [[ist]] abgefahren.
> Wir [[sind]] um sechs Uhr angekommen.
> Ich [[habe]] einen Platz reserviert.
> ```
>
> **Пояснення:** *abfahren* і *ankommen* — рух → *sein*; *reservieren* → *haben*. Форми *haben* і *hat* з дієсловами руху не вживаємо.

> [!quiz] Склади речення: «Потяг запізнюється на двадцять хвилин»
> level: A2 · type: order · id: de-a2-reisen-q10
>
> ```text order
> Der Zug
> hat
> zwanzig Minuten
> Verspätung.
> ist ✗
> ```
>
> **Пояснення:** *Verspätung haben* — «запізнюватися» (про транспорт), тож *hat*, а не *ist*.

> [!quiz] Склади питання: «Де мені пересідати?»
> level: A2 · type: order · id: de-a2-reisen-q11
>
> ```text order
> Wo
> muss
> ich
> umsteigen?
> steigen um ✗
> ```
>
> **Пояснення:** модальне дієслово на 2-му місці, відокремлюване дієслово — в інфінітиві цілим словом у кінці: *umsteigen*.

> [!quiz] Склади речення: «Ми забронювали двомісний номер на дві ночі»
> level: A2 · type: order · id: de-a2-reisen-q12
>
> ```text order
> Wir
> haben
> ein Doppelzimmer
> für zwei Nächte
> gebucht.
> gebuchen ✗
> ```
>
> **Пояснення:** *buchen* — слабке дієслово, Partizip *gebucht*. Форма *gebuchen* — помилка.

## Фішки

> [!reel] 🎫 Від «Neun-Euro-Ticket» до Deutschlandticket
> Влітку 2022 року уряд запропонував Neun-Euro-Ticket для місцевого транспорту: його продали 52 мільйони разів. Із цього проєкту виріс Deutschlandticket: з 2023 року, зараз — 63 € на місяць (з січня 2026), як пише Bundesregierung.

> [!reel] ⏱️ Чому 5 хвилин 59 секунд — «пунктуально»
> У статистиці Deutsche Bahn потяг уважають пунктуальним, якщо запізнення менше шести хвилин. Тому в німецькому розкладі «пунктуальний» не завжди означає «хвилина в хвилину».

> [!reel] 🇨🇭 Perron, Billett, retour
> У Швейцарії платформа — *das Perron*, квиток — *das Billett*, а «туди й назад» — *retour*. Ці слова запозичені з французької. Розуміти їх корисно, якщо їдеш у Цюрих чи Базель.

## Джерела та що почитати

- [Bundesregierung — Deutschlandticket: Fragen und Antworten](https://www.bundesregierung.de/breg-de/aktuelles/deutschlandticket-2134074) — ціна, де діє, історія.
- [LOK Report — DB: Jahrespünktlichkeit 2025](https://www.lok-report.de/news/deutschland/verkehr/64233-deutsche-bahn-jahrespuenktlichkeit-60-1-prozent-im-fernverkehr-88-7-prozent-im-regionalverkehr.html) — 60,1 % і 88,7 % за 2025 рік.
- [Statista — Pünktlichkeit der Bahn](https://de.statista.com/infografik/17925/puenktlichkeit-der-bahn/) — як DB рахує пунктуальність.
- [DWDS — Verspätung](https://www.dwds.de/wb/Versp%C3%A4tung) — значення.
- [DWDS — Gleis](https://www.dwds.de/wb/Gleis) — значення, приклади.
- [DB Navigator](https://www.bahn.de) — маршрути, розклад, квитки.
- Goethe-Institut — сторінка іспиту *Goethe-Zertifikat A2* на goethe.de: тематика «Reisen und Verkehr».

> [!important] Підсумок
> - Квиток: *eine Fahrkarte nach … (einfach / hin und zurück)*; колія — *Gleis*; затримка — *Verspätung haben*; пересадка — *umsteigen / Anschluss*.
> - Потяг, який ти не встиг: *verpassen*. Скасовано: *ist ausgefallen*.
> - Житло: *Einzelzimmer, Doppelzimmer, Ferienwohnung, Jugendherberge* — *buchen* і *übernachten*.
> - Deutschlandticket: 63 € на місяць (з 1.1.2026), діє в Nahverkehr, не в ICE/IC.
> - Пунктуальність DB 2025: Fernverkehr 60,1 %, Regionalverkehr 88,7 %.
