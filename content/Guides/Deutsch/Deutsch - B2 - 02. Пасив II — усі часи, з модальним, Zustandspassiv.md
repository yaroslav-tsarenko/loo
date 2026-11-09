---
title: Пасив II — усі часи, з модальним, Zustandspassiv
id: de-b2-passiv
level: B2
icon: px:gear
tags: [deutsch, b2, grammar, passiv, werden, zustandspassiv, modalverben]
prerequisites: ["[[Deutsch - B2 - 01. Система часів і Futur II]]", "[[Deutsch - B1 - 17. Пасив — Präsens і Präteritum]]"]
estimatedMinutes: 45
---

# Пасив II — усі часи, з модальним, Zustandspassiv

> [!success] Після цієї теми ти зможеш
> - утворити Vorgangspassiv у всіх часах: *wird gebaut, wurde gebaut, ist gebaut worden, war gebaut worden, wird gebaut werden*;
> - сказати пасив із модальним дієсловом: *Das Dach muss repariert werden. Hier darf nicht geraucht werden.*;
> - розрізнити процес і результат: *Die Tür wird geöffnet* і *Die Tür ist geöffnet*;
> - вжити безособовий пасив: *Es wird getanzt. Hier wird gearbeitet. Mir wird geholfen.*

## Передбач

> [!quiz] Як сказати в Perfekt пасиву: «Будинок збудовано»?
> level: B2 · type: single · id: de-b2-passiv-q01
> - [x] Das Haus ist gebaut worden.
> - [ ] Das Haus ist gebaut geworden.
> - [ ] Das Haus hat gebaut worden.
> - [ ] Das Haus wurde gebaut worden.
>
> **Пояснення:** у звичайному Perfekt пасиву допоміжне — **sein**, а після Partizip II ставиться коротка форма **worden**. *geworden* — Partizip II від *werden* у значенні «стати» (*Er ist Arzt geworden*). *hat* тут неможливе: допоміжне пасиву в Perfekt — *ist / sind*. *wurde … worden* змішує два часи.

## Пасив у двох словах

У темі B1-17 ти вивчив основний пасив: **werden + Partizip II**. Він показує **процес** і ставить на перше місце те, що відбувається, а не того, хто діє: *Das Haus wird gebaut.* («Будинок будується / будують»). Виконавця називають рідко: *von + Dativ* для людини, *durch + Akkusativ* для засобу чи причини. Сьогодні додамо решту часів, модальні дієслова, безособовий пасив і стан — **Zustandspassiv**.

## Усі часи Vorgangspassiv

Змінюється лише допоміжне *werden*; Partizip II лишається тим самим. У складних часах *werden* стає *worden*, а допоміжним стає *sein*.

| Час | Утворення | Приклад |
|---|---|---|
| Präsens | wird / werden + Partizip II | Das Haus **wird** gebaut. |
| Präteritum | wurde / wurden + Partizip II | Das Haus **wurde** gebaut. |
| Perfekt | ist / sind + Partizip II + **worden** | Das Haus **ist** gebaut **worden**. |
| Plusquamperfekt | war / waren + Partizip II + **worden** | Das Haus **war** gebaut **worden**. |
| Futur I | wird / werden + Partizip II + **werden** | Das Haus **wird** gebaut **werden**. |
| Futur II | wird + Partizip II + **worden sein** | Das Haus **wird** gebaut **worden sein**. |

Futur II пасиву майже не зустрінеш: *Bis Ende des Jahres wird das Gebäude abgerissen worden sein.* Для Futur I зазвичай вистачає Präsens із маркером часу: *Nächstes Jahr wird die Straße saniert.*

> [!diagram] Як росте пасив: від Präsens до Futur I
> ```yaml
> layout: flow
> nodes:
>   - { id: subj, label: "підмет", text: "Das Haus", tone: mint }
>   - { id: v1, label: "допоміжне", text: "wird", tone: orange }
>   - { id: p2, label: "Partizip II", text: "gebaut", tone: gray }
>   - { id: v2, label: "кінець", text: "—", tone: orange }
> steps:
>   - { focus: [subj, v1, p2], note: "Präsens: werden + Partizip II. Дієслово wird на другому місці, Partizip II — у кінці." }
>   - { set: { v1: "wurde" }, focus: v1, note: "Präteritum: змінюємо тільки werden → wurde. Partizip II той самий." }
>   - { set: { v1: "ist", v2: "worden" }, focus: [v1, v2], note: "Perfekt: допоміжним стає ist, а в кінці зʼявляється worden. Саме worden, а не geworden." }
>   - { set: { v1: "war", v2: "worden" }, focus: v1, note: "Plusquamperfekt: ist → war. Подія була раніше за іншу в минулому." }
>   - { set: { v1: "wird", v2: "werden" }, focus: [v1, v2], note: "Futur I: wird + Partizip II + werden. Два werden в одному реченні — це нормально: перше змінюється, друге — інфінітив." }
> ```
> Допоміжні дієслова (*wird, wurde, ist, war*) — помаранчеві, підмет — мʼятний, Partizip II — сірий.

**worden чи geworden?** *worden* — Partizip II від *werden* **лише в пасиві**. У значенні «стати» (*Er ist Arzt **geworden**. Es ist kalt **geworden**.*) Partizip II — *geworden*. Одне й те саме слово *ist … geworden*, але різні конструкції.

**Підрядне речення.** Усі форми з допоміжним *sein* або *werden* стоять у кінці: *Er sagt, dass das Haus 1990 gebaut **worden ist**.* Для Futur I: *…, dass das Haus gebaut **werden wird**.*

## Виконавець і Dativ

Виконавця називаємо за потреби: *Der Roman wurde **von** Thomas Mann geschrieben.* (людина — *von + Dativ*), *Das Haus wurde **durch** einen Brand zerstört.* (причина — *durch + Akkusativ*). Якщо дієслово керує Dativ, додаток **не змінює відмінок** і не стає підметом: *Mir wurde sofort geholfen.* («Мені одразу допомогли».)

## Пасив із модальним дієсловом

Модальне дієслово стоїть на другому місці, а **Passiv-Infinitiv** (Partizip II + *werden*) іде в кінець:

| Час | Приклад | Переклад |
|---|---|---|
| Präsens | Das Dach **muss** repariert **werden**. | Дах треба відремонтувати. |
| Präteritum | Das Dach **musste** repariert **werden**. | Дах треба було відремонтувати. |
| Konjunktiv II | Das Dach **müsste** repariert **werden**. | Дах слід було б відремонтувати. |
| Perfekt (рідко) | Das Dach **hat** repariert werden **müssen**. | Дах довелося відремонтувати. |

У підрядному реченні модальне дієслово стоїть **останнім**: *Ich weiß, dass das Dach repariert werden **muss**.* У Perfekt утворюється подвійний інфінітив (*repariert werden müssen*), і *hat* виходить перед ним: *…, weil das Dach **hat** repariert werden müssen.* У розмові замість цієї форми беруть Präteritum: *Das Dach musste repariert werden.*

Значення залежить від модального дієслова:

| Модальне | Значення | Приклад |
|---|---|---|
| muss | необхідність | Der Antrag muss bis Freitag eingereicht werden. |
| kann | можливість | Der Fehler kann behoben werden. |
| darf nicht | заборона | Hier darf nicht geraucht werden. |
| soll | вимога, розпорядження | Alle Türen sollen kontrolliert werden. |

## Безособовий пасив

Пасив не потребує підмета, якщо дія не має додатка в Akkusativ або важлива сама дія: *Es wird getanzt.* («Танцюють».) Займенник *es* тут не підмет, а **місце-заповнювач на першій позиції**. Коли перше місце займає інший елемент, *es* зникає:

| Правильно | Неправильно |
|---|---|
| **Es** wird heute Abend getanzt. | ~~Heute Abend es wird getanzt.~~ |
| Heute Abend wird getanzt. | ~~Heute Abend wird es getanzt.~~ |
| Hier wird viel gearbeitet. | ~~Hier es wird viel gearbeitet.~~ |
| Mir wird geholfen. | ~~Ich werde geholfen.~~ |

Дієслово залишається в однині: *wird*. Такий пасив зручний для процесів і правил: *Hier wird gearbeitet. Am Wochenende wird viel gewandert. Es wird auf den Bus gewartet.* Дієслова з прийменниковим додатком теж можуть мати безособовий пасив.

**Яких дієслів немає в пасиві.** Зазвичай Vorgangspassiv не утворюють дієслова стану й міри: *haben, besitzen, bekommen, kennen, wissen*, а також *kosten* (= коштувати) і *wiegen* (= мати вагу; у значенні «зважувати» пасив є: *Die Koffer werden gewogen*). Зворотні дієслова (*sich freuen, sich waschen*) також не мають звичайного пасиву.

## Zustandspassiv: sein + Partizip II

*werden + Partizip II* показує **процес**. *sein + Partizip II* показує **стан після процесу** — результат, який зараз бачимо.

| | Vorgangspassiv (процес) | Zustandspassiv (стан) |
|---|---|---|
| Präsens | Die Tür **wird** geöffnet. | Die Tür **ist** geöffnet. |
| Präteritum | Die Tür **wurde** geöffnet. | Die Tür **war** geöffnet. |
| Український сенс | «Двері відчиняють» | «Двері відчинені» |

> [!diagram] Процес чи результат
> ```yaml
> layout: compare
> columns: { a: "wird … (процес)", b: "ist … (стан)" }
> nodes:
>   - { id: a1, col: a, label: "акцент", text: "хтось щось робить", tone: yellow }
>   - { id: a2, col: a, label: "приклад", text: "Das Fenster wird geschlossen.", note: "Хтось зачиняє вікно", tone: yellow }
>   - { id: a3, col: a, label: "ще приклад", text: "Der Tisch wird reserviert.", note: "Столик зараз резервують", tone: yellow }
>   - { id: b1, col: b, label: "акцент", text: "результат дії", tone: pink }
>   - { id: b2, col: b, label: "приклад", text: "Das Fenster ist geschlossen.", note: "Вікно зачинене", tone: pink }
>   - { id: b3, col: b, label: "ще приклад", text: "Der Tisch ist reserviert.", note: "Столик зарезервований", tone: pink }
> steps:
>   - { focus: [a1, a2], note: "wird geschlossen: ми бачимо дію. Хтось зараз зачиняє вікно." }
>   - { focus: a3, note: "wird reserviert: бронювання відбувається просто зараз." }
>   - { focus: [b1, b2], note: "ist geschlossen: дія вже завершена, лишився стан. Хто саме зачинив — неважливо." }
>   - { focus: b3, note: "ist reserviert: на табличці в ресторані. Це типова мова вивісок: Geöffnet, Geschlossen, Reserviert." }
> ```

Zustandspassiv утворюють перехідні дієслова, дія яких залишає видимий результат: *öffnen, schließen, reparieren, reservieren, besetzen, ausverkaufen, ausbuchen*. Поширені приклади: *Das Geschäft ist bis 20 Uhr geöffnet. Alle Zimmer sind ausgebucht. Rauchen ist hier verboten.*

**Не кожне «sein + Partizip II» — Zustandspassiv.** Дієслова руху й зміни стану (*gehen, kommen, einschlafen, aufstehen*) утворюють Perfekt з *sein*, і це **активний** час: *Er ist eingeschlafen. Sie ist gekommen.* Критерій простий: чи може дієслово мати додаток у Akkusativ (*Man öffnet die Tür*)? Якщо так, то зазвичай *ist geöffnet* — стан (винятки є: *Er ist den ganzen Weg gegangen* — активний Perfekt, хоча Akkusativ є). Якщо ні (*Er schläft ein*), то *ist eingeschlafen* — Perfekt.

**Українське «-ся» не завжди пасив.** «Двері відчиняються» можна сказати про дію, яку виконує хтось (*Die Tür wird geöffnet*), або про дію, яка відбувається сама (*Die Tür öffnet sich*). Німецька розрізняє їх: пасив припускає виконавця, зворотне дієслово — ні.

## Приклади

- Das Rathaus wurde 1905 gebaut. — Ратушу збудували 1905 року.
- Die Brücke ist gestern gesperrt worden. — Міст закрили вчора.
- Als wir ankamen, war die Straße schon gesperrt worden. — Коли ми приїхали, вулицю вже закрили.
- Nächstes Jahr wird das Gebäude saniert. — Наступного року будівлю відремонтують.
- Der Fehler musste sofort behoben werden. — Помилку треба було виправити негайно.
- Das Formular muss vollständig ausgefüllt werden. — Формуляр треба заповнити повністю.
- Hier darf nicht geraucht werden. — Тут не можна палити.
- Heute Abend wird getanzt. — Сьогодні ввечері танці.
- Mir wurde bei der Anmeldung sofort geholfen. — Мені на реєстрації одразу допомогли.
- Das Büro ist bis 17 Uhr geöffnet. — Офіс відкритий до 17:00.
- Alle Zimmer sind leider ausgebucht. — На жаль, усі номери заброньовані.
- Die Tür öffnet sich automatisch. — Двері відчиняються автоматично.

## Слова

> [!word] das Passiv
> ipa: /ˈpasiːf/ · pos: noun · level: B1 · id: de-b2-passiv-w01
> uk: пасив; пасивний стан
> forms: die Passive
> example: Im **Passiv** steht oft nicht, wer etwas tut. — У пасиві часто не сказано, хто діє.
> note: Das Aktiv — протилежність. Das Vorgangspassiv (werden) і das Zustandspassiv (sein).

> [!word] das Gebäude
> ipa: /ɡəˈbɔʏ̯də/ · pos: noun · level: B1 · id: de-b2-passiv-w02
> uk: будівля; споруда
> forms: die Gebäude
> example: Das **Gebäude** wurde im 19. Jahrhundert errichtet. — Будівлю зведено в XIX столітті.
> note: das Haus — і «будинок», і «житло»; das Gebäude — будь-яка споруда: школа, вокзал, офіс.

> [!word] errichten
> ipa: /ɛɐ̯ˈʁɪçtn̩/ · pos: verb · level: B2 · id: de-b2-passiv-w03
> uk: зводити; споруджувати; створювати
> forms: errichten → errichtete → hat errichtet
> example: Auf dem Platz wird ein Denkmal **errichtet**. — На площі зводять памʼятник.
> note: також «створювати» в офіційному стилі: eine Stiftung errichten. Іменник — die Errichtung.

> [!word] abreißen
> ipa: /ˈapʁaɪ̯sn̩/ · pos: verb · level: B2 · id: de-b2-passiv-w04
> uk: зносити; зривати; відривати
> forms: abreißen → riss ab → hat abgerissen
> example: Das alte Hotel wurde **abgerissen**. — Старий готель знесли.
> note: відокремлюване. Іменник — der Abriss. ei: [aɪ̯], ß = [s].

> [!word] sanieren
> ipa: /zaˈniːʁən/ · pos: verb · level: B2 · id: de-b2-passiv-w05
> uk: ремонтувати, оздоровлювати (будівлю, фірму)
> forms: sanieren → sanierte → hat saniert
> example: Das Schulgebäude muss dringend **saniert** werden. — Будівлю школи треба терміново капітально відремонтувати.
> note: у житловому контексті — капітальний ремонт; ще й «фінансово оздоровлювати» (ein Unternehmen sanieren). На відміну від renovieren (оновлення), sanieren — глибокий, капітальний ремонт.

> [!word] beheben
> ipa: /bəˈheːbn̩/ · pos: verb · level: B2 · id: de-b2-passiv-w06
> uk: усувати (несправність, помилку)
> forms: beheben → behob → hat behoben
> example: Der Fehler konnte schnell **behoben** werden. — Помилку вдалося швидко усунути.
> note: типово з Fehler, Schaden, Mangel, Störung. Невідокремлюване: behoben, не ~~gebehoben~~.

> [!word] unterzeichnen
> ipa: /ʊntɐˈtsaɪ̯çnən/ · pos: verb · level: B2 · id: de-b2-passiv-w07
> uk: підписувати (офіційно)
> forms: unterzeichnen → unterzeichnete → hat unterzeichnet
> example: Der Vertrag wurde gestern **unterzeichnet**. — Договір підписали вчора.
> note: урочистіше за unterschreiben (картка вже є); для угод, договорів, документів.

> [!word] die Umsetzung
> ipa: /ˈʊmzɛtsʊŋ/ · pos: noun · level: B2 · id: de-b2-passiv-w08
> uk: втілення; реалізація
> forms: die Umsetzungen
> example: Die **Umsetzung** des Plans dauert zwei Jahre. — Реалізація плану триває два роки.
> note: umsetzen — реалізовувати (ein Konzept umsetzen). Наголос на першому складі, [ˈʊmzɛtsʊŋ].

> [!word] die Eröffnung
> ipa: /ɛɐ̯ˈʔœfnʊŋ/ · pos: noun · level: B2 · id: de-b2-passiv-w09
> uk: відкриття (заходу, магазину)
> forms: die Eröffnungen
> example: Die **Eröffnung** der Ausstellung ist am Freitag. — Відкриття виставки в пʼятницю.
> note: ö — губи як для «о», язик як для «е». Протилежність: die Schließung.

> [!word] die Verordnung
> ipa: /fɛɐ̯ˈʔɔʁdnʊŋ/ · pos: noun · level: B2 · id: de-b2-passiv-w10
> uk: розпорядження; постанова
> forms: die Verordnungen
> example: Die neue **Verordnung** tritt am 1. Januar in Kraft. — Нове розпорядження набирає чинності 1 січня.
> note: нижчий за закон акт: Gesetz → Verordnung. Також: ärztliche Verordnung — призначення лікаря.

> [!word] die Regelung
> ipa: /ˈʁeːɡəlʊŋ/ · pos: noun · level: B2 · id: de-b2-passiv-w11
> uk: врегулювання; положення; правило
> forms: die Regelungen
> example: Die **Regelung** gilt für alle Mitarbeiter. — Положення діє для всіх працівників.
> note: regeln — врегулювати. Не лише «правила», а й «як це вирішено».

> [!word] die Ausstellung
> ipa: /ˈaʊ̯sʃtɛlʊŋ/ · pos: noun · level: B1 · id: de-b2-passiv-w12
> uk: виставка
> forms: die Ausstellungen
> example: Die **Ausstellung** wird bis Ende Mai gezeigt. — Виставка триває до кінця травня.
> note: ще й «видача документа»: die Ausstellung des Reisepasses. Пишемо з двома s і двома l: Ausstellung.

> [!word] kontrollieren
> ipa: /kɔntʁɔˈliːʁən/ · pos: verb · level: B1 · id: de-b2-passiv-w13
> uk: перевіряти; контролювати
> forms: kontrollieren → kontrollierte → hat kontrolliert
> example: Die Tickets werden im Zug **kontrolliert**. — Квитки перевіряють у потязі.
> note: невідокремлюване, без ge- у Partizip II; -ieren — наголос на -ier-. Іменник die Kontrolle.

> [!word] sperren
> ipa: /ˈʃpɛʁən/ · pos: verb · level: B2 · id: de-b2-passiv-w14
> uk: закривати (прохід, дорогу); блокувати
> forms: sperren → sperrte → hat gesperrt
> example: Die Straße wird wegen Bauarbeiten **gesperrt**. — Вулицю закривають через будівельні роботи.
> note: sp на початку слова = «шп». Також: eine Karte sperren — заблокувати картку.

> [!word] die Sperrung
> ipa: /ˈʃpɛʁʊŋ/ · pos: noun · level: B2 · id: de-b2-passiv-w15
> uk: перекриття; блокування
> forms: die Sperrungen
> example: Wegen der **Sperrung** fahren die Busse eine andere Strecke. — Через перекриття автобуси їдуть іншим маршрутом.
> note: на дорогах і залізниці: Vollsperrung — повне перекриття.

## Слухаємо

> [!listen] Що ти почув?
> level: B2 · type: choice · id: de-b2-passiv-l01
> audio: Das Haus ist vor zehn Jahren gebaut worden.
> - [ ] Das Haus wurde vor zehn Jahren gebaut.
> - [x] Das Haus ist vor zehn Jahren gebaut worden.
> - [ ] Das Haus war vor zehn Jahren gebaut worden.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-passiv-l02
> audio: Hier darf nicht geraucht werden.

> [!listen] Послухай діалог. Що відбувається з вулицею?
> level: B2 · type: answer · id: de-b2-passiv-l03
> audio: A: Warum ist die Straße gesperrt?
> audio: B: Sie wird gerade saniert. Mit den Arbeiten ist vor einer Woche begonnen worden.
> audio: A: Und wie lange dauert das?
> audio: B: Bis Ende Mai soll alles fertig sein.
> - [x] Її зараз ремонтують, роботи вже почалися.
> - [ ] Її вже відремонтували.
> - [ ] Її збираються закрити в травні.
>
> **Пояснення:** *wird gerade saniert* — процес, що триває зараз. *sind begonnen worden* — Perfekt пасиву: роботи розпочато тиждень тому. До кінця травня (*bis Ende Mai*) їх мають закінчити.

> [!listen] Послухай оголошення. Що правда?
> level: B2 · type: answer · id: de-b2-passiv-l04
> audio: Der Kassenbereich ist von zwölf bis dreizehn Uhr geschlossen. Dringende Anfragen werden an Schalter vier bearbeitet.
> - [x] Каса зачинена в обідню перерву, термінові питання приймають на четвертому вікні.
> - [ ] Каса відкрита безперервно, а четверте вікно зачинене.
> - [ ] Усі питання обробляють лише після тринадцятої години.
>
> **Пояснення:** *ist geschlossen* — стан («зачинено»), а *werden … bearbeitet* — процес («опрацьовують»). Це різниця між Zustandspassiv і Vorgangspassiv у одному оголошенні.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: de-b2-passiv-l05
> audio: Mir wurde sofort geholfen.

## Вимова

У пасиві головна вимовна пастка — довгий ряд приголосних на кінці речення: *geraucht werden*, *gebaut worden*. Наголос падає на корінь Partizip II (*geˈraucht*), а *werden / worden* вимовляються швидко й легко: [ˈveːɐ̯dn̩], [ˈvɔʁdn̩]. Закінчення -en після d і t зазвичай стягується в складотворче [n̩].

> [!speak] Скажи вголос
> level: B2 · id: de-b2-passiv-s01
> text: Das Haus ist vor zehn Jahren gebaut worden.
> ipa: /das haʊ̯s ɪst foːɐ̯ tseːn ˈjaːʁən ɡəˈbaʊ̯t ˈvɔʁdn̩/
> tip: worden — коротке [ɔ]: «ворден», не «вурден». gebaut — [ɡəˈbaʊ̯t], дифтонг au = «ау».
> uk: Будинок збудували десять років тому.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-passiv-s02
> text: Hier darf nicht geraucht werden.
> ipa: /hiːɐ̯ daʁf nɪçt ɡəˈʁaʊ̯xt ˈveːɐ̯dn̩/
> tip: darf — кінцеве f; nicht — ch після i = [ç]. geraucht — ch після au = [x], як українське «х».
> uk: Тут не можна палити.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-passiv-s03
> text: Das Dach muss repariert werden.
> ipa: /das dax mʊs ʁepaˈʁiːɐ̯t ˈveːɐ̯dn̩/
> tip: repariert — наголос на -ier-: «репарі́рт». Dach — ch після a = [x].
> uk: Дах треба відремонтувати.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-passiv-s04
> text: Heute Abend wird getanzt.
> ipa: /ˈhɔʏ̯tə ˈaːbn̩t vɪʁt ɡəˈtantst/
> tip: Abend — довге «а» і «b» дзвінке всередині слова. getanzt закінчується на -tst: «ґетанцт».
> uk: Сьогодні ввечері танці.

> [!speak] Скажи вголос
> level: B2 · id: de-b2-passiv-s05
> text: Das Geschäft ist bis zwanzig Uhr geöffnet.
> ipa: /das ɡəˈʃɛft ɪst bɪs ˈtsvantsɪç uːɐ̯ ɡəˈʔœfnət/
> tip: zwanzig — z = [ts], -ig = [ɪç]. geöffnet — ö губами як «о», язик як «е»; наголос на -öff-.
> uk: Магазин відкритий до двадцятої години.

## Типові помилки українців

> [!pitfall] «ist gebaut geworden» замість «ist gebaut worden»
> *geworden* — це «стати» (*Er ist Arzt geworden*). У пасиві в Perfekt і Plusquamperfekt потрібна коротка форма **worden**: *Das Haus **ist** gebaut **worden**. Das Haus **war** gebaut **worden**.* Допоміжне — *sein*: не ~~hat gebaut worden~~.

> [!pitfall] «Магазин відкритий» ≠ wird geöffnet
> Українська «відкритий» і «відкривається» часто звучать близько, а німецька їх розводить. *Das Geschäft **ist** geöffnet* — «магазин відкритий» (стан). *Das Geschäft **wird** geöffnet* означає, що хтось зараз його відчиняє. А «магазин відкривається о восьмій» — *Das Geschäft öffnet um 8 Uhr* (активне) або *wird um 8 Uhr geöffnet* (процес).

> [!pitfall] Порядок слів із модальним у пасиві
> Passiv-Infinitiv (*repariert werden*) — одне ціле і йде в кінець. Не ~~Das Dach muss werden repariert~~, а *Das Dach muss repariert werden*. У підрядному реченні модальне дієслово стоїть після нього: не ~~…, weil das Dach muss repariert werden~~, а *…, weil das Dach repariert werden **muss***.

> [!pitfall] «es» на другому місці в безособовому пасиві
> *Es wird getanzt* — це *es* на першій позиції. Якщо вперед виходить обставина, *es* зникає: *Heute Abend wird getanzt*, а не ~~Heute Abend wird es getanzt~~. А з Dativ додаток лишається в Dativ: *Mir wird geholfen*, не ~~Ich werde geholfen~~.

## Практика

> [!quiz] Яка форма — Futur I пасиву?
> level: B2 · type: single · id: de-b2-passiv-q02
> - [x] Die Straße wird saniert werden.
> - [ ] Die Straße wird saniert worden sein.
> - [ ] Die Straße ist saniert worden.
> - [ ] Die Straße wurde saniert.
>
> **Пояснення:** Futur I пасиву — *wird* + Partizip II + **werden**. *…worden sein* — Futur II пасиву, *ist … worden* — Perfekt, *wurde* — Präteritum.

> [!quiz] «Коли ми прийшли, двері вже були відчинені (кимось)». Обери правильне речення у Plusquamperfekt пасиву.
> level: B2 · type: single · id: de-b2-passiv-q03
> - [x] Als wir kamen, war die Tür schon geöffnet worden.
> - [ ] Als wir kamen, hatte die Tür schon geöffnet worden.
> - [ ] Als wir kamen, war die Tür schon geöffnet geworden.
> - [ ] Als wir kamen, wurde die Tür schon geöffnet worden.
>
> **Пояснення:** у Plusquamperfekt пасиву — *war … Partizip II + worden*. *hatte* не підходить, бо допоміжне пасиву — *sein*. *geworden* — інше дієслово («стати»), *wurde … worden* змішує два часи.

> [!quiz] Заповни пропуски: часи пасиву
> level: B2 · type: fill · id: de-b2-passiv-q04
>
> ```text fill
> Das Rathaus [[wurde]] 1905 gebaut.
> Das Rathaus [[ist]] 2015 renoviert [[worden]].
> Die Brücke [[war]] schon gesperrt [[worden]], als wir kamen.
> Nächstes Jahr [[wird]] die Straße saniert [[werden]].
> ```
>
> **Пояснення:** Präteritum — *wurde*. Perfekt — *ist … worden*. Plusquamperfekt — *war … worden*. Futur I — *wird … werden*.

> [!quiz] Як сказати: «Дах треба відремонтувати»?
> level: B2 · type: single · id: de-b2-passiv-q05
> - [x] Das Dach muss repariert werden.
> - [ ] Das Dach muss werden repariert.
> - [ ] Das Dach wird repariert müssen.
> - [ ] Das Dach muss reparieren werden.
>
> **Пояснення:** модальне дієслово на другому місці, потім Passiv-Infinitiv: Partizip II + *werden*, обидва в кінці. *reparieren werden* — інфінітив замість Partizip II.

> [!quiz] Склади підрядне речення: «Я знаю, що автомобіль треба відремонтувати»
> level: B2 · type: order · id: de-b2-passiv-q06
>
> ```text order
> Ich
> weiß,
> dass
> das
> Auto
> repariert
> werden
> muss.
> wird ✗
> ```
>
> **Пояснення:** у підрядному реченні модальне дієслово стоїть останнім, після Passiv-Infinitiv (*repariert werden*). *wird* дало б Präsens пасиву, а не «треба».

> [!quiz] Які речення правильні (Perfekt пасиву)?
> level: B2 · type: multi · id: de-b2-passiv-q07
> - [x] Das Gebäude ist saniert worden.
> - [x] Die Tür ist geöffnet worden.
> - [x] Er ist von allen gelobt worden.
> - [ ] Das Haus ist gebaut geworden.
> - [ ] Der Brief hat geschrieben worden.
>
> **Пояснення:** пасив Perfekt = *ist / sind* + Partizip II + **worden**. *geworden* належить іншому дієслову («стати»). *hat … worden* неможливе: допоміжне пасиву — *sein*.

> [!quiz] «Магазин зараз відкритий» (стан). Як сказати?
> level: B2 · type: single · id: de-b2-passiv-q08
> - [x] Das Geschäft ist geöffnet.
> - [ ] Das Geschäft wird geöffnet.
> - [ ] Das Geschäft ist geöffnet worden.
> - [ ] Das Geschäft öffnet.
>
> **Пояснення:** стан — *sein + Partizip II*. *wird geöffnet* — процес (хтось відчиняє), *ist geöffnet worden* — Perfekt процесу («було відчинено»), *öffnet* — активне «відкривається» (момент початку роботи).

> [!quiz] У яких реченнях описано стан, а не процес?
> level: B2 · type: multi · id: de-b2-passiv-q09
> - [x] Das Fenster ist geschlossen.
> - [x] Der Tisch ist reserviert.
> - [ ] Das Fenster wird geschlossen.
> - [ ] Der Tisch ist reserviert worden.
>
> **Пояснення:** *ist + Partizip II* — Zustandspassiv: результат, який бачимо зараз. *wird geschlossen* — дія відбувається. *ist reserviert worden* — Perfekt Vorgangspassiv: хтось виконав бронювання (дія в минулому), тому тут увага на самій дії.

> [!quiz] Заповни пропуски: Zustandspassiv
> level: B2 · type: fill · id: de-b2-passiv-q10
>
> ```text fill
> Das Büro [[ist]] bis 17 Uhr geöffnet.
> Als wir kamen, [[war]] die Rechnung schon bezahlt. (стан)
> Alle Zimmer [[sind]] leider ausgebucht.
> ```
>
> **Пояснення:** стан у теперішньому — *ist / sind*, у минулому — *war*. Підмет *alle Zimmer* — множина, тому *sind*.

> [!quiz] Склади безособовий пасив: «Сьогодні ввечері танці»
> level: B2 · type: order · id: de-b2-passiv-q11
>
> ```text order
> Heute
> Abend
> wird
> getanzt.
> es ✗
> ```
>
> **Пояснення:** обставина на першому місці, тому *es* не потрібне. Дієслово *wird* на другому місці, Partizip II — у кінці. Заповнювач *es* стоїть тільки на першій позиції: *Es wird heute Abend getanzt.*

> [!quiz] «Мені одразу допомогли». Як правильно?
> level: B2 · type: single · id: de-b2-passiv-q12
> - [x] Mir wurde sofort geholfen.
> - [ ] Ich wurde sofort geholfen.
> - [ ] Es wurde mich sofort geholfen.
> - [ ] Mich wurde sofort geholfen.
>
> **Пояснення:** *helfen* керує Dativ, і Dativ у пасиві зберігається. Підмета немає, тому *wurde* стоїть у 3-й особі однини. *Ich wurde geholfen* — помилка: *helfen* не дає підмета в Nominativ.

> [!quiz] Яке речення з безособовим пасивом правильне?
> level: B2 · type: single · id: de-b2-passiv-q13
> - [x] Hier wird viel gearbeitet.
> - [ ] Hier es wird viel gearbeitet.
> - [ ] Hier wird es viel gearbeitet.
> - [ ] Hier werden viel gearbeitet.
>
> **Пояснення:** підмета немає, тому дієслово в однині (*wird*), а *es* на першій позиції не потрібне. Форма *werden* вимагала б підмета у множині.

> [!quiz] Які з цих дієслів зазвичай не мають Vorgangspassiv?
> level: B2 · type: multi · id: de-b2-passiv-q14
> - [x] haben
> - [x] besitzen
> - [x] kennen
> - [ ] öffnen
> - [ ] reparieren
>
> **Пояснення:** *haben, besitzen, kennen* позначають стан, а не дію з обʼєктом, тому пасиву для них зазвичай немає. *öffnen* і *reparieren* — типові перехідні дієслова: *geöffnet / repariert werden*.

> [!quiz] Яка форма підходить у підрядному реченні: «Er sagt, dass das Haus 1990 ___.»
> level: B2 · type: single · id: de-b2-passiv-q15
> - [x] gebaut worden ist
> - [ ] gebaut geworden ist
> - [ ] ist gebaut worden
> - [ ] worden gebaut ist
>
> **Пояснення:** у підрядному реченні відмінюване дієслово стоїть у самому кінці: *gebaut worden ist*. *ist gebaut worden* — порядок головного речення.

> [!quiz] Заповни пропуски: пасив із модальним
> level: B2 · type: fill · id: de-b2-passiv-q16
>
> ```text fill
> Das Fenster darf nicht [[geöffnet]] werden. (відчиняти)
> Die Rechnung muss bis Freitag [[bezahlt]] werden. (оплатити)
> Gestern [[konnte]] der Fehler schnell behoben werden. (вдалося)
> ```
>
> **Пояснення:** Passiv-Infinitiv = Partizip II + *werden*. Третє речення — минуле (*gestern*), тому *konnte*: Präteritum модального.

> [!quiz] Склади речення: «Міст довелося закрити»
> level: B2 · type: order · id: de-b2-passiv-q17
>
> ```text order
> Die
> Brücke
> musste
> gesperrt
> werden.
> wurde ✗
> ```
>
> **Пояснення:** Präteritum модального (*musste*) + Passiv-Infinitiv. *wurde* було б звичайним пасивом без «довелося».

> [!quiz] «Двері самі відчинилися». Яке речення підходить?
> level: B2 · type: single · id: de-b2-passiv-q18
> - [x] Die Tür öffnete sich.
> - [ ] Die Tür wurde geöffnet.
> - [ ] Die Tür war geöffnet.
> - [ ] Die Tür ist geöffnet worden.
>
> **Пояснення:** якщо дія відбувається сама, німецька вживає зворотне дієслово: *sich öffnen*. Пасив (*wurde geöffnet*) припускає виконавця; *war geöffnet* — лише стан.

## Фішки

> [!reel] 🚪 Geöffnet / Geschlossen
> На дверях кожного магазину в Німеччині висить табличка *Geöffnet* або *Geschlossen* — це Zustandspassiv у одному слові, без *ist*. Так само працюють *Reserviert* на столику й *Besetzt* на туалеті: Partizip II як вивіска «що з цим зараз».

> [!reel] 🗣️ Es wird gemunkelt
> Німці люблять безособовий пасив для чуток і оголошень: *Es wird gemunkelt, dass …* («ходять чутки, що …»), *Es wird gebeten, das Rauchen zu unterlassen* («просимо не палити»). Виконавця не названо, тож звучить і ввічливо, і трохи загадково. *munkeln* — шепотітися, пускати чутки.

> [!reel] 🧩 Куди зникло ge- в worden
> У словнику біля *werden* стоїть *ist geworden / worden*: дієслово має **дві** форми Partizip II, по одній на кожну роль. *geworden* — коли *werden* означає «ставати» (*ist alt geworden*), *worden* — коли воно допоміжне в пасиві (*ist gebaut worden*). Тому ці дві конструкції не можна міняти місцями.

## Джерела та що почитати

- [DWDS — Passiv](https://www.dwds.de/wb/Passiv) — визначення терміна, види пасиву.
- [DWDS — sanieren](https://www.dwds.de/wb/sanieren) — значення «ремонтувати» й «оздоровлювати».
- [DWDS — beheben](https://www.dwds.de/wb/beheben) — значення й типові сполучення.
- [Wikipedia — Zustandspassiv](https://de.wikipedia.org/wiki/Zustandspassiv) — огляд Zustandspassiv і відмінність від Perfekt.
- [Wikipedia — Passiv (Deutsch)](https://de.wikipedia.org/wiki/Passiv#Deutsch) — огляд німецького пасиву: Vorgangspassiv, Zustandspassiv, безособовий пасив.
- H. Dreyer, R. Schmitt — *Lehr- und Übungsbuch der deutschen Grammatik* (Hueber) — розділ «Passiv».

> [!important] Підсумок
> - Vorgangspassiv усіх часів: *wird gebaut, wurde gebaut, ist gebaut **worden**, war gebaut **worden**, wird gebaut **werden***. Не ~~geworden~~, не ~~hat~~.
> - З модальним: *Das Dach muss repariert werden.* У підрядному модальне останнє: *…, weil das Dach repariert werden muss.*
> - Безособовий пасив: *Es wird getanzt* / *Heute wird getanzt*; заповнювач *es* — на першій позиції; Dativ лишається: *Mir wird geholfen.*
> - Zustandspassiv = *sein* + Partizip II: *Das Geschäft ist geöffnet.* Процес — *wird*, стан — *ist*.
> - «Двері відчинилися самі» — *Die Tür öffnete sich*: пасив припускає виконавця.
