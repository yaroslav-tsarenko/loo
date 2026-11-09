---
title: Наука, технології й майбутнє
id: de-b2-wissenschaft
level: B2
icon: px:star
tags: [deutsch, b2, vocabulary, wissenschaft, forschung, technik, ki]
prerequisites: ["[[Deutsch - B1 - 07. Медіа, інтернет і технології]]", "[[Deutsch - B1 - 12. Довкілля, природа й сортування сміття]]"]
estimatedMinutes: 55
---

# Наука, технології й майбутнє

> [!success] Після цієї теми ти зможеш
> - розуміти й переказувати новини про дослідження: *Laut einer Studie …*, *Forscher haben herausgefunden, dass …*;
> - розрізняти *belegen, nachweisen, beweisen, widerlegen* і не казати «доведено», коли йдеться лише про підтвердження;
> - говорити про технології й ризики: *künstliche Intelligenz, Datensicherheit, Gentechnik, autonomes Fahren*;
> - описати шлях науковця: *Promotion, Stipendium, Forschungsinstitut*;
> - пояснити, чим відрізняються *Max-Planck-Gesellschaft* і *Fraunhofer-Gesellschaft*.

## Передбач

> [!quiz] У новинах: «Eine neue … zeigt, dass Bewegung das Gedächtnis verbessert». Яке слово пасує?
> level: B2 · type: single · id: de-b2-wissenschaft-q01
> - [ ] Studium
> - [x] Studie
> - [ ] Student
> - [ ] Studio
>
> **Пояснення:** ***die Studie*** — окреме дослідження. ***das Studium*** — навчання у виші, ***der Student*** — людина, що вчиться, ***das Studio*** — студія. Слова мають спільний корінь, але значення різні, і саме *Studie* трапляється в новинах про науку.

## Як працює дослідження

Німецькою історію дослідження розповідають за стандартною схемою. Спершу є запитання, відповіддю на яке служить **Hypothese** — припущення, що його можна перевірити. Далі вибирають **Methode** (спосіб), проводять **Experiment** чи **Messung**, **werten** дані **aus** і підсумовують **Ergebnisse**. Хороша стаття у **Fachzeitschrift** описує всі кроки, щоб інші могли повторити дослід.

> [!diagram] Шлях дослідження: від запитання до висновку
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "1 · питання", text: "Fragestellung", tone: yellow }
>   - { id: s2, label: "2 · припущення", text: "Hypothese", tone: pink }
>   - { id: s3, label: "3 · дослід", text: "Experiment / Messung", tone: yellow }
>   - { id: s4, label: "4 · аналіз", text: "Daten auswerten", tone: pink }
>   - { id: s5, label: "5 · висновок", text: "belegt / widerlegt", tone: gray }
> edges:
>   - { from: s1, to: s2 }
>   - { from: s2, to: s3 }
>   - { from: s3, to: s4 }
>   - { from: s4, to: s5 }
> steps:
>   - { focus: s1, note: "Усе починається із запитання: Hilft Sport gegen Stress?" }
>   - { focus: s2, note: "Hypothese — припущення, яке можна перевірити: Wer sich mehr bewegt, schläft besser." }
>   - { focus: s3, note: "Experiment у лабораторії або Messung у реальних умовах дає дані." }
>   - { focus: s4, note: "Дані впорядковують і оцінюють (auswerten), порівнюють із гіпотезою." }
>   - { focus: s5, note: "Результат або підтверджує гіпотезу (belegen), або спростовує її (widerlegen)." }
> ```

### Чотири дієслова: belegen, nachweisen, beweisen, widerlegen

| Дієслово | Значення | Приклад |
|---|---|---|
| **belegen** | підтвердити фактами, даними | Die Studie belegt den Zusammenhang. |
| **nachweisen** | виявити й показати наявність | Man konnte das Virus im Wasser nachweisen. |
| **beweisen** | довести остаточно (математика, право, логіка) | Er hat den Satz bewiesen. |
| **widerlegen** | спростувати | Das Experiment widerlegt die These. |

Українське «довести» часто прямо перекладають як *beweisen*, але в науці про результат досліджень, особливо в медицині чи соціології, зазвичай кажуть **belegen** («підтверджує») або **zeigen**. *Beweisen* звучить як остаточний вердикт, і його вживають обережніше.

### Як розповісти про результат

| Мета | Фраза |
|---|---|
| джерело | Laut einer Studie der Universität Heidelberg … |
| дослідники | Forscher haben herausgefunden, dass … |
| результат | Die Daten zeigen / belegen / deuten darauf hin, dass … |
| обережність | Es spricht vieles dafür, dass … / Es lässt sich noch nicht sicher sagen, ob … |
| наслідки | Das wirkt sich auf die Gesundheit aus. (*sich auswirken auf + Akk*) |
| критика | Die Ergebnisse sind umstritten. / Die Methode ist fragwürdig. |

Для прогнозів є шкала впевненості: **sicher** (точно) → **wahrscheinlich** → **vermutlich** → **möglicherweise** → **kaum**. Прогнози звучать у Futur I (*Es wird bald …*) та з *voraussichtlich*: *Der Satellit wird voraussichtlich im Herbst starten.*

## Технології: KI, дані й безпека

*Künstliche Intelligenz* (скорочено **KI**, англ. AI) у німецьких новинах часто стоїть поряд зі словами *Algorithmus*, *Daten* і *Datenschutz*. Тут корисні два терміни, які легко сплутати:

- **Datenschutz** — захист персональних даних (право людини; його регулює, зокрема, європейський *Datenschutz-Grundverordnung* (DSGVO, англ. GDPR));
- **Datensicherheit** — технічна безпека даних від крадіжки й втрати (паролі, *Verschlüsselung*, резервні копії).

На рівні ЄС є також перший загальний закон про штучний інтелект — *KI-Verordnung* (англ. AI Act), що набрав чинності 1 серпня 2024 року. Вона сортує системи ШІ за рівнем ризику.

Інші слова теми: **autonomes Fahren** (автономне водіння), **vernetzen** (поєднувати в мережу: *vernetzte Geräte*), **simulieren** (моделювати), **Gentechnik** (генна інженерія), **Impfstoff** (вакцина). Про енергетику й клімат дивись також [[Deutsch - B1 - 12. Довкілля, природа й сортування сміття]].

## Шлях науковця

У Німеччині більшість докторантів працюють за договором при кафедрі чи інституті або мають **Stipendium**. Докторську роботу пишуть під керівництвом професора; її результат — **Dissertation**, а процес і ступінь називають **Promotion** (звідси *promovieren* і *Dr.* перед прізвищем). Дослідження фінансують університети й державні та приватні фонди — так звані *Fördermittel* (зазвичай у множині). Головний фонд, що фінансує дослідження в університетах, — Німецьке дослідницьке товариство (*DFG*); гроші зазвичай отримують під окремі проєкти.

> [!note] Wissenschaft ширше за «науку»
> *Die Wissenschaft* охоплює і природничі, і гуманітарні науки (*Geisteswissenschaften*). Тому *Wissenschaftler* — це й фізик, і історик, і мовознавець.

## Приклади

- Forscher haben einen neuen Impfstoff im Labor getestet. — Дослідники випробували нову вакцину в лабораторії.
- Die Studie belegt, dass regelmäßige Bewegung das Risiko senkt. — Дослідження підтверджує, що регулярний рух знижує ризик.
- Die Hypothese wurde durch das Experiment widerlegt. — Гіпотезу спростував експеримент.
- Künstliche Intelligenz verändert viele Berufe. — Штучний інтелект змінює багато професій.
- Der Klimawandel wirkt sich auf die Landwirtschaft aus. — Зміна клімату позначається на сільському господарстві.
- Der Satellit wird voraussichtlich im Herbst gestartet. — Супутник, імовірно, запустять восени.
- Die Daten müssen vor dem Versand verschlüsselt werden. — Дані перед відправленням мають бути зашифровані.
- Nach der Promotion möchte sie in der Forschung bleiben. — Після захисту докторської вона хоче залишитися в науці.
- Die Ergebnisse sind noch umstritten. — Результати досі спірні.
- Mit einem Stipendium kann er drei Jahre forschen. — Зі стипендією він може три роки займатися дослідженнями.

## Слова

> [!word] die Forschung
> ipa: /ˈfɔʁʃʊŋ/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w01
> uk: наукове дослідження; наука як діяльність
> forms: die Forschungen
> example: Die **Forschung** an diesem Medikament dauert schon zehn Jahre. — Дослідження цього препарату тривають уже десять років.
> note: зазвичай однина; форма Forschungen — про окремі напрямки або результати.

> [!word] der Forscher
> ipa: /ˈfɔʁʃɐ/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w02
> uk: дослідник
> forms: die Forscher
> example: Ein **Forscher** aus Hamburg hat die Daten ausgewertet. — Дослідник із Гамбурга опрацював дані.
> note: жінка — die Forscherin, die Forscherinnen; -er на кінці читається як [ɐ].

> [!word] die Studie
> ipa: /ˈʃtuːdi̯ə/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w03
> uk: дослідження; наукова робота
> forms: die Studien
> example: Die **Studie** umfasst 2.000 Teilnehmer. — Дослідження охоплює 2000 учасників.
> note: множина die Studien [ˈʃtuːdi̯ən]; не плутай із das Studium (навчання).

> [!word] das Experiment
> ipa: /ɛkspeʁiˈmɛnt/ · pos: noun · level: B1 · id: de-b2-wissenschaft-w04
> uk: експеримент
> forms: die Experimente
> example: Im **Experiment** zeigte sich ein klarer Effekt. — В експерименті виявився чіткий ефект.
> note: наголос на -ment; дієслово experimentieren.

> [!word] das Labor
> ipa: /laˈboːɐ̯/ · pos: noun · level: B1 · id: de-b2-wissenschaft-w05
> uk: лабораторія
> forms: die Labore (також die Labors)
> example: Die Proben werden im **Labor** untersucht. — Проби досліджують у лабораторії.
> note: повна форма das Laboratorium; наголос на -bor-, кінцеве -or читається [oːɐ̯].

> [!word] die Erkenntnis
> ipa: /ɛɐ̯ˈkɛntnɪs/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w06
> uk: пізнання; висновок, наукове знання
> forms: die Erkenntnisse
> example: Neue **Erkenntnisse** zeigen, wie das Gehirn lernt. — Нові знання показують, як мозок вчиться.
> note: іменники на -nis бувають і das (das Ergebnis), і die (die Erkenntnis, die Kenntnis), тому рід вчи разом зі словом.

> [!word] die Erfindung
> ipa: /ɛɐ̯ˈfɪndʊŋ/ · pos: noun · level: B1 · id: de-b2-wissenschaft-w07
> uk: винахід
> forms: die Erfindungen
> example: Das Fahrrad war eine wichtige **Erfindung**. — Велосипед був важливим винаходом.
> note: erfinden — вигадати, винайти; der Erfinder — винахідник. Erfindung — також «вигадка».

> [!word] die Digitalisierung
> ipa: /diɡitaliˈziːʁʊŋ/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w08
> uk: цифровізація
> forms: — (без множини)
> example: Die **Digitalisierung** verändert die Verwaltung. — Цифровізація змінює управління.
> note: -ung — завжди die; digital з наголосом на -tal.

> [!word] die Raumfahrt
> ipa: /ˈʁaʊ̯mfaːɐ̯t/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w09
> uk: космонавтика; освоєння космосу
> forms: — (без множини)
> example: Die europäische **Raumfahrt** wird von der ESA koordiniert. — Європейську космонавтику координує ESA.
> note: Raum + Fahrt; der Raumfahrer — космонавт.

> [!word] der Satellit
> ipa: /zatɛˈliːt/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w10
> uk: супутник
> forms: die Satelliten
> example: Der **Satellit** sendet Wetterdaten zur Erde. — Супутник надсилає на Землю дані про погоду.
> note: слабка відміна: den Satelliten (Akk), dem Satelliten (Dat) — як der Student.

> [!word] der Impfstoff
> ipa: /ˈɪmpfʃtɔf/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w11
> uk: вакцина
> forms: die Impfstoffe
> example: Der neue **Impfstoff** wird gerade zugelassen. — Нову вакцину зараз допускають до застосування.
> note: Impfung — це саме процедура щеплення; вакцина — Impfstoff. mpf: [m] + [pf].

> [!word] die Diagnose
> ipa: /diaˈɡnoːzə/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w12
> uk: діагноз
> forms: die Diagnosen
> example: Die **Diagnose** stellt der Arzt nach der Untersuchung. — Діагноз лікар ставить після обстеження.
> note: eine Diagnose stellen — поставити діагноз; gn — два окремі звуки [ɡn].

> [!word] das Gen
> ipa: /ɡeːn/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w13
> uk: ген
> forms: die Gene
> example: Dieses **Gen** beeinflusst das Risiko für die Krankheit. — Цей ген впливає на ризик цієї хвороби.
> note: довге [eː]; не плутай із «джин» — англійське gene у німецькій читається [ɡeːn].

> [!word] der Wasserstoff
> ipa: /ˈvasɐˌʃtɔf/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w14
> uk: водень
> forms: — (без множини)
> example: Mit **Wasserstoff** lassen sich Busse und Züge antreiben. — Воднем можна приводити в рух автобуси й потяги.
> note: Wasser + Stoff («водяна речовина»); кисень — Sauerstoff, азот — Stickstoff, вуглець — Kohlenstoff.

> [!word] die Hypothese
> ipa: /hypoˈteːzə/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w15
> uk: гіпотеза
> forms: die Hypothesen
> example: Die **Hypothese** wurde im Test bestätigt. — Гіпотезу підтвердили в тесті.
> note: y = [y] як ü, h на початку — видих; th = [t].

> [!word] der Beweis
> ipa: /bəˈvaɪ̯s/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w16
> uk: доказ
> forms: die Beweise
> example: Dafür gibt es bisher keinen **Beweis**. — Для цього досі немає доказу.
> note: beweisen (bewies, hat bewiesen) — «довести»; Beweis — остаточніше за Beleg.

> [!word] die Fachzeitschrift
> ipa: /ˈfaxˌtsaɪ̯tʃʁɪft/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w17
> uk: фаховий журнал
> forms: die Fachzeitschriften
> example: Der Artikel erscheint in einer **Fachzeitschrift**. — Стаття вийде у фаховому журналі.
> note: Fach + Zeitschrift; ch після a — [x].

> [!word] der Nobelpreis
> ipa: /noˈbɛlˌpʁaɪ̯s/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w18
> uk: Нобелівська премія
> forms: die Nobelpreise
> example: Sie erhielt den **Nobelpreis** für Chemie. — Вона отримала Нобелівську премію з хімії.
> note: der Nobelpreisträger — лауреат; Nobel — наголос на -bel-.

> [!word] das Patent
> ipa: /paˈtɛnt/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w19
> uk: патент
> forms: die Patente
> example: Die Firma hat ein **Patent** auf das Verfahren angemeldet. — Фірма подала заявку на патент на цей спосіб.
> note: ein Patent anmelden — подати заявку; erteilen — видати.

> [!word] die Innovation
> ipa: /ɪnovaˈtsi̯oːn/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w20
> uk: інновація
> forms: die Innovationen
> example: **Innovationen** entstehen oft an Hochschulen. — Інновації часто виникають у вишах.
> note: -ion — зазвичай die (die Nation); наголос на -on; прикметник innovativ.

> [!word] die Grundlagenforschung
> ipa: /ˈɡʁʊntlaːɡn̩ˌfɔʁʃʊŋ/ · pos: noun · level: C1 · id: de-b2-wissenschaft-w21
> uk: фундаментальні дослідження
> forms: — (без множини)
> example: Die **Grundlagenforschung** fragt zuerst nach dem Verständnis, nicht nach dem Nutzen. — Фундаментальні дослідження спершу шукають розуміння, а не користі.
> note: Grundlage — основа; протилежність — die angewandte Forschung (прикладні дослідження).

> [!word] die Promotion
> ipa: /pʁomoˈtsi̯oːn/ · pos: noun · level: C1 · id: de-b2-wissenschaft-w22
> uk: захист докторської дисертації; здобуття докторського ступеня
> forms: die Promotionen
> example: Die **Promotion** dauert in der Regel drei bis fünf Jahre. — Докторат зазвичай триває від трьох до пʼяти років.
> note: promovieren — писати докторську; Dr. перед прізвищем; не плутай з англійським promotion («просування»).

> [!word] das Stipendium
> ipa: /ʃtiˈpɛndi̯ʊm/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w23
> uk: стипендія
> forms: die Stipendien
> example: Sie bekommt ein **Stipendium** für ihr Studium in Dresden. — Вона отримує стипендію на навчання в Дрездені.
> note: множина Stipendien [ʃtiˈpɛndi̯ən]; ein Stipendium erhalten / beantragen.

> [!word] die Auswirkung
> ipa: /ˈaʊ̯sˌvɪʁkʊŋ/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w24
> uk: наслідок; вплив
> forms: die Auswirkungen
> example: Die **Auswirkungen** auf die Umwelt sind noch unklar. — Наслідки для довкілля ще не зрозумілі.
> note: sich auswirken auf (+ Akk) — позначатися на чомусь; найчастіше в множині.

> [!word] das Risiko
> ipa: /ˈʁiːziko/ · pos: noun · level: B1 · id: de-b2-wissenschaft-w25
> uk: ризик
> forms: die Risiken
> example: Jede neue Technologie hat auch ein **Risiko**. — Кожна нова технологія має й ризик.
> note: також die Risikos; ein Risiko eingehen — піти на ризик; s між голосними — [z].

> [!word] der Fortschritt
> ipa: /ˈfɔʁtʃʁɪt/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w26
> uk: прогрес
> forms: die Fortschritte
> example: In der Medizin gab es große **Fortschritte**. — У медицині були великі успіхи.
> note: Fortschritte machen — досягати успіхів; Schritt — «крок», sch + r: [ʃʁ].

> [!word] die Prognose
> ipa: /pʁoˈɡnoːzə/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w27
> uk: прогноз
> forms: die Prognosen
> example: Die **Prognose** sagt für nächstes Jahr ein Wachstum voraus. — Прогноз передбачає на наступний рік зростання.
> note: Prognose (про майбутнє, на підставі даних) ≠ Diagnose (про теперішній стан); gn — [ɡn].

> [!word] die Gentechnik
> ipa: /ˈɡeːnˌtɛçnɪk/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w28
> uk: генна інженерія
> forms: — (без множини)
> example: Über die **Gentechnik** wird viel gestritten. — Про генну інженерію багато сперечаються.
> note: Technik — ch після e дає [ç].

> [!word] die Verschlüsselung
> ipa: /fɛɐ̯ˈʃlʏslʊŋ/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w29
> uk: шифрування
> forms: die Verschlüsselungen
> example: Die **Verschlüsselung** schützt Nachrichten vor fremdem Zugriff. — Шифрування захищає повідомлення від стороннього доступу.
> note: verschlüsseln — шифрувати; der Schlüssel — ключ; ü коротке.

> [!word] die künstliche Intelligenz
> ipa: /ˈkʏnstlɪçə ɪntɛliˈɡɛnts/ · pos: noun · level: B2 · id: de-b2-wissenschaft-w30
> uk: штучний інтелект
> forms: — (без множини)
> example: Die **künstliche Intelligenz** schreibt Texte und erkennt Bilder. — Штучний інтелект пише тексти й розпізнає зображення.
> note: скорочено KI [kaːˈʔiː]; прикметник змінюється: eine künstliche Intelligenz, mit künstlicher Intelligenz.

> [!word] erforschen
> ipa: /ɛɐ̯ˈfɔʁʃn̩/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w31
> uk: досліджувати (докладно)
> forms: erforschen → erforschte → hat erforscht
> example: Wissenschaftler **erforschen** die Ursachen der Krankheit. — Науковці досліджують причини хвороби.
> note: erforschen — глибоке вивчення чогось невідомого; untersuchen — перевіряти, аналізувати конкретний обʼєкт.

> [!word] entwickeln
> ipa: /ɛntˈvɪkl̩n/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w32
> uk: розробляти; розвивати
> forms: entwickeln → entwickelte → hat entwickelt
> example: Die Firma **entwickelt** ein neues Verfahren. — Фірма розробляє новий спосіб.
> note: sich entwickeln — розвиватися; die Entwicklung — розробка / розвиток.

> [!word] auswerten
> ipa: /ˈaʊ̯sveːɐ̯tn̩/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w33
> uk: опрацьовувати, оцінювати (дані)
> forms: auswerten → wertete aus → hat ausgewertet
> example: Das Team **wertet** die Daten **aus**. — Команда опрацьовує дані.
> note: відокремлюване; die Auswertung — аналіз результатів.

> [!word] analysieren
> ipa: /analyˈziːʁən/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w34
> uk: аналізувати; досліджувати склад і звʼязки
> forms: analysieren → analysierte → hat analysiert
> example: Das Labor **analysiert** die Proben auf Schadstoffe. — Лабораторія аналізує проби на шкідливі речовини.
> note: наголос на -sie-; ie = [iː], y = [y]; die Analyse — аналіз.

> [!word] belegen
> ipa: /bəˈleːɡn̩/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w35
> uk: підтверджувати доказами
> forms: belegen → belegte → hat belegt
> example: Die Zahlen **belegen** diesen Trend. — Цифри підтверджують цю тенденцію.
> note: також «забронювати» (einen Platz belegen) і «записатися на курс» (einen Kurs belegen); der Beleg — підтвердження, чек.

> [!word] widerlegen
> ipa: /viːdɐˈleːɡn̩/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w36
> uk: спростувати
> forms: widerlegen → widerlegte → hat widerlegt
> example: Neue Daten **widerlegen** die alte Theorie. — Нові дані спростовують стару теорію.
> note: untrennbar: наголос на -leg-; hat widerlegt без ge-.

> [!word] messen
> ipa: /ˈmɛsn̩/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w37
> uk: вимірювати
> forms: messen → er misst · maß · hat gemessen
> example: Der Sensor **misst** die Temperatur jede Sekunde. — Датчик вимірює температуру щосекунди.
> note: у 3-й особі e → i: er misst; die Messung — вимірювання.

> [!word] simulieren
> ipa: /zimuˈliːʁən/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w38
> uk: моделювати; імітувати
> forms: simulieren → simulierte → hat simuliert
> example: Der Computer **simuliert** den Verkehr der ganzen Stadt. — Компʼютер моделює рух транспорту всього міста.
> note: s на початку — [z]; die Simulation.

> [!word] vernetzen
> ipa: /fɛɐ̯ˈnɛtsn̩/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w39
> uk: поєднувати в мережу; налагоджувати звʼязки
> forms: vernetzen → vernetzte → hat vernetzt
> example: Alle Geräte im Haus sind **vernetzt**. — Усі пристрої в будинку зʼєднані в мережу.
> note: sich vernetzen — налагоджувати професійні контакти; das Netz — мережа.

> [!word] fördern
> ipa: /ˈfœʁdɐn/ · pos: verb · level: B2 · id: de-b2-wissenschaft-w40
> uk: підтримувати; фінансувати; сприяти
> forms: fördern → förderte → hat gefördert
> example: Der Staat **fördert** die Forschung mit Millionen. — Держава підтримує дослідження мільйонами.
> note: die Förderung — підтримка, фінансування; ö — округлене [œ].

> [!word] wissenschaftlich
> ipa: /ˈvɪsn̩ʃaftlɪç/ · pos: adj · level: B2 · id: de-b2-wissenschaft-w41
> uk: науковий
> example: Das ist keine **wissenschaftliche** Methode. — Це не науковий метод.
> note: від Wissenschaft; -lich — [lɪç]; sch + a — [ʃa].

> [!word] innovativ
> ipa: /ɪnovaˈtiːf/ · pos: adj · level: B2 · id: de-b2-wissenschaft-w42
> uk: інноваційний
> example: Das Start-up hat eine **innovative** Idee. — У стартапу інноваційна ідея.
> note: наголос на -tiv; кінцеве v = [f], але у формах — [v]: innovative [ɪnovaˈtiːvə].

> [!word] empirisch
> ipa: /ɛmˈpiːʁɪʃ/ · pos: adj · level: C1 · id: de-b2-wissenschaft-w43
> uk: емпіричний
> example: Die Aussage ist **empirisch** belegt. — Це твердження підтверджене емпірично.
> note: «на досвіді й даних»; протилежність — theoretisch.

> [!word] autonom
> ipa: /aʊ̯toˈnoːm/ · pos: adj · level: B2 · id: de-b2-wissenschaft-w44
> uk: автономний, самостійний
> example: Das Auto fährt **autonom** durch die Stadt. — Автомобіль самостійно їде містом.
> note: autonomes Fahren — автономне водіння; наголос на -nom.

> [!word] umstritten
> ipa: /ʊmˈʃtʁɪtn̩/ · pos: adj · level: B2 · id: de-b2-wissenschaft-w45
> uk: спірний
> example: Die Gentechnik ist in Europa **umstritten**. — Генна інженерія в Європі викликає суперечки.
> note: part. II від umstreiten («сперечатися про»); використовують як прикметник.

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-wissenschaft-l01
> audio: Die Forscher haben die Hypothese widerlegt.
> - [ ] Die Forscher haben die Hypothese bestätigt.
> - [x] Die Forscher haben die Hypothese widerlegt.
> - [ ] Die Forscher haben die Hypothese entwickelt.
>
> **Пояснення:** *widerlegen* — спростувати, *bestätigen* — підтвердити. Протилежні за значенням дієслова легко переплутати, коли слухаєш уважно лише початок речення.

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-wissenschaft-l02
> audio: Wir haben den neuen Impfstoff im Labor getestet.
> - [ ] Wir haben den neuen Impfstoff im Lager getestet.
> - [ ] Wir haben den neuen Wasserstoff im Labor getestet.
> - [x] Wir haben den neuen Impfstoff im Labor getestet.
>
> **Пояснення:** *Impfstoff* — вакцина, *Wasserstoff* — водень (обидва закінчуються на -stoff). *Labor* — лабораторія, *Lager* — склад.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-wissenschaft-l03
> audio: Die künstliche Intelligenz verändert die Forschung.
> explain: *künstliche* — ü коротке, -ch- після ü дає [ç]; *Intelligenz* — наголос на -genz; *Forschung* — sch [ʃ].

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-wissenschaft-l04
> audio: Die Raumfahrt braucht neue Technologien.
> explain: *Raumfahrt* — одне слово (Raum + Fahrt); *Technologien* — наголос на -gi-, ch після e = [ç].

> [!listen] Послухай інтервʼю з дослідницею. Над чим вона працює?
> level: B2 · type: answer · id: de-b2-wissenschaft-l05
> audio: A: Frau Dr. Keller, woran forschen Sie gerade?
> audio: B: Wir entwickeln einen neuen Akku, der doppelt so lange hält.
> audio: A: Und wann kommt er auf den Markt?
> audio: B: Das lässt sich schwer prognostizieren. Wahrscheinlich in fünf Jahren.
> - [ ] Над новою вакциною, яка буде готова за рік.
> - [x] Над акумулятором, що працює вдвічі довше; вихід на ринок імовірно за пʼять років.
> - [ ] Над супутником, який уже запустили.
>
> **Пояснення:** *einen neuen Akku … doppelt so lange* — акумулятор, що працює вдвічі довше. *Wahrscheinlich in fünf Jahren* — «імовірно, за пʼять років», дослідниця обережна: *schwer zu prognostizieren*.

## Вимова

Багато слів цієї теми — запозичення з латини й грецької. Ключові правила:

- Слова на **-ie**, **-ion**, **-ik** зазвичай мають наголос на цьому закінченні: *Technologie, Innovation, Physik*. Винятки: *Studie* — наголос на початку (***Stu**die*), *Technik* [ˈtɛçnɪk] — теж на першому складі.
- ***y*** в грецьких словах — це [y], як німецьке ü: *Hypothese, Physik*.
- ***th*** і ***ph*** читаються як [t] і [f]: *Theorie, Physik*.
- ***gn*** і ***pf*** — окремі звуки: *Prognose* [pʁoˈɡnoːzə], *Impfstoff*.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-wissenschaft-s01
> text: Die Studie belegt diese Hypothese.
> ipa: /diː ˈʃtuːdi̯ə bəˈleːkt ˈdiːzə hypoˈteːzə/
> tip: Studie — наголос на першому складі. belegt — кінцеве gt = [kt]. Hypothese — y як ü, th = [t].
> uk: Дослідження підтверджує цю гіпотезу.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-wissenschaft-s02
> text: Die Prognose klingt vorsichtig.
> ipa: /diː pʁoˈɡnoːzə klɪŋt ˈfoːɐ̯zɪçtɪç/
> tip: Prognose — gn як два звуки [ɡn], наголос на -gno-. vorsichtig — кінцеве -ig = [ɪç].
> uk: Прогноз звучить обережно.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-wissenschaft-s03
> text: Der Satellit misst die Temperatur der Erde.
> ipa: /deːɐ̯ zatɛˈliːt mɪst diː tɛmpəʁaˈtuːɐ̯ deːɐ̯ ˈeːɐ̯də/
> tip: Satellit — наголос на -lit. Temperatur — наголос на -tur, r після u дає [ɐ̯]. misst — ss після короткого i.
> uk: Супутник вимірює температуру Землі.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-wissenschaft-s04
> text: Sie hat ein Stipendium für die Promotion.
> ipa: /ziː hat aɪ̯n ʃtiˈpɛndi̯ʊm fyːɐ̯ diː pʁomoˈtsi̯oːn/
> tip: Stipendium — st на початку слова дає [ʃt]; наголос на -pen-. Promotion — наголос на -ti-on.
> uk: У неї є стипендія на докторат.

## Типові помилки українців

> [!pitfall] Studie, Studium, Student — не «одне й те саме»
> Корінь один, а значення три: **die Studie** — дослідження, **das Studium** — навчання у виші, **der Student** — той, хто навчається. *Sie macht ein Studium in Berlin* — вона навчається, *Sie liest eine Studie* — читає дослідження. Українське «студія» (кіностудія, студія звукозапису) німецькою — *das Studio*, і це четверте слово.

> [!pitfall] «Доведено» не завжди beweisen
> В українських новинах кажуть «вчені довели, що …» навіть про одне дослідження. Німецькою про результат дослідження обережніше: *Die Studie **belegt** / **zeigt**, dass …*, *Es deutet darauf hin, dass …*. *Beweisen* вживають там, де доказ остаточний: у математиці, логіці, праві. Якщо хочеш звучати природно в науковому тексті — вживай *belegen*.

> [!pitfall] Technik ≠ Technologie
> Українське «технологія» німці розділяють. **Die Technik** — це і техніка (прилади, машини), і спосіб виконання (*die Maltechnik*, «техніка малювання»), і напрям (*Elektrotechnik*). **Die Technologie** — сукупність знань, методів і систем у певній галузі (*Biotechnologie*, *Informationstechnologie*). *Das Auto ist modernste Technik* — «найсучасніша техніка», але *Wir entwickeln neue Technologien* — «нові технології».

> [!pitfall] Akademiker ≠ академік
> **Der Akademiker** — людина з вищою освітою (університетським дипломом), а не член Академії наук. «Академік» німецькою — *das Mitglied der Akademie der Wissenschaften*. *Akademikerin* — жінка з дипломом. Слово *Akademiker* часто трапляється в статистиці й вакансіях: *Akademikerquote* — частка людей із вищою освітою.

## Ситуація: на конференції

> [!listen] Послухай розмову на конференції. Що хоче зробити Олена?
> level: B2 · type: answer · id: de-b2-wissenschaft-l06
> audio: A: Entschuldigung, Sie forschen am Fraunhofer-Institut, richtig?
> audio: B: Ja, ich arbeite im Bereich Batterietechnik. Und Sie?
> audio: A: Ich bin Olena, ich schreibe gerade meine Masterarbeit zu Speichertechnik.
> audio: B: Dann schicken Sie mir doch eine Nachricht. Vielleicht gibt es bei uns ein Praktikum.
> - [ ] Вона хоче скасувати доповідь.
> - [x] Вона шукає можливість стажування в Fraunhofer-інституті.
> - [ ] Вона пропонує спільну патентну заявку.
>
> **Пояснення:** Олена пише магістерську роботу з накопичувачів енергії, а співрозмовник пропонує написати повідомлення, бо «vielleicht gibt es bei uns ein Praktikum» — можливо, у них є стажування.

Відповідай так, ніби ти — Олена.

> [!speak] Скажи вголос: «Я пишу магістерську роботу»
> level: B2 · id: de-b2-wissenschaft-s05
> text: Ich schreibe gerade meine Masterarbeit.
> ipa: /ɪç ˈʃʁaɪ̯bə ɡəˈʁaːdə ˈmaɪ̯nə ˈmaːstɐˌʔaʁbaɪ̯t/
> tip: schreibe — sch + r: [ʃʁ]. Masterarbeit — Master читається як [ˈmaːstɐ] (a довге), не англійське «мастер».
> uk: Я зараз пишу магістерську роботу.

> [!speak] Скажи вголос: «Чи є у вас практика?»
> level: B2 · id: de-b2-wissenschaft-s06
> text: Gibt es bei Ihnen vielleicht ein Praktikum?
> ipa: /ɡɪpt ɛs baɪ̯ ˈiːnən fiˈlaɪ̯çt aɪ̯n ˈpʁaktikʊm/
> tip: vielleicht — ie = [iː], ei = [aɪ̯], ch після i = [ç]. Praktikum — наголос на Prak-.
> uk: Чи є у вас, можливо, стажування?

## Landeskunde: Max Planck und Fraunhofer

> [!example] Max Planck und Fraunhofer
> Deutschland hat neben den Universitäten ein dichtes Netz von Forschungsorganisationen. Zwei davon kennt fast jeder: die Max-Planck-Gesellschaft und die Fraunhofer-Gesellschaft. Sie sind ähnlich bekannt, aber sie machen nicht dasselbe. Die Max-Planck-Gesellschaft wurde 1948 gegründet, als Nachfolgerin der Kaiser-Wilhelm-Gesellschaft von 1911. Sie betreibt Grundlagenforschung in den Natur- und Lebenswissenschaften und in den Geisteswissenschaften. Das bedeutet: Die Forscher suchen zuerst nach neuem Wissen und fragen nicht, ob man es morgen schon verkaufen kann. Nach Angaben der Gesellschaft zählen 31 Nobelpreisträger zu ihren Wissenschaftlern. Die Fraunhofer-Gesellschaft entstand 1949 und betreibt angewandte Forschung. Hier geht es darum, Ideen für Unternehmen nutzbar zu machen, zum Beispiel neue Batterien, Sensoren oder Software. Mehr als 30.000 Beschäftigte arbeiten an 74 Instituten und Forschungseinrichtungen in ganz Deutschland. Den Namen trägt die Gesellschaft nach Joseph von Fraunhofer (1787–1826), der als Glasschleifer begann und später ein bekannter Forscher und Unternehmer wurde. Neben diesen beiden Gesellschaften gibt es noch die Helmholtz-Gemeinschaft und die Leibniz-Gemeinschaft. Bei Helmholtz arbeiten nach eigenen Angaben mehr als 48.000 Menschen in 18 Forschungszentren. Die Leibniz-Gemeinschaft beschäftigt rund 21.400 Personen, und Bund und Länder fördern ihre Institute gemeinsam. Die Forschung an Hochschulen unterstützt außerdem die Deutsche Forschungsgemeinschaft (DFG), die Projekte von Forschenden bewilligt und finanziert. Für Studierende ist das interessant: Man kann dort oft Praktika, Abschlussarbeiten oder Promotionsstellen finden.

> [!quiz] Welche Gesellschaft betreibt vor allem Grundlagenforschung?
> level: B2 · type: single · id: de-b2-wissenschaft-q02
> - [ ] die Fraunhofer-Gesellschaft
> - [x] die Max-Planck-Gesellschaft
> - [ ] beide ausschließlich angewandte Forschung
> - [ ] keine von beiden, sie arbeiten nur an Universitäten
>
> **Пояснення:** у тексті: «Die Max-Planck-Gesellschaft … betreibt Grundlagenforschung». Fraunhofer займається *angewandte Forschung*.

> [!quiz] Was stimmt laut Text über die Fraunhofer-Gesellschaft?
> level: B2 · type: multi · id: de-b2-wissenschaft-q03
> - [x] Sie betreibt angewandte Forschung.
> - [x] Sie entstand 1949.
> - [x] Sie hat mehr als 30.000 Beschäftigte.
> - [ ] Sie wurde 1948 als Nachfolgerin der Kaiser-Wilhelm-Gesellschaft gegründet.
>
> **Пояснення:** 1948 і Kaiser-Wilhelm-Gesellschaft стосуються Max-Planck-Gesellschaft. Fraunhofer — 1949, прикладні дослідження, понад 30 000 працівників.

> [!quiz] Woher hat die Fraunhofer-Gesellschaft ihren Namen?
> level: B2 · type: single · id: de-b2-wissenschaft-q04
> - [ ] vom Physiker, nach dem die Max-Planck-Gesellschaft benannt ist
> - [ ] von einem Ingenieur, der die Gesellschaft 1949 gegründet hat
> - [ ] von einem Gründer der Kaiser-Wilhelm-Gesellschaft
> - [x] von Joseph von Fraunhofer, der als Glasschleifer begann und später Forscher und Unternehmer wurde
>
> **Пояснення:** «Den Namen trägt die Gesellschaft nach Joseph von Fraunhofer (1787–1826)». Фраунгофер жив у 1787–1826 роках, тобто задовго до заснування організації. Макс Планк дав імʼя іншій організації — *Max-Planck-Gesellschaft*.

## Практика

> [!quiz] Яка пара дієслів — протилежні за значенням?
> level: B2 · type: single · id: de-b2-wissenschaft-q05
> - [ ] nachweisen – belegen
> - [x] belegen – widerlegen
> - [ ] messen – auswerten
> - [ ] fördern – erforschen
>
> **Пояснення:** *belegen* — підтвердити, *widerlegen* — спростувати. *Nachweisen* і *belegen* — близькі за значенням, *messen* (вимірювати) та *auswerten* (опрацювати дані) — послідовні кроки, а не протилежності.

> [!quiz] Які іменники мають артикль das?
> level: B2 · type: multi · id: de-b2-wissenschaft-q06
> - [x] Labor
> - [x] Patent
> - [x] Experiment
> - [ ] Satellit
> - [ ] Impfstoff
>
> **Пояснення:** *das Labor, das Patent, das Experiment*. *Der Satellit* та *der Impfstoff* — чоловічого роду. *Satellit* — der (слабка відміна, як *Student*); *Impfstoff* — рід за останньою частиною, *der Stoff*.

> [!quiz] Заповни пропуски
> level: B2 · type: fill · bank: Studium, Gen · id: de-b2-wissenschaft-q07
>
> ```text fill
> Das Team hat das neue Medikament im [[Labor]] getestet.
> Die Ergebnisse stehen in einer [[Fachzeitschrift]].
> Die [[Studie]] belegt, dass das Medikament gut wirkt.
> ```
>
> **Пояснення:** *im Labor* — лабораторія, *Fachzeitschrift* — журнал, *die Studie* — дослідження. *Studium* (навчання) не підходить за значенням і за артиклем (*das*), а *Gen* — середнього роду і не пасує до *die*.

> [!quiz] Заповни пропуски
> level: B2 · type: fill · id: de-b2-wissenschaft-q08
>
> ```text fill
> Nach dem Master möchte ich eine [[Promotion]] (докторат) beginnen.
> Dafür suche ich ein [[Stipendium]] (грошова підтримка), damit ich Zeit für die [[Forschung]] habe.
> ```
>
> **Пояснення:** *eine Promotion* — докторат, *ein Stipendium* — стипендія, *die Forschung* — науково-дослідна діяльність. Артикль і закінчення підказують рід: *eine*, *ein*, *die*.

> [!quiz] Склади речення: «Дослідження підтверджує, що вакцина діє.»
> level: B2 · type: order · id: de-b2-wissenschaft-q09
>
> ```text order
> Die
> Studie
> belegt,
> dass
> der
> Impfstoff
> wirkt.
> zu ✗
> ```
>
> **Пояснення:** після *dass* дієслово йде в кінець підрядного речення: *dass der Impfstoff wirkt*. *Zu* тут зайве, бо після *dass* інфінітива з *zu* не потрібно.

> [!quiz] Склади речення: «Дослідники ретельно опрацювали дані.»
> level: B2 · type: order · id: de-b2-wissenschaft-q10
>
> ```text order
> Forscher
> haben
> die
> Daten
> sorgfältig
> ausgewertet.
> ausgewerten ✗
> ```
>
> **Пояснення:** *auswerten* — слабке відокремлюване дієслово: Partizip II *ausgewertet*. Форма *ausgewerten* — типова помилка, бо звучить як сильне дієслово.

> [!quiz] Який варіант правильний?
> level: B2 · type: single · id: de-b2-wissenschaft-q11
> - [ ] Der Klimawandel wirkt sich in die Landwirtschaft aus.
> - [x] Der Klimawandel wirkt sich auf die Landwirtschaft aus.
> - [ ] Der Klimawandel wirkt sich für die Landwirtschaft aus.
> - [ ] Der Klimawandel wirkt sich an der Landwirtschaft aus.
>
> **Пояснення:** *sich auswirken auf (+ Akk)* — «позначатися на чомусь». Прийменник *auf* вимагає Akkusativ: *auf die Landwirtschaft*.

> [!quiz] Яке слово пасує: «Die Wetter… für morgen: Regen und Wind»?
> level: B2 · type: single · id: de-b2-wissenschaft-q12
> - [ ] Diagnose
> - [x] Prognose
> - [ ] Hypothese
> - [ ] Erfindung
>
> **Пояснення:** *Prognose* — прогноз про майбутнє. *Diagnose* — висновок про теперішній стан (у медицині), *Hypothese* — припущення, яке ще треба перевірити.

## Фішки

> [!reel] 🛰️ Супутник — спочатку «охоронець»
> Латинське *satelles* означало «охоронець, супутник правителя». У XVII столітті Йоганнес Кеплер використав це слово для місяців, що «супроводжують» Юпітер, і так воно стало астрономічним терміном. Слово *Satellit* як штучне тіло на орбіті зʼявилося пізніше. Етимологічний словник Пфайфера описує цю історію докладно.

> [!reel] 🤖 Roboter — зі словʼянського «робота»
> Слово *Roboter* стало міжнародним завдяки пʼєсі чеського письменника Карела Чапека «R.U.R.» (1920). Воно утворене від чеського *robota* — «тяжка праця, панщина», спорідненого з нашим словом «робота» й німецьким *Arbeit*. Тож німецьке *Roboter* — словʼянський родич нашої «роботи».

> [!reel] 🧪 Hypothese — «підкладене під низ»
> Грецьке *hypóthesis* буквально означає «те, що підкладено знизу»: основа, на якій будують міркування. Гіпотеза у науці — це підкладений фундамент, який ще треба випробувати. Німецьке слово *Hypothese* зʼявилося у XVIII столітті.

## Джерела та що почитати

- [Fraunhofer-Gesellschaft — Profile / Structure](https://www.fraunhofer.de/en/about-fraunhofer/profile-structure.html): рік заснування (1949), понад 30 000 працівників, 74 інститути, Joseph von Fraunhofer.
- [Max-Planck-Gesellschaft — Profile and Visions](https://www.mpg.de/11761628/profile-visions): фундаментальні дослідження, 1948, 31 лауреат Нобелівської премії.
- [Max-Planck-Gesellschaft — History of the Max Planck Society](https://www.mpg.de/195481/history-of-the-max-planck-society): 26 лютого 1948 року й Kaiser-Wilhelm-Gesellschaft (1911).
- [Helmholtz-Gemeinschaft — Über uns](https://www.helmholtz.de/ueber-uns/) (понад 48 000 працівників у 18 центрах) і [Leibniz-Gemeinschaft — Über uns](https://www.leibniz-gemeinschaft.de/ueber-uns) (близько 21 400 працівників; Bund і Länder фінансують разом): інші великі позауніверситетські наукові організації Німеччини.
- [DFG — Über uns](https://www.dfg.de/de/ueber-uns): Німецьке дослідницьке товариство, фінансування дослідницьких проєктів.
- [Європейська комісія — Data protection in the EU](https://commission.europa.eu/law/law-topic/data-protection/data-protection-eu_en): загальний регламент про захист даних (GDPR / DSGVO).
- [Європейська комісія — AI Act](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai): набрання чинності 1 серпня 2024 року.
- [DWDS — Satellit](https://www.dwds.de/wb/Satellit), [Roboter](https://www.dwds.de/wb/Roboter), [Hypothese](https://www.dwds.de/wb/Hypothese): етимологія слів.
- [DWDS — Studie](https://www.dwds.de/wb/Studie) і [Promotion](https://www.dwds.de/wb/Promotion): значення й вживання.

> [!important] Підсумок
> - Дослідження: *Hypothese → Experiment / Messung → Daten auswerten → belegt / widerlegt*.
> - *Belegen* і *zeigen* про результат; *beweisen* — лише коли доказ остаточний; *nachweisen* — показати наявність.
> - *Datenschutz* — права на дані, *Datensicherheit* — технічний захист; *KI-Verordnung* регулює штучний інтелект у ЄС.
> - *Studie* ≠ *Studium*; *Technik* ≠ *Technologie*; *Akademiker* — людина з дипломом.
> - Max-Planck — *Grundlagenforschung* (1948); Fraunhofer — *angewandte Forschung* (1949).
