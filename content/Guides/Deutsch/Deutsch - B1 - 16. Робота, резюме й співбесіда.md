---
title: Робота, резюме й співбесіда
id: de-b1-bewerbung
level: B1
icon: px:crown
tags: [deutsch, b1, vocabulary, bewerbung, arbeit, lebenslauf]
prerequisites: ["[[Deutsch - A2 - 12. Робота, професії й навчання]]", "[[Deutsch - B1 - 14. Konjunktiv II — würde, hätte, wäre і ввічливість]]"]
estimatedMinutes: 60
---

# Робота, резюме й співбесіда

> [!success] Після цієї теми ти зможеш
> - прочитати *Stellenanzeige* і зрозуміти, що вимагають і що пропонують;
> - назвати складники пакета документів: *Anschreiben, tabellarischer Lebenslauf, Zeugnisse*;
> - розповісти про свій досвід, сильні й слабкі сторони на *Vorstellungsgespräch*;
> - розібратися в договорі: *Probezeit, befristet, brutto / netto, Kündigungsfrist*;
> - пояснити, що таке *Anerkennung* закордонного диплома.

## Передбач

> [!quiz] У вакансії написано: «3.200 € brutto». Що це означає?
> level: B1 · type: single · id: de-b1-bewerbung-q01
> - [ ] Сума, яку ти отримаєш на банківську картку.
> - [x] Зарплата до вирахування податків і соціальних внесків.
> - [ ] Зарплата разом із премією за рік.
> - [ ] Зарплата без вихідних днів.
>
> **Пояснення:** *brutto* — «до вирахувань», *netto* — «після вирахувань», тобто те, що приходить на рахунок («на руки»). З 3.200 € brutto на картку надійде помітно менше. Саме *brutto* майже завжди стоїть у вакансіях.

## Вакансія: Stellenanzeige

Оголошення про роботу в Німеччині читають за схемою. Заголовок містить посаду та **(m/w/d)** — «чоловік / жінка / інша стать»: шукають людей усіх статей. Далі зазвичай чотири блоки:

| Блок | Типові слова | Що відповідає |
|---|---|---|
| Wir sind … | Unternehmen, Team | про компанію |
| Ihre Aufgaben | verantwortlich für, betreuen | що доведеться робити |
| Ihr Profil | Anforderungen, Berufserfahrung, Kenntnisse | кого шукають |
| Wir bieten | Gehalt, Gleitzeit, Homeoffice, Weiterbildung | що пропонують |

У вакансіях до тебе звертаються на «Ви» — *Ihre Aufgaben*, *Ihr Profil*. Якщо компанія молода (стартап), може бути *du*: *Deine Aufgaben*.

> [!tip] Обовʼязково чи бажано
> У *Ihr Profil* часто поряд стоять *Voraussetzung* («обовʼязкова умова») і *wünschenswert* («бажано»). Другого можна й не мати. Не відмовляйся від вакансії лише тому, що не виконав усі пункти «бажано».

## Пакет документів: Bewerbungsunterlagen

Класичний пакет — це *Bewerbungsunterlagen*:

1. **Anschreiben** — супровідний лист (на сторінку): чому саме ця посада й компанія, що ти вмієш.
2. **Tabellarischer Lebenslauf** — резюме у вигляді таблиці, у зворотному хронологічному порядку (найновіше — першим). Внизу — місце, дата й підпис.
3. **Zeugnisse** — копії дипломів, сертифікатів і *Arbeitszeugnisse* від попередніх роботодавців.

Фото в резюме **не обовʼязкове**. Закон про рівне ставлення (AGG) забороняє дискримінацію за віком, статтю, походженням, тому роботодавцям не радять вимагати фото. Багато хто фото не додає. Вік, сімейний стан і дата народження в резюме теж необовʼязкові.

> [!diagram] Шлях заявки: від вакансії до договору
> ```yaml
> layout: flow
> nodes:
>   - { id: s1, label: "1 · пошук", text: "Stellenanzeige", tone: yellow }
>   - { id: s2, label: "2 · відправка", text: "Bewerbung", tone: pink }
>   - { id: s3, label: "3 · співбесіда", text: "Vorstellungsgespräch", tone: yellow }
>   - { id: s4, label: "4 · відповідь", text: "Zusage / Absage", tone: pink }
>   - { id: s5, label: "5 · договір", text: "Arbeitsvertrag", tone: gray }
> edges:
>   - { from: s1, to: s2 }
>   - { from: s2, to: s3 }
>   - { from: s3, to: s4 }
>   - { from: s4, to: s5 }
> steps:
>   - { focus: s1, note: "Знаходиш Stellenanzeige: сайт компанії, портал або Agentur für Arbeit." }
>   - { focus: s2, note: "Надсилаєш Bewerbung: Anschreiben, Lebenslauf і Zeugnisse в одному PDF-файлі або через форму." }
>   - { focus: s3, note: "Якщо документи підійшли, запрошують на Vorstellungsgespräch (також Bewerbungsgespräch)." }
>   - { focus: s4, note: "Через кілька днів чи тижнів приходить Zusage (так) або Absage (ні)." }
>   - { focus: s5, note: "Після Zusage підписуєш Arbeitsvertrag: звертай увагу на Probezeit, befristet / unbefristet, brutto." }
> ```

Хто подає документи, — **Bewerber** (*die Bewerberin*). Дієслово зворотне: *sich bewerben*. Куди: **bei** (компанія) + **um** (посада): *Ich bewerbe mich **bei** Siemens **um** die Stelle als Techniker.* Також кажуть *auf eine Stelle*: *Ich bewerbe mich auf die Stelle.*

Формальний лист починається з *Sehr geehrte Frau Weber,* (кома!) — наступний рядок з **малої** літери: *ich bewerbe mich …* Кінцівка: *Mit freundlichen Grüßen* + імʼя.

## Співбесіда: Vorstellungsgespräch

Типові питання й відповіді з Konjunktiv II для ввічливості:

| Питання | Відповідь |
|---|---|
| Erzählen Sie etwas über sich. | Ich habe in Charkiw Informatik studiert und arbeite seit fünf Jahren als Entwickler. |
| Warum möchten Sie bei uns arbeiten? | Ich würde gern in einem internationalen Team arbeiten. |
| Was sind Ihre Stärken und Schwächen? | Ich bin zuverlässig und teamfähig. Manchmal bin ich zu perfektionistisch. |
| Wo sehen Sie sich in fünf Jahren? | Ich würde gern mehr Verantwortung übernehmen. |
| Wie hoch ist Ihre Gehaltsvorstellung? | Ich stelle mir etwa 3.500 Euro brutto vor. |
| Haben Sie noch Fragen? | Ja. Wie sieht die Einarbeitung aus? |

Лакуну в резюме (*eine Lücke im Lebenslauf*) краще пояснити коротко й чесно: *Von März bis Dezember habe ich Deutsch gelernt.* Для людей, які змінили професію, є слово *Quereinsteiger* («той, хто прийшов з іншої галузі»).

## Договір: Arbeitsvertrag

- **Befristet** — на певний строк (наприклад, на рік). **Unbefristet** — безстроково.
- **Probezeit** — випробувальний термін. Під час нього, але **не довше шести місяців**, можна розірвати договір із терміном попередження в **два тижні** (*§ 622 Abs. 3 BGB*).
- **Kündigungsfrist** — термін повідомлення про звільнення. Загалом — **чотири тижні до 15-го або до кінця місяця** (*§ 622 Abs. 1 BGB*); для роботодавця він зростає зі стажем.
- **Tarifvertrag** — колективна угода, у якій для галузі прописано оплату й робочий час. Захищає працівників також **Betriebsrat** — рада працівників на підприємстві.
- **Gehaltsabrechnung** — розрахунковий листок. З *brutto* вираховують **Steuern** і **Sozialversicherung**; залишається *netto*.
- **Arbeitszeugnis** — характеристика від роботодавця. За законом працівник має право на неї (*§ 109 GewO*); вона має бути доброзичливою, тому її мовою «між рядків» пишуть уважно (див. «Фішки»).

> [!note] Kündigen — це і «звільнитися», і «звільнити»
> *Ich habe gekündigt* — я сам звільнився. Коли звільняє роботодавець, кажуть *Mir wurde gekündigt* («мене звільнили») або *Die Firma hat mir gekündigt*. Дієслово одне, а напрям залежить від того, хто підмет.

## Приклади

- Ich bewerbe mich um die Stelle als Buchhalterin. — Я подаю заявку на посаду бухгалтерки.
- Im Anschreiben erkläre ich, warum ich zu der Firma passe. — У супровідному листі я пояснюю, чому підходжу цій фірмі.
- Der Lebenslauf ist tabellarisch und nicht länger als zwei Seiten. — Резюме у вигляді таблиці й не довше двох сторінок.
- Mein Vertrag ist unbefristet, die Probezeit dauert sechs Monate. — Мій договір безстроковий, випробувальний термін триває шість місяців.
- Das Gehalt beträgt 3.200 Euro brutto im Monat. — Зарплата — 3.200 євро brutto на місяць.
- Wir haben Ihre Unterlagen erhalten und laden Sie zum Vorstellungsgespräch ein. — Ми отримали Ваші документи й запрошуємо Вас на співбесіду.
- Leider müssen wir Ihnen mitteilen, dass wir uns für einen anderen Bewerber entschieden haben. — На жаль, мусимо повідомити, що вибрали іншого кандидата.
- Ich habe zehn Jahre Berufserfahrung im Vertrieb. — У мене десять років досвіду в продажах.
- Die Firma bietet Gleitzeit und zwei Tage Homeoffice pro Woche. — Фірма пропонує гнучкий графік і два дні віддаленої роботи на тиждень.
- Dein Diplom muss übersetzt und beglaubigt werden. — Твій диплом мають перекласти й засвідчити.

## Слова

> [!word] die Stellenanzeige
> ipa: /ˈʃtɛlənʔanˌtsaɪ̯ɡə/ · pos: noun · level: B1 · id: de-b1-bewerbung-w01
> uk: оголошення про вакансію
> forms: die Stellenanzeigen
> example: Ich habe die **Stellenanzeige** in der Zeitung gelesen. — Я прочитав оголошення про вакансію в газеті.
> note: також das Stellenangebot, die Stellenausschreibung; у Швейцарії й Австрії часто das Inserat.

> [!word] sich bewerben um (+ Akk)
> ipa: /zɪç bəˈvɛʁbn̩/ · pos: verb · level: B1 · id: de-b1-bewerbung-w02
> uk: подавати заявку (на посаду); претендувати
> forms: bewirbt sich → bewarb sich → hat sich beworben
> example: Sie **bewirbt sich** bei der Bank **um** eine Stelle. — Вона подає заявку до банку на посаду.
> note: також sich bewerben auf (+ Akk): sich auf eine Stelle bewerben. Фірма — bei + Dat.

> [!word] der Bewerber
> ipa: /bəˈvɛʁbɐ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w03
> uk: кандидат; той, хто подає заявку
> forms: die Bewerber
> example: Die Firma hat zehn **Bewerber** zum Gespräch eingeladen. — Фірма запросила десять кандидатів на співбесіду.
> note: жінка — die Bewerberin, die Bewerberinnen.

> [!word] das Anschreiben
> ipa: /ˈanʃʁaɪ̯bn̩/ · pos: noun · level: B1 · id: de-b1-bewerbung-w04
> uk: супровідний лист
> forms: die Anschreiben
> example: Im **Anschreiben** nenne ich meine Motivation. — У супровідному листі я називаю свою мотивацію.
> note: синонім — das Bewerbungsschreiben, das Motivationsschreiben.

> [!word] tabellarisch
> ipa: /tabɛˈlaːʁɪʃ/ · pos: adj · level: B1 · id: de-b1-bewerbung-w05
> uk: у вигляді таблиці; табличний
> example: Mein Lebenslauf ist **tabellarisch** aufgebaut. — Моє резюме складене у вигляді таблиці.
> note: der tabellarische Lebenslauf — стандартне німецьке резюме; die Tabelle — таблиця.

> [!word] das Vorstellungsgespräch
> ipa: /ˈfoːɐ̯ʃtɛlʊŋsɡəˌʃpʁɛːç/ · pos: noun · level: B1 · id: de-b1-bewerbung-w06
> uk: співбесіда
> forms: die Vorstellungsgespräche
> example: Morgen habe ich ein **Vorstellungsgespräch** um zehn Uhr. — Завтра о десятій у мене співбесіда.
> note: також das Bewerbungsgespräch; у розмові — «das Gespräch».

> [!word] die Probezeit
> ipa: /ˈpʁoːbəˌtsaɪ̯t/ · pos: noun · level: B1 · id: de-b1-bewerbung-w07
> uk: випробувальний термін
> forms: die Probezeiten
> example: In der **Probezeit** gilt eine kurze Kündigungsfrist. — У випробувальний термін діє короткий строк попередження про звільнення.
> note: коротке попередження (два тижні) діє лише до шести місяців Probezeit (§ 622 BGB).

> [!word] der Arbeitsvertrag
> ipa: /ˈaʁbaɪ̯tsfɛɐ̯ˌtʁaːk/ · pos: noun · level: B1 · id: de-b1-bewerbung-w08
> uk: трудовий договір
> forms: die Arbeitsverträge
> example: Ich habe den **Arbeitsvertrag** gestern unterschrieben. — Вчора я підписала трудовий договір.
> note: ä у множині: Verträge; перед підписом читай Probezeit і Kündigungsfrist.

> [!word] brutto
> ipa: /ˈbʁʊto/ · pos: adv · level: B1 · id: de-b1-bewerbung-w09
> uk: брутто; до вирахування податків
> example: Das Gehalt ist 3.000 Euro **brutto**. — Зарплата — 3.000 євро brutto.
> note: «брутто» — із італійської; протилежне — netto.

> [!word] netto
> ipa: /ˈnɛto/ · pos: adv · level: B1 · id: de-b1-bewerbung-w10
> uk: нетто; після вирахування податків
> example: Davon bleiben mir etwa 2.100 Euro **netto**. — З цього лишається приблизно 2.100 євро netto.
> note: також як іменник — das Netto (розм. «на руки»). Не плутати з назвою магазину Netto.

> [!word] das Arbeitszeugnis
> ipa: /ˈaʁbaɪ̯tsˌtsɔʏ̯knɪs/ · pos: noun · level: B1 · id: de-b1-bewerbung-w11
> uk: характеристика з місця роботи
> forms: die Arbeitszeugnisse
> example: Zur Bewerbung gehört oft ein **Arbeitszeugnis**. — До заявки часто додають характеристику з попередньої роботи.
> note: das Zeugnis — також шкільне свідоцтво та диплом як документ.

> [!word] die Anerkennung
> ipa: /ˈanʔɛɐ̯kɛnʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w12
> uk: визнання (кваліфікації); повага
> forms: die Anerkennungen
> example: Für meinen Beruf brauche ich die **Anerkennung** meines Diploms. — Для моєї професії потрібне визнання мого диплома.
> note: також «похвала, повага»: Sie bekam viel Anerkennung. Die Berufsanerkennung — визнання професії.

> [!word] die Berufserfahrung
> ipa: /bəˈʁuːfsʔɛɐ̯ˌfaːʁʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w13
> uk: професійний досвід
> forms: — (зазвичай без множини)
> example: Er hat fünf Jahre **Berufserfahrung** als Elektriker. — Він має пʼять років досвіду електрика.
> note: eine Stelle für Berufseinsteiger — без вимог до досвіду.

> [!word] die Qualifikation
> ipa: /kvalifikaˈtsi̯oːn/ · pos: noun · level: B1 · id: de-b1-bewerbung-w14
> uk: кваліфікація
> forms: die Qualifikationen
> example: Ihre **Qualifikationen** passen gut zu der Stelle. — Ваша кваліфікація добре підходить до цієї посади.
> note: наголос на -on; qu — [kv].

> [!word] die Stärke
> ipa: /ˈʃtɛʁkə/ · pos: noun · level: B1 · id: de-b1-bewerbung-w15
> uk: сильна сторона; сила
> forms: die Stärken
> example: Meine **Stärke** ist die Zusammenarbeit im Team. — Моя сильна сторона — співпраця в команді.
> note: у співбесіді: Was sind Ihre Stärken? Протилежне — die Schwäche.

> [!word] die Schwäche
> ipa: /ˈʃvɛçə/ · pos: noun · level: B1 · id: de-b1-bewerbung-w16
> uk: слабка сторона; слабкість
> forms: die Schwächen
> example: Eine **Schwäche** von mir ist: Ich sage selten Nein. — Моя слабка сторона: я рідко кажу «ні».
> note: ä — [ɛ]; ch після ä — [ç] («хь»).

> [!word] kündigen
> ipa: /ˈkʏndɪɡn̩/ · pos: verb · level: B1 · id: de-b1-bewerbung-w17
> uk: звільнятися; звільняти; розривати договір
> forms: kündigt → kündigte → hat gekündigt
> example: Ich habe gestern **gekündigt**. — Вчора я подав заяву про звільнення.
> note: також «розірвати договір оренди»: die Wohnung kündigen. Іменник — die Kündigung.

> [!word] die Kündigungsfrist
> ipa: /ˈkʏndɪɡʊŋsˌfʁɪst/ · pos: noun · level: B1 · id: de-b1-bewerbung-w18
> uk: термін попередження про звільнення
> forms: die Kündigungsfristen
> example: Meine **Kündigungsfrist** beträgt vier Wochen. — Мій термін попередження про звільнення — чотири тижні.
> note: те саме слово вживають в оренді житла.

> [!word] befristet
> ipa: /bəˈfʁɪstət/ · pos: adj · level: B1 · id: de-b1-bewerbung-w19
> uk: на визначений строк; тимчасовий
> example: Der Vertrag ist auf zwei Jahre **befristet**. — Договір укладено на два роки.
> note: протилежне — unbefristet.

> [!word] der Arbeitgeber
> ipa: /ˈaʁbaɪ̯tˌɡeːbɐ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w20
> uk: роботодавець
> forms: die Arbeitgeber
> example: Mein **Arbeitgeber** bezahlt die Weiterbildung. — Мій роботодавець оплачує підвищення кваліфікації.
> note: жінка — die Arbeitgeberin. Der Arbeitgeber «дає» роботу (geben).

> [!word] der Arbeitnehmer
> ipa: /ˈaʁbaɪ̯tˌneːmɐ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w21
> uk: працівник (найманий)
> forms: die Arbeitnehmer
> example: Jeder **Arbeitnehmer** hat Anspruch auf Urlaub. — Кожен працівник має право на відпустку.
> note: жінка — die Arbeitnehmerin. Der Arbeitnehmer «бере» роботу (nehmen). Не плутай: Arbeitnehmer ≠ роботодавець.

> [!word] die Referenz
> ipa: /ʁefeˈʁɛnts/ · pos: noun · level: B1 · id: de-b1-bewerbung-w22
> uk: рекомендація; відгук про роботу
> forms: die Referenzen
> example: Ich kann zwei **Referenzen** nennen. — Я можу назвати двох осіб, які дадуть рекомендацію.
> note: «посилання» в науковому тексті — der Verweis. Не плутай з українським «референція».

> [!word] die Weiterbildung
> ipa: /ˈvaɪ̯tɐˌbɪldʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w23
> uk: підвищення кваліфікації; курси
> forms: die Weiterbildungen
> example: Die Firma bietet jedes Jahr eine **Weiterbildung** an. — Фірма щороку пропонує курси підвищення кваліфікації.
> note: синонім — die Fortbildung.

> [!word] die Zusage
> ipa: /ˈtsuːˌzaːɡə/ · pos: noun · level: B1 · id: de-b1-bewerbung-w24
> uk: позитивна відповідь; згода
> forms: die Zusagen
> example: Ich habe heute eine **Zusage** bekommen! — Сьогодні я отримала позитивну відповідь!
> note: дієслово — zusagen; протилежне — die Absage.

> [!word] einstellen
> ipa: /ˈaɪ̯nʃtɛlən/ · pos: verb · level: B1 · id: de-b1-bewerbung-w25
> uk: приймати на роботу; (також) припиняти
> forms: stellt ein → stellte ein → hat eingestellt
> example: Die Firma **stellt** zehn neue Mitarbeiter **ein**. — Фірма наймає десять нових співробітників.
> note: відокремлюване. Друге значення: den Betrieb einstellen — припинити роботу.

> [!word] die Gehaltsvorstellung
> ipa: /ɡəˈhaltsˌfoːɐ̯ʃtɛlʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w26
> uk: бажана зарплата
> forms: die Gehaltsvorstellungen
> example: Bitte nennen Sie Ihre **Gehaltsvorstellung**. — Будь ласка, назвіть бажану зарплату.
> note: у вакансіях часто вимагають вказати.

> [!word] die Agentur für Arbeit
> ipa: /aɡɛnˈtuːɐ̯ fyːɐ̯ ˈaʁbaɪ̯t/ · pos: noun · level: B1 · id: de-b1-bewerbung-w27
> uk: агентство зайнятості
> forms: die Agenturen für Arbeit
> example: Ich habe mich bei der **Agentur für Arbeit** gemeldet. — Я зареєструвалася в агентстві зайнятості.
> note: розм. — das Arbeitsamt (так називали до 2004 р.). Jobcenter — окрема установа: тема 26.

> [!word] der Betriebsrat
> ipa: /bəˈtʁiːpsˌʁaːt/ · pos: noun · level: B1 · id: de-b1-bewerbung-w28
> uk: рада працівників підприємства
> forms: die Betriebsräte
> example: Der **Betriebsrat** vertritt die Mitarbeiter. — Рада працівників представляє співробітників.
> note: ä у множині: Räte; в Австрії теж є Betriebsrat.

> [!word] die Initiativbewerbung
> ipa: /initsi̯aˈtiːfbəˌvɛʁbʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w29
> uk: ініціативна заявка (без вакансії)
> forms: die Initiativbewerbungen
> example: Ich schicke eine **Initiativbewerbung** an die Firma. — Я надсилаю в компанію ініціативну заявку.
> note: v у Initiativ — [f] у кінці складу.

> [!word] die Bewerbungsunterlagen
> ipa: /bəˈvɛʁbʊŋsˌʔʊntɐlaːɡn̩/ · pos: noun · level: B1 · id: de-b1-bewerbung-w30
> uk: документи для заявки
> forms: — (лише множина)
> example: Schicken Sie Ihre **Bewerbungsunterlagen** bitte per E-Mail. — Надішліть, будь ласка, Ваші документи електронною поштою.
> note: також «die Unterlagen» — «документи» взагалі.

> [!word] die Fachkraft
> ipa: /ˈfaxˌkʁaft/ · pos: noun · level: B1 · id: de-b1-bewerbung-w31
> uk: фахівець; кваліфікований працівник
> forms: die Fachkräfte
> example: In Deutschland fehlen viele **Fachkräfte**. — У Німеччині бракує багатьох фахівців.
> note: der Fachkräftemangel — нестача фахівців.

> [!word] der Quereinsteiger
> ipa: /ˈkveːɐ̯ʔaɪ̯nˌʃtaɪ̯ɡɐ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w32
> uk: той, хто прийшов у професію з іншої галузі
> forms: die Quereinsteiger
> example: Als **Quereinsteiger** arbeitet er jetzt in der IT. — Прийшовши з іншої галузі, він тепер працює в ІТ.
> note: жінка — die Quereinsteigerin; quer — «упоперек».

> [!word] die Gleitzeit
> ipa: /ˈɡlaɪ̯tˌtsaɪ̯t/ · pos: noun · level: B1 · id: de-b1-bewerbung-w33
> uk: гнучкий графік
> forms: — (без множини)
> example: Wir haben **Gleitzeit**: Beginn zwischen sieben und zehn Uhr. — У нас гнучкий графік: початок між сьомою і десятою.
> note: gleiten — ковзати.

> [!word] das Homeoffice
> ipa: /ˈhoʊ̯mɔfɪs/ · pos: noun · level: B1 · id: de-b1-bewerbung-w34
> uk: віддалена робота з дому
> forms: die Homeoffices
> example: Zwei Tage pro Woche arbeite ich im **Homeoffice**. — Два дні на тиждень я працюю з дому.
> note: німецьке слово англійського походження; die Heimarbeit — старіше, інакше забарвлене слово.

> [!word] der Tarifvertrag
> ipa: /taˈʁiːfˌfɛɐ̯tʁaːk/ · pos: noun · level: B1 · id: de-b1-bewerbung-w35
> uk: колективна (тарифна) угода
> forms: die Tarifverträge
> example: Im **Tarifvertrag** steht die Bezahlung für die ganze Branche. — У тарифній угоді прописана оплата для всієї галузі.
> note: Tarif + Vertrag: [f] і [f] стоять поруч, вимовляй один довший [f]; v у Vertrag — теж [f].

> [!word] die Beförderung
> ipa: /bəˈfœʁdəʁʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w36
> uk: підвищення на посаді; перевезення
> forms: die Beförderungen
> example: Nach drei Jahren bekam er eine **Beförderung**. — Через три роки він отримав підвищення.
> note: у транспорті — die Beförderung von Personen: перевезення людей.

> [!word] die Beglaubigung
> ipa: /bəˈɡlaʊ̯bɪɡʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w37
> uk: засвідчення (копії, документа)
> forms: die Beglaubigungen
> example: Für das Diplom brauche ich eine **Beglaubigung**. — Для диплома мені потрібне засвідчення.
> note: beglaubigte Kopie — завірена копія. Ставлять печатку в Bürgeramt, нотаріус тощо.

> [!word] die Übersetzung
> ipa: /yːbɐˈzɛtsʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w38
> uk: переклад
> forms: die Übersetzungen
> example: Die **Übersetzung** muss von einem vereidigten Übersetzer sein. — Переклад має бути від присяжного перекладача.
> note: наголос на -set-. Der Übersetzer — перекладач; vereidigter Übersetzer — присяжний перекладач.

> [!word] das Diplom
> ipa: /diˈploːm/ · pos: noun · level: B1 · id: de-b1-bewerbung-w39
> uk: диплом
> forms: die Diplome
> example: Mein **Diplom** ist aus Lwiw. — Мій диплом зі Львова.
> note: у Німеччині Diplom — також старий ступінь (до Болонської реформи); сьогодні Bachelor / Master.

> [!word] reglementiert
> ipa: /ʁeɡlɛmɛnˈtiːɐ̯t/ · pos: adj · level: B1 · id: de-b1-bewerbung-w40
> uk: регульований (про професію: потрібен дозвіл)
> example: Arzt ist ein **reglementierter** Beruf. — Лікар — регульована професія.
> note: der reglementierte Beruf — професія, для якої потрібне офіційне визнання; нерегульовану можна виконувати без нього.

> [!word] die Sozialversicherung
> ipa: /zoˈtsi̯aːlfɛɐ̯ˌzɪçəʁʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w41
> uk: соціальне страхування
> forms: die Sozialversicherungen
> example: Von meinem Gehalt zahle ich auch Beiträge zur **Sozialversicherung**. — З моєї зарплати я сплачую також внески на соціальне страхування.
> note: сюди входять пенсійне, медичне, безробітне, страхування по догляду й нещасних випадків.

> [!word] die Steuer
> ipa: /ˈʃtɔʏ̯ɐ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w42
> uk: податок
> forms: die Steuern
> example: Die **Steuern** werden direkt vom Gehalt abgezogen. — Податки утримуються прямо із зарплати.
> note: das Steuer (середній рід) — кермо; die Steuererklärung — податкова декларація.

> [!word] die Gehaltsabrechnung
> ipa: /ɡəˈhaltsʔapˌʁɛçnʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w43
> uk: розрахунковий листок
> forms: die Gehaltsabrechnungen
> example: Auf der **Gehaltsabrechnung** siehst du brutto und netto. — У розрахунковому листку бачиш brutto і netto.
> note: також die Lohnabrechnung; розрахункові листки варто зберігати.

> [!word] verhandeln
> ipa: /fɛɐ̯ˈhandl̩n/ · pos: verb · level: B1 · id: de-b1-bewerbung-w44
> uk: вести переговори; домовлятися
> forms: verhandelt → verhandelte → hat verhandelt
> example: Beim Gehalt kann man oft **verhandeln**. — Щодо зарплати часто можна домовлятися.
> note: verhandeln über (+ Akk): über das Gehalt verhandeln.

> [!word] die Verantwortung
> ipa: /fɛɐ̯ˈʔantvɔʁtʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w45
> uk: відповідальність
> forms: — (без множини)
> example: Ich möchte mehr **Verantwortung** übernehmen. — Я хочу взяти на себе більше відповідальності.
> note: Verantwortung übernehmen / tragen — брати / нести відповідальність.

> [!word] teamfähig
> ipa: /ˈtiːmˌfɛːɪç/ · pos: adj · level: B1 · id: de-b1-bewerbung-w46
> uk: здатний працювати в команді
> example: Wir suchen eine **teamfähige** Kollegin. — Ми шукаємо колегу, що вміє працювати в команді.
> note: die Teamfähigkeit — командність; у резюме часто разом із «zuverlässig».

> [!word] die Kenntnis
> ipa: /ˈkɛntnɪs/ · pos: noun · level: B1 · id: de-b1-bewerbung-w47
> uk: знання; відомості
> forms: die Kenntnisse
> example: Gute **Kenntnisse** in Englisch sind erforderlich. — Потрібне добре знання англійської.
> note: у резюме: Sprachkenntnisse (мови), EDV-Kenntnisse (компʼютер). Однина — зазвичай у виразі etwas zur Kenntnis nehmen.

> [!word] die Lücke
> ipa: /ˈlʏkə/ · pos: noun · level: B1 · id: de-b1-bewerbung-w48
> uk: прогалина; пропуск
> forms: die Lücken
> example: Ich erkläre die **Lücke** in meinem Lebenslauf. — Я пояснюю прогалину в моєму резюме.
> note: ü — губи як для «у», язик як для «і»; не «ю».

> [!word] die Voraussetzung
> ipa: /foˈʁaʊ̯sˌzɛtsʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w49
> uk: передумова; вимога
> forms: die Voraussetzungen
> example: Eine **Voraussetzung** ist ein abgeschlossenes Studium. — Одна з вимог — закінчене навчання.
> note: unter der Voraussetzung, dass … — за умови, що …

> [!word] die Anforderung
> ipa: /ˈanfɔʁdəʁʊŋ/ · pos: noun · level: B1 · id: de-b1-bewerbung-w50
> uk: вимога
> forms: die Anforderungen
> example: Die **Anforderungen** stehen unter „Ihr Profil“. — Вимоги наведено в розділі «Ihr Profil».
> note: Voraussetzung — умова допуску, Anforderung — те, що потрібно вміти для роботи.

## Слухаємо

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-bewerbung-l01
> audio: Ich bewerbe mich bei der Firma um die Stelle als Techniker.
> - [ ] Ich bewerbe mich bei der Firma für die Stelle als Techniker.
> - [x] Ich bewerbe mich bei der Firma um die Stelle als Techniker.
> - [ ] Ich bewerbe mich bei der Firma auf die Stelle als Techniker.

> [!listen] Що ти почув?
> level: B1 · type: choice · id: de-b1-bewerbung-l02
> audio: Der Vertrag ist unbefristet, die Probezeit dauert sechs Monate.
> - [ ] Der Vertrag ist befristet, die Probezeit dauert sechs Monate.
> - [x] Der Vertrag ist unbefristet, die Probezeit dauert sechs Monate.
> - [ ] Der Vertrag ist unbefristet, die Probezeit dauert zwei Monate.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-bewerbung-l03
> audio: Leider müssen wir Ihnen eine Absage schicken.
> explain: Absage — відмова; протилежне — Zusage. Müssen стоїть на другому місці, schicken — в кінці.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: de-b1-bewerbung-l04
> audio: Ich habe fünf Jahre Berufserfahrung als Buchhalterin.
> explain: Berufserfahrung — одне слово. Als Buchhalterin: після als — професія без артикля.

> [!listen] Послухай діалог. Яка робота потрібна жінці?
> level: B1 · type: answer · id: de-b1-bewerbung-l05
> audio: A: Guten Tag, Agentur für Arbeit, Sie sprechen mit Herrn Brandt.
> audio: B: Guten Tag, mein Name ist Bondar. Ich suche eine Stelle als Buchhalterin, am liebsten in Teilzeit.
> audio: A: Haben Sie Berufserfahrung?
> audio: B: Ja, sieben Jahre. Aber mein Diplom ist noch nicht anerkannt.
> - [ ] повна зайнятість медсестрою
> - [x] бухгалтерка, бажано на неповний робочий день
> - [ ] викладачка в університеті
>
> **Пояснення:** *Stelle als Buchhalterin* — посада бухгалтерки, *in Teilzeit* — на неповний день. Диплом поки не визнаний (*nicht anerkannt*).

> [!listen] Послухай відповідь на співбесіді. Що кандидат називає слабкою стороною?
> level: B1 · type: answer · id: de-b1-bewerbung-l06
> audio: A: Was sind Ihre Stärken und Schwächen?
> audio: B: Ich bin zuverlässig und arbeite gern im Team. Eine Schwäche ist: Ich sage selten Nein, wenn Kollegen Hilfe brauchen.
> - [ ] Він не вміє працювати в команді.
> - [ ] Він завжди спізнюється.
> - [x] Йому важко відмовити колегам.
>
> **Пояснення:** *ich sage selten Nein* — «я рідко кажу ні». Командність — це якраз його сильна сторона.

## Вимова

У довгих складних словах — один головний наголос на першому корені: **Be**werbung, **Ar**beitsvertrag, **Vor**stellungsgespräch. Є також ряд коротких «пасток»: *brutto* [ˈbʁʊto] — коротке [ʊ]; *Stärke* — [ʃt-] на початку слова читається «шт»; *Lücke* — [ʏ] як у «Küche».

> [!speak] Скажи вголос
> level: B1 · id: de-b1-bewerbung-s01
> text: Ich bewerbe mich um die Stelle als Entwicklerin.
> ipa: /ɪç bəˈvɛʁbə mɪç ʊm diː ˈʃtɛlə als ɛntˈvɪkləʁɪn/
> tip: bewerbe — наголос на -wer-, перший склад слабкий [bə]. Stelle — ʃt на початку: «штеле».
> uk: Я подаю заявку на посаду розробниці.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-bewerbung-s02
> text: Das Gehalt beträgt 3.200 Euro brutto.
> ipa: /das ɡəˈhalt bəˈtʁɛːkt ˈdʁaɪ̯ˌtaʊ̯zn̩t ˈtsvaɪ̯hʊndɐt ˈɔʏ̯ʁo ˈbʁʊto/
> tip: beträgt — ä довге [ɛː], кінцеве gt = [kt]. Euro — [ˈɔʏ̯ʁo].
> uk: Зарплата — 3.200 євро brutto.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-bewerbung-s03
> text: Ich habe fünf Jahre Berufserfahrung.
> ipa: /ɪç ˈhaːbə fʏnf ˈjaːʁə bəˈʁuːfsʔɛɐ̯ˌfaːʁʊŋ/
> tip: fünf — коротке ü, f наприкінці без «в». Berufserfahrung — головний наголос на -ruf-.
> uk: У мене пʼять років досвіду.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-bewerbung-s04
> text: Ich würde gern mehr Verantwortung übernehmen.
> ipa: /ɪç ˈvʏʁdə ɡɛʁn meːɐ̯ fɛɐ̯ˈʔantvɔʁtʊŋ ˌyːbɐˈneːmən/
> tip: Verantwortung — ʔ між fɛɐ̯ і antwort; «в» у -wort- звучить як [v]. Übernehmen — головний наголос на -neh-.
> uk: Я б хотів узяти на себе більше відповідальності.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-bewerbung-s05
> text: Meine Stärke ist die Teamarbeit.
> ipa: /ˈmaɪ̯nə ˈʃtɛʁkə ɪst diː ˈtiːmˌʔaʁbaɪ̯t/
> tip: Stärke — [ʃt] на початку «шт», ä = [ɛ]. Teamarbeit — Team читається як англійське «тім».
> uk: Моя сильна сторона — командна робота.

> [!speak] Скажи вголос
> level: B1 · id: de-b1-bewerbung-s06
> text: Mein Vertrag ist auf zwei Jahre befristet.
> ipa: /maɪ̯n fɛɐ̯ˈtʁaːk ɪst aʊ̯f tsvaɪ̯ ˈjaːʁə bəˈfʁɪstət/
> tip: Vertrag — кінцеве g = [k]: «фертрак». befristet — наголос на -frist-.
> uk: Мій договір укладено на два роки.

## Типові помилки українців

> [!pitfall] brutto й netto: «на руки» — це не brutto
> У Німеччині в оголошеннях вказують *brutto*: це зарплата до податків та соціальних внесків. Українське «на руки» — це **netto**. Різниця велика: податки й внески разом можуть забирати суттєву частину, тому не рахуй свій бюджет за *brutto*.

> [!pitfall] Referenz, Zeugnis, Anschreiben — «хибні друзі»
> *Referenz* — це **рекомендація** або людина, що дасть відгук, а не українська «референція» чи «довідка». *Zeugnis* — не лише шкільне «свідоцтво», а й **характеристика** з роботи (*Arbeitszeugnis*). *Anschreiben* — супровідний лист до заявки, а не «лист-підтвердження». Резюме — *Lebenslauf* (буквально «хід життя»), а не *Resümee* (так називають підсумок тексту).

> [!pitfall] Arbeitgeber ≠ Arbeitnehmer
> *Geber* — «той, хто дає», *Nehmer* — «той, хто бере». **Arbeitgeber** — той, хто *дає* роботу (роботодавець), **Arbeitnehmer** — той, хто *бере* її (працівник). Українською «наймач» і «найманий» легко переплутати, тому запамʼятай пару *geben / nehmen*.

> [!pitfall] «Дорогий пане Вебер!» в офіційному листі
> До незнайомого адресата пиши *Sehr geehrter Herr Weber,* або *Sehr geehrte Frau Weber,* — із **комою**, а наступне речення починай із малої літери (*ich bewerbe mich …*), якщо це не іменник. Українське «Дорогий / Шановний …!» з окличним знаком і великою літерою — не німецька норма. *Liebe Frau Weber* і *Hallo* — для знайомих, не для першої заявки.

## Ситуація: співбесіда

> [!listen] Послухай початок співбесіди. Що правда?
> level: B1 · type: answer · id: de-b1-bewerbung-l07
> audio: A: Guten Tag, Frau Kovalenko. Erzählen Sie uns etwas über sich.
> audio: B: Ich habe in Kyjiw sechs Jahre als Buchhalterin gearbeitet. Seit einem Jahr lebe ich in Leipzig.
> audio: A: Warum möchten Sie bei uns arbeiten?
> audio: B: Ich würde gern in einem internationalen Team arbeiten.
> - [x] Вона шість років працювала бухгалтеркою, зараз живе в Лейпцигу.
> - [ ] Вона щойно закінчила університет і не має досвіду.
> - [ ] Вона живе в Києві й шукає віддалену роботу.
>
> **Пояснення:** *sechs Jahre als Buchhalterin gearbeitet* — шість років досвіду; *seit einem Jahr lebe ich in Leipzig* — живе в Лейпцигу вже рік.

Відповідай на питання про себе вголос.

> [!speak] Скажи вголос: «Я б хотіла працювати в міжнародній команді»
> level: B1 · id: de-b1-bewerbung-s07
> text: Ich würde gern in einem internationalen Team arbeiten.
> ipa: /ɪç ˈvʏʁdə ɡɛʁn ɪn ˈaɪ̯nəm ɪntɐnatsi̯oˈnaːlən tiːm ˈaʁbaɪ̯tən/
> tip: international — наголос на -na-; ti = [tsi̯]. Würde — ü з округленими губами.
> uk: Я б хотіла працювати в міжнародній команді.

> [!speak] Скажи вголос: «Розкажіть про себе»
> level: B1 · id: de-b1-bewerbung-s08
> text: Ich habe sechs Jahre als Buchhalterin gearbeitet.
> ipa: /ɪç ˈhaːbə zɛks ˈjaːʁə als ˈbuːxhaltəʁɪn ɡəˈʔaʁbaɪ̯tət/
> tip: Buchhalterin — ch після u = [x] («х»). Gearbeitet — ʔ між ɡə і arbeitet.
> uk: Я шість років працювала бухгалтеркою.

## Landeskunde: Anerkennung ausländischer Abschlüsse

> [!example] Anerkennung ausländischer Abschlüsse
> Wer im Ausland einen Beruf gelernt hat, kann in Deutschland arbeiten, aber nicht immer sofort. Es gibt zwei Gruppen von Berufen. Bei „nicht reglementierten“ Berufen, zum Beispiel in der IT oder in vielen Ausbildungsberufen, darf man ohne Anerkennung arbeiten. Eine Anerkennung kann bei der Jobsuche trotzdem helfen. Bei „reglementierten“ Berufen, zum Beispiel Ärztin, Lehrer oder Krankenpfleger, braucht man die Anerkennung, bevor man arbeiten darf. Dafür stellt man einen Antrag bei der zuständigen Stelle. Man braucht Zeugnisse, einen Lebenslauf und oft beglaubigte Übersetzungen. Dann vergleicht die Behörde den ausländischen Abschluss mit einem deutschen. Manchmal muss man zusätzlich einen Kurs oder eine Prüfung machen. Informationen und Beratung gibt es zum Beispiel auf dem Portal „Anerkennung in Deutschland“.

> [!quiz] Wer braucht die Anerkennung, bevor er arbeiten darf?
> level: B1 · type: single · id: de-b1-bewerbung-q02
> - [ ] jeder Arbeitnehmer in Deutschland
> - [x] wer in einem reglementierten Beruf arbeiten will, zum Beispiel als Ärztin
> - [ ] nur wer ein Diplom aus der Ukraine hat
> - [ ] niemand, die Anerkennung ist immer freiwillig
>
> **Пояснення:** у тексті: «Bei reglementierten Berufen … braucht man die Anerkennung, bevor man arbeiten darf». Для нерегульованих професій вона не обовʼязкова.

> [!quiz] Що з перерахованого, за текстом, зазвичай потрібне для заявки на визнання?
> level: B1 · type: multi · id: de-b1-bewerbung-q03
> - [x] Zeugnisse
> - [x] Lebenslauf
> - [x] beglaubigte Übersetzungen
> - [ ] ein Arbeitsvertrag mit der neuen Firma
>
> **Пояснення:** «Man braucht Zeugnisse, einen Lebenslauf und oft beglaubigte Übersetzungen.» Договір із новою фірмою у тексті не згадується.

> [!quiz] Що може статися після порівняння диплома?
> level: B1 · type: single · id: de-b1-bewerbung-q04
> - [ ] Диплом автоматично стає німецьким без перевірки.
> - [ ] Завжди потрібно вчитися заново пʼять років.
> - [x] Інколи потрібно пройти додатковий курс або іспит.
> - [ ] Заявку приймають лише по телефону.
>
> **Пояснення:** «Manchmal muss man zusätzlich einen Kurs oder eine Prüfung machen.» — не завжди, лише інколи.

## Практика

> [!quiz] Заповни пропуски у вакансії
> level: B1 · type: fill · bank: unbefristet, Absage · id: de-b1-bewerbung-q05
>
> ```text fill
> Wir suchen eine [[Fachkraft]] (m/w/d) für unser Büro in Leipzig.
> Ihr Profil: Sie haben mehrere Jahre [[Berufserfahrung]] und sind teamfähig.
> Wir bieten: 3.400 Euro [[brutto]] (vor Abzug der Steuern), Gleitzeit und Weiterbildung.
> Der Vertrag ist zunächst auf zwei Jahre [[befristet]].
> Senden Sie Ihre [[Bewerbungsunterlagen]] bitte per E-Mail.
> ```
>
> **Пояснення:** *auf zwei Jahre* вказує на строк, тому **befristet**, а не *unbefristet*. *Absage* — відмова, що не пасує до жодного пропуску. *brutto* — сума до вирахувань, що стоїть у вакансіях.

> [!quiz] Склади речення: «Я подаю заявку на посаду бухгалтерки.»
> level: B1 · type: order · id: de-b1-bewerbung-q06
>
> ```text order
> Ich
> bewerbe
> mich
> um
> die
> Stelle
> als
> Buchhalterin.
> mir ✗
> ```
>
> **Пояснення:** *sich bewerben* — зворотне дієслово з **Akkusativ**: *mich*. *mir* помилкове, бо дієслово не вимагає Dativ.

> [!quiz] Як звернутися до пані Вебер на початку офіційного листа?
> level: B1 · type: single · id: de-b1-bewerbung-q07
> - [ ] Hallo Frau Weber,
> - [ ] Lieber Frau Weber,
> - [x] Sehr geehrte Frau Weber,
> - [ ] Sehr geehrt Frau Weber,
>
> **Пояснення:** формальне звертання до жінки — *Sehr geehrte* (закінчення -e як у жіночого роду). *Hallo* — для знайомих, *Lieber* — чоловічий рід і неформальне.

> [!quiz] Що таке Arbeitnehmer?
> level: B1 · type: single · id: de-b1-bewerbung-q08
> - [ ] роботодавець
> - [x] найманий працівник
> - [ ] безробітний
> - [ ] керівник відділу
>
> **Пояснення:** *der Arbeitnehmer* «бере» (*nehmen*) роботу — це працівник. Роботодавець — *der Arbeitgeber* («дає» роботу).

> [!quiz] Яке з тверджень про документи на вакансію правильне?
> level: B1 · type: multi · id: de-b1-bewerbung-q09
> - [x] До пакета зазвичай входять Anschreiben, tabellarischer Lebenslauf і Zeugnisse.
> - [x] Фото в резюме не є обовʼязковим.
> - [ ] До першої заявки додають договір оренди житла.
> - [ ] Anschreiben — це характеристика від колишнього роботодавця.
>
> **Пояснення:** Anschreiben — супровідний лист самого кандидата; характеристику дає колишній роботодавець (*Arbeitszeugnis*). Договір оренди до заявки на роботу не додають.

> [!quiz] Заповни пропуски: розмова про договір
> level: B1 · type: fill · bank: Absage, unbefristet · id: de-b1-bewerbung-q10
>
> ```text fill
> A: Wie viel verdienst du denn?
> B: Im Vertrag steht 3.200 Euro [[brutto]], aber ich bekomme nur etwa 2.300 Euro [[netto]].
> A: Und ist der Vertrag schon fest?
> B: Erst nach der [[Probezeit]]. Die dauert sechs Monate.
> ```
>
> **Пояснення:** *brutto* — сума в договорі, *netto* — те, що надходить на рахунок; *Probezeit* — випробувальний термін. *unbefristet* («безстроковий») не пасує до слів «Erst nach der …», а *Absage* — це відмова.

> [!quiz] Склади питання: «Скільки триває термін попередження про звільнення?»
> level: B1 · type: order · id: de-b1-bewerbung-q11
>
> ```text order
> Wie
> lang
> ist
> die
> Kündigungsfrist?
> Probezeit ✗
> ```
>
> **Пояснення:** питальне слово, дієслово *ist*, потім підмет. *Probezeit* — інше поняття (випробувальний термін).

> [!quiz] Ти отримала Absage. Що це означає?
> level: B1 · type: single · id: de-b1-bewerbung-q12
> - [x] Тобі відмовили.
> - [ ] Тебе прийняли на роботу.
> - [ ] Тебе запросили на співбесіду.
> - [ ] Тобі підвищили зарплату.
>
> **Пояснення:** *die Absage* — відмова, *die Zusage* — позитивна відповідь. Запрошення на співбесіду — *die Einladung*.

## Фішки

> [!reel] 🕵️ Мова Arbeitszeugnis: «між рядків»
> Характеристика мусить бути доброзичливою, тому роботодавці пишуть кодом. За усталеною практикою «stets zu unserer vollsten Zufriedenheit» означає оцінку «дуже добре», «zu unserer vollen Zufriedenheit» — «добре», а «zu unserer Zufriedenheit» — лише «задовільно». Тому за дрібними словами в Zeugnis читають уважно.

> [!reel] 📸 Фото в резюме — вже не правило
> Колись у Німеччині резюме без фотографії здавалося незавершеним. Відтоді як діє закон про рівне ставлення (AGG), фото не вимагають, а дехто з роботодавців навіть просить його не додавати, щоб оцінювати лише кваліфікацію. Тож якщо не хочеш, фото на резюме не потрібне.

> [!reel] ⏳ Probezeit: максимум півроку
> Закон (§ 622 BGB) дозволяє на час Probezeit скорочений термін попередження про звільнення — **два тижні**, але «пробний» період із цим пільговим терміном не може бути довшим за **шість місяців**. Далі діє звичайний термін — чотири тижні. Тож і працівник, і роботодавець можуть у перші місяці розійтися швидко.

## Джерела та що почитати

- [DWDS — Bewerbung](https://www.dwds.de/wb/Bewerbung): значення слова, приклади, сполучуваність.
- [DWDS — Arbeitszeugnis](https://www.dwds.de/wb/Arbeitszeugnis): значення й приклади слова.
- [§ 622 BGB — Kündigungsfristen bei Arbeitsverhältnissen](https://www.gesetze-im-internet.de/bgb/__622.html): Probezeit до шести місяців, два тижні, чотири тижні.
- [§ 109 GewO — Zeugnis](https://www.gesetze-im-internet.de/gewo/__109.html): право працівника на характеристику.
- [AGG — Allgemeines Gleichbehandlungsgesetz](https://www.gesetze-im-internet.de/agg/): закон про рівне ставлення, на який посилаються щодо фото й віку у резюме.
- [Anerkennung in Deutschland](https://www.anerkennung-in-deutschland.de/html/de/index.php): офіційний портал уряду про визнання закордонних кваліфікацій.
- [Make it in Germany — Berufsanerkennung](https://www.make-it-in-germany.com/de/arbeiten-in-deutschland/berufsanerkennung): огляд процедури.
- [Agentur für Arbeit](https://www.arbeitsagentur.de): вакансії й консультація.

> [!important] Підсумок
> - Вакансія: *Aufgaben, Profil, Wir bieten*; **(m/w/d)** означає, що шукають людей усіх статей.
> - Пакет: *Anschreiben + tabellarischer Lebenslauf + Zeugnisse*; фото необовʼязкове.
> - *Sich bewerben bei* (фірма) *um* (посада); початок листа — *Sehr geehrte Frau Weber,*.
> - Договір: *befristet / unbefristet*, *Probezeit* до 6 місяців, *brutto* ≠ *netto*, *Kündigungsfrist*.
> - Диплом: для *reglementierte Berufe* потрібна *Anerkennung* до початку роботи.
