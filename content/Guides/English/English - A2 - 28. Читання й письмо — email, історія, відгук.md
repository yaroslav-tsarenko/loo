---
title: Читання й письмо — email, історія, відгук
order: 228
id: en-a2-read-write
level: A2
icon: px:envelope
tags: [english, a2, skills, reading, writing, email, linkers, reviews]
prerequisites: ["[[English - A1 - 29. Читання й письмо — анкета, оголошення, листівка]]", "[[English - A2 - 19. Past Continuous — дія в процесі в минулому]]", "[[English - A2 - 27. Перші фразові дієслова]]"]
estimatedMinutes: 45
---

# Читання й письмо — email, історія, відгук

> [!success] Після цієї теми ти зможеш
> - прочитати коротку статтю чи лист і зрозуміти **головне** (gist) та знайти **деталь** (detail);
> - написати неформальний email другові: *Hi Kate, Thanks for… Looking forward to… Take care,*;
> - розповісти коротку історію в минулому зі звʼязками **first, then, after that, in the end; so, because, when**;
> - написати короткий відгук про кафе чи готель: що добре, що погано, чи радиш.

## Передбач

> [!quiz] Як закінчити лист другові: «Чекаю на зустріч!»?
> level: A2 · id: en-a2-read-write-q01
> - [ ] I'm looking forward to see you.
> - [x] I'm looking forward to seeing you.
> - [ ] I look forward see you.
> - [ ] I'm waiting to meet you.
>
> **Пояснення:** у фразі *look forward to* слово *to* — прийменник, тож після нього йде **-ing**: *to seeing*, *to hearing from you*. «To see» — найчастіша помилка навіть на B2.

## Пояснення

### Як читати: спершу головне, потім деталь

Не читай текст слово за словом зі словником. Спершу **проглянь** (skim): заголовок, перше й останнє речення — і відповідай собі, про що текст. Потім **шукай** (scan) лише те, що питають: імʼя, число, день.

> [!diagram] Два проходи по тексту
> ```yaml
> layout: flow
> nodes:
>   - { id: head, label: "1. skim", text: "headline + перше речення", note: "15–20 секунд", tone: blue, icon: "px:magnifier" }
>   - { id: gist, label: "gist", text: "Про що текст?", note: "одне речення своїми словами", tone: violet }
>   - { id: scan, label: "2. scan", text: "шукаю ключове слово", note: "Saturday, 100, Danylo", tone: orange, icon: "px:target" }
>   - { id: detail, label: "detail", text: "Відповідь на питання", note: "читаю уважно лише цей абзац", tone: green, icon: "px:check" }
> steps:
>   - { focus: head, note: "Читаємо заголовок і перше речення. Більше поки не треба." }
>   - { move: { from: head, to: gist, value: "bike workshop" }, note: "Формулюємо суть: підліток відкрив безкоштовну майстерню велосипедів. Це gist." }
>   - { focus: scan, note: "Питання: «Коли він ремонтує велосипеди?» Очі біжать текстом і шукають день тижня." }
>   - { move: { from: scan, to: detail, value: "every Saturday" }, note: "Знайшли every Saturday — читаємо лише це речення уважно. Це detail." }
> ```

> [!example] Teenager opens free bike workshop
> Last summer, 16-year-old Danylo from Poltava had a problem: his bike was broken, and the repair shop was too expensive. So he watched videos online and repaired it himself. Then his friends asked him for help with their bikes.
>
> After that, Danylo decided to open a small workshop in his grandfather's garage. Now he fixes bikes for free every Saturday. "People only pay for the parts," he says. "I enjoy it, and I'm learning a lot."
>
> Last month he repaired his hundredth bike. In the future, he wants to study engineering.

### Неформальний email

Лист другові має просту схему — і майже готові фрази для кожної частини.

| Частина | Фрази | Переклад |
|---|---|---|
| привітання | *Hi Kate,* / *Dear Kate,* | Привіт, Кейт / Дорога Кейт |
| подяка, вибачення | *Thanks for your email.* / *Sorry I didn't reply sooner.* | Дякую за лист. / Вибач, що не відповіла раніше. |
| новини | *Guess what? I passed my exams!* | Уяви собі — я склала іспити! |
| питання, пропозиція | *Are you free in August?* / *Why don't you come?* | Ти вільна в серпні? / Може, приїдеш? |
| завершення | *Looking forward to hearing from you.* / *Write soon!* | Чекаю на відповідь. / Пиши! |
| прощання | *Take care,* / *Love,* / *Best,* + імʼя | Бережи себе / З любовʼю / Усього найкращого |

> [!example] An email to a friend
> Hi Kate,
>
> Thanks for your email — it was great to hear from you! Sorry I didn't reply sooner. I was really busy last week because we had exams.
>
> Guess what? I passed all of them! So now I'm on holiday. I'm going to visit my grandparents in the Carpathians next week.
>
> Are you free in August? Maybe you can come and stay with us. My mum says it's no problem.
>
> Looking forward to hearing from you.
>
> Take care,
> Olena
>
> P.S. I've attached some photos from my trip to Lviv.

### Історія в минулому

Історія — це події по черзі. Щоб читач не загубився, кожну нову подію починай зі **звʼязки**: *first, then, after that, later, in the end*. А причину й наслідок показуй через *because* і *so*.

> [!diagram] Історія по кроках: звʼязки на шкалі часу
> ```yaml
> layout: timeline
> nodes:
>   - { id: first, at: "10:00", label: "First", text: "First, I slept until ten.", tone: blue }
>   - { id: then, at: "11:00", label: "Then", text: "Then I made pancakes.", tone: violet }
>   - { id: after, at: "12:00", label: "After that", text: "After that, I went to the park.", tone: orange }
>   - { id: when, at: "13:00", label: "when", text: "I was reading when it started to rain.", note: "Past Continuous + Past Simple", tone: red }
>   - { id: end, at: "16:00", label: "In the end", text: "In the end, we talked for three hours.", tone: green }
> steps:
>   - { show: first, note: "First — перша подія. Після неї кома: First, I slept until ten." }
>   - { show: then, note: "Then — «потім». Кома після нього не обовʼязкова." }
>   - { show: after, note: "After that — «після цього»: ще одна подія в ланцюжку." }
>   - { show: when, note: "Поворот сюжету: фон (I was reading) перериває коротка подія (it started to rain) — when." }
>   - { show: end, note: "In the end — чим усе закінчилося. Не плутай з at the end (of the day) — «наприкінці чогось»." }
> ```

> [!example] A quiet Saturday?
> Last Saturday I wanted to have a quiet day. First, I slept until ten. Then I made pancakes for breakfast. After that, I went to the park with a book. I was reading on a bench when it suddenly started to rain. I didn't have an umbrella, so I ran to a café. In the end, I met an old school friend there, and we talked for three hours. It wasn't a quiet day, but it was a great one!

| Звʼязка | Що робить | Приклад |
|---|---|---|
| first, then, after that, later | порядок подій | *Then I made pancakes.* |
| in the end / finally | чим закінчилося | *In the end, we talked for hours.* |
| so | наслідок → «тому» | *It was raining, so I ran to a café.* |
| because | причина → «бо» | *I ran to a café because it was raining.* |
| when / while | фон і подія | *I was reading when it started to rain.* |
| but | контраст | *It wasn't quiet, but it was great.* |

### Короткий відгук

Відгук (*review*) — 4–6 речень: **що й де** → **що добре** → **що погано** → **чи радиш** (+ зірки).

> [!example] Bella Pizza, Lviv ★★★★☆
> I went to Bella Pizza with my family last Friday. The location is great — it's right in the city centre. The pizza was delicious and the staff were friendly. The only problem was the service: we waited forty minutes for our food. But the prices are good, so it's really good value for money. I'd recommend it — but don't go if you're in a hurry!

> [!tip] Пиши абзацами
> Нова думка — новий абзац (*paragraph*): привітання, новини, питання, прощання. У відгуку — «добре» і «погано» окремо. Короткі абзаци читаються вдвічі легше.

## Приклади

- *Thanks for the invitation! I'd love to come.* — Дякую за запрошення! Я з радістю прийду.
- *Sorry I didn't reply sooner — I was on holiday.* — Вибач, що не відповіла раніше, — я була у відпустці.
- *I've attached the photos from the party.* — Додаю фото з вечірки.
- *Looking forward to seeing you on Saturday.* — Чекаю на зустріч у суботу.
- *First we went to the museum. Then we had lunch.* — Спочатку ми пішли в музей. Потім пообідали.
- *We missed the bus, so we took a taxi.* — Ми не встигли на автобус, тож поїхали на таксі.
- *Later that evening, Max called me.* — Пізніше того вечора мені подзвонив Макс.
- *In the end, everything was fine.* — Зрештою все було добре.
- *The hotel is in a great location, but the rooms are small.* — Готель у чудовому місці, але кімнати маленькі.
- *The museum is definitely worth a visit.* — Музей точно варто відвідати.

## Слова

> [!word] article
> ipa: /ˈɑːtɪkəl/ · ipa-us: /ˈɑːrtɪkəl/ · pos: noun · level: A2 · id: en-a2-read-write-w01
> uk: стаття
> example: I read an interesting **article** about sleep. — Я прочитав цікаву статтю про сон.
> note: у граматиці *article* — ще й артикль (a, an, the).

> [!word] headline
> ipa: /ˈhedlaɪn/ · pos: noun · level: A2 · id: en-a2-read-write-w02
> uk: заголовок (у газеті, новинах)
> example: Read the **headline** first. — Спершу прочитай заголовок.

> [!word] paragraph
> ipa: /ˈpærəɡrɑːf/ · ipa-us: /ˈpærəɡræf/ · pos: noun · level: A2 · id: en-a2-read-write-w03
> uk: абзац
> example: Start a new **paragraph** for each idea. — Кожну думку починай з нового абзацу.

> [!word] story
> ipa: /ˈstɔːri/ · pos: noun · level: A2 · id: en-a2-read-write-w04
> uk: історія; оповідання
> example: Tell me the **story** of your first job. — Розкажи історію своєї першої роботи.
> note: наука про минуле — *history*; *story* — розповідь.

> [!word] reply
> ipa: /rɪˈplaɪ/ · pos: verb · level: A2 · id: en-a2-read-write-w05
> uk: відповідати (на лист, повідомлення); відповідь
> example: Sorry I didn't **reply** sooner. — Вибач, що не відповів раніше.
> forms: reply → replied → replied
> note: *reply to* an email; іменник — *a quick reply*.

> [!word] attachment
> ipa: /əˈtætʃmənt/ · pos: noun · level: A2 · id: en-a2-read-write-w06
> uk: вкладення (файл у листі)
> example: Please see the **attachment**. — Дивіться вкладення.
> note: дієслово — *attach*: *I've attached the photos.*

> [!word] invitation
> ipa: /ˌɪnvɪˈteɪʃən/ · pos: noun · level: A2 · id: en-a2-read-write-w07
> uk: запрошення
> example: Thanks for the **invitation**! — Дякую за запрошення!

> [!word] Thanks for…
> ipa: /ˈθæŋks fə/ · ipa-us: /ˈθæŋks fər/ · pos: phrase · level: A2 · id: en-a2-read-write-w08
> uk: дякую за…
> example: **Thanks for** your email. — Дякую за лист.
> note: після *for* — іменник або *-ing*: *Thanks for helping me.*

> [!word] Looking forward to…
> ipa: /ˌlʊkɪŋ ˈfɔːwəd tə/ · ipa-us: /ˌlʊkɪŋ ˈfɔːrwərd tə/ · pos: phrase · level: A2 · id: en-a2-read-write-w09
> uk: з нетерпінням чекаю…
> example: **Looking forward to** hearing from you. — Чекаю на твою відповідь.
> note: після *to* — тільки *-ing*: *to seeing*, не «to see».

> [!word] Take care
> ipa: /ˌteɪk ˈkeə/ · ipa-us: /ˌteɪk ˈker/ · pos: phrase · level: A2 · id: en-a2-read-write-w10
> uk: бережи себе (прощання)
> example: See you soon. **Take care**, Olena. — До зустрічі. Бережи себе. Олена.

> [!word] then
> ipa: /ðen/ · pos: adv · level: A2 · id: en-a2-read-write-w11
> uk: потім; тоді
> example: We had lunch, and **then** we went home. — Ми пообідали, а потім пішли додому.
> note: не плутай з *than* /ðæn/ — «ніж».

> [!word] after that
> ipa: /ˌɑːftə ˈðæt/ · ipa-us: /ˌæftər ˈðæt/ · pos: phrase · level: A2 · id: en-a2-read-write-w12
> uk: після цього
> example: **After that**, we went to a café. — Після цього ми пішли в кафе.

> [!word] later
> ipa: /ˈleɪtə/ · ipa-us: /ˈleɪtər/ · pos: adv · level: A2 · id: en-a2-read-write-w13
> uk: пізніше; згодом
> example: Two hours **later**, the rain stopped. — Через дві години дощ ущух.

> [!word] in the end
> ipa: /ɪn ði ˈend/ · pos: phrase · level: A2 · id: en-a2-read-write-w14
> uk: зрештою; врешті-решт
> example: **In the end**, we found the hotel. — Зрештою ми знайшли готель.
> note: *at the end of* — наприкінці чогось: *at the end of the film*.

> [!word] so
> ipa: /səʊ/ · ipa-us: /soʊ/ · pos: conj · level: A2 · id: en-a2-read-write-w15
> uk: тому; тож
> example: It was late, **so** we took a taxi. — Було пізно, тож ми взяли таксі.
> note: *so* — наслідок, *because* — причина: *We took a taxi because it was late.*

> [!word] review
> ipa: /rɪˈvjuː/ · pos: noun · level: A2 · id: en-a2-read-write-w16
> uk: відгук; рецензія
> example: I always read the **reviews** before I book a hotel. — Я завжди читаю відгуки, перш ніж бронювати готель.

> [!word] service
> ipa: /ˈsɜːvɪs/ · ipa-us: /ˈsɜːrvɪs/ · pos: noun · level: A2 · id: en-a2-read-write-w17
> uk: обслуговування; послуга
> example: The food was good, but the **service** was slow. — Їжа була смачна, але обслуговування — повільне.

> [!word] value for money
> ipa: /ˌvæljuː fə ˈmʌni/ · pos: phrase · level: A2 · id: en-a2-read-write-w18
> uk: вигідно; добра якість за свою ціну
> example: The hotel is good **value for money**. — Готель вартий своїх грошей.

> [!word] location
> ipa: /ləʊˈkeɪʃən/ · ipa-us: /loʊˈkeɪʃən/ · pos: noun · level: A2 · id: en-a2-read-write-w19
> uk: розташування; місце
> example: The **location** is perfect — near the beach. — Розташування ідеальне — біля пляжу.

> [!word] worth
> ipa: /wɜːθ/ · ipa-us: /wɜːrθ/ · pos: adj · level: A2 · id: en-a2-read-write-w20
> uk: вартий; варто
> example: The film is **worth** watching. — Фільм варто подивитися.
> note: *worth* + іменник або *-ing*: *worth a visit*, *worth seeing*.

## Слухаємо

> [!listen] Чому Олена не відповіла на лист?
> level: A2 · type: answer · id: en-a2-read-write-l01
> audio: A: Hi Olena! Did you get my email?
> audio: B: Yes, thanks! Sorry I didn't reply. I was really busy with my exams.
> audio: A: No problem. So, can you come on Saturday?
> audio: B: Yes, I'd love to!
> - [ ] вона не отримала лист
> - [x] вона була зайнята іспитами
> - [ ] вона була у відпустці

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · id: en-a2-read-write-l02
> audio: Thanks for your email. See you on Saturday!

> [!listen] Чим закінчилася історія?
> level: A2 · type: answer · id: en-a2-read-write-l03
> audio: Last Sunday I went to the market. First, I bought some vegetables. Then I met my friend Ira, and we had a coffee together. In the end, I left my vegetables in the café!
> - [ ] Вона купила овочі й пішла додому.
> - [ ] Вона загубила гаманець на ринку.
> - [x] Вона забула овочі в кафе.

> [!listen] Що не сподобалося в готелі?
> level: A2 · type: answer · id: en-a2-read-write-l04
> audio: I stayed at the Green Hotel last month. The location was perfect and the room was clean, but the breakfast was terrible. Overall, it's good value for money.
> - [ ] розташування
> - [ ] кімната
> - [x] сніданок

## Вимова

> [!speak] Почни відповідь на лист друга.
> level: A2 · id: en-a2-read-write-s01
> text: Thanks for your email. It was great to hear from you.
> ipa: /ˈθæŋks fə jɔːr ˈiːmeɪl ɪt wəz ˈɡreɪt tə ˈhɪə frəm juː/
> tip: thanks — /θ/ язик між зубами; for, to, from — слабкі /fə tə frəm/.

> [!speak] Скажи, що чекаєш на зустріч.
> level: A2 · id: en-a2-read-write-s02
> text: I'm looking forward to seeing you.
> ipa: /aɪm ˌlʊkɪŋ ˈfɔːwəd tə ˈsiːɪŋ juː/
> tip: seeing — з -ing! Наголос на FOR- і SEE-.

> [!speak] Розкажи про день двома подіями.
> level: A2 · id: en-a2-read-write-s03
> text: First we went to the museum, and then we had lunch.
> ipa: /ˈfɜːst wi ˈwent tə ðə mjuːˈziːəm ənd ˈðen wi hæd ˈlʌntʃ/
> tip: museum — наголос на -SE-: «мʼю-ЗІ-ем»; then — дзвінкий /ð/.

## Типові помилки українців

> [!pitfall] Looking forward to see you
> *To* тут — прийменник, як у *Thanks for coming*, тому далі **-ing**: *I'm looking forward to **seeing** you.* Так само: *I look forward to hearing from you.*

> [!pitfall] «Привіт, дорога Кейт!» дослівно
> Українське «Дорогий друже!» або «Привіт, Кейт!» зі знаком оклику англійською звучить дивно. Пиши: ***Hi Kate,*** або ***Dear Kate,*** — **з комою**, а текст — з нового рядка й великої літери.

> [!pitfall] Кома перед that, because, when
> Українською кома перед «що», «бо», «коли» обовʼязкова. Англійською — ні: *I think **that** it's great.* *I was late **because** the bus didn't come.* Кома потрібна, коли *when* чи *because* стоїть на початку: ***When** I got home, it was dark.*

## Практика

> [!quiz] Прочитай статтю «Teenager opens free bike workshop». Про що вона загалом?
> level: A2 · id: en-a2-read-write-q02
> - [ ] Підліток купив дорогий велосипед.
> - [x] Підліток безкоштовно ремонтує велосипеди в майстерні.
> - [ ] Підліток вивчає інженерію в університеті.
> - [ ] Дідусь Данила відкрив веломагазин.
>
> **Пояснення:** gist — головна думка: Danylo *fixes bikes for free* у своїй майстерні. Інженерія — лише план на майбутнє (деталь).

> [!quiz] Коли Данило ремонтує велосипеди?
> level: A2 · id: en-a2-read-write-q03
> - [ ] щодня після школи
> - [ ] лише влітку
> - [x] щосуботи
> - [ ] щонеділі в гаражі дідуся
>
> **Пояснення:** *Now he fixes bikes for free every Saturday.* Знайти таку деталь — це scanning: шукаєш день тижня, а не читаєш усе.

> [!quiz] Як можна закінчити лист другові? Обери всі.
> level: A2 · type: multi · id: en-a2-read-write-q04
> - [x] Take care,
> - [x] Love,
> - [x] See you soon,
> - [ ] Yours faithfully,
> - [ ] Dear Sir,
>
> **Пояснення:** *Take care*, *Love*, *See you soon* — неформальні прощання. *Yours faithfully* — завершення офіційного листа незнайомій людині, *Dear Sir* — це взагалі початок.

> [!quiz] Як почати email подрузі Кейт?
> level: A2 · id: en-a2-read-write-q05
> - [ ] Hello, dear Kate!
> - [x] Hi Kate,
> - [ ] Dear Sir or Madam,
> - [ ] Kate!
>
> **Пояснення:** другові — *Hi Kate,* або *Dear Kate,* з комою. *Dear Sir or Madam* — офіційний лист, коли імені не знаєш.

> [!quiz] Заповни історію звʼязками
> level: A2 · type: fill · id: en-a2-read-write-q06 · bank: because, while
>
> ```text fill
> [[First]], I slept until ten. [[Then]] I made pancakes.
> [[After that]], I went to the park.
> [[In the end]], I met an old friend there.
> ```

> [!quiz] So чи because?
> level: A2 · type: fill · id: en-a2-read-write-q07 · bank
>
> ```text fill
> I was tired, [[so]] I went to bed early.
> I went to bed early [[because]] I was tired.
> It was raining, [[so]] we stayed at home.
> ```

> [!quiz] Склади речення: «Дякую за запрошення».
> level: A2 · type: order · id: en-a2-read-write-q08
>
> ```text order
> Thanks
> for
> the
> invitation.
> to ✗
> ```

> [!quiz] Склади кінцівку листа: «Чекаю на відповідь».
> level: A2 · type: order · id: en-a2-read-write-q09
>
> ```text order
> I'm
> looking forward
> to
> hearing
> from you.
> hear ✗
> ```

> [!quiz] Відгук про Bella Pizza: що було не так?
> level: A2 · id: en-a2-read-write-q10
> - [ ] піца була холодна
> - [ ] ціни занадто високі
> - [x] довго чекали на їжу
> - [ ] персонал був неввічливий
>
> **Пояснення:** *The only problem was the service: we waited forty minutes.* Персонал, навпаки, *friendly*, а ціни — *good*.

> [!quiz] «The hotel is good value for money.» Що це означає?
> level: A2 · id: en-a2-read-write-q11
> - [ ] готель дуже дорогий
> - [x] за таку ціну готель хороший
> - [ ] у готелі можна обміняти гроші
> - [ ] у готелі приймають лише готівку
>
> **Пояснення:** *value for money* — якість відповідає ціні або краща за неї. «Вигідно».

> [!quiz] Заповни email
> level: A2 · type: fill · id: en-a2-read-write-q12 · bank: see, Dear
>
> ```text fill
> Hi Max,
> [[Thanks]] for your invitation! I'd love to come.
> I've [[attached]] a photo of my new bike.
> Looking forward to [[seeing]] you on Saturday.
> Take [[care]],
> Ira
> ```

> [!quiz] I was reading in the park ___ it started to rain.
> level: A2 · id: en-a2-read-write-q13
> - [x] when
> - [ ] so
> - [ ] then
> - [ ] after that
>
> **Пояснення:** довга дія-фон (*was reading*) + коротка подія (*started*) — звʼязка *when*. (тема A2-19)

## Фішки

> [!reel] ✍️ P.S. — «написано після»
> *P.S.* — латинське *post scriptum*, «написане після підпису». У паперових листах це був спосіб додати думку, не переписуючи все. В email потреби немає, але P.S. лишився — як дружній «бонус» наприкінці.

> [!reel] ↩️ Re: — це не «reply»
> *Re:* у темі листа більшість вважає скороченням від *reply*. Насправді це латинське *in re* — «щодо, стосовно». Тому *Re: meeting* — «Щодо зустрічі».

> [!reel] 💋 x у кінці повідомлення
> Британці часто закінчують повідомлення друзям на *x* або *xx* — це «поцілунки». *See you tomorrow x* — звичайна дружня кінцівка, не освідчення. У робочих листах x не ставлять.

## Джерела та що почитати

- [British Council LearnEnglish — Reading A2](https://learnenglish.britishcouncil.org/skills/reading/a2-reading) — короткі статті, листи й оголошення з питаннями.
- [British Council LearnEnglish — Writing A2](https://learnenglish.britishcouncil.org/skills/writing/a2-writing) — email другові, історія, відгук.
- [Cambridge English — A2 Key: Reading and Writing](https://www.cambridgeenglish.org/exams-and-tests/key/) — завдання «email 25+ слів» і «історія за картинками».
- M. Swan — *Practical English Usage*: розділи про *look forward to* та звʼязки *so / because*.

> [!important] Підсумок
> - Читай двічі: **skim** (про що?) → **scan** (де відповідь?) → уважно лише потрібний абзац.
> - Email: *Hi Kate,* → *Thanks for…* → новини → питання → *Looking forward to hearing from you.* → *Take care,*.
> - Історія: *first, then, after that, later, in the end*; *so* — наслідок, *because* — причина, *when* — подія на фоні.
> - Відгук: що й де → добре → погано → чи радиш; *value for money*, *worth a visit*.
