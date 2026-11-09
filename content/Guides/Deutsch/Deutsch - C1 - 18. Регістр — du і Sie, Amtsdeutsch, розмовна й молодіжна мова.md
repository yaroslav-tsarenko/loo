---
title: Регістр — du і Sie, Amtsdeutsch, розмовна й молодіжна мова
id: de-c1-register
level: C1
icon: px:chat
tags: [deutsch, c1, skills, register, amtsdeutsch, umgangssprache, jugendsprache, duzen]
prerequisites: ["[[Deutsch - C1 - 15. Професійна комунікація — переговори, фідбек]]", "[[Deutsch - B1 - 13. Розмовні скорочення — hab', 'ne, haste, gibt's]]"]
estimatedMinutes: 45
---

# Регістр — du і Sie, Amtsdeutsch, розмовна й молодіжна мова

> [!success] Після цієї теми ти зможеш
> - розрізняти чотири рівні німецької — **Amtsdeutsch**, нейтральну стандартну мову, **Umgangssprache** і **Jugendsprache** — і перемикатися між ними залежно від адресата;
> - вирішувати, коли **duzen**, а коли **siezen** у Німеччині, Австрії й Швейцарії, і як ввічливо прийняти або запропонувати *das Du*;
> - «перекладати» канцелярит на звичайну мову: *fernmündlich → telefonisch*, *zwecks Klärung → um das zu klären*;
> - розуміти молодіжні слова (*cringe, lost, Digga, das crazy*) і не вживати їх там, де вони звучать недоречно.

## Передбач

> [!quiz] Ти пишеш у месенджері новій колезі, з якою ще не знайомий. У компанії всі звертаються одне до одного на «Sie». Яке повідомлення доречне?
> level: C1 · type: single · id: de-c1-register-q01
> - [ ] Hey, kannst du mir mal kurz die Datei schicken?
> - [x] Guten Morgen, Frau Lenz, könnten Sie mir bitte die Datei schicken?
> - [ ] Sehr geehrte Frau Lenz, hiermit ersuche ich Sie um Übersendung der Datei.
> - [ ] Hallo Frau Lenz, kannst du mir die Datei schicken?
>
> **Пояснення:** доречний **нейтрально-ввічливий** регістр: *Sie*, привітання, Konjunktiv II (*könnten Sie*). Перший варіант — фамільярний (*du, mal kurz*). Третій граматично правильний, але звучить як лист з установи (*ersuche … um Übersendung*), тобто занадто офіційно для чату. Четвертий змішує прізвище з *du* — типова помилка: *Frau Lenz* і *du* разом не вживають.

## Пояснення

### Що таке регістр

**Регістр** (*das Register*, *die Stilebene*) — це вибір слів, граматики й тону залежно від того, **кому**, **де** і **навіщо** ти говориш. Українською ти теж не пишеш у ЦНАП так, як пишеш другові. Але в німецькій різниця видніша: окрема форма звертання (*du / Sie*), окрема лексика канцелярії і багато розмовних слів, яких немає в підручниках.

| Рівень | Де звучить | Приклад: «Зателефонуйте нам» | Ознаки |
|---|---|---|---|
| **Amtsdeutsch** (канцелярит) | листи установ, закони, формуляри | *Wir bitten um fernmündliche Kontaktaufnahme.* | Nominalstil, пасив, прийменники з Genitiv (*zwecks, seitens*) |
| **писемна стандартна мова** (gehoben) | наука, преса, офіційні листи | *Bitte setzen Sie sich telefonisch mit uns in Verbindung.* | повні речення, ввічливі формули |
| **нейтральна стандартна мова** | робота, магазин, лікар | *Rufen Sie uns bitte an.* | *Sie*, звичайні слова |
| **Umgangssprache** (розмовна) | друзі, родина, колеги на *du* | *Ruf mal an!* | *mal, halt, ne*, скорочення, *Kohle, pennen* |
| **Jugendsprache** (молодіжна) | підлітки, соцмережі | *Digga, call mich!* | англіцизми, слова-маркери групи |

> [!diagram] Шкала регістрів: від установи до шкільного двору
> ```yaml
> layout: flow
> nodes:
>   - { id: amt, label: "1 · Amtsdeutsch", text: "fernmündliche Kontaktaufnahme", note: "лист з установи", tone: gray }
>   - { id: geh, label: "2 · gehoben", text: "sich telefonisch in Verbindung setzen", note: "офіційний лист", tone: yellow }
>   - { id: neu, label: "3 · neutral", text: "Rufen Sie uns bitte an.", note: "робота, сервіс", tone: pink }
>   - { id: umg, label: "4 · umgangssprachlich", text: "Ruf mal an!", note: "друзі, родина", tone: yellow }
>   - { id: jug, label: "5 · Jugendsprache", text: "Digga, call mich!", note: "підлітки, чати", tone: gray }
> edges:
>   - { from: amt, to: geh }
>   - { from: geh, to: neu }
>   - { from: neu, to: umg }
>   - { from: umg, to: jug }
> steps:
>   - { focus: amt, note: "Канцелярит: іменники замість дієслів (Kontaktaufnahme), рідкісні слова (fernmündlich = telefonisch). Його треба розуміти, але самому так писати майже не доводиться." }
>   - { focus: geh, note: "Писемна стандартна мова: ввічливо й повно. Так пишуть заяви, скарги, листи в університет." }
>   - { focus: neu, note: "Центр шкали — ти завжди можеш на нього спертися. Sie + звичайні слова + bitte." }
>   - { focus: umg, note: "Розмовна мова: mal, halt, скорочення (hab's), розмовні слова (Kohle = гроші). Тільки з тими, з ким ти на du." }
>   - { focus: jug, note: "Молодіжна мова швидко змінюється. Розуміти — корисно, вживати — обережно: від дорослого вона часто звучить кумедно." }
> ```
> Кольори тут лише розділяють сусідні рівні; номер і назва рівня є в кожному блоці.

### du чи Sie: правила DACH

*Sie* — ввічлива форма для дорослих, яких ти не знаєш, і для професійних ролей (лікар, чиновник, продавець, викладач у вузі). *du* — для родини, друзів, дітей, а також у спільнотах, де так прийнято (спортклуб, студенти між собою, багато стартапів).

| Ситуація | Зазвичай | Примітка |
|---|---|---|
| установа, лікар, банк | **Sie** | *du* сприймуть як неповагу |
| колеги в класичній фірмі | **Sie**, поки не запропонують *du* | у багатьох компаніях усі на *du* з першого дня |
| стартап, ІТ, креативні професії | часто **du** | дивись, як пишуть інші, і повторюй |
| студенти між собою | **du** | викладачі — зазвичай *Sie* |
| діти й підлітки до ≈ 16 років | **du** | у школі старших учнів інколи кличуть на *Sie* |
| інтернет-магазини, реклама | часто **du** | «Hol dir jetzt …» — маркетингова близькість |

**Хто пропонує *du*?** Традиційно — старша або вища за посадою людина: *Wollen wir uns duzen?* / *Ich bin übrigens Jana.* Відповідь: *Gern, ich bin Taras.* Відмовитися ввічливо важко, тож у формальному середовищі ініціативу краще лишити іншій стороні.

**Гібриди:** *Hamburger Sie* — імʼя + *Sie* (*Jana, können Sie …?*), часто в офісах і серед персоналу. *Münchner Du* — прізвище + *du* (*Frau Lenz, kannst du …?*) — рідкісне, регіональне, учневі краще не вживати.

> [!note] Австрія й Швейцарія
> **AT:** титули важливіші, ніж у Німеччині: *Frau Magistra*, *Herr Magister*, *Herr Doktor* — у листі й в усному звертанні. **CH:** у робочому середовищі на *du* переходять швидко, а в розмові панує діалект (*Schwiizerdütsch*). Письмова стандартна мова в Швейцарії — без *ß*, тому *Grüsse* замість *Grüße*.

### Amtsdeutsch: як читати канцелярит

Листи й бланки установ (*Bescheid*, *Schreiben*, *Vordruck*) мають свої звички. Їх треба **розуміти**, а у власних листах — помʼякшувати.

| Amtsdeutsch | Звичайною мовою | Що змінилося |
|---|---|---|
| *fernmündlich* | *telefonisch* | рідкісне слово → звичайне |
| *Lichtzeichenanlage* | *Ampel* | технічний термін → побутове слово |
| *zwecks Klärung* | *um das zu klären* | Genitiv-прийменник → *um … zu* |
| *seitens des Vermieters* | *vom Vermieter* | Genitiv → *von* |
| *Die Inanspruchnahme der Leistung ist kostenpflichtig.* | *Wenn Sie die Leistung nutzen, kostet das Geld.* | іменник → підрядне речення |
| *Wir setzen Sie hiermit in Kenntnis, dass …* | *Wir informieren Sie, dass …* | сполука іменника з дієсловом → дієслово |
| *Es wird um Rücksendung gebeten.* | *Bitte schicken Sie es zurück.* | безособовий пасив → прохання |

> [!tip] Як відповідати установі
> На лист з установи відповідай **писемним стандартом**, а не канцеляритом: *Sehr geehrte Damen und Herren, ich beziehe mich auf Ihr Schreiben vom 3. März.* Повні речення, *Sie*, без *zwecks* і *seitens*. Так тебе зрозуміють швидше, а лист виглядатиме впевнено.

### Розмовна й молодіжна мова

**Umgangssprache** — не помилка, а інший регістр. Вона живе в усному мовленні й чатах: *Ich hab keine Kohle* (= *kein Geld*), *Ich penn bei dir* (= *Ich schlafe bei dir*), *Hast du's kapiert?* (= *verstanden*). У формальному тексті такі слова звучать грубувато або фамільярно.

**Jugendsprache** — ще вужча: слова-маркери групи, багато англіцизмів, швидка зміна моди. Деякі слова потрапляють у словники (*cringe*, *lost* є в Duden), інші зникають за рік. Для тебе головне — **розуміти**, бо ці слова чути в серіалах, школі дітей і соцмережах.

| Слово | Значення | Приклад |
|---|---|---|
| *cringe* | дуже ніяковий, «аж соромно» | *Das Video war so cringe.* |
| *lost* | розгублений, не в темі | *Bei Mathe bin ich komplett lost.* |
| *Digga* | друже, брате (звертання) | *Digga, was geht?* |
| *das crazy* | «оце так!», «капець» | *— Er hat den Job gekündigt. — Das crazy.* |
| *Aura* | харизма, «крутість» людини | *Der Typ hat Aura.* |
| *chillen* | відпочивати, розслаблятися | *Wir chillen am See.* |

## Приклади

- *Könnten Sie mir bitte sagen, bis wann ich das Formular abgeben muss?* — Чи не могли б ви сказати, до коли я маю здати формуляр? (нейтрально-ввічливо)
- *Wollen wir uns duzen? Ich bin Jana.* — Може, перейдемо на «ти»? Я Яна.
- *Die Rückmeldung hat fernmündlich zu erfolgen.* — Відповідь слід надати телефоном. (Amtsdeutsch)
- *Zwecks Prüfung Ihres Antrags benötigen wir weitere Unterlagen.* — Для перевірки вашої заяви нам потрібні додаткові документи. (Amtsdeutsch)
- *Seitens der Schule gibt es keine Einwände.* — З боку школи заперечень немає.
- *Ich hab grad echt keine Kohle.* — У мене зараз реально немає грошей. (розмовне)
- *Hast du's jetzt kapiert?* — Тепер дійшло? (розмовне, трохи різко)
- *Digga, das war voll cringe!* — Брате, це було так соромно! (молодіжне)
- *Ich bin bei dem Thema total lost.* — У цій темі я зовсім не тямлю.
- *Wir haben am Wochenende nur gechillt.* — На вихідних ми просто відпочивали.
- *Sehr geehrte Frau Magistra Huber, …* — Шановна пані магістр Губер, … (AT)

## Слова

### Регістр і стиль

> [!word] das Register
> ipa: /ʁeˈɡɪstɐ/ · pos: noun · level: C1 · id: de-c1-register-w01
> uk: регістр (мовний); реєстр; покажчик
> forms: die Register
> example: Im Gespräch mit Behörden wählt man ein höheres **Register**. — У розмові з установами обирають вищий регістр.
> note: у лінгвістиці — рівень мовлення (formell, neutral, umgangssprachlich). Також: покажчик у книжці, реєстр (das Handelsregister). Наголос на -gis-.

> [!word] die Stilebene
> ipa: /ˈʃtiːlˌʔeːbənə/ · pos: noun · level: C1 · id: de-c1-register-w02
> uk: стильовий рівень; рівень мовлення
> forms: die Stilebenen
> example: Das Wort gehört zu einer anderen **Stilebene**. — Це слово належить до іншого стильового рівня.
> note: der Stil + die Ebene; рід — від Ebene. Словники позначають стильові рівні так: gehoben, umgangssprachlich, salopp, derb.

> [!word] das Amtsdeutsch
> ipa: /ˈamtsdɔʏ̯tʃ/ · pos: noun · level: C1 · id: de-c1-register-w03
> uk: канцелярит; мова установ
> forms: — (без множини)
> example: Der Brief ist in typischem **Amtsdeutsch** geschrieben. — Лист написано типовим канцеляритом.
> note: часто з відтінком критики. Нейтральніше: die Verwaltungssprache.

> [!word] die Verwaltungssprache
> ipa: /fɛɐ̯ˈvaltʊŋsˌʃpʁaːxə/ · pos: noun · level: C1 · id: de-c1-register-w04
> uk: мова адміністрації, адміністративна мова
> forms: die Verwaltungssprachen
> example: Viele Städte wollen ihre **Verwaltungssprache** verständlicher machen. — Багато міст хочуть зробити мову своїх установ зрозумілішою.
> note: нейтральний термін; Amtsdeutsch — розмовне й критичне позначення того самого.

> [!word] die Jugendsprache
> ipa: /ˈjuːɡn̩tˌʃpʁaːxə/ · pos: noun · level: B2 · id: de-c1-register-w05
> uk: молодіжна мова, сленг молоді
> forms: die Jugendsprachen (рідко)
> example: Die **Jugendsprache** verändert sich sehr schnell. — Молодіжна мова змінюється дуже швидко.
> note: d у Jugend- оглушується: [ɡn̩t]. Щороку конкурс «Jugendwort des Jahres» проводить видавництво PONS Langenscheidt.

> [!word] förmlich
> ipa: /ˈfœʁmlɪç/ · pos: adj · level: B2 · id: de-c1-register-w08
> uk: офіційний; формальний; сухо-ввічливий
> example: Ihre Antwort war sehr **förmlich**. — Її відповідь була дуже офіційною.
> note: від die Form. Нейтральне: formell. Förmlich може мати відтінок «холодно, без тепла». Як прислівник — ще й «буквально»: Er ist förmlich explodiert.

> [!word] gehoben
> ipa: /ɡəˈhoːbn̩/ · pos: adj · level: C1 · id: de-c1-register-w09
> uk: піднесений, книжний (стиль)
> example: «Speisen» klingt **gehobener** als «essen». — «Speisen» звучить книжніше, ніж «essen».
> note: позначка словника «gehoben» — для урочистих і книжних слів (das Antlitz, entschlafen). Також: eine gehobene Position — висока посада.

> [!word] die Höflichkeitsform
> ipa: /ˈhøːflɪçkaɪ̯tsˌfɔʁm/ · pos: noun · level: B2 · id: de-c1-register-w12
> uk: ввічлива форма (звертання)
> forms: die Höflichkeitsformen
> example: «Sie» ist die **Höflichkeitsform** im Deutschen. — «Sie» — ввічлива форма в німецькій.
> note: Sie, Ihnen, Ihr — завжди з великої літери. Рід — від die Form.

### Amtsdeutsch

> [!word] das Schreiben
> ipa: /ˈʃʁaɪ̯bn̩/ · pos: noun · level: B2 · id: de-c1-register-w13
> uk: лист (офіційний), письмове звернення
> forms: die Schreiben
> example: Vielen Dank für Ihr **Schreiben** vom 3. März. — Дякуємо за ваш лист від 3 березня.
> note: у діловій і офіційній мові замість der Brief. Субстантивований інфінітив — тому das і множина без закінчення.

> [!word] der Vordruck
> ipa: /ˈfoːɐ̯dʁʊk/ · pos: noun · level: C1 · id: de-c1-register-w14
> uk: бланк, типова форма
> forms: die Vordrucke
> example: Bitte verwenden Sie den beiliegenden **Vordruck**. — Будь ласка, скористайтеся доданим бланком.
> note: синоніми: das Formular (звичайніше), der Antragsvordruck. AT також: das Formblatt.

> [!word] fernmündlich
> ipa: /ˈfɛʁnmʏntlɪç/ · pos: adj · level: C1 · id: de-c1-register-w15
> uk: телефонний; по телефону (канц.)
> example: Eine **fernmündliche** Auskunft ist leider nicht möglich. — На жаль, довідку телефоном не надаємо.
> note: Amtsdeutsch, застаріле. У звичайній мові — telefonisch. fern (далеко) + mündlich (усно).

> [!word] die Lichtzeichenanlage
> ipa: /ˈlɪçttsaɪ̯çn̩ˌʔanlaːɡə/ · pos: noun · level: C1 · id: de-c1-register-w16
> uk: світлофор (офіц. термін)
> forms: die Lichtzeichenanlagen
> example: Die **Lichtzeichenanlage** an der Kreuzung ist ausgefallen. — Світлофор на перехресті вимкнувся.
> note: термін правил дорожнього руху (StVO). У побуті — die Ampel. Класичний приклад канцеляриту.

> [!word] die Mitwirkungspflicht
> ipa: /ˈmɪtvɪʁkʊŋsˌpflɪçt/ · pos: noun · level: C1 · id: de-c1-register-w19
> uk: обовʼязок сприяти (надавати дані, документи)
> forms: die Mitwirkungspflichten
> example: Sie haben eine **Mitwirkungspflicht** und müssen Änderungen sofort melden. — Ви зобовʼязані сприяти й мусите одразу повідомляти про зміни.
> note: часто в листах Jobcenter, Familienkasse, Ausländerbehörde. mitwirken (сприяти) + die Pflicht.

> [!word] jemanden in Kenntnis setzen (von + Dat)
> ipa: /ˈjeːmandn̩ ɪn ˈkɛntnɪs ˈzɛtsn̩/ · pos: phrase · level: C1 · id: de-c1-register-w20
> uk: повідомити, поінформувати когось (офіц.)
> example: Wir **setzen** Sie hiermit davon **in Kenntnis**, dass Ihr Antrag eingegangen ist. — Цим повідомляємо, що вашу заяву отримано.
> note: офіційна сполука іменника з дієсловом. Звичайною мовою: informieren, mitteilen. Пор. zur Kenntnis nehmen — взяти до відома.

> [!word] umständlich
> ipa: /ˈʊmʃtɛntlɪç/ · pos: adj · level: B2 · id: de-c1-register-w22
> uk: заплутаний, громіздкий; незграбний
> example: Der Text ist sehr **umständlich** formuliert. — Текст сформульовано дуже громіздко.
> note: про текст, інструкцію, процедуру. Протилежне: einfach, klar, direkt. Від die Umstände.

### Розмовна мова

> [!word] pennen
> ipa: /ˈpɛnən/ · pos: verb · level: B2 · id: de-c1-register-w24
> uk: розм. спати; дрімати; «тупити»
> forms: pennen → pennte → hat gepennt
> example: Kann ich heute bei dir **pennen**? — Можна я сьогодні в тебе переночую?
> note: розмовне. Також «бути неуважним»: Da hast du wohl gepennt! — Ти, мабуть, проґавив! Нейтрально: schlafen.

> [!word] quatschen
> ipa: /ˈkvatʃn̩/ · pos: verb · level: B1 · id: de-c1-register-w25
> uk: розм. базікати, теревенити
> forms: quatschen → quatschte → hat gequatscht
> example: Wir haben stundenlang **gequatscht**. — Ми годинами теревенили.
> note: розмовне, не грубе. Пор.: Quatsch! — Дурниці! Нейтрально: sich unterhalten, reden.

> [!word] kapieren
> ipa: /kaˈpiːʁən/ · pos: verb · level: B2 · id: de-c1-register-w26
> uk: розм. второпати, зрозуміти
> forms: kapieren → kapierte → hat kapiert
> example: Hast du das endlich **kapiert**? — Ти нарешті второпав?
> note: розмовне, у питанні може звучати різко. Нейтрально: verstehen. -ieren: без ge- у Partizip II.

> [!word] der Kumpel
> ipa: /ˈkʊmpl̩/ · pos: noun · level: B1 · id: de-c1-register-w27
> uk: розм. приятель, кореш; гірник
> forms: die Kumpel (розм. die Kumpels)
> example: Ich gehe mit ein paar **Kumpels** ins Stadion. — Я йду з кількома приятелями на стадіон.
> note: первісно — шахтар (Ruhrgebiet). Жінка: die Kumpelin (рідко, розм.). Нейтрально: der Freund, der Bekannte.

> [!word] bescheuert
> ipa: /bəˈʃɔʏ̯ɐt/ · pos: adj · level: B2 · id: de-c1-register-w28
> uk: розм. дурний, безглуздий
> example: Das ist echt eine **bescheuerte** Idee. — Це справді безглузда ідея.
> note: salopp; про людину звучить образливо. Мʼякше: blöd, seltsam. Нейтрально: unsinnig.

> [!word] krass
> ipa: /kʁas/ · pos: adj · level: B1 · id: de-c1-register-w29
> uk: розм. крутий; жахливий; різкий
> example: Das Konzert war **krass**! — Концерт був неймовірний!
> note: у розмовній мові — і схвалення, і жах («krass, wie teuer!»). У писемній мові — «різкий, грубий»: ein krasser Gegensatz — різкий контраст.

### Молодіжна мова

> [!word] chillen
> ipa: /ˈtʃɪlən/ · pos: verb · level: B1 · id: de-c1-register-w30
> uk: розм. відпочивати, розслаблятися
> forms: chillen → chillte → hat gechillt
> example: Am Sonntag **chillen** wir einfach zu Hause. — У неділю ми просто відпочиваємо вдома.
> note: англіцизм (to chill). ch на початку — [tʃ], як «ч». Також: Chill mal! — Заспокойся!

> [!word] cringe
> ipa: /krɪndʒ/ · pos: adj · level: B2 · id: de-c1-register-w31
> uk: ніяковий, «аж соромно» (молодіжне)
> example: Der Werbespot ist echt **cringe**. — Ця реклама просто соромна.
> note: не відмінюється: ein cringe Video. Duden: umgangssprachlich; Jugendwort des Jahres 2021. Дієслово: cringen (cringte, hat gecringt).

> [!word] lost
> ipa: /lɔst/ · pos: adj · level: B2 · id: de-c1-register-w32
> uk: розгублений, не в темі (молодіжне)
> example: Ohne Navi bin ich in der Stadt völlig **lost**. — Без навігатора я в місті геть губляюся.
> note: Duden: umgangssprachlich, indeklinabel; Jugendwort des Jahres 2020. Нейтрально: ratlos, verwirrt.

> [!word] der Digga
> ipa: /ˈdɪɡa/ · pos: noun · level: B2 · id: de-c1-register-w33
> uk: друже, брате (звертання; молодіжне)
> forms: die Diggas
> example: **Digga**, was geht? — Брате, як справи?
> note: Duden: Jugendsprache. Вживається як звертання без артикля. Варіант: Digger. Від північнонім. Dicker (товстун) — за однією з версій.

> [!word] die Aura
> ipa: /ˈaʊ̯ʁa/ · pos: noun · level: C1 · id: de-c1-register-w34
> uk: аура; харизма
> forms: die Auren
> example: Die Schauspielerin hat eine besondere **Aura**. — Акторка має особливу ауру.
> note: книжне слово отримало молодіжне значення «крутість»: Der hat Aura. Jugendwort des Jahres 2024. Протилежне в чатах: Minus-Aura.

### Ще з листів і чатів

> [!word] die Kontaktaufnahme
> ipa: /kɔnˈtaktʔaʊ̯fˌnaːmə/ · pos: noun · level: C1 · id: de-c1-register-w35
> uk: звʼязок, встановлення контакту (офіц.)
> forms: die Kontaktaufnahmen
> example: Wir freuen uns über Ihre **Kontaktaufnahme**. — Будемо раді, якщо ви з нами звʼяжетеся.
> note: Nominalstil від Kontakt aufnehmen. Простіше: Melden Sie sich gern bei uns.

> [!word] hiermit
> ipa: /ˈhiːɐ̯mɪt/ · pos: adv · level: B2 · id: de-c1-register-w36
> uk: цим (документом), таким чином
> example: **Hiermit** kündige ich meinen Vertrag. — Цим я розриваю свій договір.
> note: типовий початок офіційної заяви: Hiermit beantrage / kündige / bestätige ich … В особистому листі звучить занадто офіційно. Інколи наголос на другому складі: [hiːɐ̯ˈmɪt].

> [!word] ersuchen (um + Akk)
> ipa: /ɛɐ̯ˈzuːxn̩/ · pos: verb · level: C2 · id: de-c1-register-w37
> uk: (офіц.) просити, звертатися з проханням
> forms: ersuchen → ersuchte → hat ersucht
> example: Wir **ersuchen** Sie um umgehende Antwort. — Просимо вас негайно відповісти.
> note: книжне й канцелярське; в Австрії в офіційних листах частіше, ніж у Німеччині. Звичайно: bitten um + Akk.

> [!word] die Leichte Sprache
> ipa: /ˈlaɪ̯çtə ˈʃpʁaːxə/ · pos: noun · level: C1 · id: de-c1-register-w38
> uk: «легка мова» (спрощена мова з чіткими правилами)
> forms: — (без множини)
> example: Die Stadt bietet ihre Informationen auch in **Leichter Sprache** an. — Місто пропонує інформацію також «легкою мовою».
> note: як термін — Leichte з великої. Короткі речення, без Genitiv і пасиву, пояснення складних слів. Мʼякший варіант — Einfache Sprache.

> [!word] das Jugendwort
> ipa: /ˈjuːɡn̩tˌvɔʁt/ · pos: noun · level: B2 · id: de-c1-register-w39
> uk: молодіжне слово
> forms: die Jugendwörter
> example: «Ragebait» ist das **Jugendwort** des Jahres 2026. — «Ragebait» — молодіжне слово 2026 року.
> note: рід і множина — від das Wort → die Wörter. Конкурс Jugendwort des Jahres проводить видавництво PONS Langenscheidt.

> [!word] labern
> ipa: /ˈlaːbɐn/ · pos: verb · level: B2 · id: de-c1-register-w40
> uk: розм. молоти язиком, патякати
> forms: labern → laberte → hat gelabert
> example: Lass ihn doch **labern**! — Хай собі патякає!
> note: розмовне, з негативним відтінком (на відміну від нейтральнішого quatschen). Laber nicht! — Не верзи!

> [!word] peinlich
> ipa: /ˈpaɪ̯nlɪç/ · pos: adj · level: B1 · id: de-c1-register-w41
> uk: ніяковий, соромний; прикрий
> example: Mein Fehler in der Präsentation war mir sehr **peinlich**. — Мені було дуже ніяково через помилку в презентації.
> note: нейтральний відповідник молодіжного cringe. Es ist mir peinlich, dass … — мені соромно, що … Також: peinlich genau — до дрібниць точно.

## Слухаємо

> [!listen] Послухай. Який це регістр?
> level: C1 · type: choice · id: de-c1-register-l01
> audio: Zwecks Prüfung Ihres Antrags bitten wir um fernmündliche Kontaktaufnahme.
> - [x] Zwecks Prüfung Ihres Antrags bitten wir um fernmündliche Kontaktaufnahme.
> - [ ] Um Ihren Antrag zu prüfen, rufen Sie uns bitte an.
> - [ ] Ruf mal an, dann checken wir deinen Antrag.
>
> **Пояснення:** прозвучало канцелярське речення: *zwecks*, *fernmündlich*, *Kontaktaufnahme*. Другий варіант — те саме нейтральною мовою, третій — розмовною (*ruf mal an, checken*).

> [!listen] Напиши або скажи, що почув
> level: C1 · type: dictation · id: de-c1-register-l02
> audio: Seitens der Schule gibt es keine Einwände.
> explain: *seitens* + Genitiv: *seitens der Schule* — з боку школи. *der Einwand → die Einwände*.

> [!listen] Яка пропозиція звучить у розмові?
> level: C1 · type: answer · id: de-c1-register-l03
> audio: A: Frau Becker, ich wollte Ihnen noch für die Hilfe danken.
> audio: B: Gern geschehen. Sagen Sie mal, wollen wir uns nicht duzen? Ich bin Petra.
> audio: A: Sehr gern, ich bin Taras.
> - [x] Пані Беккер пропонує перейти на «ти», і Тарас погоджується.
> - [ ] Тарас пропонує перейти на «ти», а пані Беккер відмовляється.
> - [ ] Обоє домовляються й далі звертатися на «ви».
> - [ ] Пані Беккер просить Тараса не називати її на імʼя.
>
> **Пояснення:** *wollen wir uns nicht duzen? Ich bin Petra* — пропозиція перейти на *du* й назвати імʼя. Пропонує саме Petra Becker, Тарас відповідає *Sehr gern, ich bin Taras*. Переклад: — Пані Беккер, я хотів ще подякувати вам за допомогу. — Нема за що. Слухайте, може, перейдемо на «ти»? Я Петра. — Залюбки, я Тарас.

> [!listen] Що означає реакція підлітка?
> level: C1 · type: answer · id: de-c1-register-l04
> audio: A: Hast du gehört? Jonas hat vor der ganzen Klasse ein Liebesgedicht vorgelesen.
> audio: B: Nein! Das ist so cringe, Digga.
> - [x] Йому ніяково за Йонаса: вчинок здається соромним.
> - [ ] Він захоплений віршем Йонаса.
> - [ ] Він не зрозумів, про що йдеться.
> - [ ] Він сердиться на співрозмовника.
>
> **Пояснення:** *cringe* — «аж соромно», ніяковість і сором за іншого. *Digga* — звертання до друга, тут без образи. Переклад: — Чув? Йонас прочитав перед усім класом любовний вірш. — Та ну! Це так соромно, брате.

## Вимова

> [!speak] Скажи вголос: ввічлива пропозиція
> level: C1 · id: de-c1-register-s01
> text: Wollen wir uns duzen? Ich bin Jana.
> ipa: /ˈvɔlən viːɐ̯ ʊns ˈduːtsn̩ ɪç bɪn ˈjaːna/
> tip: питання з інтонацією вгору на *duzen*; *z* = [ts]; *Jana* — j як «й».
> uk: Може, перейдемо на «ти»? Я Яна.

> [!speak] Скажи вголос
> level: C1 · id: de-c1-register-s02
> text: Ich beziehe mich auf Ihr Schreiben vom dritten März.
> ipa: /ɪç bəˈtsiːə mɪç aʊ̯f iːɐ̯ ˈʃʁaɪ̯bn̩ fɔm ˈdʁɪtn̩ mɛʁts/
> tip: *beziehe* — наголос на -zie-, [ts]; *Schreiben* — [ʃʁ], ei = [aɪ̯]; *März* — коротке [ɛ].
> uk: Я посилаюся на ваш лист від третього березня.

> [!speak] Скажи вголос: «переклад» канцеляриту
> level: C1 · id: de-c1-register-s03
> text: Bitte rufen Sie uns an, damit wir das klären können.
> ipa: /ˈbɪtə ˈʁuːfn̩ ziː ʊns an daˈmɪt viːɐ̯ das ˈklɛːʁən ˈkœnən/
> tip: *rufen … an* — відокремлюване: *an* у кінці головного речення з легким наголосом; *damit* як сполучник — наголос на -mit.
> uk: Будь ласка, зателефонуйте нам, щоб ми могли це зʼясувати.

## Типові помилки українців

> [!pitfall] Прізвище + du або імʼя + «Ви» за українською звичкою
> ~~Frau Lenz, kannst du …?~~ → **Frau Lenz, können Sie …?** або (якщо ви на *du*) **Anna, kannst du …?** В українській «пані Олено, ви…» звучить природно, а в німецькій прізвище з *Frau / Herr* майже завжди вимагає *Sie*. Імʼя + *Sie* (*Anna, können Sie …?*) можливе — це «гамбурзьке Sie» в офісах. А от *Frau Lenz + du* учневі краще не вживати.

> [!pitfall] Sie з малої літери або «ви» до друзів
> ~~Ich danke sie für ihre Hilfe~~ → Ich danke **Ihnen** für **Ihre** Hilfe. Ввічливе *Sie, Ihnen, Ihr* — завжди з великої, інакше читається як «вони». І навпаки: до кількох друзів — ***ihr*** (*Kommt ihr mit?*), а не *Sie*: українське «ви» до групи друзів відповідає німецькому *ihr*.

> [!pitfall] Канцелярит у власному листі
> Учні, які багато читали листів з установ, починають писати *Hiermit ersuche ich Sie zwecks Klärung um fernmündliche Kontaktaufnahme*. Граматично це правильно, але звучить неприродно навіть для установи. Пиши писемним стандартом: *Ich bitte Sie, mich anzurufen, damit wir die Frage klären können.*

> [!pitfall] Молодіжне слово в діловій ситуації
> *Das Meeting war echt cringe* чи *Ich bin bei dem Projekt lost* у листі керівникові звучать фамільярно й трохи кумедно від дорослого. В офіційному тексті: *Die Besprechung war unangenehm*, *Bei diesem Projekt fehlt mir noch der Überblick*. Розмовні *Kohle, pennen, kapieren* — теж лише для друзів.

## Ситуація: лист з Jobcenter

> [!listen] Олена читає подрузі лист з установи й питає, що він означає. Що їй треба зробити?
> level: C1 · type: answer · id: de-c1-register-l05
> audio: A: Hör mal: «Im Rahmen Ihrer Mitwirkungspflicht werden Sie gebeten, die Unterlagen binnen zwei Wochen einzureichen.» Was heißt das?
> audio: B: Ganz einfach: Du musst die Papiere in den nächsten zwei Wochen abgeben.
> audio: A: Und wenn ich Fragen habe?
> audio: B: Dann ruf an. Fernmündlich heißt nur telefonisch.
> - [x] Подати документи протягом двох тижнів; з питаннями — подзвонити.
> - [ ] Прийти особисто через два тижні без документів.
> - [ ] Нічого не робити: це лише інформація.
> - [ ] Відповісти листом у Leichte Sprache.
>
> **Пояснення:** *binnen zwei Wochen einreichen* = *in den nächsten zwei Wochen abgeben*; *Mitwirkungspflicht* — обовʼязок надати документи; *fernmündlich* = *telefonisch*. Переклад: — Слухай: «У межах вашого обовʼязку сприяння просимо подати документи протягом двох тижнів». Що це означає? — Усе просто: ти маєш здати папери протягом двох тижнів. — А якщо в мене є питання? — Тоді дзвони. «Fernmündlich» означає просто «телефоном».

> [!listen] Олена телефонує в установу. Як вона починає розмову?
> level: C1 · type: choice · id: de-c1-register-l06
> audio: Guten Tag, mein Name ist Olena Kovalenko. Ich rufe wegen Ihres Schreibens vom dritten März an.
> - [x] Guten Tag, mein Name ist Olena Kovalenko. Ich rufe wegen Ihres Schreibens vom dritten März an.
> - [ ] Hallo, hier ist Olena. Ich ruf wegen dem Brief an.
> - [ ] Sehr geehrte Damen und Herren, hiermit rufe ich an.
>
> **Пояснення:** нейтрально-ввічливий старт телефонної розмови: привітання, повне імʼя, привід (*wegen Ihres Schreibens* — писемний Genitiv). Другий варіант — розмовний (*ruf, wegen dem*), третій переносить формулу листа в усну мову.

> [!speak] Ситуація: почни дзвінок в установу
> level: C1 · id: de-c1-register-s04
> text: Guten Tag, ich rufe wegen Ihres Schreibens an.
> ipa: /ˈɡuːtn̩ taːk ɪç ˈʁuːfə ˈveːɡn̩ ˈiːʁəs ˈʃʁaɪ̯bn̩s an/
> tip: *Tag* — кінцеве g = [k], «так»; *wegen* — довге [eː]; *Schreibens* — Genitiv, -ns.
> uk: Добрий день, я телефоную щодо вашого листа.

> [!speak] Ситуація: попроси пояснити простіше
> level: C1 · id: de-c1-register-s05
> text: Könnten Sie mir das bitte in einfachen Worten erklären?
> ipa: /ˈkœntn̩ ziː miːɐ̯ das ˈbɪtə ɪn ˈaɪ̯nfaxn̩ ˈvɔʁtn̩ ɛɐ̯ˈklɛːʁən/
> tip: *könnten* — коротке [œ]; *einfachen* — ch після a = [x]; *erklären* — наголос на -klä-, [ɛː].
> uk: Чи не могли б ви пояснити мені це простими словами?

> [!speak] Ситуація: прийми пропозицію перейти на «ти»
> level: C1 · id: de-c1-register-s06
> text: Sehr gern, ich bin Taras. Danke für das Angebot.
> ipa: /zeːɐ̯ ɡɛʁn ɪç bɪn taˈʁas ˈdaŋkə fyːɐ̯ das ˈanɡəboːt/
> tip: *gern* — r після голосного майже не чути; *Angebot* — наголос на першому складі, кінцеве t чітке.
> uk: Залюбки, я Тарас. Дякую за пропозицію.

## Landeskunde: Zwischen Amtsdeutsch und Jugendwort

> [!example] Zwischen Amtsdeutsch und Jugendwort
> Wer in Deutschland lebt, wechselt jeden Tag mehrmals das Register. Am Morgen liest man vielleicht einen Brief vom Amt, mittags schreibt man einer Kollegin eine E-Mail, und abends kommen Nachrichten von den Jugendlichen in der Familie. Jede dieser Situationen folgt eigenen Regeln.
>
> Behördenbriefe gelten seit Langem als schwer verständlich. Typisch sind lange Nominalketten, Passivsätze und Wörter, die man sonst kaum benutzt, etwa „fernmündlich“ statt „telefonisch“ oder „Lichtzeichenanlage“ statt „Ampel“. Viele Verwaltungen bemühen sich inzwischen um eine klarere Sprache. Für Menschen mit geistigen oder seelischen Behinderungen gibt es sogar eine gesetzliche Regel: Nach § 11 des Behindertengleichstellungsgesetzes sollen Träger öffentlicher Gewalt mit ihnen in einfacher und verständlicher Sprache kommunizieren. Auf Verlangen sollen sie Bescheide erläutern und, wenn das nicht ausreicht, in Leichter Sprache erklären. Leichte Sprache arbeitet mit kurzen Sätzen, bekannten Wörtern und einer klaren Gliederung. Sie ist nicht dasselbe wie „Einfache Sprache“, die weniger strengen Regeln folgt und sich an ein breiteres Publikum richtet.
>
> Am anderen Ende der Skala steht die Jugendsprache. Jedes Jahr lässt der Verlag PONS Langenscheidt das „Jugendwort des Jahres“ wählen; gewertet werden nur die Stimmen von Jugendlichen zwischen elf und zwanzig Jahren. 2025 gewann „das crazy“ mit 35,7 Prozent der Stimmen, nur 0,2 Prozentpunkte vor dem zweiten Platz. Am 10. Oktober 2026 wurde auf der Frankfurter Buchmesse „Ragebait“ zum Jugendwort 2026 gekürt (36,5 Prozent): Gemeint sind Inhalte im Netz, die absichtlich Wut auslösen sollen. Auf den Plätzen zwei und drei landeten „Peak“ (33,8 Prozent) und „Crashout“ (29,7 Prozent). Die Liste zeigt, wie stark das Englische die Sprache junger Menschen prägt. Viele dieser Wörter verschwinden nach wenigen Jahren wieder; andere, wie „cringe“ oder „lost“, stehen inzwischen im Duden.
>
> Zwischen diesen Polen liegt das, was man im Alltag am häufigsten braucht: ein neutrales, höfliches Standarddeutsch. Ob man jemanden duzt oder siezt, hängt von der Situation ab. In Behörden, beim Arzt und gegenüber Unbekannten ist „Sie“ die sichere Wahl. In vielen Unternehmen, besonders in jungen Firmen, duzt man sich dagegen schon am ersten Arbeitstag. Wer unsicher ist, wartet lieber ab, denn traditionell bietet die ältere oder ranghöhere Person das Du an. Auch die Nachbarländer haben eigene Gewohnheiten: In Österreich spielen akademische Titel wie „Magister“ oder „Doktor“ in der Anrede traditionell eine größere Rolle als in Deutschland. Wer das Register passend wählt, wirkt nicht nur sprachlich korrekt, sondern auch sozial kompetent.

> [!quiz] Nach dem Text: Was verlangt § 11 des Behindertengleichstellungsgesetzes von Behörden?
> level: C1 · type: single · id: de-c1-register-q02
> - [ ] Alle Briefe müssen grundsätzlich in Leichter Sprache verschickt werden.
> - [x] Sie sollen mit Menschen mit geistigen oder seelischen Behinderungen einfach und verständlich kommunizieren und Bescheide auf Verlangen erklären.
> - [ ] Sie dürfen keine Fachwörter mehr verwenden.
> - [ ] Sie müssen alle Bürger duzen.
>
> **Пояснення:** у тексті: *sollen … in einfacher und verständlicher Sprache kommunizieren. Auf Verlangen sollen sie Bescheide erläutern* і лише якщо цього замало — *in Leichter Sprache erklären*. Обовʼязку писати всі листи Leichter Sprache закон не встановлює.

> [!quiz] Nach dem Text: Was stimmt über das Jugendwort des Jahres? Wähle alle richtigen Aussagen.
> level: C1 · type: multi · id: de-c1-register-q03
> - [x] Gewertet werden Stimmen von Jugendlichen zwischen elf und zwanzig Jahren.
> - [x] Das Jugendwort 2026 ist „Ragebait“.
> - [ ] „Ragebait“ bedeutet ein besonders lustiges Video.
> - [ ] Alle Jugendwörter kommen später in den Duden.
>
> **Пояснення:** вік 11–20 і «Ragebait» (2026) прямо названі в тексті. *Ragebait* — контент, що *absichtlich Wut auslösen* має, тобто «приманка для гніву», а не смішне відео. Про Duden: *viele … verschwinden … wieder*, лише деякі (*cringe, lost*) потрапили до словника.

> [!quiz] Nach dem Text: Wer bietet traditionell das Du an?
> level: C1 · type: single · id: de-c1-register-q04
> - [ ] die jüngere Person, weil sie die Initiative zeigen soll
> - [x] die ältere oder ranghöhere Person
> - [ ] immer die Frau
> - [ ] der Gast, der zum ersten Mal kommt
>
> **Пояснення:** *traditionell bietet die ältere oder ranghöhere Person das Du an*. Тому в незнайомому колективі краще не поспішати з *du*.

## Практика

> [!quiz] Яке речення — канцелярит (Amtsdeutsch)?
> level: C1 · type: single · id: de-c1-register-q05
> - [ ] Bitte rufen Sie uns an.
> - [x] Wir bitten um fernmündliche Kontaktaufnahme.
> - [ ] Ruf mich doch mal an!
> - [ ] Könnten Sie mich bitte zurückrufen?
>
> **Пояснення:** *fernmündliche Kontaktaufnahme* — подвійна ознака канцеляриту: рідкісне слово (*fernmündlich*) і віддієслівний іменник замість дієслова (*Kontaktaufnahme* замість *anrufen*). Інші варіанти — нейтральний, розмовний і ввічливий регістр.

> [!quiz] Обери всі речення, які доречні в листі керівникові, з яким ти на «Sie».
> level: C1 · type: multi · id: de-c1-register-q06
> - [x] Könnten Sie mir bitte bis Freitag Bescheid geben?
> - [x] Ich wäre Ihnen dankbar für eine kurze Rückmeldung.
> - [ ] Gib mir bitte bis Freitag Bescheid.
> - [ ] Das Projekt ist echt krass, ich bin aber noch etwas lost.
> - [ ] Ich danke ihnen für ihre Geduld.
>
> **Пояснення:** доречні два ввічливі речення з *Sie / Ihnen*. *Gib mir* — форма на *du*. *Krass* і *lost* — розмовна й молодіжна лексика. В останньому реченні ввічливі *Ihnen, Ihre* написано з малої — так читається як «їм, їхня».

> [!quiz] «Переклади» канцелярит звичайною мовою
> level: C1 · type: fill · bank: zwecks, fernmündlich · id: de-c1-register-q07
>
> ```text fill
> fernmündlich → [[telefonisch]]
> die Lichtzeichenanlage → die [[Ampel]]
> seitens des Vermieters → [[vom]] Vermieter
> der Vordruck → das [[Formular]]
> ```
>
> **Пояснення:** *fernmündlich = telefonisch*, *Lichtzeichenanlage = Ampel*, *seitens + Gen → von + Dat* (*vom Vermieter*), *Vordruck ≈ Formular*. Слова з банку — це саме канцелярські варіанти, яких треба уникнути.

> [!quiz] Яке звертання підходить для листа австрійському чиновнику з титулом магістра?
> level: C1 · type: single · id: de-c1-register-q08
> - [ ] Hallo Herr Huber,
> - [x] Sehr geehrter Herr Magister Huber,
> - [ ] Lieber Huber,
> - [ ] Sehr geehrte Herr Huber,
>
> **Пояснення:** в Австрії академічний титул у звертанні звичний: *Herr Magister Huber*. *Hallo* — занадто неформально, *Lieber Huber* — без *Herr* і фамільярно, *Sehr geehrte Herr* — помилка в закінченні (для *Herr* потрібне *geehrter*).

> [!quiz] Колега каже: «Ich hab grad keine Kohle.» Що вона має на увазі?
> level: C1 · type: single · id: de-c1-register-q09
> - [ ] Їй холодно, бо не працює опалення.
> - [x] У неї зараз немає грошей.
> - [ ] Вона не має часу.
> - [ ] Вона не купила вугілля для гриля.
>
> **Пояснення:** розмовне *die Kohle* = *das Geld*. Пряме значення «вугілля» в такій фразі майже не вживають; *keine Zeit* — інша фраза. Слово доречне серед друзів, але не в листі.

> [!quiz] Заповни пропуски: du чи Sie?
> level: C1 · type: fill · bank: dich, euch · id: de-c1-register-q10
>
> ```text fill
> Frau Weber, könnten [[Sie]] mir bitte helfen?
> Paul, kannst [[du]] mir bitte helfen?
> Kinder, habt [[ihr]] eure Hausaufgaben gemacht?
> Herr Kaya, ich danke [[Ihnen]] für die Hilfe.
> ```
>
> **Пояснення:** прізвище з *Frau / Herr* → *Sie / Ihnen* (з великої). Імʼя дорослого друга → *du*. Група дітей чи друзів → *ihr*. *danken* керує Dativ, тому *Ihnen*. *dich* і *euch* у банку — Akkusativ / Dativ, а тут потрібні Nominativ або Dativ ввічливої форми.

> [!quiz] Склади нейтрально-ввічливе прохання: «Чи не могли б ви пояснити мені це простими словами?»
> level: C1 · type: order · id: de-c1-register-q11
>
> ```text order
> Könnten Sie
> mir das bitte
> in einfachen Worten
> erklären?
> erklärst du ✗
> ```
>
> **Пояснення:** *Könnten Sie* відкриває ввічливе питання (Konjunktiv II), інфінітив *erklären* — у кінці. *erklärst du* — форма на *du*, вона не поєднується з *Sie*.

> [!quiz] Склади речення: «З боку школи заперечень немає.»
> level: C1 · type: order · id: de-c1-register-q12
>
> ```text order
> Seitens
> der Schule
> gibt es
> keine Einwände.
> dem Schule ✗
> ```
>
> **Пояснення:** *seitens* керує Genitiv: *der Schule* (жін. рід). Після першого члена речення — дієслово *gibt*. *dem Schule* — і неправильний рід, і неправильний відмінок.

> [!quiz] Яке слово позначене в словнику як «gehoben» (книжне)?
> level: C1 · type: single · id: de-c1-register-q13
> - [ ] pennen
> - [x] speisen
> - [ ] quatschen
> - [ ] chillen
>
> **Пояснення:** *speisen* («трапезувати») — книжне слово до *essen*. *pennen, quatschen, chillen* — розмовні. Такі позначки (*gehoben, umgangssprachlich, salopp, abwertend*) у Duden і DWDS допомагають обрати регістр.

> [!quiz] Твій новий колега, ровесник, каже: «Wir duzen uns hier alle.» Як найкраще відповісти?
> level: C1 · type: single · id: de-c1-register-q14
> - [x] Super, ich bin Taras.
> - [ ] Sehr geehrter Kollege, ich bedanke mich für das Angebot des Duzens.
> - [ ] Ich bleibe lieber beim Sie, Digga.
> - [ ] Okay, aber dann sagen Sie bitte Taras zu mir.
>
> **Пояснення:** колега пояснює правило колективу — природно погодитися й назвати імʼя. Другий варіант — канцелярит у живій розмові, третій поєднує відмову з молодіжним *Digga*, четвертий — суперечливий: погоджується на *du*, але сам уживає *Sie*.

## Фішки

> [!reel] 🏛️ Чому «Lichtzeichenanlage»
> Слово з правил дорожнього руху звучить кумедно, але має логіку: законові потрібен точний, загальний термін для будь-якого пристрою, що подає світлові сигнали. Тому в законі — *Lichtzeichenanlage*, а в житті — *Ampel*. Так само *Postwertzeichen* (поштова марка) чи *Personenvereinzelungsanlage* (турнікет).

> [!reel] 🤝 Гамбурзьке «Sie»
> *Jana, können Sie …?* — імʼя + *Sie* — називають *Hamburger Sie*. Його часто чути в офісах і серед персоналу магазинів чи готелів. Існує і дзеркальне *Münchner Du* (прізвище + *du*), але воно рідкісне. Для учня найпростіше правило: прізвище — *Sie*, імʼя — частіше *du*.

> [!reel] 📱 Словник, що старіє за рік
> Молодіжні слова застарівають швидко: те, що було «круто» у 2015-му, у 2026-му може звучати як від батьків. Якщо доросла людина вживає *Digga* чи *cringe*, підлітки іноді вважають саме це *cringe*. Розуміти ці слова варто, а вживати — лише серед своїх.

## Джерела та що почитати

- [Gesetze im Internet — § 11 BGG «Verständlichkeit und Leichte Sprache»](https://www.gesetze-im-internet.de/bgg/__11.html): обовʼязок установ пояснювати рішення простою мовою.
- [ZDFheute — «Ragebait» ist das Jugendwort des Jahres 2026](https://www.zdfheute.de/panorama/jugendwort-des-jahres-2026-gewinner-ragebait-100.html): результати голосування, вікова група, значення слова.
- [Langenscheidt — Pressemeldungen](https://www.langenscheidt.com/pressemeldungen): офіційні повідомлення про Jugendwort des Jahres.
- [Langenscheidt — «Das crazy» ist das Jugendwort des Jahres 2025](https://www.langenscheidt.com/presse/langenscheidt-jugendwort-2025-das-crazy-ist-das-jugendwort-des-jahres): результат 2025 року (35,7 % голосів).
- [Duden — «lost»](https://www.duden.de/rechtschreibung/lost): значення, позначка «umgangssprachlich», невідмінюваний прикметник; також [«Digga»](https://www.duden.de/rechtschreibung/Digga).
- [Duden — «Amtsdeutsch»](https://www.duden.de/rechtschreibung/Amtsdeutsch): значення й стильова позначка.
- [Duden — «Lichtzeichenanlage»](https://www.duden.de/rechtschreibung/Lichtzeichenanlage) і [«fernmündlich»](https://www.duden.de/rechtschreibung/fernmuendlich): канцелярські слова з позначками.

> [!important] Підсумок
> - **Регістри:** Amtsdeutsch → писемний стандарт → нейтральна мова → Umgangssprache → Jugendsprache. Центр шкали (*Sie* + звичайні слова + *bitte*) — завжди безпечний.
> - **du / Sie:** прізвище з *Frau / Herr* — *Sie*; до групи друзів — *ihr*; *Sie, Ihnen, Ihr* — з великої. *du* традиційно пропонує старша або вища за посадою людина.
> - **Amtsdeutsch** треба розуміти: *fernmündlich = telefonisch*, *zwecks / seitens* + Genitiv, *Inanspruchnahme* → *nutzen*. Відповідай установі писемним стандартом, а не канцеляритом.
> - **Розмовні й молодіжні слова** (*Kohle, pennen, kapieren, cringe, lost, Digga*) — лише серед своїх; у листі вони звучать фамільярно.
> - **AT / CH:** в Австрії — титули у звертанні; у Швейцарії — швидкий перехід на *du* і *ss* замість *ß*.
