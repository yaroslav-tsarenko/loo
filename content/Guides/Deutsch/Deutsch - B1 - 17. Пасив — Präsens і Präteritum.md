---
title: Пасив — Präsens і Präteritum
id: de-b1-passiv
level: B1
icon: px:gear
tags: [deutsch, b1, grammar, passiv, werden, partizip2]
prerequisites: ["[[Deutsch - A2 - 01. Perfekt — haben чи sein і Partizip II]]", "[[Deutsch - A2 - 22. Майбутнє — werden і Präsens]]"]
estimatedMinutes: 45
---

# Пасив — Präsens і Präteritum

> [!success] Після цієї теми ти зможеш
> - утворити пасив у Präsens і Präteritum: *Das Haus wird gebaut. Das Haus wurde gebaut.*;
> - перетворити активне речення на пасивне й назвати виконавця через *von + Dativ*;
> - прочитати й написати правила та інструкції: *Hier wird nicht geraucht.*;
> - розрізнити процес (*wird geöffnet*) і результат (*ist geöffnet*).

## Передбач

> [!quiz] Як сказати: «Тут не палять» (правило)?
> level: B1 · type: single · id: de-b1-passiv-q01
> - [ ] Hier ist nicht geraucht.
> - [x] Hier wird nicht geraucht.
> - [ ] Hier wird nicht rauchen.
> - [ ] Hier werden nicht geraucht.
>
> **Пояснення:** пасив = форма *werden* + Partizip II. Виконавця немає, підмета теж, тому *wird* (3-тя особа однини) і *geraucht* в кінці. *ist geraucht* описувало б результат, а не дію.

## Навіщо пасив

В активному реченні важливо, **хто** діє: *Der Koch kocht die Suppe.* У пасивному акцент іде на **дію або результат**, а виконавець неважливий, невідомий чи очевидний: *Die Suppe wird gekocht.* Пасив природний у:

- **процесах** і інструкціях: *Zuerst wird der Teig gemacht.*
- **правилах** і оголошеннях: *Hier wird nicht geraucht. Das Fenster darf nicht geöffnet werden.* (модальне дієслово + Partizip II + *werden*; докладно — B2-02)
- **новинах**: *Der Mann wurde gestern festgenommen.*
- **описі подій минулого**: *Die Brücke wurde 1998 gebaut.*

Українською ми маємо схожі форми («будинок будується», «двері зачиняються», «тут не палять»). Основний пасив німецька утворює через **werden**.

## Утворення: werden + Partizip II

| Особа | Präsens | Präteritum |
|---|---|---|
| ich | werde gefragt | wurde gefragt |
| du | wirst gefragt | wurdest gefragt |
| er / sie / es | **wird** gefragt | **wurde** gefragt |
| wir | werden gefragt | wurden gefragt |
| ihr | werdet gefragt | wurdet gefragt |
| sie / Sie | **werden** gefragt | **wurden** gefragt |

На практиці найчастіше трапляються дві форми: *wird / wurde* (однина) і *werden / wurden* (множина):

- Das Haus **wird** gebaut. — Die Häuser **werden** gebaut.
- Das Haus **wurde** gebaut. — Die Häuser **wurden** gebaut.

Partizip II утворюється як у Perfekt (A2-01): *machen → gemacht, einladen → eingeladen, besuchen → besucht, abholen → abgeholt*. У пасиві він стоїть **у кінці речення**; у підрядному — перед *wird*: *…, weil das Haus renoviert wird.*

> [!diagram] З активного речення в пасивне
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "підмет (хто робить)", text: "Der Koch", tone: mint }
>   - { id: verb, label: "дієслово", text: "kocht", tone: orange }
>   - { id: obj, label: "решта / Partizip", text: "die Suppe", tone: gray }
> steps:
>   - { focus: [subj, verb, obj], note: "Активне речення: Der Koch kocht die Suppe." }
>   - { set: { subj: "Die Suppe", verb: "wird", obj: "gekocht" }, focus: [subj, verb, obj], note: "Додаток у Akkusativ (die Suppe) стає підметом у Nominativ. Дієслово розпадається: wird (друге місце) + Partizip II (gekocht, в кінці)." }
>   - { set: { subj: "Die Suppe", verb: "wird", obj: "vom Koch gekocht" }, focus: obj, note: "Колишній підмет, якщо він потрібен, стає додатком: von + Dativ → vom Koch (von dem). Часто його взагалі не називають." }
>   - { set: { subj: "Die Suppe", verb: "wurde", obj: "gekocht" }, focus: verb, note: "Минуле: wird → wurde. Partizip II той самий. Die Suppe wurde gekocht." }
> ```

## Виконавець: von + Dativ

Якщо хочемо назвати виконавця, ставимо його з **von + Dativ**: *Das Bild wurde **von einem Schüler** gemalt.* З відмінками: *von dem Lehrer → vom Lehrer*, *von der Ärztin*, *von den Kindern*. Прийменник **durch + Akkusativ** вказує на засіб або причину: *Das Haus wurde **durch einen Brand** zerstört.* Загалом виконавця називають рідко: лише коли він справді важливий (*Der Roman wurde von Thomas Mann geschrieben*).

## Пасив без підмета і з Dativ

Не кожне речення має підмет. Іноді дія важлива сама по собі:

- *Heute wird gefeiert.* — Сьогодні святкують.
- *Hier wird nicht geraucht.* — Тут не палять.
- *Hier wird Deutsch gesprochen.* — Тут говорять німецькою. Тут підмет є: *Deutsch* (в активі це був би Akkusativ: *Man spricht Deutsch*).

Якщо дієслово керує **Dativ** (*helfen, danken, gratulieren*), додаток **залишається в Dativ**, а дієслово — в формі *wird*: *Mir wird geholfen.* («Мені допомагають»), а не ~~Ich werde geholfen~~. Так само: *Dem Kind wurde geholfen.*

## Man чи пасив?

Розмовна німецька часто воліє *man* (активне безособове): *Man spricht hier Deutsch.* Пасив (*Hier wird Deutsch gesprochen.*) звучить трохи офіційніше й частіше в письмових текстах. Обидва варіанти правильні.

## Процес чи результат: wird / ist

*werden* + Partizip II описує **процес**: *Die Tür **wird** geöffnet.* — «Двері відчиняють». Для **результату** (стану) використовують *sein* + Partizip II: *Die Tür **ist** geöffnet.* — «Двері відчинені». Це окрема конструкція (Zustandspassiv); докладніше — у темі B2-02. Поки що памʼятай різницю: *wird* — дія, *ist* — те, що вже зроблено.

## Приклади

- Die Pakete werden jeden Morgen geliefert. — Посилки доставляють щоранку.
- Das Museum wurde letztes Jahr renoviert. — Музей відремонтували минулого року.
- Hier wird nicht geraucht. — Тут не палять.
- In Deutschland wird viel Brot gegessen. — У Німеччині їдять багато хліба.
- Das Fenster wurde von den Kindern kaputtgemacht. — Вікно розбили діти.
- Der Termin wurde auf Montag verschoben. — Термін перенесли на понеділок.
- Wie wird das Wort geschrieben? — Як пишеться це слово?
- Mir wurde gestern im Büro sehr geholfen. — Мені вчора в офісі дуже допомогли.
- Ich weiß, dass das Auto morgen repariert wird. — Я знаю, що машину завтра полагодять.
- Das Rauchverbot wird kontrolliert. — За дотриманням заборони куріння стежать.

## Слова

> [!word] der Vorgang
> ipa: /ˈfoːɐ̯ɡaŋ/ · pos: noun · level: B2 · id: de-b1-passiv-w01
> uk: процес; подія; (в установі) справа
> forms: die Vorgänge
> example: Der **Vorgang** dauert etwa zehn Minuten. — Процес триває приблизно десять хвилин.
> note: das Vorgangspassiv — пасив-процес (wird gemacht), на відміну від Zustandspassiv (ist gemacht).

> [!word] herstellen
> ipa: /ˈheːɐ̯ʃtɛlən/ · pos: verb · level: B2 · id: de-b1-passiv-w02
> uk: виробляти; виготовляти
> forms: stellt her → stellte her → hat hergestellt
> example: Das Gerät **wird** in Deutschland **hergestellt**. — Цей прилад виробляють у Німеччині.
> note: відокремлюване; іменник — die Herstellung, der Hersteller.

> [!word] das Verbot
> ipa: /fɛɐ̯ˈboːt/ · pos: noun · level: B2 · id: de-b1-passiv-w03
> uk: заборона
> forms: die Verbote
> example: Das **Verbot** gilt seit dem ersten Januar. — Заборона діє з першого січня.
> note: verbieten — забороняти. Складені: das Rauchverbot, das Parkverbot.

> [!word] die Vorschrift
> ipa: /ˈfoːɐ̯ʃʁɪft/ · pos: noun · level: B2 · id: de-b1-passiv-w04
> uk: припис; правило; інструкція
> forms: die Vorschriften
> example: Diese **Vorschrift** muss man beachten. — Цього припису треба дотримуватися.
> note: die Sicherheitsvorschrift, die Dienstvorschrift. Наголос на першому складі: «фор-шріфт».

> [!word] genehmigen
> ipa: /ɡəˈneːmɪɡn̩/ · pos: verb · level: B2 · id: de-b1-passiv-w05
> uk: дозволяти; затверджувати (офіційно)
> forms: genehmigt → genehmigte → hat genehmigt
> example: Der Antrag **wurde** schnell **genehmigt**. — Заяву схвалили швидко.
> note: іменник — die Genehmigung (офіційний дозвіл); див. також B1-26.

> [!word] renovieren
> ipa: /ʁenoˈviːʁən/ · pos: verb · level: B2 · id: de-b1-passiv-w06
> uk: ремонтувати (оновлювати приміщення)
> forms: renoviert → renovierte → hat renoviert
> example: Die Wohnung **wird** gerade **renoviert**. — Квартиру зараз ремонтують.
> note: -ieren: Partizip II без ge-; renoviert, не ~~gerenoviert~~. Іменник — die Renovierung.

> [!word] die Maßnahme
> ipa: /ˈmaːsnaːmə/ · pos: noun · level: B2 · id: de-b1-passiv-w07
> uk: захід; заходи
> forms: die Maßnahmen
> example: Neue **Maßnahmen** wurden beschlossen. — Ухвалили нові заходи.
> note: ß після довгого [aː] — звук [s]; Maßnahmen ergreifen — вживати заходів.

> [!word] durchführen
> ipa: /ˈdʊʁçfyːʁən/ · pos: verb · level: B2 · id: de-b1-passiv-w08
> uk: проводити; здійснювати
> forms: führt durch → führte durch → hat durchgeführt
> example: Die Prüfung **wird** im Mai **durchgeführt**. — Іспит проведуть у травні.
> note: відокремлюване: Partizip II durchgeführt.

> [!word] einführen
> ipa: /ˈaɪ̯nfyːʁən/ · pos: verb · level: B2 · id: de-b1-passiv-w09
> uk: запроваджувати; вводити
> forms: führt ein → führte ein → hat eingeführt
> example: Das neue System **wurde** letztes Jahr **eingeführt**. — Нову систему запровадили торік.
> note: також «імпортувати» (товар) і «вводити когось у справу».

> [!word] abschaffen
> ipa: /ˈapʃafn̩/ · pos: verb · level: B2 · id: de-b1-passiv-w10
> uk: скасовувати; ліквідовувати
> forms: schafft ab → schaffte ab → hat abgeschafft
> example: Die Gebühr **wurde** **abgeschafft**. — Збір скасували.
> note: sch = «ш»; ab- — відокремлюваний префікс: schafft … ab.

> [!word] beschädigen
> ipa: /bəˈʃɛːdɪɡn̩/ · pos: verb · level: B2 · id: de-b1-passiv-w11
> uk: пошкоджувати
> forms: beschädigt → beschädigte → hat beschädigt
> example: Das Auto **wurde** beim Parken **beschädigt**. — Автомобіль пошкодили під час паркування.
> note: ä довге [ɛː]; іменник — der Schaden, die Beschädigung.

> [!word] zerstören
> ipa: /tsɛɐ̯ˈʃtøːʁən/ · pos: verb · level: B2 · id: de-b1-passiv-w12
> uk: руйнувати; знищувати
> forms: zerstört → zerstörte → hat zerstört
> example: Das Gebäude **wurde** im Krieg **zerstört**. — Будівлю зруйнували під час війни.
> note: ö довге: губи для «о», язик для «е».

> [!word] liefern
> ipa: /ˈliːfɐn/ · pos: verb · level: B1 · id: de-b1-passiv-w13
> uk: постачати; доставляти
> forms: liefert → lieferte → hat geliefert
> example: Die Ware **wird** morgen **geliefert**. — Товар доставлять завтра.
> note: іменник — die Lieferung; ie = довге [iː].

> [!word] erledigen
> ipa: /ɛɐ̯ˈleːdɪɡn̩/ · pos: verb · level: B1 · id: de-b1-passiv-w14
> uk: виконувати; справлятися (зі справою)
> forms: erledigt → erledigte → hat erledigt
> example: Die Aufgabe **wurde** schnell **erledigt**. — Завдання швидко виконали.
> note: розм. Das ist erledigt — це вже зроблено / з цим покінчено.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-passiv-l01
> audio: Das Paket wird morgen geliefert.
> - [ ] Das Paket wurde gestern geliefert.
> - [x] Das Paket wird morgen geliefert.
> - [ ] Das Paket liefert morgen.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-passiv-l02
> audio: Die Brücke wurde 1998 gebaut.
> - [ ] Die Brücke wird 1998 gebaut.
> - [ ] Die Brücke war 1998 gebaut.
> - [x] Die Brücke wurde 1998 gebaut.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-passiv-l03
> audio: Hier wird nicht geraucht.
> explain: wird — 3-тя особа однини, geraucht стоїть у кінці. Підмета в реченні немає.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-passiv-l04
> audio: Die Wohnung wurde letztes Jahr renoviert.
> explain: renoviert — Partizip II без ge- (дієслово на -ieren).

> [!listen] Послухай оголошення. Що відбувається з вікнами?
> level: B1 · type: answer · id: de-b1-passiv-l05
> audio: A: Achtung, liebe Mieter! Am Dienstag werden die Fenster im Haus erneuert. Die Arbeiten werden von neun bis siebzehn Uhr durchgeführt. Bitte räumen Sie die Fensterbänke frei.
> - [ ] Вікна вимиють у вівторок.
> - [x] Вікна замінять у вівторок, роботи тривають з девʼятої до сімнадцятої.
> - [ ] Вікна вже замінили, мешканці можуть ставити квіти.
>
> **Пояснення:** *werden … erneuert* — Präsens-пасив зі значенням майбутнього: «будуть замінені». *Die Arbeiten werden durchgeführt* — «роботи проводяться».

## Вимова

У пасивних конструкціях наголос падає на Partizip II і на дієслово-основу: ge**baut**, ge**lie**fert, reno**viert** (наголос на -viert), але **ab**geholt (на префіксі). Форми *wird* [vɪʁt] і *wurde* [ˈvʊʁdə] різняться голосними: короткий [ɪ] і короткий [ʊ].

> [!speak] Скажи вголос
> level: B1 · id: de-b1-passiv-s01
> text: Das Haus wird gebaut.
> ipa: /das haʊ̯s vɪʁt ɡəˈbaʊ̯t/
> tip: wird — [vɪʁt]: коротке [ɪ], кінцеве d = [t]. gebaut — наголос на -baut.
> uk: Будинок будується.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-passiv-s02
> text: Das Museum wurde letztes Jahr renoviert.
> ipa: /das muˈzeːʊm ˈvʊʁdə ˈlɛtstəs jaːɐ̯ ʁenoˈviːɐ̯t/
> tip: wurde — короткий [ʊ], «вурде». renoviert — наголос на -viert, v = [v].
> uk: Музей відремонтували минулого року.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-passiv-s03
> text: Hier wird nicht geraucht.
> ipa: /hiːɐ̯ vɪʁt nɪçt ɡəˈʁaʊ̯xt/
> tip: hier — довге [iː] і видих h. nicht — [ç] «хь». geraucht — ch після au = [x] «х».
> uk: Тут не палять.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-passiv-s04
> text: Die Pakete werden jeden Morgen geliefert.
> ipa: /diː paˈkeːtə ˈveːɐ̯dn̩ ˈjeːdn̩ ˈmɔʁɡn̩ ɡəˈliːfɐt/
> tip: werden — довге [eː]; кінцеве -en майже не вимовляється. geliefert — ie = довге [iː].
> uk: Посилки доставляють щоранку.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-passiv-s05
> text: Mir wurde gestern sehr geholfen.
> ipa: /miːɐ̯ ˈvʊʁdə ˈɡɛstɐn zeːɐ̯ ɡəˈhɔlfn̩/
> tip: mir — довге [iː]. geholfen — h у -hol- — легкий видих, кінцеве -en майже не звучить.
> uk: Мені вчора дуже допомогли.

## Типові помилки українців

> [!pitfall] Passiv і Futur: *werden* + Partizip II ≠ *werden* + Infinitiv
> *werden* вживається в двох різних конструкціях. З **Partizip II** це пасив: *Ich werde gefragt* — «мене питають». З **Infinitiv** це Futur I: *Ich werde fragen* — «я питатиму». Тож *Das Essen wird gekocht* — «їжу готують / вона готується» (з часовим словом пасив у Präsens часто має значення майбутнього: *Das wird morgen gemacht* — «це буде зроблено завтра»). Futur — лише з Infinitiv: *Ich werde kochen*.

> [!pitfall] «Ich werde geholfen» і «Er wird geholfen»
> Дієслова з **Dativ** (*helfen, danken, gratulieren, antworten*) не роблять Dativ-додаток підметом. Правильно: *Mir wird geholfen. Ihm wird gedankt.* Українське «мені допомагають» — теж у давальному, тож цього разу рідна мова підказує правильно.

> [!pitfall] von + Akkusativ замість von + Dativ
> Виконавця після *von* ставимо в Dativ: *von einem Architekten, von der Lehrerin, von den Kindern*. Помилка *~~von einen Architekten~~* виникає за аналогією з прийменниками, що вимагають Akkusativ (*für einen, durch einen*). Для засобу чи причини — *durch* + Akkusativ: *durch einen Unfall*.

> [!pitfall] wird gebaut ≠ ist gebaut
> «Будинок збудований» (результат) і «будинок будується» (процес) — різні речення: *Das Haus **ist** gebaut* — він уже стоїть; *Das Haus **wird** gebaut* — його будують зараз. Не пиши *ist* там, де говориш про процес або правило: ~~Hier ist nicht geraucht~~ → *Hier wird nicht geraucht.*

## Практика

> [!quiz] Яка форма пропущена: «Das Haus ___ 1950 gebaut.»
> level: B1 · type: single · id: de-b1-passiv-q02
> - [ ] wird
> - [x] wurde
> - [ ] wurden
> - [ ] werden
>
> **Пояснення:** рік у минулому → Präteritum, а підмет *das Haus* — однина: **wurde**. *wurden* — множина; *wird / werden* — Präsens.

> [!quiz] Яка форма пропущена: «Die Häuser ___ jedes Jahr renoviert.»
> level: B1 · type: single · id: de-b1-passiv-q03
> - [ ] wird
> - [x] werden
> - [ ] wurde
> - [ ] werdet
>
> **Пояснення:** *die Häuser* — множина, *jedes Jahr* — звичка у теперішньому → **werden**. *wird* — для однини, *werdet* — для *ihr*.

> [!quiz] Які речення стоять у пасиві?
> level: B1 · type: multi · id: de-b1-passiv-q04
> - [x] Das Paket wird morgen geliefert.
> - [x] Die Brücke wurde 1998 gebaut.
> - [ ] Er wird morgen kommen.
> - [ ] Es wird kalt.
>
> **Пояснення:** пасив = *werden* + Partizip II. У *Er wird kommen* — Futur I (*werden* + Infinitiv), у *Es wird kalt* — *werden* як повноцінне дієслово «ставати».

> [!quiz] Заповни пропуски формами werden
> level: B1 · type: fill · bank: ist, wirst · id: de-b1-passiv-q05
>
> ```text fill
> Hier [[wird]] Deutsch gesprochen.
> Die Wohnung [[wurde]] letztes Jahr renoviert.
> Die Kinder [[werden]] jeden Tag von der Oma abgeholt.
> ```
>
> **Пояснення:** *Deutsch* — підмет, однина → **wird**; *letztes Jahr* → Präteritum **wurde**; *die Kinder* — множина, *jeden Tag* → **werden**. *ist* дав би стан, *wirst* — для *du*.

> [!quiz] Склади речення: «Ратушу збудували 1900 року.»
> level: B1 · type: order · id: de-b1-passiv-q06
>
> ```text order
> Das
> Rathaus
> wurde
> im
> Jahr
> 1900
> gebaut.
> geworden ✗
> ```
>
> **Пояснення:** *wurde* стоїть на другому місці, Partizip II *gebaut* — в кінці. *geworden* — Partizip II від *werden* («ставати»), у простому пасиві він не потрібен.

> [!quiz] Склади речення: «Тут не палять.»
> level: B1 · type: order · id: de-b1-passiv-q07
>
> ```text order
> Hier
> wird
> nicht
> geraucht.
> man ✗
> ```
>
> **Пояснення:** безособовий пасив: *wird* на другому місці, *nicht* перед Partizip II. *man* належить до активної конструкції (*Man raucht hier nicht*), в одному реченні їх не поєднують.

> [!quiz] «Книгу написав відомий автор.» Як це в пасиві?
> level: B1 · type: single · id: de-b1-passiv-q08
> - [ ] Das Buch wurde von einen bekannten Autor geschrieben.
> - [x] Das Buch wurde von einem bekannten Autor geschrieben.
> - [ ] Das Buch wurde durch einem bekannten Autor geschrieben.
> - [ ] Das Buch wurde für einen bekannten Autor geschrieben.
>
> **Пояснення:** виконавця-людину вводимо через **von + Dativ**: *von einem … Autor*. *durch* вимагає Akkusativ і вживається для засобу чи причини; *für* означає «для».

> [!quiz] Як сказати: «Йому допомогли»?
> level: B1 · type: single · id: de-b1-passiv-q09
> - [ ] Er wurde geholfen.
> - [x] Ihm wurde geholfen.
> - [ ] Ihn wurde geholfen.
> - [ ] Ihm werden geholfen.
>
> **Пояснення:** *helfen* + Dativ. У пасиві Dativ-додаток **лишається Dativ** (*ihm*), а дієслово стоїть у 3-й особі однини (*wurde*), бо підмета немає.

> [!quiz] Перетвори на пасив у Präsens: «Der Koch bereitet das Essen zu.»
> level: B1 · type: single · id: de-b1-passiv-q10
> - [ ] Das Essen wurde vom Koch zubereitet.
> - [ ] Das Essen wird zubereiten vom Koch.
> - [x] Das Essen wird vom Koch zubereitet.
> - [ ] Der Koch wird das Essen zubereitet.
>
> **Пояснення:** *das Essen* (Akkusativ) стає підметом, *der Koch* — додатком *vom Koch*, Partizip II *zubereitet* стоїть у кінці. *wurde* — це Präteritum, а завдання вимагає Präsens.

> [!quiz] Склади речення: «Я залишаюся вдома, бо квартиру ремонтують.»
> level: B1 · type: order · id: de-b1-passiv-q11
>
> ```text order
> Ich
> bleibe
> zu
> Hause,
> weil
> die
> Wohnung
> renoviert
> wird.
> ist ✗
> ```
>
> **Пояснення:** у підрядному реченні з *weil* Partizip II і *wird* стоять у кінці: *renoviert wird*. *ist* описував би стан («відремонтована»), а не процес.

> [!quiz] Перепиши з *man* на пасив
> level: B1 · type: fill · id: de-b1-passiv-q12
>
> ```text fill
> Man spricht hier Deutsch. = Hier [[wird]] Deutsch [[gesprochen]].
> Die Firma liefert die Ware. = Die Ware [[wird]] von der Firma [[geliefert]].
> ```
>
> **Пояснення:** обʼєкт активного речення стає підметом; дієслово → *wird* + Partizip II. У другому реченні виконавець — *von der Firma*.

> [!quiz] На дверях висить табличка: двері вже закриті. Що сказати?
> level: B1 · type: single · id: de-b1-passiv-q13
> - [x] Die Tür ist geschlossen.
> - [ ] Die Tür wird geschlossen.
> - [ ] Die Tür wurde schließen.
> - [ ] Die Tür geschlossen wird.
>
> **Пояснення:** *ist geschlossen* — результат (стан). *wird geschlossen* означає, що двері зачиняють просто зараз.

> [!quiz] Які речення правильні?
> level: B1 · type: multi · id: de-b1-passiv-q14
> - [x] Es wird viel gelacht.
> - [x] Mir wurde das Buch geschenkt.
> - [ ] Ich wurde geholfen.
> - [ ] Das Buch wurde mir geschenken.
>
> **Пояснення:** *Es wird viel gelacht* — безособовий пасив. *Mir wurde das Buch geschenkt* — підмет *das Buch*, Dativ *mir*. Помилки: *Ich wurde geholfen* (helfen + Dativ → *Mir wurde geholfen*), *geschenken* (Partizip II — *geschenkt*).

> [!quiz] Яка правильна форма: «Wir ___ zur Party ___.»
> level: B1 · type: single · id: de-b1-passiv-q15
> - [ ] wurden … geeinladen
> - [x] wurden … eingeladen
> - [ ] wurden … einladen
> - [ ] wurden … eingeladet
>
> **Пояснення:** *einladen* — відокремлюване сильне дієслово: *ein* + *ge* + *laden* = **eingeladen** (ge- стоїть між префіксом і коренем). *geeinladen* і *eingeladet* — помилки; *einladen* — інфінітив.

> [!quiz] Яким прийменником зазвичай вводимо виконавця-людину?
> level: B1 · type: single · id: de-b1-passiv-q16
> - [x] von (+ Dativ)
> - [ ] bei (+ Dativ)
> - [ ] mit (+ Dativ)
> - [ ] zu (+ Dativ)
>
> **Пояснення:** *von + Dativ* — стандартний виконавець у пасиві (*von dem Lehrer*). Українське орудне «вчителем» не має відповідника. *durch* вживають для засобу, причини чи посередника.

> [!quiz] Як сказати: «У Німеччині пʼють багато пива»?
> level: B1 · type: single · id: de-b1-passiv-q17
> - [ ] In Deutschland wird viel Bier trinken.
> - [ ] In Deutschland werden viel Bier getrunken.
> - [x] In Deutschland wird viel Bier getrunken.
> - [ ] In Deutschland wird viel Bier getrunkt.
>
> **Пояснення:** *Bier* — однина, тому *wird*; *trinken* — сильне дієслово, Partizip II **getrunken**, а не ~~getrunkt~~.

> [!quiz] Яка форма пропущена: «Die Briefe ___ gestern geschickt.»
> level: B1 · type: single · id: de-b1-passiv-q18
> - [ ] wurde
> - [x] wurden
> - [ ] wird
> - [ ] werden
>
> **Пояснення:** *gestern* → Präteritum; *die Briefe* — множина → **wurden**.

## Фішки

> [!reel] 🧩 «es» — заповнювач першого місця
> Пасив без підмета часто починається з *es*: *Es wird getanzt* — «танцюють». Це *es* — не підмет, а заповнювач першого місця, воно зникає, коли вперед виходить інший елемент: *Heute wird getanzt.* Так у пасиві проявляється правило V2: у головному реченні дієслово стоїть на другому місці.

> [!reel] 🚭 Німецька любов до правил
> Написи на кшталт *Hier wird nicht geparkt* («Тут не паркуються») чи *Hier wird gearbeitet* («Тут ведуться роботи») ти побачиш скрізь. Пасив ідеально підходить: правило діє незалежно від людини, і не треба називати, хто саме забороняє. Тому оголошення у дворах, на вокзалах і будмайданчиках так часто його вживають.

> [!reel] 🧪 Інструкція — теж пасив
> У німецьких рецептах і технічних текстах теж часто читаєш: *Zuerst werden die Eier getrennt. Dann wird der Teig gerührt.* Ту саму інструкцію можна сказати наказом (*Trennen Sie die Eier*), але пасив звучить нейтральніше й безособово.

## Джерела та що почитати

- [DWDS — Passiv](https://www.dwds.de/wb/Passiv): значення терміна й приклади.
- [Duden — Passiv](https://www.duden.de/rechtschreibung/Passiv): визначення граматичного терміна.
- [DWDS — werden](https://www.dwds.de/wb/werden): повна стаття дієслова: пасив, Futur, «ставати».
- [Wikipedia — Passiv](https://de.wikipedia.org/wiki/Passiv): огляд Vorgangs- і Zustandspassiv у німецькій.
- [Wikipedia — Zustandspassiv](https://de.wikipedia.org/wiki/Zustandspassiv): конструкція *sein* + Partizip II, до якої ми повернемося в B2.

> [!important] Підсумок
> - Пасив = *werden* + Partizip II: *Das Haus wird gebaut.* (Präsens), *Das Haus wurde gebaut.* (Präteritum).
> - Підмет пасива — колишній Akkusativ-додаток; виконавця додаємо з *von + Dativ*, засіб — *durch + Akk*.
> - Без підмета: *Hier wird nicht geraucht. Heute wird gefeiert.* З Dativ: *Mir wurde geholfen.*
> - *wird gemacht* — процес; *ist gemacht* — результат.
> - Часто замість пасива кажуть *man*: *Man spricht hier Deutsch.*
