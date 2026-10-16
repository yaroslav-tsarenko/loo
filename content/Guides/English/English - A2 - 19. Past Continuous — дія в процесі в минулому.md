---
title: Past Continuous — дія в процесі в минулому
order: 219
id: en-a2-past-continuous
level: A2
icon: px:clock
tags: [english, a2, grammar, past-continuous, when-while, storytelling]
prerequisites: ["[[English - A2 - 04. Past Simple — питання й заперечення]]", "[[English - A1 - 26. Present Continuous — що відбувається зараз]]"]
estimatedMinutes: 40
---

# Past Continuous — дія в процесі в минулому

> [!success] Після цієї теми ти зможеш
> - сказати, що ти робив у певний момент минулого: **At 8 pm I was watching a film**;
> - розповісти про перервану дію: **I was cooking when the phone rang**;
> - описати дві паралельні дії з **while**;
> - намалювати «фон» історії: **It was raining and people were hurrying home…**

## Передбач

> [!quiz] «Я готував вечерю, коли подзвонив телефон». Як сказати?
> level: A2 · id: en-a2-past-continuous-q01
> - [ ] I cooked dinner when the phone was ringing.
> - [x] I was cooking dinner when the phone rang.
> - [ ] I was cook dinner when the phone rang.
> - [ ] I cooked dinner when the phone rang.
>
> **Пояснення:** готування — довга дія **в процесі** (*was cooking*), дзвінок — коротка подія, що її **перервала** (*rang*). Саме для таких «довга + коротка» англійці мають Past Continuous.

## Простими словами

Уяви кіно. **Past Continuous** — це кадр, поставлений на паузу посеред дії: героїня **йде** вулицею, падає сніг, грає музика. Ми не знаємо, коли вона почала й закінчила, — ми бачимо процес. **Past Simple** — це події, що стаються в кадрі: раптом **дзвонить** телефон, вона **обертається**.

В українській для цього є вид дієслова: «**готував**» (процес) vs «**приготував**» (результат). Англійська робить те саме часом: *was cooking* vs *cooked*.

> [!diagram] Довга дія і коротка подія, що її перервала
> ```yaml
> layout: timeline
> nodes:
>   - { id: start, at: "19:00", label: "початок", text: "I started cooking.", tone: gray }
>   - { id: cooking, at: "19:00–19:40", label: "Past Continuous — процес", text: "I was cooking dinner…", note: "довга дія, «фон»", tone: blue, icon: "px:clock" }
>   - { id: ring, at: "19:15", label: "Past Simple — подія", text: "…when the phone rang.", note: "коротка дія перериває довгу", tone: orange, icon: "px:phone" }
>   - { id: q, at: "питання", label: "що ти робив о 19:15?", text: "What were you doing at 7:15?", note: "— I was cooking.", tone: violet }
> steps:
>   - { show: start, note: "О сьомій я почав готувати. Але нас цікавить не початок, а сам процес." }
>   - { show: cooking, note: "Сорок хвилин я в процесі — I was cooking. Це довга смуга на шкалі часу: was / were + -ing." }
>   - { show: ring, note: "Посеред процесу — коротка подія: дзвонить телефон. Одна точка на шкалі — Past Simple: rang." }
>   - { focus: [cooking, ring], note: "Разом: I was cooking dinner when the phone rang. Довга дія — Continuous, коротка — Simple, зʼєднує їх when." }
>   - { show: q, note: "Так само питаємо про конкретний момент: What were you doing at 7:15? — I was cooking." }
> ```

## Пояснення

### Форма: was / were + -ing

| | I / he / she / it | you / we / they |
|---|---|---|
| **+** | I **was working** | They **were working** |
| **−** | She **wasn't (was not) working** | We **weren't (were not) working** |
| **?** | **Was** he **working**? — Yes, he **was**. / No, he **wasn't**. | **Were** you **working**? — Yes, we **were**. / No, we **weren't**. |
| wh-? | What **was** she **doing**? | Where **were** you **going**? |

Правопис **-ing** — той самий, що в Present Continuous: *make → making*, *run → running*, *lie → lying*.

### Чотири ситуації для Past Continuous

| Ситуація | Приклад |
|---|---|
| **1. Процес у певний момент** минулого | At 10 pm yesterday I **was reading**. — Учора о 22:00 я читав. |
| **2. Довга дія, яку перервала коротка** (when + Past Simple) | We **were having** lunch **when** Dad **arrived**. — Ми обідали, коли приїхав тато. |
| **3. Дві дії одночасно** (while) | **While** I **was washing up**, my sister **was watching** TV. — Поки я мив посуд, сестра дивилася телевізор. |
| **4. Фон історії** | It **was snowing**. People **were hurrying** home. Then I **saw** him. — Падав сніг. Люди поспішали додому. І тут я побачив його. |

### when чи while?

- **when** + коротка дія (Past Simple): *I was sleeping **when** the alarm **went off**.*
- **while** + довга дія (Past Continuous): ***While** I **was sleeping**, someone **called** me.*

Частини можна міняти місцями: *When the phone rang, I was cooking* = *I was cooking when the phone rang*. Якщо підрядне йде першим — ставимо кому.

> [!quiz] Перевір себе: when чи while?
> level: A2 · type: fill · bank · id: en-a2-past-continuous-q02
>
> ```text fill
> I was walking home [[when]] it started to rain.
> [[While]] we were waiting for the bus, we chatted about films.
> She was having a shower [[when]] the lights went out.
> ```
>
> **Пояснення:** **when** — перед короткою подією (*started*, *went out*). **While** — перед довгим процесом (*were waiting*).

### Past Continuous чи Past Simple?

> [!diagram] Процес чи завершена дія
> ```yaml
> layout: compare
> columns: { cont: "Past Continuous — процес", simple: "Past Simple — завершена дія" }
> nodes:
>   - { id: c1, col: cont, label: "was / were + -ing", text: "I was reading a book.", note: "Я читав книжку (у процесі, може й не дочитав).", tone: blue }
>   - { id: s1, col: simple, label: "V2", text: "I read a book.", note: "Я прочитав книжку (від початку до кінця).", tone: green }
>   - { id: c2, col: cont, label: "одночасно", text: "While she was singing, he was playing the guitar.", tone: blue }
>   - { id: s2, col: simple, label: "одна за одною", text: "She got up, had a shower and left.", tone: green }
> steps:
>   - { show: [c1, s1], note: "Was reading — «читав» (процес). Read — «прочитав» (результат). Майже як недоконаний і доконаний вид в українській." }
>   - { show: c2, note: "Дві довгі дії, що йшли паралельно, — обидві в Past Continuous, зʼєднуємо while." }
>   - { show: s2, note: "Ланцюжок дій одна за одною — усі в Past Simple: спершу встала, потім душ, потім пішла." }
> ```

> [!warning] Дієслова стану не люблять -ing
> **know, want, like, love, need, believe, understand, own** описують стан, а не процес. Навіть у минулому кажи *I **knew** the answer*, *She **wanted** to go*, а не ~~*I was knowing*~~.

> [!quiz] Перевір себе: обери правильний варіант
> level: A2 · id: en-a2-past-continuous-q03
>
> When I arrived at the party, everyone ___.
>
> - [ ] danced
> - [x] was dancing
> - [ ] were dancing
> - [ ] was danced
>
> **Пояснення:** коли я прийшов, танці вже йшли — процес → Past Continuous. **Everyone** граматично однина: *everyone **was** dancing*.

## Приклади

- What **were** you **doing** at midnight? — I **was sleeping**, of course! — Що ти робив опівночі? — Спав, звісно!
- I **was driving** to work when I **saw** the accident. — Я їхав на роботу, коли побачив аварію.
- **While** Mum **was cooking**, the kids **were playing** in the garden. — Поки мама готувала, діти гралися в саду.
- The sun **was shining** and the birds **were singing**. — Світило сонце, співали птахи.
- She **slipped** while she **was running** for the bus. — Вона послизнулася, коли бігла на автобус.
- I **wasn't listening**, sorry. What did you say? — Вибач, я не слухав. Що ти сказав?
- **Were** you **working** when I **called**? — Ти працював, коли я дзвонив?
- He **fell asleep** while he **was watching** TV. — Він заснув, коли дивився телевізор.
- There was a **power cut** while we **were having** dinner. — Поки ми вечеряли, зникло світло.
- **Suddenly** someone **knocked** on the door. — Раптом хтось постукав у двері.

## Слова

> [!word] while
> ipa: /waɪl/ · pos: conj · level: A2 · id: en-a2-past-continuous-w01
> uk: поки, у той час як
> example: Someone stole my bag **while** I was sleeping on the train. — Поки я спав у поїзді, хтось украв мою сумку.

> [!word] suddenly
> ipa: /ˈsʌd.ən.li/ · pos: adv · level: A2 · id: en-a2-past-continuous-w02
> uk: раптом, раптово
> example: We were walking in the park when **suddenly** it started to rain. — Ми гуляли в парку, як раптом почався дощ.

> [!word] accident
> ipa: /ˈæk.sɪ.dənt/ · pos: noun · level: A2 · id: en-a2-past-continuous-w03
> uk: аварія; нещасний випадок
> example: I saw an **accident** while I was driving to work. — Я бачив аварію, коли їхав на роботу.
> note: by accident — випадково.

> [!word] burn
> ipa: /bɜːn/ · ipa-us: /bɝːn/ · pos: verb · level: A2 · id: en-a2-past-continuous-w04
> uk: обпікати(ся); горіти
> forms: burn → burnt / burned → burnt / burned
> example: I **burnt** my hand while I was cooking. — Я обпік руку, коли готував.
> note: US частіше burned.

> [!word] ring
> ipa: /rɪŋ/ · pos: verb · level: A2 · id: en-a2-past-continuous-w05
> uk: дзвонити (про телефон, дзвінок)
> forms: ring → rang → rung
> example: The phone **rang** while I was in the shower. — Телефон задзвонив, коли я був у душі.
> note: UK також ring someone — подзвонити комусь (US — call).

> [!word] drop
> ipa: /drɒp/ · ipa-us: /drɑːp/ · pos: verb · level: A2 · id: en-a2-past-continuous-w06
> uk: упускати, кидати; падати
> example: I **dropped** my phone while I was getting off the bus. — Я впустив телефон, коли виходив з автобуса.

> [!word] slip
> ipa: /slɪp/ · pos: verb · level: A2 · id: en-a2-past-continuous-w07
> uk: посковзнутися
> example: Be careful, you might **slip** — the floor is wet. — Обережно, можна посковзнутися: підлога мокра.

> [!word] crash
> ipa: /kræʃ/ · pos: verb · level: A2 · id: en-a2-past-continuous-w08
> uk: врізатися, розбитися (про транспорт)
> example: He was texting when he **crashed** into a tree. — Він писав повідомлення, коли врізався в дерево.
> note: як іменник — аварія: a car crash.

> [!word] knock
> ipa: /nɒk/ · ipa-us: /nɑːk/ · pos: verb · level: A2 · id: en-a2-past-continuous-w09
> uk: стукати
> example: Someone was **knocking** on the door. — Хтось стукав у двері.
> note: k на початку німе.

> [!word] power cut
> ipa: /ˈpaʊə kʌt/ · ipa-us: /ˈpaʊ.ɚ kʌt/ · pos: noun · level: A2 · id: en-a2-past-continuous-w10
> uk: відключення світла
> example: There was a **power cut** while I was charging my laptop. — Поки я заряджав ноутбук, вимкнули світло.
> note: US — power outage.

> [!word] interrupt
> ipa: /ˌɪn.təˈrʌpt/ · pos: verb · level: A2 · id: en-a2-past-continuous-w11
> uk: перебивати, переривати
> example: Sorry to **interrupt**, but your taxi is here. — Вибачте, що перебиваю, але ваше таксі приїхало.

> [!word] shine
> ipa: /ʃaɪn/ · pos: verb · level: A2 · id: en-a2-past-continuous-w12
> uk: світити, сяяти
> forms: shine → shone → shone
> example: The sun was **shining** when we left the house. — Коли ми виходили з дому, світило сонце.
> note: shone: UK /ʃɒn/, US /ʃoʊn/.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-past-continuous-l01
> audio: They were watching TV when I arrived.
> - [ ] They watched TV when I arrived.
> - [x] They were watching TV when I arrived.
> - [ ] They were watching TV when I was arriving.

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-past-continuous-l02
> audio: I wasn't listening.
> - [x] I wasn't listening.
> - [ ] I'm not listening.
> - [ ] I didn't listen.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-past-continuous-l03
> audio: It was raining when we left.

> [!listen] Надрукуй почуте
> level: A2 · type: dictation · id: en-a2-past-continuous-l04
> audio: What were you doing at eight o'clock?

> [!listen] Що сталося з Максом?
> level: A2 · type: answer · id: en-a2-past-continuous-l05
> audio: A: Max, what happened to your arm?
> audio: B: I was riding my bike to work when a dog ran into the road. I tried to stop, but I fell off.
> audio: A: Oh no! Were you wearing a helmet?
> audio: B: Yes, luckily I was.
> - [ ] Він бігав у парку й посковзнувся
> - [x] Він їхав на велосипеді, на дорогу вибіг пес, і він упав
> - [ ] Його вкусив пес
> - [ ] Він їхав без шолома й ударився головою

> [!listen] Чому Оля не відповіла на дзвінок?
> level: A2 · type: answer · id: en-a2-past-continuous-l06
> audio: A: I called you three times last night! Why didn't you answer?
> audio: B: Sorry! I was having a bath, and then I fell asleep while I was reading.
> - [ ] Вона була в кіно
> - [ ] Її телефон розрядився
> - [x] Вона приймала ванну, а потім заснула за читанням
> - [ ] Вона не почула через гучну музику

## Вимова

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-continuous-s01
> text: I was cooking dinner when the phone rang.
> ipa: /aɪ wəz ˈkʊk.ɪŋ ˈdɪn.ə wen ðə fəʊn ræŋ/
> tip: was у ствердженні слабке — [wəz]; -ing — носове /ŋ/ без [g] у кінці.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-continuous-s02
> text: What were you doing?
> ipa: /wɒt wə juː ˈduː.ɪŋ/
> tip: were тут слабке — [wə]; інтонація ↘ вниз наприкінці.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-continuous-s03
> text: Were you sleeping? Yes, I was.
> ipa: /wə juː ˈsliːp.ɪŋ jes aɪ wɒz/
> tip: у короткій відповіді was сильне — [wɒz], з повним голосним.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-continuous-s04
> text: It was raining and the wind was blowing.
> ipa: /ɪt wəz ˈreɪn.ɪŋ ən ðə wɪnd wəz ˈbləʊ.ɪŋ/
> tip: wind — коротке /ɪ/; and між словами — коротке [ən].

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-continuous-s05
> text: While I was waiting, I read the news.
> ipa: /waɪl aɪ wəz ˈweɪt.ɪŋ aɪ red ðə njuːz/
> tip: read у минулому — [red], як колір red; while — губи округлені /w/.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-past-continuous-s06
> text: We weren't listening.
> ipa: /wiː wɜːnt ˈlɪs.ən.ɪŋ/
> tip: weren't — один склад [wɜːnt]; у listen t німе: [ЛІС-ен].

## Типові помилки українців

> [!pitfall] «When I cooked, the phone rang» — коли маєш на увазі процес
> Українське «**готував**» може бути і процесом, і просто фактом. Якщо дію щось перервало, вона була в процесі: *I **was cooking** when the phone rang*. *When I cooked, the phone rang* звучить як «щоразу, коли я щось готував, дзвонив телефон».

> [!pitfall] «I was knowing», «She was wanting»
> Дієслова стану (know, want, like, need, understand, believe) не беруть -ing навіть у минулому: *I **knew** him*, *She **wanted** a coffee*.

> [!pitfall] «Where you were going?»
> Як і в теперішньому, у питанні допоміжне дієслово стоїть **перед** підметом: *Where **were you** going?*, *What **was she** doing?*

## Практика

> [!quiz] Обери правильне речення
> level: A2 · id: en-a2-past-continuous-q04
> - [ ] I was have a shower when you called.
> - [x] I was having a shower when you called.
> - [ ] I had a shower when you were calling.
> - [ ] I were having a shower when you called.
>
> **Пояснення:** довга дія (душ) — *was having*; коротка (дзвінок) — *called*. *I* → **was**.

> [!quiz] «Що ви робили о дев'ятій ранку?» — як спитати?
> level: A2 · id: en-a2-past-continuous-q05
> - [ ] What you were doing at 9 am?
> - [ ] What did you doing at 9 am?
> - [x] What were you doing at 9 am?
> - [ ] What was you doing at 9 am?
>
> **Пояснення:** *What + were + you + doing*. З *you* — завжди **were**, навіть в однині.

> [!quiz] Яке речення описує дві одночасні довгі дії?
> level: A2 · id: en-a2-past-continuous-q06
> - [ ] I got home and made dinner.
> - [x] While I was making dinner, my husband was ironing.
> - [ ] When I got home, my husband made dinner.
> - [ ] I was making dinner when my husband came in.
>
> **Пояснення:** обидві дії тривали паралельно — обидві в Past Continuous, зʼєднані **while**.

> [!quiz] Обери всі правильні речення
> level: A2 · type: multi · id: en-a2-past-continuous-q07
> - [x] She was walking to school when she met her teacher.
> - [ ] She was knowing the answer.
> - [x] When the film ended, we went home.
> - [x] It was snowing all morning.
> - [ ] While I opened the door, the cat ran out.
>
> **Пояснення:** *was knowing* — дієслово стану, лише *knew*. *While* вимагає довгої дії: *While I **was opening** the door…* або *When I opened the door…*

> [!quiz] Встав was / were / wasn't / weren't
> level: A2 · type: fill · bank · id: en-a2-past-continuous-q08
>
> ```text fill
> The children [[were]] playing outside when it started to rain.
> I [[wasn't]] sleeping — I was just resting my eyes!
> [[Was]] she wearing a red coat?
> We [[weren't]] watching the match, so we don't know the score.
> ```
>
> **Пояснення:** *the children, we* → **were / weren't**; *I, she* → **was / wasn't**.

> [!quiz] Постав дієслова в Past Continuous або Past Simple
> level: A2 · type: fill · id: en-a2-past-continuous-q09
>
> ```text fill
> I [[was reading]] (read) when the lights [[went]] (go) out.
> While they [[were travelling|were traveling]] (travel) in Italy, they [[met]] (meet) an old friend.
> She [[dropped]] (drop) her keys while she [[was getting]] (get) out of the car.
> ```
>
> **Пояснення:** довгі дії — *was reading, were travelling, was getting*; короткі події — *went, met, dropped*. **Travelling** — британське написання, *traveling* — американське.

> [!quiz] Склади речення: «Поки я спав, хтось подзвонив»
> level: A2 · type: order · id: en-a2-past-continuous-q10
>
> ```text order
> While
> I
> was sleeping,
> someone
> called.
> ```
>
> **Пояснення:** *While* + довга дія в Past Continuous, далі коротка в Past Simple. Кома — бо підрядне стоїть першим.

> [!quiz] Склади питання: «Куди ти йшов, коли я тебе побачив?»
> level: A2 · type: order · id: en-a2-past-continuous-q11
>
> ```text order
> Where
> were
> you
> going
> when I saw you?
> ```
>
> **Пояснення:** *Where + were + you + going* — допоміжне дієслово перед підметом.

> [!quiz] Склади речення: «Світило сонце, і ми снідали в саду»
> level: A2 · type: order · id: en-a2-past-continuous-q12
>
> ```text order
> The sun
> was shining
> and we
> were having
> breakfast in the garden.
> ```
>
> **Пояснення:** фон історії — дві паралельні дії в Past Continuous.

> [!quiz] Почни історію: що найкраще звучить як перше речення?
> level: A2 · id: en-a2-past-continuous-q13
> - [x] It was a cold night. Snow was falling, and I was walking home alone.
> - [ ] It was a cold night. Snow fell, and I walked home alone, and then I was meeting a strange man.
> - [ ] It is a cold night. Snow was fall.
>
> **Пояснення:** історії часто починаються з **фону** в Past Continuous (*snow was falling, I was walking*), а події, що «стаються», ідуть у Past Simple: *Suddenly I **heard** a noise…*

> [!quiz] Відповідь на «Were you working at 6 pm?»
> level: A2 · id: en-a2-past-continuous-q14
> - [ ] Yes, I were.
> - [ ] No, I didn't.
> - [x] No, I wasn't. I was at the gym.
> - [ ] Yes, I was work.
>
> **Пояснення:** коротка відповідь повторює допоміжне дієслово: **Yes, I was / No, I wasn't**.

## Фішки

> [!reel] 🎬 Past Continuous — мова сценаристів
> Відкрий будь-який роман: «Rain was falling. A man was standing by the window…» Фон — Continuous, сюжетні події — Simple. Так англійці «ставлять камеру».

> [!reel] 🧭 when vs while — коротко і довго
> when — для «бах!» (the phone rang), while — для «тягнеться» (while I was cooking). Підказка: while довше слово — для довшої дії.

> [!reel] 🇺🇦 Вид дієслова тобі допоможе
> «Читав» (процес) — was reading, «прочитав» (результат) — read. Українська вже вміє бачити процес — просто перенеси це відчуття в англійську.

## Джерела та що почитати

- 🟢 R. Murphy — *Essential Grammar in Use* (Cambridge): розділи про was / were + -ing і Past Continuous vs Past Simple.
- 🟢 [British Council LearnEnglish — Grammar A1–A2](https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar) — past continuous з вправами.
- 🟡 [Cambridge Dictionary — English Grammar Today](https://dictionary.cambridge.org/grammar/british-grammar/) — past continuous, when / while.
- 🟡 [BBC Learning English](https://www.bbc.co.uk/learningenglish/) — короткі історії, де легко почути фон і події.

> [!important] Підсумок
> - Форма: **was / were + -ing**; питання — *Were you…?*, заперечення — *wasn't / weren't*.
> - Процес у момент минулого: *At 10 pm I was reading*.
> - Довга дія + коротка подія: *I was cooking **when** the phone **rang***; дві паралельні — **while**.
> - Фон історії — Continuous, події — Simple.
> - Дієслова стану (know, want, like) — без -ing.
