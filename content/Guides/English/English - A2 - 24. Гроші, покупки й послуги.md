---
title: Гроші, покупки й послуги
order: 224
id: en-a2-money
level: A2
icon: px:buck
tags: [english, a2, vocabulary, money, shopping, services, complaints]
prerequisites: ["[[English - A1 - 22. Одяг, кольори й у магазині]]", "[[English - A2 - 23. Прислівники й порядок слів]]"]
estimatedMinutes: 40
---

# Гроші, покупки й послуги

> [!success] Після цієї теми ти зможеш
> - розплатитися й попросити чек: **Can I pay by card?**, **Could I have a receipt?**;
> - не плутати **cost / spend / pay** і **borrow / lend**;
> - поговорити про банк, банкомат, оренду й пошту;
> - ввічливо поскаржитися й попросити повернути гроші: **It's faulty. Can I have a refund?**

## Передбач

> [!quiz] «Можеш позичити мені 100 гривень?» Як сказати?
> level: A2 · id: en-a2-money-q01
> - [ ] Can you borrow me 100 hryvnias?
> - [x] Can you lend me 100 hryvnias?
> - [ ] Can I lend 100 hryvnias from you?
> - [ ] Can you owe me 100 hryvnias?
>
> **Пояснення:** українське «позичити» — це два англійські слова. **Lend** — дати в борг (*Can you lend me…?*), **borrow** — взяти в борг (*Can I borrow…?*). Хто просить гроші в друга, той *borrows*; друг, який дає, — *lends*.

## Простими словами

Гроші в англійській «рухаються» різними дієсловами залежно від того, **хто** робить дію і **куди** вони йдуть. Тому спершу уяви напрямок: гроші йдуть **від мене** (*pay, spend, lend*) чи **до мене** (*borrow, save, get a refund*)?

> [!diagram] Позичаємо гроші: borrow і lend
> ```yaml
> layout: flow
> nodes:
>   - { id: taras, label: "Тарас", text: "£50 → £30", tone: blue, icon: "px:person" }
>   - { id: me, label: "я", text: "£0", tone: violet, icon: "px:person" }
> edges:
>   - { from: taras, to: me, label: "£20" }
> steps:
>   - { focus: me, note: "У мене порожній гаманець, а в Тараса є гроші. Я питаю: Can I borrow £20? — Можна в тебе позичити 20 фунтів?" }
>   - { move: { from: taras, to: me, value: "£20" }, set: { me: "£20", taras: "£30" }, note: "Гроші йдуть від Тараса до мене. Про мене: I borrowed £20 from Taras. Про Тараса: Taras lent me £20." }
>   - { focus: [taras, me], note: "Та сама подія — два дієслова. Borrow — брати (from), lend — давати (to / кому). Тепер I owe Taras £20 — я винен Тарасові." }
>   - { move: { from: me, to: taras, value: "£20" }, set: { me: "£0", taras: "£50" }, note: "Через тиждень: I paid him back — я повернув борг. Тепер ми квити." }
> ```

## Пояснення

### cost, spend, pay — хто що робить

| Дієслово | Хто підмет | Конструкція | Приклад |
|---|---|---|---|
| **cost** (cost, cost) | **річ** | річ + cost + сума | The ticket **cost** £15. — Квиток коштував 15 фунтів. |
| **spend** (spent, spent) | **людина** | spend + сума + **on** + річ | I **spent** £15 **on** a ticket. — Я витратив 15 фунтів на квиток. |
| **pay** (paid, paid) | **людина** | pay + сума + **for** + річ | I **paid** £15 **for** the ticket. — Я заплатив 15 фунтів за квиток. |

- *How much **does** it **cost**?* = *How much **is** it?* — Скільки це коштує?
- Платимо **за щось** — *pay **for***: *I'll pay for the drinks*. Але з рахунком чи людиною *for* не потрібен: *pay **the bill***, *pay **the waiter***.
- **Spend** — ще й про час: *I spent two hours in the shop.*

### Як платити

| Фраза | Значення |
|---|---|
| Can I pay **by card**? | Можна карткою? |
| I'll pay **in cash**. | Я заплачу готівкою. |
| Is **contactless** OK? | Можна безконтактно? |
| Enter your **PIN**, please. | Введіть PIN-код. |
| Here's your **change**. | Ось ваша решта. |
| Could I have a **receipt**, please? | Можна чек? |
| Have you got any **change**? | У тебе є дрібні? |
| Keep the change! | Решти не треба! |

> [!note] UK vs US
> **UK:** note, cash machine / cashpoint, queue, parcel, postcode, purse (жіночий гаманець). **US:** bill, ATM, line, package, zip code, purse = жіноча сумочка (гаманець — wallet).

> [!quiz] Перевір себе: cost, spend чи pay?
> level: A2 · type: fill · bank · id: en-a2-money-q02
>
> ```text fill
> How much does this jacket [[cost]]?
> I [[spent]] all my money on books last month.
> Did you [[pay]] for the taxi, or should I?
> She [[spent]] three hours choosing a new phone.
> ```
>
> **Пояснення:** річ «коштує» — **cost**; людина «витрачає» гроші й час — **spend / spent** (+ on); людина «платить» за щось — **pay for**.

### Банк, оренда, пошта

- **Bank:** open a **bank account** — відкрити рахунок; take out a **loan** — взяти кредит; get cash from a **cash machine** — зняти готівку; **exchange** money — обміняти валюту; **currency** — валюта.
- **Оренда:** pay the **rent** — платити за оренду; pay a **deposit** — внести заставу; a **fee** — плата, збір (*a booking fee* — плата за бронювання).
- **Пошта:** send a **parcel** — надіслати посилку; buy **stamps** — купити марки; write the **postcode** — написати поштовий індекс; free **delivery** — безкоштовна доставка.

### Як поскаржитися ввічливо

Англійська скарга — спокійна та ввічлива, навіть коли ти сердишся. Формула: **що купив → що не так → чого хочеш**.

| Крок | Фрази |
|---|---|
| що купив | I **bought** these headphones here last week. |
| що не так | They don't work. · It's **faulty**. · It's broken. · There's a hole in it. |
| чого хочеш | **Could I** have a **refund**, please? · **Could I exchange** it? · Can you **repair** it? |
| якщо не допомагають | I'd like to speak to the manager, please. · I'd like to make a **complaint**. |

> [!quiz] Перевір себе: обери ввічливу скаргу
> level: A2 · id: en-a2-money-q03
> - [ ] Give me my money back now!
> - [x] Excuse me, I bought this kettle yesterday, but it doesn't work. Could I have a refund, please?
> - [ ] Your kettle is bad. I want new.
> - [ ] Excuse me, this kettle is faulty. You must give me money.
>
> **Пояснення:** *Excuse me* + що купив + що не так + прохання з *Could I…, please?* — так англійці отримують результат без конфлікту.

## Приклади

- Can I pay **by card**, or is it **cash** only? — Можна карткою, чи лише готівкою?
- I'm **saving** for a new laptop. — Я відкладаю на новий ноутбук.
- I can't **afford** a holiday this year. — Цього року я не можу дозволити собі відпустку.
- Could you **lend** me your pen? — Can I **borrow** your pen? — Позичиш ручку?
- I still **owe** you ten pounds, don't I? — Я ж досі винен тобі десять фунтів?
- These trainers were a real **bargain** — only £20 in the **sale**! — Ці кросівки — справжня знахідка: лише 20 фунтів на розпродажі!
- Is there a **cash machine** near here? — Тут поблизу є банкомат?
- How much is the **rent** for this flat? — Скільки коштує оренда цієї квартири?
- I'd like to send this **parcel** to Ukraine. — Я хотів би надіслати цю посилку в Україну.
- Don't **waste** your money on that rubbish. — Не марнуй гроші на цей мотлох.

## Слова

### Платимо

> [!word] cash
> ipa: /kæʃ/ · pos: noun · level: A2 · id: en-a2-money-w01
> uk: готівка
> example: Do you take **cash**? — Ви приймаєте готівку?

> [!word] pay by card
> ipa: /peɪ baɪ kɑːd/ · ipa-us: /peɪ baɪ kɑːrd/ · pos: phrase · level: A2 · id: en-a2-money-w02
> uk: платити карткою
> forms: pay → paid → paid
> example: Can I **pay by card**? — Можна розрахуватися карткою?
> note: готівкою — pay in cash.

> [!word] change
> ipa: /tʃeɪndʒ/ · pos: noun · level: A2 · id: en-a2-money-w03
> uk: решта; дрібні гроші
> example: Sorry, I haven't got any **change**. — Вибачте, у мене немає дрібних.

> [!word] receipt
> ipa: /rɪˈsiːt/ · pos: noun · level: A2 · id: en-a2-money-w04
> uk: чек, квитанція
> example: Keep the **receipt** in case you want to return it. — Збережи чек на випадок, якщо захочеш повернути товар.
> note: p не читається: [рі-СІЇТ].

> [!word] refund
> ipa: /ˈriː.fʌnd/ · pos: noun · level: A2 · id: en-a2-money-w05
> uk: повернення грошей
> example: The shop gave me a full **refund**. — Магазин повністю повернув мені гроші.

> [!word] cost
> ipa: /kɒst/ · ipa-us: /kɑːst/ · pos: verb · level: A2 · id: en-a2-money-w06
> uk: коштувати
> forms: cost → cost → cost
> example: How much did your bike **cost**? — Скільки коштував твій велосипед?

> [!word] spend
> ipa: /spend/ · pos: verb · level: A2 · id: en-a2-money-w07
> uk: витрачати (гроші, час)
> forms: spend → spent → spent
> example: We **spent** too much money on holiday. — Ми витратили забагато грошей у відпустці.

> [!word] save
> ipa: /seɪv/ · pos: verb · level: A2 · id: en-a2-money-w08
> uk: заощаджувати, відкладати; рятувати
> example: I **save** a little money every month. — Я щомісяця відкладаю трохи грошей.

> [!word] pay back
> ipa: /peɪ ˈbæk/ · pos: phrase · level: A2 · id: en-a2-money-w09
> uk: повертати борг
> forms: pay → paid → paid
> example: I'll **pay** you **back** on Friday. — Я поверну тобі гроші в пʼятницю.
> note: частини можна розділити: pay me back, pay it back.

> [!word] lend
> ipa: /lend/ · pos: verb · level: A2 · id: en-a2-money-w10
> uk: позичати (давати комусь)
> forms: lend → lent → lent
> example: My sister **lent** me her car for the weekend. — Сестра позичила мені свою машину на вихідні.
> note: lend someone something.

> [!word] owe
> ipa: /əʊ/ · ipa-us: /oʊ/ · pos: verb · level: A2 · id: en-a2-money-w11
> uk: бути винним (гроші)
> example: How much do I **owe** you? — Скільки я тобі винен?

> [!word] afford
> ipa: /əˈfɔːd/ · ipa-us: /əˈfɔːrd/ · pos: verb · level: A2 · id: en-a2-money-w12
> uk: дозволити собі (за грошима)
> example: We can't **afford** to buy a house yet. — Ми поки не можемо дозволити собі купити будинок.
> note: зазвичай із can / can't: can afford + іменник або + to.

### Банк і гроші

> [!word] bank account
> ipa: /ˈbæŋk əˌkaʊnt/ · pos: noun · level: A2 · id: en-a2-money-w13
> uk: банківський рахунок
> example: I'd like to open a **bank account**. — Я хотів би відкрити рахунок у банку.

> [!word] cash machine
> ipa: /ˈkæʃ məˌʃiːn/ · pos: noun · level: A2 · id: en-a2-money-w14
> uk: банкомат
> example: The **cash machine** isn't working. — Банкомат не працює.
> note: також cashpoint (UK), ATM (US).

> [!word] PIN
> ipa: /pɪn/ · pos: noun · level: A2 · id: en-a2-money-w15
> uk: PIN-код
> example: Never tell anyone your **PIN**. — Нікому не кажи свій PIN-код.
> note: читається як слово pin, не по літерах.

> [!word] coin
> ipa: /kɔɪn/ · pos: noun · level: A2 · id: en-a2-money-w16
> uk: монета
> example: I need a one-pound **coin** for the trolley. — Мені потрібна монета в один фунт для візка.

> [!word] note
> ipa: /nəʊt/ · ipa-us: /noʊt/ · pos: noun · level: A2 · id: en-a2-money-w17
> uk: банкнота, купюра (UK)
> example: Have you got anything smaller than a fifty-pound **note**? — У вас немає купюри, дрібнішої за пʼятдесят фунтів?
> note: US — bill.

> [!word] budget
> ipa: /ˈbʌdʒ.ɪt/ · pos: noun · level: A2 · id: en-a2-money-w18
> uk: бюджет
> example: We're on a tight **budget** this month. — Цього місяця в нас обмежений бюджет.
> note: on a budget — економно.

> [!word] cashier
> ipa: /kæʃˈɪə/ · ipa-us: /kæʃˈɪr/ · pos: noun · level: A2 · id: en-a2-money-w19
> uk: касир
> example: Please pay the **cashier** at the exit. — Будь ласка, розрахуйтеся з касиром на виході.
> note: наголос на другому складі.

> [!word] loan
> ipa: /ləʊn/ · ipa-us: /loʊn/ · pos: noun · level: A2 · id: en-a2-money-w20
> uk: позика, кредит
> example: They took out a **loan** to buy a car. — Вони взяли кредит, щоб купити машину.

> [!word] currency
> ipa: /ˈkʌr.ən.si/ · ipa-us: /ˈkɝː.ən.si/ · pos: noun · level: A2 · id: en-a2-money-w21
> uk: валюта
> example: The **currency** of Ukraine is the hryvnia. — Валюта України — гривня.

> [!word] exchange
> ipa: /ɪksˈtʃeɪndʒ/ · pos: verb · level: A2 · id: en-a2-money-w22
> uk: обмінювати; (noun) обмін
> example: Where can I **exchange** euros for pounds? — Де можна обміняти євро на фунти?
> note: також обміняти товар у магазині: Can I exchange it for a bigger size?

> [!word] waste
> ipa: /weɪst/ · pos: verb · level: A2 · id: en-a2-money-w23
> uk: марнувати, витрачати даремно
> example: Don't **waste** money on things you don't need. — Не марнуй гроші на непотрібні речі.
> note: a waste of time — марна трата часу.

### Покупки й послуги

> [!word] discount
> ipa: /ˈdɪs.kaʊnt/ · pos: noun · level: A2 · id: en-a2-money-w24
> uk: знижка
> example: Students get a ten per cent **discount**. — Студенти отримують знижку десять відсотків.

> [!word] bargain
> ipa: /ˈbɑː.ɡɪn/ · ipa-us: /ˈbɑːr.ɡɪn/ · pos: noun · level: A2 · id: en-a2-money-w25
> uk: вигідна покупка
> example: Only five pounds? What a **bargain**! — Лише пʼять фунтів? Яка вигода!

> [!word] sale
> ipa: /seɪl/ · pos: noun · level: A2 · id: en-a2-money-w26
> uk: розпродаж; продаж
> example: I bought this coat in the **sale**. — Я купив це пальто на розпродажі.
> note: for sale — продається; on sale — у продажу (US — зі знижкою).

> [!word] customer
> ipa: /ˈkʌs.tə.mə/ · ipa-us: /ˈkʌs.tə.mɚ/ · pos: noun · level: A2 · id: en-a2-money-w27
> uk: покупець, клієнт
> example: The shop was full of **customers**. — У магазині було повно покупців.

> [!word] queue
> ipa: /kjuː/ · pos: noun · level: A2 · id: en-a2-money-w28
> uk: черга
> example: There was a long **queue** at the post office. — На пошті була довга черга.
> note: US — line; читається як літера Q.

> [!word] contactless
> ipa: /ˈkɒn.tækt.ləs/ · ipa-us: /ˈkɑːn.tækt.ləs/ · pos: adj · level: A2 · id: en-a2-money-w29
> uk: безконтактний
> example: You can pay **contactless** up to £100. — Безконтактно можна платити до 100 фунтів.

> [!word] complain
> ipa: /kəmˈpleɪn/ · pos: verb · level: A2 · id: en-a2-money-w30
> uk: скаржитися
> example: Some guests **complained** about the noise. — Деякі гості скаржилися на шум.
> note: complain about something / to someone.

> [!word] complaint
> ipa: /kəmˈpleɪnt/ · pos: noun · level: A2 · id: en-a2-money-w31
> uk: скарга
> example: I'd like to make a **complaint**. — Я хочу подати скаргу.

> [!word] faulty
> ipa: /ˈfɔːl.ti/ · ipa-us: /ˈfɑːl.ti/ · pos: adj · level: A2 · id: en-a2-money-w32
> uk: несправний, з дефектом
> example: The charger was **faulty**, so I took it back. — Зарядка була несправна, тож я її повернув.

> [!word] repair
> ipa: /rɪˈpeə/ · ipa-us: /rɪˈper/ · pos: verb · level: A2 · id: en-a2-money-w33
> uk: ремонтувати, лагодити
> example: How much will it cost to **repair** my phone? — Скільки коштуватиме полагодити телефон?

> [!word] delivery
> ipa: /dɪˈlɪv.ər.i/ · pos: noun · level: A2 · id: en-a2-money-w34
> uk: доставка
> example: **Delivery** is free on orders over £30. — Доставка безкоштовна для замовлень понад 30 фунтів.

### Оренда й пошта

> [!word] rent
> ipa: /rent/ · pos: noun · level: A2 · id: en-a2-money-w35
> uk: оренда, орендна плата; (verb) орендувати
> example: The **rent** is due on the first of the month. — Орендну плату треба внести першого числа.

> [!word] deposit
> ipa: /dɪˈpɒz.ɪt/ · ipa-us: /dɪˈpɑː.zɪt/ · pos: noun · level: A2 · id: en-a2-money-w36
> uk: застава; перший внесок; депозит
> example: We paid a month's rent as a **deposit**. — Ми заплатили заставу в розмірі місячної оренди.

> [!word] fee
> ipa: /fiː/ · pos: noun · level: A2 · id: en-a2-money-w37
> uk: плата, збір, комісія
> example: There's no **fee** for using this cash machine. — За користування цим банкоматом комісії немає.

> [!word] parcel
> ipa: /ˈpɑː.səl/ · ipa-us: /ˈpɑːr.səl/ · pos: noun · level: A2 · id: en-a2-money-w38
> uk: посилка
> example: A **parcel** came for you this morning. — Сьогодні вранці тобі прийшла посилка.
> note: US — package.

> [!word] stamp
> ipa: /stæmp/ · pos: noun · level: A2 · id: en-a2-money-w39
> uk: (поштова) марка; печатка
> example: Two first-class **stamps**, please. — Дві марки першого класу, будь ласка.

> [!word] postcode
> ipa: /ˈpəʊst.kəʊd/ · ipa-us: /ˈpoʊst.koʊd/ · pos: noun · level: A2 · id: en-a2-money-w40
> uk: поштовий індекс
> example: What's your **postcode**? — Який у вас поштовий індекс?
> note: US — zip code.

## Слухаємо

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-money-l01
> audio: Can I pay by card?
> - [x] Can I pay by card?
> - [ ] Can I pay in cash?
> - [ ] Can I pay for the card?

> [!listen] Що ти почув?
> level: A2 · type: choice · id: en-a2-money-l02
> audio: I spent fifty pounds on clothes.
> - [ ] I spent fifteen pounds on clothes.
> - [x] I spent fifty pounds on clothes.
> - [ ] I paid fifty pounds for the clothes.

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · id: en-a2-money-l03
> audio: Could I have a receipt, please?

> [!listen] Напиши або скажи, що почув
> level: A2 · type: dictation · id: en-a2-money-l04
> audio: How much do I owe you?

> [!listen] Що отримав покупець?
> level: A2 · type: answer · id: en-a2-money-l05
> audio: A: Hello. I bought these headphones here on Saturday, but the left side doesn't work.
> audio: B: I'm sorry about that. Have you got the receipt?
> audio: A: Yes, here it is.
> audio: B: Would you like to exchange them, or would you prefer a refund?
> audio: A: A refund, please.
> - [ ] Нові навушники
> - [x] Повернення грошей
> - [ ] Знижку на наступну покупку
> - [ ] Безкоштовний ремонт

> [!listen] Скільки коштує надіслати посилку?
> level: A2 · type: answer · id: en-a2-money-l06
> audio: A: Hi. I'd like to send this parcel to Kyiv, please.
> audio: B: Let me weigh it. That's two kilos, so it's twenty-four pounds fifty. It'll take about a week.
> audio: A: OK. Can I pay contactless?
> audio: B: Yes, of course.
> - [ ] £14.50, доставка за два дні
> - [x] £24.50, доставка приблизно за тиждень
> - [ ] £24.15, доставка за місяць
> - [ ] Безкоштовно, бо посилка легка

## Ситуація: повертаємо товар

> [!example] У магазині електроніки
> **Customer:** Excuse me, I bought this phone charger here last week, but it's **faulty** — it doesn't charge.
> **Assistant:** Oh, I'm sorry. Do you have the **receipt**?
> **Customer:** Yes, here you are.
> **Assistant:** Would you like to **exchange** it for a new one?
> **Customer:** Actually, could I have a **refund**, please?
> **Assistant:** Of course. Did you **pay by card**?
> **Customer:** No, **in cash**.
> **Assistant:** Here's your money — twelve ninety-nine. Sorry again!
>
> Зверни увагу на ввічливі «помʼякшувачі»: *Excuse me*, *Actually*, *could I…, please?* Прямо «Give me my money» англійською звучить грубо.

## Вимова

> [!speak] Скажи вголос
> level: A2 · id: en-a2-money-s01
> text: Could I have a receipt, please?
> ipa: /kʊd aɪ hæv ə rɪˈsiːt pliːz/
> tip: receipt — p не читається: [рі-СІЇТ]; could I — зливаються: [ку-дай].

> [!speak] Скажи вголос
> level: A2 · id: en-a2-money-s02
> text: Can I pay by card?
> ipa: /kən aɪ peɪ baɪ kɑːd/
> tip: card — довге [каад], r не вимовляється (UK); can — слабке [kən].

> [!speak] Скажи вголос
> level: A2 · id: en-a2-money-s03
> text: Can I borrow ten pounds?
> ipa: /kən aɪ ˈbɒr.əʊ ten paʊndz/
> tip: borrow — [БО-роу], наголос на першому; pounds — дзвінке [dz] у кінці.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-money-s04
> text: I can't afford it.
> ipa: /aɪ kɑːnt əˈfɔːd ɪt/
> tip: afford‿it зливаються: [е-ФОО-дит]; can't — довге [аа] (UK).

> [!speak] Скажи вголос
> level: A2 · id: en-a2-money-s05
> text: It's faulty. Could I have a refund?
> ipa: /ɪts ˈfɔːl.ti kʊd aɪ hæv ə ˈriː.fʌnd/
> tip: faulty — [ФООЛ-ті], довге /ɔː/; refund — наголос на першому: РІЇ-фанд.

> [!speak] Скажи вголос
> level: A2 · id: en-a2-money-s06
> text: How much does it cost?
> ipa: /haʊ mʌtʃ dəz ɪt kɒst/
> tip: does — слабке [dəz]; cost — коротке /ɒ/, як «кост» з округленими губами.

## Типові помилки українців

> [!pitfall] «Can you borrow me…?»
> «Позич мені» — ***Lend** me*, «Можна в тебе позичити?» — *Can I **borrow**…?* Borrow — брати **від** когось (*from*), lend — давати **комусь**.

> [!pitfall] «How much costs it?», «I spent money for…»
> Питання з *cost* будується через *does*: *How much **does** it **cost**?* (або просто *How much is it?*). Витрачати — **spend on**: *I spent £20 **on** a book*. Платити — **pay for**: *I paid £20 **for** a book*.

> [!pitfall] magazine — це не магазин
> **Magazine** — журнал. Магазин — **shop** (US — *store*). *I bought a magazine at the shop* — я купив журнал у магазині. А чек у магазині — **receipt**, не *recipe* (рецепт страви).

## Практика

> [!quiz] Яке речення правильне?
> level: A2 · id: en-a2-money-q04
> - [ ] This bag costed £40.
> - [x] This bag cost £40.
> - [ ] I costed £40 for this bag.
> - [ ] This bag spent £40.
>
> **Пояснення:** **cost** — неправильне дієслово: cost → cost → cost. І підмет при ньому — річ, а не людина.

> [!quiz] Ти хочеш, щоб друг повернув тобі борг. Що кажеш?
> level: A2 · id: en-a2-money-q05
> - [ ] You borrow me twenty pounds.
> - [x] You owe me twenty pounds.
> - [ ] You lend me twenty pounds.
> - [ ] You afford me twenty pounds.
>
> **Пояснення:** **owe** — бути винним: *You owe me £20* — ти мені винен 20 фунтів.

> [!quiz] Що відповісти на «Have you got any change?»
> level: A2 · id: en-a2-money-q06
> - [ ] Yes, I changed my clothes.
> - [x] Sorry, I've only got a twenty-pound note.
> - [ ] Yes, I've got a new job.
> - [ ] No, I don't like changes.
>
> **Пояснення:** **change** тут — дрібні гроші. «Вибач, у мене лише купюра в 20 фунтів».

> [!quiz] Встав borrow, lend, owe або afford
> level: A2 · type: fill · bank · id: en-a2-money-q07
>
> ```text fill
> Could you [[lend]] me your charger for an hour?
> Can I [[borrow]] your bike tomorrow?
> I can't [[afford]] a new car — it's too expensive.
> Here's the money I [[owe]] you. Thanks for helping!
> ```
>
> **Пояснення:** дати комусь — **lend**; взяти в когось — **borrow**; дозволити собі — **afford**; бути винним — **owe**.

> [!quiz] Встав прийменник
> level: A2 · type: fill · bank: with · id: en-a2-money-q08
>
> ```text fill
> Can I pay [[by]] card?
> I'd prefer to pay [[in]] cash.
> We spent a lot of money [[on]] food.
> How much did you pay [[for]] your phone?
> ```
>
> **Пояснення:** *pay **by** card*, *pay **in** cash*, *spend **on***, *pay **for***.

> [!quiz] Склади ввічливе прохання: «Можна мені повернути гроші, будь ласка?»
> level: A2 · type: order · id: en-a2-money-q09
>
> ```text order
> Could
> I
> have
> a refund,
> please?
> ```
>
> **Пояснення:** **Could I have…, please?** — найввічливіша щоденна формула прохання.

> [!quiz] Склади речення: «Я витратив усі гроші на подарунки»
> level: A2 · type: order · id: en-a2-money-q10
>
> ```text order
> I
> spent
> all my money
> on presents.
> for presents. // ✗
> ```
>
> **Пояснення:** **spend** + сума + **on** + річ.

## Фішки

> [!reel] 💷 Чому фунт — £
> Знак £ — це стилізована L від латинського libra, «фунт» (міра ваги). Колись фунт стерлінгів справді дорівнював фунту срібла.

> [!reel] 🇬🇧 Черга — національний спорт
> Британці дуже серйозно ставляться до queue. Пролізти без черги (jump the queue) — серйозне порушення етикету. Тихо стань у кінець черги й чекай.

> [!reel] 👛 Purse у Лондоні й Нью-Йорку
> У Британії purse — маленький жіночий гаманець. В Америці purse — жіноча сумочка (UK handbag). Одне слово — різні речі по обидва боки океану.

## Джерела та що почитати

- 🟢 [British Council LearnEnglish — Vocabulary A1–A2](https://learnenglish.britishcouncil.org/vocabulary/a1-a2-vocabulary) — гроші, покупки, сервіси.
- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — вимова UK / US і різниця borrow / lend.
- 🟡 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Elementary* (Cambridge): розділи про гроші й покупки.
- 🟡 [BBC Learning English](https://www.bbc.co.uk/learningenglish/) — розмовні фрази для магазину й банку.

> [!important] Підсумок
> - **cost** — про річ (*It cost £10*); **spend on** — витратити (*I spent £10 on it*); **pay for** — заплатити (*I paid £10 for it*).
> - **borrow** — взяти в борг, **lend** — дати в борг, **owe** — бути винним, **afford** — дозволити собі.
> - Платимо **by card**, **in cash**, **contactless**; просимо **receipt**, отримуємо **change**.
> - Скарга: що купив → що не так (**faulty**) → *Could I have a **refund** / **exchange** it?*
