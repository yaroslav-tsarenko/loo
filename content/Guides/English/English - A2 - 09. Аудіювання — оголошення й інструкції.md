---
title: Аудіювання — оголошення й інструкції
order: 209
id: en-a2-listen-announcements
level: A2
icon: px:map
tags: [english, a2, listening, announcements, instructions, travel]
prerequisites: ["[[English - A1 - 28. Аудіювання — діалоги на щодень]]", "[[English - A2 - 07. Подорожі, відпустка й транспорт]]"]
estimatedMinutes: 40
---

# Аудіювання — оголошення й інструкції

> [!success] Після цієї теми ти зможеш
> - зрозуміти оголошення на вокзалі й в аеропорту: номер платформи чи виходу, час, затримку, скасування;
> - вихопити головне з оголошення в магазині, прогнозу погоди й автовідповідача;
> - виконати інструкцію на слух: рецепт, маршрут, «натисніть 1»;
> - користуватися «скелетом» оголошення, щоб знати, коли прозвучить потрібна цифра.

## Передбач

> [!quiz] На вокзалі чуєш: «The 10:15 to Brighton is delayed by twenty minutes». Що це означає для тебе?
> level: A2 · id: en-a2-listen-announcements-q01
> - [ ] потяг скасовано
> - [x] потяг відійде приблизно о 10:35
> - [ ] потяг відходить з платформи 20
> - [ ] потяг прибуде о 10:15 замість 10:35
>
> **Пояснення:** *delayed by twenty minutes* — затримується на двадцять хвилин. *Cancelled* означало б «скасовано». Оголошення звучать за шаблоном, і цей шаблон можна вивчити.

## Стратегія: у кожного оголошення є скелет

Оголошення пишуть за шаблоном, і порядок інформації майже завжди однаковий. Знаючи скелет, ти знаєш, **коли** прозвучить потрібна цифра.

> [!diagram] Скелет оголошення на вокзалі
> ```yaml
> layout: flow
> nodes:
>   - { id: att, label: "1. Увага", text: "Attention, please.", note: "можна пропустити", tone: gray }
>   - { id: what, label: "2. Що", text: "The 10:15 to Brighton", note: "час + напрямок", tone: blue }
>   - { id: change, label: "3. Зміна", text: "is delayed by 20 minutes", note: "delayed / cancelled", tone: orange }
>   - { id: where, label: "4. Де", text: "platform 4", note: "platform / gate", tone: violet }
>   - { id: act, label: "5. Що робити", text: "Please wait…", note: "go to / change at", tone: green }
> steps:
>   - { focus: att, note: "Вступ — сигнал «зараз буде важливе». Слухай уважно наступне речення." }
>   - { focus: what, note: "Час відправлення і місто — щоб ти зрозумів, чи це про твій потяг. Не твій — можна розслабитися." }
>   - { focus: change, note: "Головне — чи щось змінилося: delayed (затримується), cancelled (скасовано), on time (вчасно)." }
>   - { focus: where, note: "Номер платформи чи виходу. Записуй одразу, цифрою." }
>   - { focus: act, note: "Інструкція: що робити далі. Часто тут дієслово в наказовому способі: go to, change at, please wait." }
> ```

### Ключові слова за місцем

| Де | Слова-сигнали | Що означають |
|---|---|---|
| вокзал | *platform*, *calling at*, *change at*, *delayed*, *cancelled*, *mind the gap* | платформа, із зупинками в, пересадка в, затримується, скасовано, обережно — проміжок |
| аеропорт | *gate*, *boarding*, *final call*, *departure time*, *passengers* | вихід, посадка, останнє запрошення, час вильоту, пасажири |
| магазин | *aisle*, *half price*, *special offer*, *checkouts*, *the store will close* | ряд, пів ціни, спецпропозиція, каси, магазин зачиняється |
| погода | *sunny*, *cloudy*, *showers*, *degrees*, *in the morning / afternoon* | сонячно, хмарно, короткочасний дощ, градуси, зранку / вдень |
| автовідповідач | *opening hours*, *press one*, *please hold*, *we are closed on…* | години роботи, натисніть 1, залишайтеся на лінії, вихідний день |
| інструкція | *first, then, next, after that, finally*, наказовий спосіб | спершу, потім, далі, після цього, нарешті |

> [!tip] Інструкції — слухай дієслова й порядок
> У рецепті чи маршруті кожен крок починається з дієслова: *pour*, *add*, *stir*; *turn right*, *walk past*, *cross*. А слова *first, then, after that, finally* — це «нумерація» кроків. Записуй коротко: «1 pour milk → 2 add sugar → 3 stir».

## Приклади

- *The next train to Leeds will depart from platform six.* — Наступний потяг до Лідса відправиться з шостої платформи.
- *This train is calling at York and Durham.* — Цей потяг робить зупинки в Йорку й Даремі.
- *Change at Peterborough for Ely.* — До Ілі — з пересадкою в Пітерборо.
- *Flight BA472 is now boarding at gate twelve.* — На рейс BA472 триває посадка біля виходу 12.
- *This is the final call for passengers to Warsaw.* — Останнє запрошення для пасажирів до Варшави.
- *All T-shirts are half price in aisle seven.* — Усі футболки — за пів ціни в сьомому ряду.
- *Tomorrow will be cloudy, with showers in the afternoon.* — Завтра буде хмарно, вдень — короткочасні дощі.
- *Our opening hours are 10 a.m. to 6 p.m.* — Ми працюємо з 10:00 до 18:00.
- *First, pour the milk into a pan. Then stir.* — Спершу налийте молоко в каструлю. Потім перемішайте.
- *Turn right and walk past the bank.* — Поверніть праворуч і пройдіть повз банк.

## Слова

> [!word] platform
> ipa: /ˈplætfɔːm/ · ipa-us: /ˈplætfɔːrm/ · pos: noun · level: A2 · id: en-a2-listen-announcements-w01
> uk: платформа
> example: The train leaves from **platform** three. — Потяг відходить з третьої платформи.

> [!word] delay
> ipa: /dɪˈleɪ/ · pos: noun · level: A2 · id: en-a2-listen-announcements-w02
> uk: затримка; затримувати (verb)
> example: There's a **delay** of thirty minutes. — Затримка — тридцять хвилин.
> note: be delayed by 20 minutes — затримується на 20 хвилин.

> [!word] cancel
> ipa: /ˈkænsəl/ · pos: verb · level: A2 · id: en-a2-listen-announcements-w03
> uk: скасовувати
> example: They **cancelled** the flight because of the fog. — Рейс скасували через туман.
> forms: cancel → cancelled → cancelled
> note: US — canceled, з однією l.

> [!word] announcement
> ipa: /əˈnaʊnsmənt/ · pos: noun · level: A2 · id: en-a2-listen-announcements-w04
> uk: оголошення
> example: Did you hear the **announcement**? — Ти чув оголошення?
> note: дієслово — announce /əˈnaʊns/.

> [!word] passenger
> ipa: /ˈpæsɪndʒə/ · ipa-us: /ˈpæsɪndʒər/ · pos: noun · level: A2 · id: en-a2-listen-announcements-w05
> uk: пасажир; пасажирка
> example: All **passengers** must show their passports. — Усі пасажири мають показати паспорти.

> [!word] final call
> ipa: /ˌfaɪnəl ˈkɔːl/ · pos: phrase · level: A2 · id: en-a2-listen-announcements-w06
> uk: останнє запрошення (на посадку)
> example: This is the **final call** for flight LH905. — Останнє запрошення на рейс LH905.

> [!word] aisle
> ipa: /aɪl/ · pos: noun · level: A2 · id: en-a2-listen-announcements-w07
> uk: ряд, прохід (у магазині, літаку, церкві)
> example: Milk is in **aisle** four. — Молоко — у четвертому ряду.
> note: s не читається: «айл», так само як isle (острів).

> [!word] opening hours
> ipa: /ˈəʊpənɪŋ ˌaʊəz/ · ipa-us: /ˈoʊpənɪŋ ˌaʊrz/ · pos: phrase · level: A2 · id: en-a2-listen-announcements-w08
> uk: години роботи
> example: What are your **opening hours**? — Які у вас години роботи?

> [!word] calling at
> ipa: /ˈkɔːlɪŋ ət/ · pos: phrase · level: A2 · id: en-a2-listen-announcements-w09
> uk: із зупинками в (про потяг)
> example: This train is **calling at** Reading and Bath. — Цей потяг має зупинки в Редінгу й Баті.
> note: типова фраза британських залізниць.

> [!word] recipe
> ipa: /ˈresəpi/ · pos: noun · level: A2 · id: en-a2-listen-announcements-w10
> uk: рецепт (страви)
> example: Can you give me the **recipe**? — Можеш дати мені рецепт?
> note: три склади: «РЕ-се-пі». Рецепт від лікаря — prescription.

> [!word] stir
> ipa: /stɜː/ · ipa-us: /stɝː/ · pos: verb · level: A2 · id: en-a2-listen-announcements-w11
> uk: перемішувати, помішувати
> example: **Stir** the soup slowly. — Повільно помішуйте суп.
> forms: stir → stirred → stirred

> [!word] pour
> ipa: /pɔː/ · ipa-us: /pɔːr/ · pos: verb · level: A2 · id: en-a2-listen-announcements-w12
> uk: наливати; лити(ся)
> example: **Pour** the milk into a glass. — Налийте молоко в склянку.
> note: It's pouring — ллє як з відра.

## Слухаємо

Перед кожним завданням прочитай питання й визнач, яку частину «скелета» чекаєш. Завдання 1–6 — повільно, далі — у звичайному темпі, як на справжньому вокзалі.

### Вокзал

> [!listen] З якої платформи відходить потяг?
> level: A2 · type: answer · speed: slow · id: en-a2-listen-announcements-l01
> audio: The next train to Manchester will depart from platform six.
> - [ ] з платформи 2
> - [x] з платформи 6
> - [ ] з платформи 16

> [!listen] О котрій тепер відійде потяг до Брайтона?
> level: A2 · type: answer · speed: slow · id: en-a2-listen-announcements-l02
> audio: The ten fifteen train to Brighton is delayed by twenty minutes. We apologise for any inconvenience.
> - [ ] о 10:15
> - [ ] о 10:20
> - [x] приблизно о 10:35

> [!listen] Що сталося з потягом до Кембриджа?
> level: A2 · type: answer · speed: slow · id: en-a2-listen-announcements-l03
> audio: This is a customer announcement. The eleven forty service to Cambridge has been cancelled.
> - [x] його скасували
> - [ ] він затримується на 40 хвилин
> - [ ] він відходить з іншої платформи

> [!listen] Де треба пересісти, щоб доїхати до Ілі (Ely)?
> level: A2 · type: answer · speed: slow · id: en-a2-listen-announcements-l04
> audio: This train is for London King's Cross, calling at Peterborough and Stevenage. Passengers for Ely, please change at Peterborough.
> - [ ] у Стівениджі
> - [x] у Пітерборо
> - [ ] у Лондоні

### Аеропорт

> [!listen] До якого виходу йти на рейс до Києва?
> level: A2 · type: answer · speed: slow · id: en-a2-listen-announcements-l05
> audio: Flight BA four seven two to Kyiv is now boarding at gate twelve.
> - [x] до виходу 12
> - [ ] до виходу 2
> - [ ] до виходу 472

> [!listen] Що має зробити Анна Коваленко?
> level: A2 · type: answer · speed: slow · id: en-a2-listen-announcements-l06
> audio: This is the final call for passenger Anna Kovalenko, travelling to Warsaw. Please go immediately to gate thirty-one.
> - [ ] підійти до стійки реєстрації
> - [x] негайно йти до виходу 31
> - [ ] почекати нового часу вильоту

> [!listen] Який новий час вильоту до Мюнхена?
> level: A2 · type: answer · id: en-a2-listen-announcements-l07
> audio: Flight LH nine oh five to Munich is delayed. The new departure time is fourteen twenty-five.
> - [ ] 9:05
> - [x] 14:25
> - [ ] 14:05

> [!listen] Про що попереджає оголошення в метро?
> level: A2 · type: answer · id: en-a2-listen-announcements-l08
> audio: Please mind the gap between the train and the platform.
> - [x] бути обережним з проміжком між вагоном і платформою
> - [ ] не стояти на краю платформи
> - [ ] не залишати речі в потязі

### Магазин

> [!listen] Що продають зі знижкою і де це шукати?
> level: A2 · type: answer · id: en-a2-listen-announcements-l09
> audio: Good afternoon, shoppers. Today only, all T-shirts are half price in aisle seven.
> - [ ] усі футболки — мінус 7 %
> - [x] футболки за пів ціни, ряд 7
> - [ ] сорочки за пів ціни, ряд 11

> [!listen] Що повідомляє магазин?
> level: A2 · type: answer · id: en-a2-listen-announcements-l10
> audio: The store will close in fifteen minutes. Please take your items to the checkouts.
> - [ ] магазин відкриється за 15 хвилин
> - [x] магазин зачиниться за 15 хвилин — час іти на касу
> - [ ] каси не працюватимуть 15 хвилин

> [!listen] Де чекає хлопчик Макс?
> level: A2 · type: answer · id: en-a2-listen-announcements-l11
> audio: Attention, please. A little boy called Max is waiting for his parents at customer services, near the main entrance.
> - [ ] біля каси номер один
> - [x] біля стійки обслуговування клієнтів, коло головного входу
> - [ ] на парковці

### Погода

> [!listen] Якою буде погода завтра?
> level: A2 · type: answer · id: en-a2-listen-announcements-l12
> audio: And now the weather. Tomorrow will be cloudy in the morning, with rain in the afternoon. Temperatures around twelve degrees.
> - [ ] сонячно весь день, близько 20 градусів
> - [x] зранку хмарно, вдень дощ, близько 12 градусів
> - [ ] зранку дощ, вдень сонячно, 12 градусів

> [!listen] Який день кращий для пікніка?
> level: A2 · type: answer · id: en-a2-listen-announcements-l13
> audio: This weekend will be sunny and warm on Saturday, but on Sunday it'll be windy and cold, with some showers.
> - [x] субота
> - [ ] неділя
> - [ ] обидва дні однаково добрі

### Автовідповідач

> [!listen] Коли музей зачинений?
> level: A2 · type: answer · id: en-a2-listen-announcements-l14
> audio: Thank you for calling the City Museum. Our opening hours are ten a.m. to six p.m., Tuesday to Sunday. We are closed on Mondays.
> - [ ] у неділю
> - [x] у понеділок
> - [ ] щодня після 16:00

> [!listen] Яку кнопку натиснути, щоб поговорити з консультантом?
> level: A2 · type: answer · id: en-a2-listen-announcements-l15
> audio: Welcome to Green Bank. For account information, press one. To report a lost card, press two. To speak to an advisor, press three.
> - [ ] 1
> - [ ] 2
> - [x] 3

### Інструкції

> [!listen] Що треба зробити одразу після того, як додаси цукор?
> level: A2 · type: answer · id: en-a2-listen-announcements-l16
> audio: First, pour the milk into a small pan. Then add two spoons of sugar and stir. After that, heat it for two minutes, but don't let it boil.
> - [ ] довести до кипіння
> - [x] перемішати
> - [ ] додати ще молока

> [!listen] Де музей?
> level: A2 · type: answer · id: en-a2-listen-announcements-l17
> audio: Go out of the station and turn right. Walk past the bank, then cross the road at the traffic lights. The museum is on your left.
> - [ ] праворуч одразу біля вокзалу
> - [ ] навпроти банку
> - [x] ліворуч, після переходу дороги на світлофорі

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · id: en-a2-listen-announcements-l18
> audio: Please keep your bags with you at all times.

## Вимова

> [!speak] Спитай про платформу
> level: A2 · id: en-a2-listen-announcements-s01
> text: Excuse me, which platform is the train to Oxford?
> ipa: /ɪkˈskjuːz miː wɪtʃ ˈplætfɔːm ɪz ðə treɪn tʊ ˈɒksfəd/
> tip: PLAT-form — наголос на першому складі; Oxford — «ОКС-фед», слабке /ə/ у кінці.

> [!speak] Спитай про рейс
> level: A2 · id: en-a2-listen-announcements-s02
> text: Is the flight to Kyiv delayed?
> ipa: /ɪz ðə flaɪt tə ˈkiːɪv dɪˈleɪd/
> tip: de-LAYED, з дзвінким /d/ у кінці. Голос угору ↗ — це питання так / ні.

> [!speak] Попроси пояснити оголошення
> level: A2 · id: en-a2-listen-announcements-s03
> text: Sorry, what did the announcement say?
> ipa: /ˈsɒri wɒt dɪd ði əˈnaʊnsmənt seɪ/
> tip: an-NOUNCE-ment — наголос на другому складі; the перед голосним — /ði/.

## Типові помилки українців

> [!pitfall] Чекати, що оголошення повторять повільніше
> Оголошення звучать швидко, через гучномовець і з шумом. Не намагайся почути все: стеж за скелетом «що → зміна → де → що робити» і чекай слів-сигналів *platform*, *gate*, *delayed*, *cancelled*.

> [!pitfall] Плутати delayed і cancelled
> *Delayed* — затримується (поїдеш пізніше), *cancelled* — скасовано (не поїдеш взагалі). А *on time* — вчасно. Від цього слова залежить, чи бігти до каси.

> [!pitfall] Recipe — не рецепт від лікаря
> *Recipe* /ˈresəpi/ — рецепт страви. Рецепт на ліки — *prescription*. І читається *recipe* у три склади, а не «реципі» з наголосом на «ци».

## Практика

> [!quiz] Що означає «Change at Peterborough»?
> level: A2 · id: en-a2-listen-announcements-q02
> - [ ] Обміняйте гроші в Пітерборо.
> - [x] Пересядьте в Пітерборо.
> - [ ] Потяг змінює маршрут у Пітерборо.
> - [ ] Розклад у Пітерборо змінився.
>
> **Пояснення:** *change (trains) at* — зробити пересадку на певній станції.

> [!quiz] Що означає «final call» в аеропорту?
> level: A2 · id: en-a2-listen-announcements-q03
> - [ ] останній дзвінок по телефону
> - [x] останнє запрошення на посадку — треба поспішати
> - [ ] рейс остаточно скасовано
> - [ ] останній рейс дня
>
> **Пояснення:** *final call* — посадка от-от закінчиться. Якщо називають твоє імʼя, біжи до виходу.

> [!quiz] Які слова сигналізують про проблему з потягом чи рейсом? Обери всі.
> level: A2 · type: multi · id: en-a2-listen-announcements-q04
> - [x] delayed
> - [x] cancelled
> - [ ] on time
> - [ ] boarding
> - [x] We apologise for any inconvenience.
>
> **Пояснення:** *delayed*, *cancelled* і вибачення — ознаки проблеми. *On time* — вчасно, *boarding* — посадка триває.

> [!quiz] У якій частині оголошення зазвичай звучить номер платформи?
> level: A2 · id: en-a2-listen-announcements-q05
> - [ ] на самому початку, до слова «Attention»
> - [x] після того, як назвали потяг (час і напрямок)
> - [ ] наприкінці, після вибачень
> - [ ] його ніколи не кажуть уголос
>
> **Пояснення:** скелет: увага → який потяг → що змінилося → де (платформа) → що робити.

> [!quiz] Які слова допомагають зрозуміти порядок кроків в інструкції? Обери всі.
> level: A2 · type: multi · id: en-a2-listen-announcements-q06
> - [x] first
> - [x] then
> - [x] after that
> - [ ] because
> - [x] finally
>
> **Пояснення:** *first, then, next, after that, finally* — «нумерація» кроків. *Because* пояснює причину, а не порядок.

> [!quiz] Ти чуєш «Today only, all jackets are half price». Що це?
> level: A2 · id: en-a2-listen-announcements-q07
> - [ ] куртки сьогодні не продаються
> - [x] лише сьогодні всі куртки за пів ціни
> - [ ] половина курток уже продана
> - [ ] куртки подорожчали вдвічі
>
> **Пояснення:** *half price* — за половину ціни, тобто знижка 50 %.

> [!quiz] Заповни оголошення на вокзалі
> level: A2 · type: fill · id: en-a2-listen-announcements-q08 · bank: gate, boarding
>
> ```text fill
> The 9:40 train to Bath is [[delayed]] by fifteen minutes.
> It will depart from [[platform]] two.
> This train is [[calling]] at Reading and Swindon.
> ```

> [!quiz] Заповни рецепт
> level: A2 · type: fill · id: en-a2-listen-announcements-q09 · bank: boil, cut
>
> ```text fill
> First, [[pour]] the milk into a pan.
> Then add the sugar and [[stir]].
> [[Finally]], serve it hot.
> ```

> [!quiz] Розстав кроки маршруту в порядку, як їх почуєш
> level: A2 · type: order · id: en-a2-listen-announcements-q10
>
> ```text order
> Go out of the station.
> Turn right.
> Walk past the bank.
> Cross the road at the traffic lights.
> The museum is on your left.
> ```
>
> **Пояснення:** інструкція з маршрутом — завжди в порядку руху. Записуй кроки стрілками.

> [!quiz] Склади оголошення в аеропорту
> level: A2 · type: order · id: en-a2-listen-announcements-q11
>
> ```text order
> Flight BA472
> to Kyiv
> is now boarding
> at gate twelve.
> ```
>
> **Пояснення:** рейс → напрямок → що відбувається → де. Той самий скелет, що й на вокзалі.

> [!quiz] Автовідповідач: «We are closed on Mondays». Коли НЕ варто приходити?
> level: A2 · id: en-a2-listen-announcements-q12
> - [x] у понеділок
> - [ ] у неділю
> - [ ] щодня вранці
> - [ ] у вихідні
>
> **Пояснення:** *closed on Mondays* — зачинено по понеділках.

## Фішки

> [!reel] 🚇 Mind the gap — голос, який памʼятають роками
> Фраза *Mind the gap* звучить у лондонському метро з 1960-х. На одній станції довго лишався старий запис голосу актора Освальда Лорренса — його вдова приходила туди, щоб почути чоловіка.

> [!reel] ✈️ Чому «gate», а не «door»
> *Gate* — це вихід на посадку, а *exit* — вихід із будівлі. *Door* в аеропорту — просто двері. Якщо спитаєш «Where is door 12?», тебе зрозуміють, але *gate 12* — правильно.

> [!reel] 🍳 Recipe — родич «рецепта»
> Обидва слова — з латинського *recipe* — «візьми!». Так починалися записи лікарів і кухарів. Англійська залишила його для кухні, а для лікарів узяла *prescription*.

## Джерела та що почитати

- [British Council LearnEnglish — Listening A2](https://learnenglish.britishcouncil.org/skills/listening/a2-listening) — оголошення, автовідповідачі, інструкції з завданнями.
- [BBC Learning English — 6 Minute English](https://www.bbc.co.uk/learningenglish/english/features/6-minute-english) — короткі програми в зручному темпі.
- [National Rail Enquiries](https://www.nationalrail.co.uk/) — справжні британські формулювання про затримки й пересадки.
- [Cambridge English — A2 Key: Listening](https://www.cambridgeenglish.org/exams-and-tests/key/) — формат «запиши час, номер, місце».

> [!important] Підсумок
> - Оголошення мають скелет: увага → що → зміна → де → що робити. Чекай на потрібну частину.
> - Ключові слова: *platform, gate, delayed, cancelled, calling at, change at, final call, aisle, half price*.
> - *Delayed* — затримується, *cancelled* — скасовано, *on time* — вчасно.
> - В інструкціях слухай дієслова й «нумерацію»: *first, then, after that, finally*.
> - Записуй цифри одразу, а слова — коротко, стрілками.
