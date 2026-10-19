---
title: Бізнес — зустрічі, переговори, листування
order: 415
id: en-b2-business
level: B2
icon: px:clipboard
tags: [english, b2, vocabulary, business, meetings, negotiation, email, ielts]
prerequisites: ["[[English - B1 - 16. Робота, карʼєра й співбесіда]]", "[[English - B1 - 27. Письмо — лист, email, есе-думка]]"]
estimatedMinutes: 45
---

# Бізнес — зустрічі, переговори, листування

> [!success] Після цієї теми ти зможеш
> - вести й підтримувати робочу зустріч англійською: **agenda, item, action points, wrap up** (B2);
> - торгуватися ввічливо й твердо: пропозиція → зустрічна пропозиція → поступка → угода;
> - писати діловий email у правильному регістрі — формальному (*Further to our call…*) чи нейтральному (*Just a quick heads-up…*);
> - говорити про роботу й бізнес в IELTS Speaking Part 3 і Writing Task 2: *productivity, job security, workforce, entrepreneurs*;
> - розпізнавати факти й твердження в академічному тексті формату IELTS (True / False / Not Given).

## Передбач

> [!quiz] «Давайте обговоримо це питання на зустрічі». Як сказати правильно?
> level: B2 · id: en-b2-business-q01
> - [ ] Let's discuss about this question on the meeting.
> - [ ] Let's discuss this question on the meeting.
> - [x] Let's discuss this issue at the meeting.
> - [ ] Let's discuss about this issue at the meeting.
>
> **Пояснення:** *discuss* — перехідне дієслово, **без about**: *discuss something*. Зустріч — подія, тож **at** the meeting (як *at a party, at a conference*). А «питання» у значенні «проблема, тема» — ***issue*** або ***matter***; *question* — це те, що ставлять зі знаком питання.

## Пояснення

### Зустріч від початку до кінця

Робоча зустріч англійською має передбачувану структуру — і для кожного етапу є «свої» фрази. Хто веде зустріч — **chairs** it (*the chair*), хто записує рішення — **takes the minutes** (протокол).

| Етап | Що кажуть | Переклад |
|---|---|---|
| Відкрити | *Right, let's get started. Thanks for coming.* | Що ж, почнімо. Дякую, що прийшли. |
| Мета | *The purpose of today's meeting is to…* | Мета сьогоднішньої зустрічі — … |
| Порядок денний | *There are three **items** on the **agenda**.* | На порядку денному три пункти. |
| Дати слово | *Olena, would you like to start?* | Олено, почнете? |
| Повернути до теми | *Let's stick to the agenda, please.* | Тримаймося порядку денного, будь ласка. |
| Перейти далі | *Let's move on to the next item.* | Переходьмо до наступного пункту. |
| Підсумувати | *So, to sum up, we've agreed that…* | Отже, підсумовуючи: ми погодили, що… |
| Розподілити завдання | *The **action points** are: Max will…, Ira will…* | Завдання за підсумками: Макс…, Іра… |
| Завершити | *Let's **wrap up** there. I'll **follow up** with an email.* | На цьому завершимо. Я надішлю лист із підсумками. |

### Переговори: від пропозиції до угоди

> [!diagram] Як іде торг
> ```yaml
> layout: flow
> nodes:
>   - { id: prep, label: "prepare", text: "bottom line: €13", note: "твоя межа", tone: gray, icon: "px:clipboard" }
>   - { id: prop, label: "proposal", text: "€15 per unit", note: "пропозиція", tone: blue }
>   - { id: counter, label: "counter-offer", text: "€12 per unit", note: "зустрічна пропозиція", tone: orange }
>   - { id: conc, label: "concession", text: "€13.50 + 2-year contract", note: "поступка в обмін", tone: violet }
>   - { id: deal, label: "deal", text: "It's a deal!", note: "угода", tone: green, icon: "px:check" }
> steps:
>   - { focus: prep, note: "До переговорів визнач свою межу — the bottom line: нижче €13 за одиницю ти не підеш. Це твій leverage — знаєш, де зупинитися." }
>   - { move: { from: prep, to: prop, value: "€15" }, note: "Постачальник робить пропозицію — makes a proposal: €15 за одиницю." }
>   - { move: { from: prop, to: counter, value: "€12" }, note: "Ти відповідаєш зустрічною пропозицією — a counter-offer. Ввічливо: I'm afraid that's above our budget. Could you do €12?" }
>   - { move: { from: counter, to: conc, value: "if…, then…" }, note: "Ніхто не поступається просто так: If you sign for two years, we could go down to €13.50. Це concession в обмін на щось." }
>   - { move: { from: conc, to: deal, value: "win-win" }, note: "Обидві сторони щось отримали — win-win. Strike a deal, а далі — draft the terms і sign off on the contract." }
> ```

Головний граматичний інструмент переговорів — **умовні речення й модальні дієслова**, бо вони звучать мʼякше:

- *If you **could** increase the order, we **would** be able to offer a discount.* — Якби ви збільшили замовлення, ми змогли б дати знижку.
- *We **might** be willing to compromise on the delivery date.* — Ми, можливо, готові поступитися щодо дати доставки.
- *I'm afraid that's **non-negotiable**.* — Боюся, це не обговорюється.
- *Would you be prepared to…?* — Чи були б ви готові…?

### Листування: формально чи нейтрально?

> [!diagram] Один лист — два регістри
> ```yaml
> layout: compare
> columns: { formal: "Формально (новий клієнт, скарга)", neutral: "Нейтрально / розмовно (колега)" }
> nodes:
>   - { id: f1, col: formal, label: "привід", text: "Further to our phone call, …", tone: blue }
>   - { id: f2, col: formal, label: "вкладення", text: "Please find attached the draft.", tone: blue }
>   - { id: f3, col: formal, label: "прохання", text: "I would be grateful if you could reply at your earliest convenience.", tone: blue }
>   - { id: f4, col: formal, label: "кінець", text: "I look forward to hearing from you. Kind regards,", tone: blue }
>   - { id: n1, col: neutral, label: "привід", text: "Just following up on our call…", tone: green }
>   - { id: n2, col: neutral, label: "вкладення", text: "I've attached the draft.", tone: green }
>   - { id: n3, col: neutral, label: "прохання", text: "Can you get back to me by Friday?", tone: green }
>   - { id: n4, col: neutral, label: "кінець", text: "Thanks! Speak soon, / Cheers,", tone: green }
> steps:
>   - { focus: [f1, n1], note: "Привід листа. Формально — Further to… (на продовження…). З колегою — Just following up on… або Quick question about…" }
>   - { focus: [f2, n2], note: "Вкладення: формальне Please find attached… і звичайне I've attached… Обидва правильні — різниться лише дистанція." }
>   - { focus: [f3, n3], note: "Прохання: що формальніше, то довша й непряміша конструкція — I would be grateful if you could… Колезі достатньо Can you…?" }
>   - { focus: [f4, n4], note: "Кінець: I look forward to hearing from you + Kind regards / Best regards. Cheers — тільки для знайомих (і переважно UK)." }
> ```

> [!tip] Правило дзеркала
> Відповідай у тому ж регістрі, у якому написали тобі. Клієнт пише *Hi Taras, quick one…* — можна відповісти нейтрально. Клієнт пише *Dear Mr Melnyk* — тримай формальний тон, доки він сам не перейде на простіший.

### Для IELTS: робота й бізнес у Writing Task 2 і Speaking Part 3

Робота — одна з найчастіших тем IELTS. Типові питання Task 2: *Some people believe that working from home increases productivity. To what extent do you agree?* · *Should governments support small businesses?* Speaking Part 3: *Is job security more important than salary? Will robots replace office workers?*

| Ідея | Фраза рівня Band 6.5–7 | Переклад |
|---|---|---|
| продуктивність | *boost / increase **productivity*** | підвищити продуктивність |
| стабільність | *offer greater **job security*** | давати більшу гарантію зайнятості |
| персонал | *a skilled / flexible **workforce*** | кваліфікована / гнучка робоча сила |
| власна справа | *aspiring **entrepreneurs**; start a business* | підприємці-початківці; почати бізнес |
| задоволення | *job satisfaction* | задоволення роботою |
| віддалена робота | *remote working; flexible working hours* | віддалена робота; гнучкий графік |
| конкуренція | *face fierce competition from **competitors*** | стикатися з жорсткою конкуренцією |
| аутсорс | *companies **outsource** jobs abroad* | компанії передають роботу за кордон |

> [!example] Зразок абзацу для Task 2 (≈ Band 7)
> *Opponents of remote working argue that it damages teamwork. However, there is growing evidence that employees who work from home are at least as productive as their office-based colleagues, since they lose no time commuting and face fewer interruptions. Moreover, flexible arrangements allow companies to recruit from a much wider pool of talent, which gives them an edge over their **competitors**. That said, remote work is not suitable for every role: new staff, in particular, benefit from learning alongside experienced colleagues. Therefore, a hybrid model is likely to be the most effective solution for most businesses.*
>
> Що тут працює: тема речення → аргумент (*since…*) → додатковий аргумент (*Moreover*) → обмеження (*That said*) → висновок (*Therefore*). Лексика — точна (*interruptions, recruit, pool of talent, hybrid model*), без розмовних *a lot of, stuff, good*.

## Приклади

- *There are four **items** on the **agenda**, so let's be quick.* — На порядку денному чотири пункти, тож не затягуймо.
- *Could you **take the minutes** today, Ira?* — Іро, можеш сьогодні вести протокол?
- *The meeting **overran** by half an hour.* — Зустріч затяглася на пів години.
- *We've **brought** the launch **forward** to 1 May.* — Ми перенесли запуск на раніший термін — на 1 травня.
- *After three hours of talks, we finally **struck a deal**.* — Після трьох годин перемовин ми нарешті уклали угоду.
- *They refused to make any **concessions** on price.* — Вони відмовилися поступатися в ціні.
- *Please find attached the **draft** contract.* — У вкладенні — проєкт договору.
- *I'll **loop in** our lawyer so she can check the **terms**.* — Я долучу нашого юриста, щоб вона перевірила умови.
- *Just a **heads-up**: the client wants to move the call.* — Просто попереджаю: клієнт хоче перенести дзвінок.
- *Thank you for your **prompt** reply.* — Дякую за швидку відповідь.
- *Our **revenue** grew by 20%, but **profit** stayed flat.* — Наш дохід зріс на 20 %, але прибуток не змінився.

## Слова

### Зустрічі

> [!word] agenda
> ipa: /əˈdʒendə/ · pos: noun · level: B2 · id: en-b2-business-w01
> uk: порядок денний
> example: What's the first item on the **agenda**? — Який перший пункт порядку денного?
> note: нейтральне. *set the agenda* — визначати порядок денний (і в переносному сенсі — задавати тон). Наголос на другому складі: [е-ДЖЕН-де].

> [!word] item
> ipa: /ˈaɪtəm/ · ipa-us: /ˈaɪt̬əm/ · pos: noun · level: B2 · id: en-b2-business-w02
> uk: пункт (порядку денного, списку); товар
> example: Let's move on to the next **item**. — Переходьмо до наступного пункту.
> note: нейтральне. *item on the agenda*, *the last item*, *an item of clothing*.

> [!word] any other business
> ipa: /ˌeni ˌʌðə ˈbɪznəs/ · ipa-us: /ˌeni ˌʌðər ˈbɪznəs/ · pos: phrase · level: B2 · id: en-b2-business-w03
> uk: різне (останній пункт порядку денного)
> example: Is there **any other business** before we close? — Чи є ще якісь питання, перш ніж ми закінчимо?
> note: формальне, UK; в agenda пишуть скорочено *AOB*. Розмовно — *Anything else?*

> [!word] take the minutes
> ipa: /ˌteɪk ðə ˈmɪnɪts/ · pos: phrase · level: B2 · id: en-b2-business-w04
> uk: вести протокол (зустрічі)
> example: Could you **take the minutes** today? — Можеш сьогодні вести протокол?
> note: нейтральне. *minutes* у цьому значенні — завжди множина: *the minutes of the last meeting* — протокол минулої зустрічі.

> [!word] action point
> ipa: /ˈækʃən ˌpɔɪnt/ · pos: noun · level: B2 · id: en-b2-business-w05
> uk: завдання за підсумками зустрічі
> example: Let's go through the **action points** before we finish. — Давайте ще раз переглянемо завдання, перш ніж закінчити.
> note: нейтральне, UK. US — *action item*.

> [!word] attendee
> ipa: /ˌætenˈdiː/ · ipa-us: /əˌtenˈdiː/ · pos: noun · level: B2 · id: en-b2-business-w06
> uk: учасник (зустрічі, конференції)
> example: All **attendees** will receive the slides. — Усі учасники отримають слайди.
> note: формальне. Суфікс *-ee* з наголосом, як *employee, trainee*. Розмовно — *people at the meeting*.

> [!word] brief
> ipa: /briːf/ · pos: verb · level: B2 · id: en-b2-business-w07
> uk: проінструктувати; ввести в курс справи
> example: Can you **brief** me on the project before the call? — Можеш ввести мене в курс проєкту перед дзвінком?
> note: нейтральне. *brief somebody on something*; іменник *a briefing* — інструктаж; прикметник *brief* — короткий.

> [!word] bring forward
> ipa: /ˌbrɪŋ ˈfɔːwəd/ · ipa-us: /ˌbrɪŋ ˈfɔːrwərd/ · pos: phrase · level: B2 · id: en-b2-business-w08
> uk: перенести на раніший час
> example: We've **brought** the meeting **forward** to Monday. — Ми перенесли зустріч на раніший день — на понеділок.
> forms: bring → brought → brought
> note: нейтральне. Протилежне — *put back / push back* (перенести на пізніше) або *postpone* (B1).

> [!word] overrun
> ipa: /ˌəʊvəˈrʌn/ · ipa-us: /ˌoʊvərˈrʌn/ · pos: verb · level: B2 · id: en-b2-business-w09
> uk: затягнутися; вийти за межі (часу, бюджету)
> example: The meeting **overran** by forty minutes. — Зустріч затяглася на сорок хвилин.
> forms: overrun → overran → overrun
> note: нейтральне. *The project overran its budget* — проєкт вийшов за бюджет. Розмовно — *run over (time)*.

> [!word] consensus
> ipa: /kənˈsensəs/ · pos: noun · level: B2 · id: en-b2-business-w10
> uk: консенсус; спільна згода
> example: We couldn't **reach a consensus** on the budget. — Ми не змогли дійти згоди щодо бюджету.
> note: формальне. *reach / build a consensus*. Пишеться через **s**: *consenSus*, не «concensus».

> [!word] stakeholder
> ipa: /ˈsteɪkhəʊldə/ · ipa-us: /ˈsteɪkhoʊldər/ · pos: noun · level: B2 · id: en-b2-business-w11
> uk: зацікавлена сторона
> example: We need to keep all the **stakeholders** informed. — Треба тримати в курсі всі зацікавлені сторони.
> note: нейтральне-формальне. Це не лише власники: клієнти, працівники, постачальники, місцева громада.

> [!word] run something by somebody
> ipa: /ˌrʌn ˈsʌmθɪŋ baɪ ˈsʌmbədi/ · pos: phrase · level: B2 · id: en-b2-business-w12
> uk: показати (ідею, план) комусь, щоб дізнатися думку
> example: Let me **run it by** my manager first. — Спершу я покажу це своєму менеджерові.
> forms: run → ran → run
> note: розмовне-нейтральне. *Can I run something by you?* — Можна з тобою дещо обговорити? Формально — *consult somebody about something*.

> [!word] touch base
> ipa: /ˌtʌtʃ ˈbeɪs/ · pos: phrase · level: B2 · id: en-b2-business-w13
> uk: коротко звʼязатися; звірити годинники
> example: Let's **touch base** next week to see how it's going. — Давай коротко звʼяжемося наступного тижня й подивимося, як просуваються справи.
> note: розмовне, корпоративний жаргон. *touch base with somebody*.

> [!word] follow up
> ipa: /ˌfɒləʊ ˈʌp/ · ipa-us: /ˌfɑːloʊ ˈʌp/ · pos: phrase · level: B2 · id: en-b2-business-w14
> uk: повернутися до питання; надіслати нагадування чи підсумки
> example: I'll **follow up** with an email after the meeting. — Після зустрічі я надішлю лист із підсумками.
> note: нейтральне. *follow up on something*; іменник / прикметник з дефісом — *a follow-up email*.

> [!word] adjourn
> ipa: /əˈdʒɜːn/ · ipa-us: /əˈdʒɝːn/ · pos: verb · level: B2 · id: en-b2-business-w15
> uk: оголосити перерву; закрити засідання (до наступного разу)
> example: The meeting was **adjourned** until Friday. — Засідання перенесли (оголосили перерву) до пʼятниці.
> note: формальне (збори, суд, рада директорів). У звичайній зустрічі кажуть *let's wrap up* або *let's stop there*. Літера *d* не читається: [е-ДЖЕРН].

### Переговори

> [!word] proposal
> ipa: /prəˈpəʊzəl/ · ipa-us: /prəˈpoʊzəl/ · pos: noun · level: B2 · id: en-b2-business-w16
> uk: (офіційна) пропозиція; проєкт
> example: They rejected our **proposal**. — Вони відхилили нашу пропозицію.
> note: нейтральне-формальне. *put forward / submit a proposal*. *Offer* — конкретна пропозиція ціни чи роботи; *proposal* — план, який обговорюють.

> [!word] terms
> ipa: /tɜːmz/ · ipa-us: /tɝːmz/ · pos: noun · level: B2 · id: en-b2-business-w17
> uk: умови (договору, угоди)
> example: We agreed on the **terms** of the contract. — Ми погодили умови договору.
> note: нейтральне. *terms and conditions* — умови користування; *payment terms* — умови оплати; *be on good terms* — бути в добрих стосунках.

> [!word] counter-offer
> ipa: /ˈkaʊntər ˌɒfə/ · ipa-us: /ˈkaʊnt̬ər ˌɑːfər/ · pos: noun · level: B2 · id: en-b2-business-w18
> uk: зустрічна пропозиція
> example: The buyer made a **counter-offer** of €12 per unit. — Покупець зробив зустрічну пропозицію — €12 за одиницю.
> note: нейтральне. US часто без дефіса: *counteroffer*.

> [!word] concession
> ipa: /kənˈseʃən/ · pos: noun · level: B2 · id: en-b2-business-w19
> uk: поступка
> example: Both sides had to **make concessions**. — Обом сторонам довелося піти на поступки.
> note: формальне-нейтральне. UK ще й «пільга»: *concession tickets* — пільгові квитки.

> [!word] compromise
> ipa: /ˈkɒmprəmaɪz/ · ipa-us: /ˈkɑːmprəmaɪz/ · pos: noun · level: B2 · id: en-b2-business-w20
> uk: компроміс; (дієслово) іти на компроміс
> example: In the end, we **reached a compromise**. — Зрештою ми дійшли компромісу.
> note: нейтральне. Дієслово: *compromise on price*. Але *compromise your safety* — поставити під загрозу (негативне значення!).

> [!word] deal
> ipa: /diːl/ · pos: noun · level: B2 · id: en-b2-business-w21
> uk: угода; домовленість
> example: After weeks of talks, they finally **struck a deal**. — Після тижнів перемовин вони нарешті уклали угоду.
> note: нейтральне. *strike / close / seal a deal*; *It's a deal!* — Домовилися! *a good deal* — вигідна покупка.

> [!word] leverage
> ipa: /ˈliːvərɪdʒ/ · ipa-us: /ˈlevərɪdʒ/ · pos: noun · level: B2 · id: en-b2-business-w22
> uk: важіль впливу; переговорна сила
> example: As their only supplier, we have a lot of **leverage**. — Як їхній єдиний постачальник, ми маємо сильну позицію.
> note: нейтральне-формальне. Чіткий приклад UK / US: UK [ЛІ-ве-рідж], US [ЛЕ-ве-рідж].

> [!word] bottom line
> ipa: /ˌbɒtəm ˈlaɪn/ · ipa-us: /ˌbɑːt̬əm ˈlaɪn/ · pos: noun · level: B2 · id: en-b2-business-w23
> uk: межа, нижче якої не підеш; суть; чистий прибуток
> example: **The bottom line** is that we can't go below €13. — Суть у тому, що нижче €13 ми не підемо.
> note: розмовне в значенні «суть» (*The bottom line is…*), нейтральне у фінансах — останній рядок звіту, прибуток.

> [!word] deadlock
> ipa: /ˈdedlɒk/ · ipa-us: /ˈdedlɑːk/ · pos: noun · level: B2 · id: en-b2-business-w24
> uk: глухий кут (у переговорах)
> example: A new mediator helped to **break the deadlock**. — Новий посередник допоміг вийти з глухого кута.
> note: нейтральне-формальне. *reach a deadlock* — зайти в глухий кут. Синонім — *stalemate*.

> [!word] win-win
> ipa: /ˌwɪn ˈwɪn/ · pos: adj · level: B2 · id: en-b2-business-w25
> uk: вигідний для обох сторін
> example: It's a **win-win** situation for both companies. — Це вигідна ситуація для обох компаній.
> note: нейтральне-розмовне. Протилежне — *a lose-lose situation*.

> [!word] draft
> ipa: /drɑːft/ · ipa-us: /dræft/ · pos: noun · level: B2 · id: en-b2-business-w26
> uk: чернетка; проєкт (документа)
> example: I'll send you the first **draft** of the contract tomorrow. — Завтра надішлю тобі перший проєкт договору.
> note: нейтральне. Дієслово: *draft a letter* — скласти чернетку. UK *draught* — протяг, бочкове пиво; US *draft* в усіх значеннях.

> [!word] clause
> ipa: /klɔːz/ · ipa-us: /klɑːz/ · pos: noun · level: B2 · id: en-b2-business-w27
> uk: пункт (договору); підрядне речення
> example: There's a **clause** about late payment. — Там є пункт про прострочену оплату.
> note: формальне (юридичне). *a confidentiality clause* — пункт про конфіденційність.

> [!word] sign off on
> ipa: /ˌsaɪn ˈɒf ɒn/ · ipa-us: /ˌsaɪn ˈɑːf ɑːn/ · pos: phrase · level: B2 · id: en-b2-business-w28
> uk: затвердити; дати остаточне «добро»
> example: The director has to **sign off on** the budget. — Директор має затвердити бюджет.
> note: нейтральне-розмовне. Формально — *approve*.

> [!word] non-negotiable
> ipa: /ˌnɒn nɪˈɡəʊʃiəbəl/ · ipa-us: /ˌnɑːn nɪˈɡoʊʃiəbəl/ · pos: adj · level: B2 · id: en-b2-business-w29
> uk: який не обговорюється; обовʼязковий
> example: I'm afraid the delivery date is **non-negotiable**. — Боюся, дата доставки не обговорюється.
> note: нейтральне. Ввічливо звучить з *I'm afraid…*

### Компанія й ринок

> [!word] revenue
> ipa: /ˈrevənjuː/ · ipa-us: /ˈrevənuː/ · pos: noun · level: B2 · id: en-b2-business-w30
> uk: дохід; виручка
> example: Our annual **revenue** is about $3 million. — Наш річний дохід — близько 3 мільйонів доларів.
> note: нейтральне-формальне. *Revenue* — усі гроші від продажів; *profit* — що лишилося після витрат.

> [!word] profit
> ipa: /ˈprɒfɪt/ · ipa-us: /ˈprɑːfɪt/ · pos: noun · level: B2 · id: en-b2-business-w31
> uk: прибуток
> example: The company **made a profit** for the first time last year. — Минулого року компанія вперше отримала прибуток.
> note: нейтральне. *make a profit* (не «get a profit»); *profitable* — прибутковий; *non-profit* — неприбутковий.

> [!word] client
> ipa: /ˈklaɪənt/ · pos: noun · level: B2 · id: en-b2-business-w32
> uk: клієнт (того, хто надає послуги)
> example: We have **clients** in twelve countries. — У нас клієнти у дванадцяти країнах.
> note: нейтральне. *Client* — у юриста, агенції, IT-компанії; *customer* — покупець у магазині чи сервісі.

> [!word] supplier
> ipa: /səˈplaɪə/ · ipa-us: /səˈplaɪər/ · pos: noun · level: B2 · id: en-b2-business-w33
> uk: постачальник
> example: We're looking for a new **supplier** of packaging. — Ми шукаємо нового постачальника пакування.
> note: нейтральне. Дієслово *supply somebody with something*.

> [!word] competitor
> ipa: /kəmˈpetɪtə/ · ipa-us: /kəmˈpet̬ɪt̬ər/ · pos: noun · level: B2 · id: en-b2-business-w34
> uk: конкурент
> example: Our main **competitor** has just cut its prices. — Наш головний конкурент щойно знизив ціни.
> note: нейтральне. *competition* — конкуренція; *competitive* — конкурентний (*a competitive salary*).

> [!word] market share
> ipa: /ˌmɑːkɪt ˈʃeə/ · ipa-us: /ˌmɑːrkɪt ˈʃer/ · pos: noun · level: B2 · id: en-b2-business-w35
> uk: частка ринку
> example: We want to increase our **market share** to 15%. — Ми хочемо збільшити свою частку ринку до 15 %.
> note: нейтральне. *gain / lose market share*.

> [!word] headquarters
> ipa: /ˌhedˈkwɔːtəz/ · ipa-us: /ˈhedkwɔːrt̬ərz/ · pos: noun · level: B2 · id: en-b2-business-w36
> uk: головний офіс; штаб-квартира
> example: The company's **headquarters** are in Kyiv. — Головний офіс компанії — у Києві.
> note: нейтральне; скорочено *HQ*. Форма однакова в однині й множині. Наголос: UK [хед-КВОО-тез], US [ХЕД-квор-терз].

> [!word] merger
> ipa: /ˈmɜːdʒə/ · ipa-us: /ˈmɝːdʒər/ · pos: noun · level: B2 · id: en-b2-business-w37
> uk: злиття (компаній)
> example: The **merger** will create the country's largest bank. — Злиття створить найбільший банк країни.
> note: нейтральне-формальне. Пара — *mergers and acquisitions (M&A)* — злиття й поглинання.

> [!word] outsource
> ipa: /ˈaʊtsɔːs/ · ipa-us: /ˈaʊtsɔːrs/ · pos: verb · level: B2 · id: en-b2-business-w38
> uk: передавати на аутсорс (стороннім виконавцям)
> example: Many firms **outsource** their IT support. — Багато фірм передають ІТ-підтримку на аутсорс.
> note: нейтральне. Іменник — *outsourcing*.

> [!word] entrepreneur
> ipa: /ˌɒntrəprəˈnɜː/ · ipa-us: /ˌɑːntrəprəˈnɝː/ · pos: noun · level: B2 · id: en-b2-business-w39
> uk: підприємець
> example: She's a successful **entrepreneur** with three companies. — Вона успішна підприємиця з трьома компаніями.
> note: нейтральне. Слово французьке, наголос на останньому складі: [он-тре-пре-НЕ]. *entrepreneurial spirit* — підприємницька жилка.

> [!word] productivity
> ipa: /ˌprɒdʌkˈtɪvəti/ · ipa-us: /ˌproʊdʌkˈtɪvət̬i/ · pos: noun · level: B2 · id: en-b2-business-w40
> uk: продуктивність
> example: Shorter meetings can **boost productivity**. — Коротші зустрічі можуть підвищити продуктивність.
> note: нейтральне-формальне, ключове слово IELTS. *boost / improve / increase productivity*.

> [!word] workforce
> ipa: /ˈwɜːkfɔːs/ · ipa-us: /ˈwɝːkfɔːrs/ · pos: noun · level: B2 · id: en-b2-business-w41
> uk: робоча сила; персонал (компанії, країни)
> example: Women make up half of the company's **workforce**. — Жінки становлять половину персоналу компанії.
> note: нейтральне-формальне. *a skilled workforce* — кваліфікована робоча сила.

> [!word] job security
> ipa: /ˈdʒɒb sɪˌkjʊərəti/ · ipa-us: /ˈdʒɑːb sɪˌkjʊrət̬i/ · pos: noun · level: B2 · id: en-b2-business-w42
> uk: гарантія збереження роботи; стабільність зайнятості
> example: For many people, **job security** matters more than salary. — Для багатьох гарантія роботи важливіша за зарплату.
> note: нейтральне, часте в IELTS. Протилежне — *job insecurity*.

### Листування

> [!word] Please find attached
> ipa: /ˌpliːz faɪnd əˈtætʃt/ · pos: phrase · level: B2 · id: en-b2-business-w43
> uk: у вкладенні (ви знайдете)…
> example: **Please find attached** our latest price list. — У вкладенні — наш актуальний прайс-лист.
> note: формальне. Нейтрально — *I've attached…*; не «I send you in attachment».

> [!word] further to
> ipa: /ˈfɜːðə tə/ · ipa-us: /ˈfɝːðər tə/ · pos: phrase · level: B2 · id: en-b2-business-w44
> uk: на продовження; відповідно до (попередньої розмови)
> example: **Further to** our phone call, I'm sending the details. — На продовження нашої телефонної розмови надсилаю деталі.
> note: формальне, тільки на початку листа. Нейтрально — *Following our call…* або *As discussed…*

> [!word] at your earliest convenience
> ipa: /ət jɔːr ˌɜːliəst kənˈviːniəns/ · ipa-us: /ət jʊr ˌɝːliəst kənˈviːniəns/ · pos: phrase · level: B2 · id: en-b2-business-w45
> uk: щойно вам буде зручно; якнайшвидше
> example: Please reply **at your earliest convenience**. — Будь ласка, дайте відповідь, щойно зможете.
> note: дуже формальне. Насправді означає «якнайшвидше». Нейтрально — *as soon as you can*; розмовно — *ASAP*.

> [!word] reminder
> ipa: /rɪˈmaɪndə/ · ipa-us: /rɪˈmaɪndər/ · pos: noun · level: B2 · id: en-b2-business-w46
> uk: нагадування
> example: Just a gentle **reminder** that the invoice is due on Friday. — Мʼяко нагадую, що рахунок треба оплатити до пʼятниці.
> note: нейтральне. *a gentle / friendly reminder* — ввічлива формула в листі; *send a reminder*. Дієслово — *remind somebody about / to do something*.

> [!word] prompt
> ipa: /prɒmpt/ · ipa-us: /prɑːmpt/ · pos: adj · level: B2 · id: en-b2-business-w47
> uk: швидкий; оперативний
> example: Thank you for your **prompt** reply. — Дякую за швидку відповідь.
> note: нейтральне-формальне. Прислівник *promptly*: *Payment must be made promptly.*

> [!word] cc
> ipa: /ˌsiː ˈsiː/ · pos: verb · level: B2 · id: en-b2-business-w48
> uk: поставити в копію (листа)
> example: Could you **cc** me on your reply to the client? — Можеш поставити мене в копію відповіді клієнтові?
> forms: cc → cc'd → cc'd
> note: нейтральне. Від *carbon copy*. *bcc* — прихована копія. Також *copy somebody in*.

> [!word] loop in
> ipa: /ˌluːp ˈɪn/ · pos: phrase · level: B2 · id: en-b2-business-w49
> uk: долучити до обговорення; тримати в курсі
> example: I'll **loop in** Max from the finance team. — Я долучу Макса з фінансового відділу.
> note: розмовне (корпоративне). Формально — *include*, *inform*.

> [!word] heads-up
> ipa: /ˈhedz ʌp/ · pos: noun · level: B2 · id: en-b2-business-w50
> uk: попередження; «маячок» заздалегідь
> example: Thanks for the **heads-up** about the delay. — Дякую, що попередив про затримку.
> note: розмовне. *give somebody a heads-up*. У формальному листі — *Please be advised that…* або *I would like to inform you that…*

## Слухаємо

> [!listen] Яка мета зустрічі?
> level: B2 · type: answer · id: en-b2-business-l01
> audio: Right, let's get started. The main item on the agenda today is the launch date. Marketing wants to bring it forward to May, but production says that's not realistic. We need to reach a consensus before we finish.
> - [x] домовитися про дату запуску продукту
> - [ ] перенести зустріч на травень
> - [ ] затвердити бюджет маркетингу
> - [ ] обрати нового постачальника
>
> **Пояснення:** *The main item on the agenda… is the launch date* + *reach a consensus* — треба дійти спільного рішення щодо дати запуску. Травень — це пропозиція маркетингу, а не перенесення зустрічі.

> [!listen] Обери почуте
> level: B2 · type: choice · id: en-b2-business-l02
> audio: Could we bring the meeting forward to Thursday?
> - [x] Could we bring the meeting forward to Thursday?
> - [ ] Could we push the meeting back to Thursday?
> - [ ] Could we put the meeting off until Thursday?
>
> **Пояснення:** *bring forward* — на **раніше**; *push back* і *put off* — на пізніше. Значення протилежні, тож слухай частку.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-business-l03
> audio: Please find attached the minutes of Monday's meeting.

> [!listen] Яку поступку зробив постачальник?
> level: B2 · type: answer · id: en-b2-business-l04
> audio: A: Fifteen euros per unit is above our budget, I'm afraid.
> audio: B: I understand. If you sign a two-year contract, we could go down to thirteen fifty.
> audio: A: That sounds like a fair compromise. Let's draft the terms.
> - [ ] знизив ціну до €15 без жодних умов
> - [x] знизив ціну до €13,50 за умови дворічного контракту
> - [ ] запропонував безкоштовну доставку
> - [ ] відмовився змінювати ціну
>
> **Пояснення:** класична поступка в обмін: *If you sign a two-year contract, we could go down to thirteen fifty* (€13.50). Покупець приймає компроміс — *a fair compromise*.

> [!listen] IELTS Listening, Part 4 — лекція. Чому, за словами лектора, переговори найчастіше заходять у глухий кут?
> level: B2 · type: answer · id: en-b2-business-l05
> audio: Today I want to look at why so many negotiations end in deadlock. Surprisingly, the most common reason is not money. In most of the cases we studied, talks broke down because one side felt it had not been listened to. Price was the main problem in fewer than one in five cases.
> - [ ] The two sides cannot agree on the price.
> - [x] One side feels that it has been ignored.
> - [ ] The talks take too much time.
> - [ ] The negotiators do not prepare properly.
>
> **Пояснення:** ключ — *talks broke down because one side felt it had not been listened to* = *felt ignored* (парафраз, як завжди в IELTS). Ціна — пастка: її згадано, але як **рідшу** причину (*fewer than one in five cases*).

> [!listen] IELTS Listening, Part 3 — обговорення кейсу. Що обирає друга студентка і чому?
> level: B2 · type: answer · id: en-b2-business-l06
> audio: A: So which option should the company choose, the merger or outsourcing?
> audio: B: Outsourcing is cheaper in the short term, but I think the merger gives them more market share.
> audio: A: True, although the staff might lose some job security.
> - [x] the merger, because it increases market share
> - [ ] outsourcing, because it is cheaper
> - [ ] the merger, because it protects jobs
> - [ ] neither option
>
> **Пояснення:** *but I think the merger gives them more market share* — після *but* іде її справжня думка. Про робочі місця каже перший студент, і це **мінус** злиття, а не причина його обрати.

> [!listen] Напиши або скажи, що почув
> level: B2 · type: dictation · id: en-b2-business-l07
> audio: We couldn't reach a consensus, so let's touch base next week.

## Ситуація: переговори з клієнтом

> [!example] Відеодзвінок: студія з Харкова і британський клієнт
> **Client (Emma):** Thanks for the proposal, Andrii. To be honest, the price is a bit higher than we expected.
> **Andrii:** I understand. Could you tell me what budget you had in mind?
> **Emma:** Around forty thousand pounds for the whole project.
> **Andrii:** I see. Our **bottom line** for the full scope is forty-five. But if we moved the mobile app to a second phase, we could do it for forty.
> **Emma:** That could work. And the deadline — June is **non-negotiable** for us.
> **Andrii:** June is fine, provided we get your feedback on the designs within five working days.
> **Emma:** That sounds fair. So we're **on the same page**: forty thousand, web platform by June, app in phase two.
> **Andrii:** Exactly. I'll **draft the terms** and **follow up** with an email today. Shall I **loop in** your legal team?
> **Emma:** Yes, please **cc** Mark. It's a **deal**.
>
> Андрій не просто знижує ціну — він **зменшує обсяг** (*moved the app to a second phase*) і ставить умову (*provided we get your feedback…*). Так звучить зріла поступка: «так, якщо…», а не «добре, як скажете».

## Вимова

> [!speak] Скажи вголос
> level: B2 · id: en-b2-business-s01
> text: Let's move on to the next item on the agenda.
> ipa: /lets ˈmuːv ɒn tə ðə ˈnekst ˈaɪtəm ɒn ði əˈdʒendə/
> tip: move‿on зливаються [му-вон]; next item — /t/ майже зникає (elision, B2-11); agenda — [е-ДЖЕН-де].
> uk: Переходьмо до наступного пункту порядку денного.

> [!speak] Скажи вголос
> level: B2 · id: en-b2-business-s02
> text: I'll follow up with an email after the meeting.
> ipa: /aɪl ˈfɒləʊ ˈʌp wɪð ən ˈiːmeɪl ˈɑːftə ðə ˈmiːtɪŋ/
> tip: follow‿up — звʼязка через /w/: [фо-лоу-вап]; email — наголос на першому: [І-мейл].
> uk: Після зустрічі я надішлю лист із підсумками.

> [!speak] Поторгуйся
> level: B2 · id: en-b2-business-s03
> text: Could we meet halfway on the price?
> ipa: /kʊd wi ˈmiːt ˌhɑːfˈweɪ ɒn ðə ˈpraɪs/
> tip: halfway — літера *l* не читається, /h/ — легкий видих, не «г»: [хааф-ВЕЙ]; could — /d/ ледь чутно.
> uk: Може, зійдемося в ціні десь посередині?

> [!speak] Формальний лист уголос
> level: B2 · id: en-b2-business-s04
> text: Further to our phone call, please find attached the draft contract.
> ipa: /ˈfɜːðə tu aʊə ˈfəʊn ˈkɔːl ˈpliːz ˈfaɪnd əˈtætʃt ðə ˈdrɑːft ˈkɒntrækt/
> tip: further — /ð/, язик між зубами; attached — один склад у кінці: [е-ТЕЧТ], не «е-тет-чед».
> uk: На продовження нашої телефонної розмови надсилаю у вкладенні проєкт договору.

> [!speak] IELTS Speaking, Part 3 — «Do you think meetings are a waste of time?»
> level: B2 · id: en-b2-business-s05
> text: Not always. A short meeting with a clear agenda can save hours of emails.
> ipa: /ˈnɒt ˈɔːlweɪz ə ˈʃɔːt ˈmiːtɪŋ wɪð ə ˈklɪər əˈdʒendə kən ˈseɪv ˈaʊəz əv ˈiːmeɪlz/
> tip: Починай з чіткої позиції (*Not always*), далі — умова й приклад. clear‿agenda — звʼязне /r/: [клі-ре-ДЖЕН-де].
> uk: Не завжди. Коротка зустріч із чітким порядком денним може зекономити години листування.

> [!speak] IELTS Speaking, Part 3 — «What makes someone a good negotiator?»
> level: B2 · id: en-b2-business-s06
> text: Good negotiators listen more than they talk and look for a deal that works for both sides.
> ipa: /ˈɡʊd nɪˈɡəʊʃieɪtəz ˈlɪsən ˈmɔː ðən ðeɪ ˈtɔːk ən ˈlʊk fər ə ˈdiːl ðət ˈwɜːks fə ˈbəʊθ ˈsaɪdz/
> tip: negotiators — [ні-ГОУ-ші-ей-терз], /ʃ/ у середині; listen — літера *t* не читається; both — /θ/ у кінці.
> uk: Добрі переговорники більше слухають, ніж говорять, і шукають угоду, вигідну обом сторонам.

> [!speak] IELTS Speaking, Part 3 — «Is it better to work for a large company or a start-up?»
> level: B2 · id: en-b2-business-s07
> text: It depends. Large companies offer more job security, whereas start-ups give you responsibility early on.
> ipa: /ɪt dɪˈpendz ˈlɑːdʒ ˈkʌmpəniz ˈɒfə ˈmɔː ˈdʒɒb sɪˈkjʊərəti weərˈæz ˈstɑːtʌps ˈɡɪv ju rɪˌspɒnsəˈbɪləti ˈɜːli ˈɒn/
> tip: *whereas* показує контраст двох сторін — сильний хід для Band 7. responsibility — наголос на -BI-.
> uk: Усе залежить від обставин. Великі компанії дають більшу гарантію роботи, а стартапи рано дають відповідальність.

> [!speak] IELTS Speaking, Part 3 — «How has technology changed communication at work?»
> level: B2 · id: en-b2-business-s08
> text: Video calls have made communication faster, but people now expect an instant reply, which is quite stressful.
> ipa: /ˈvɪdiəʊ ˈkɔːlz həv ˈmeɪd kəˌmjuːnɪˈkeɪʃən ˈfɑːstə bət ˈpiːpəl ˈnaʊ ɪkˈspekt ən ˈɪnstənt rɪˈplaɪ wɪtʃ ɪz ˈkwaɪt ˈstresfəl/
> tip: Плюс → мінус через *but* і *which…* — розгорнута відповідь. communication — [ке-мʼю-ні-КЕЙ-шн].
> uk: Відеодзвінки пришвидшили спілкування, але тепер люди чекають миттєвої відповіді, і це досить напружує.

## Типові помилки українців

> [!pitfall] «This question is very actual»
> *Actual* — хибний друг: це «справжній, фактичний» (*the actual cost* — фактична вартість; *actually* — насправді). «Актуальний» — ***relevant, topical, pressing, current***: *This issue is very **relevant** right now. It's a **pressing** problem.* А «актуальна ціна» в листі — *the **current** price*, «актуальний прайс» — *our **latest** price list*.

> [!pitfall] «A perspective company», «perspectives of the project»
> *Perspective* — «точка зору, ракурс» (*from a business perspective* — з погляду бізнесу). «Перспективна компанія» — *a **promising** company*; «перспективи» (на майбутнє) — ***prospects***: *career prospects, the project's prospects*.

> [!pitfall] «Make a meeting», «on the meeting», «discuss about»
> Кальки з «зробити / провести зустріч», «на зустрічі», «обговорити про». Правильно: ***have / hold / arrange** a meeting*, ***at** the meeting*, *discuss **something*** (без *about*), але *talk **about** something*. Так само *a meeting **with** a client*, а не «meeting of a client».

> [!pitfall] «Waiting for your answer», «Hello, dear partners»
> Дослівне «Чекаю на вашу відповідь» англійською звучить нетерпляче. Формально — ***I look forward to hearing from you***, нейтрально — *Looking forward to your reply* або *Speak soon*. Звертання: *Dear Ms Koval* / *Dear Sir or Madam* (формально), *Hi Olena* (нейтрально); «Dear partners» і «Dear colleagues» на початку звичайного листа — канцелярит. І ніколи не *Dear Mr Taras* — *Mr / Ms* ставлять перед **прізвищем**.

## Практика

> [!quiz] Колега каже: «Let's bring the call forward to 2 p.m.» Дзвінок був о 4-й. Що змінилося?
> level: B2 · id: en-b2-business-q02
> - [x] Дзвінок буде раніше — о 14:00.
> - [ ] Дзвінок буде пізніше.
> - [ ] Дзвінок скасовано.
> - [ ] Дзвінок триватиме до 14:00.
>
> **Пояснення:** *bring forward* — перенести на **раніше**. На пізніше — *put back, push back, postpone*. Скасувати — *cancel, call off*.

> [!quiz] Які фрази доречні в листі новому клієнтові, з яким ти ще не знайомий? Обери всі.
> level: B2 · id: en-b2-business-q03
> - [x] Further to our phone call yesterday, …
> - [x] Please find attached our proposal.
> - [ ] Just a quick heads-up — prices are going up.
> - [x] I look forward to hearing from you.
> - [ ] Let's touch base next week, cheers!
>
> **Пояснення:** *further to, please find attached, I look forward to hearing from you* — формальні. *Heads-up*, *touch base*, *cheers* — розмовні: вони доречні з колегами, але не в першому листі клієнтові.

> [!quiz] Заповни фрази для зустрічі
> level: B2 · type: fill · id: en-b2-business-q04 · bank: question, protocol, points
>
> ```text fill
> Who's going to take the [[minutes]] today?
> There are three items on the [[agenda]].
> Let's move on to the next [[item]].
> Before we finish, let's go through the action [[points]].
> ```

> [!quiz] Колокації переговорів: заповни дієсловом
> level: B2 · type: fill · id: en-b2-business-q05 · bank: do, get, take
>
> ```text fill
> Both sides had to [[make]] concessions.
> After a long discussion, we [[reached]] a compromise.
> They finally [[struck]] a deal on Friday.
> A mediator helped to [[break]] the deadlock.
> ```

> [!quiz] Склади завершальну фразу формального листа
> level: B2 · type: order · id: en-b2-business-q06
>
> ```text order
> I look
> forward to
> hearing
> from you.
> waiting ✗
> ```
>
> **Пояснення:** *look forward to* + **-ing**: тут *to* — прийменник, а не частка інфінітива. Тому *hearing*, а не «to hear».

> [!quiz] Як сказати «Це питання зараз дуже актуальне»?
> level: B2 · id: en-b2-business-q07
> - [ ] This question is very actual now.
> - [x] This issue is very relevant right now.
> - [ ] This issue is very actually now.
> - [ ] This question is very topic now.
>
> **Пояснення:** *actual* — «фактичний, справжній», а не «актуальний». Правильно — *relevant, topical, pressing*. І «питання» як тема чи проблема — *issue*.

> [!quiz] «Вона працює в перспективному стартапі». Обери правильний варіант.
> level: B2 · id: en-b2-business-q08
> - [ ] She works for a perspective start-up.
> - [x] She works for a promising start-up.
> - [ ] She works for a prospective start-up.
> - [ ] She works in a perspectival start-up.
>
> **Пояснення:** «перспективний» = *promising*. *Perspective* — точка зору. *Prospective* — «майбутній, потенційний» (*a prospective client* — потенційний клієнт): граматично можливо, але означає інше.

> [!quiz] Клієнт — новий, лист офіційний. Яка фраза найкраще перепрошує за затримку?
> level: B2 · id: en-b2-business-q09
> - [ ] Sorry I'm late with this!
> - [ ] Sorry, sorry, sorry for the delay.
> - [x] Please accept our apologies for the delay in responding.
> - [ ] Excuse me for my late answer.
>
> **Пояснення:** формальний регістр — *Please accept our apologies for…* або *I apologise for the delay*. *Sorry I'm late with this!* — нормально для колеги. *Excuse me for my late answer* — калька з «вибачте за пізню відповідь».

> [!quiz] IELTS Academic Reading: True, False чи Not Given?
> level: B2 · id: en-b2-business-q10
>
> **The real cost of meetings.** In a recent study, researchers tracked the calendars of 1,200 office employees across eleven European companies. On average, staff spent almost a third of their working week in meetings, and managers estimated that roughly half of this time was unproductive. Meetings with a written agenda finished, on average, twelve minutes earlier than those without one. However, the researchers warn that simply cancelling meetings is not the answer: in companies that introduced "meeting-free days", employees sent significantly more emails, and several teams reported more misunderstandings between departments. The authors conclude that the problem lies not in the number of meetings but in the way they are run.
>
> *Statement:* **Employees in the study spent more than half of their working week in meetings.**
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** у тексті — *almost a third* (майже третина) робочого тижня. «Половина» (*half*) стосується іншого — частки **непродуктивного** часу. Пастка IELTS: правильне число з тексту, але про інше → **False**.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-business-q11
>
> **The real cost of meetings.** In a recent study, researchers tracked the calendars of 1,200 office employees across eleven European companies. On average, staff spent almost a third of their working week in meetings, and managers estimated that roughly half of this time was unproductive. Meetings with a written agenda finished, on average, twelve minutes earlier than those without one. However, the researchers warn that simply cancelling meetings is not the answer: in companies that introduced "meeting-free days", employees sent significantly more emails, and several teams reported more misunderstandings between departments. The authors conclude that the problem lies not in the number of meetings but in the way they are run.
>
> *Statement:* **Having an agenda tended to make meetings shorter.**
> - [x] True
> - [ ] False
> - [ ] Not Given
>
> **Пояснення:** *finished, on average, twelve minutes earlier* = *tended to be shorter*. Інші слова, той самий зміст → **True**.

> [!quiz] IELTS Academic Reading: True, False чи Not Given? (той самий текст)
> level: B2 · id: en-b2-business-q12
>
> **The real cost of meetings.** In a recent study, researchers tracked the calendars of 1,200 office employees across eleven European companies. On average, staff spent almost a third of their working week in meetings, and managers estimated that roughly half of this time was unproductive. Meetings with a written agenda finished, on average, twelve minutes earlier than those without one. However, the researchers warn that simply cancelling meetings is not the answer: in companies that introduced "meeting-free days", employees sent significantly more emails, and several teams reported more misunderstandings between departments. The authors conclude that the problem lies not in the number of meetings but in the way they are run.
>
> *Statement:* **Meeting-free days made employees more satisfied with their jobs.**
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** текст каже про більше листів і непорозумінь, але **нічого** про задоволення роботою (*job satisfaction*). Не роби висновків «від себе» → **Not Given**.

> [!quiz] IELTS Summary completion: заповни пропуски словами з банку (той самий текст)
> level: B2 · type: fill · id: en-b2-business-q13 · bank: half, minutes, calls, conflicts
>
> ```text fill
> Office staff spent nearly a [[third]] of the week in meetings.
> Meetings that had a written [[agenda]] ended earlier.
> On meeting-free days, people sent more [[emails]].
> Some teams also reported more [[misunderstandings]] between departments.
> ```
>
> **Пояснення:** у summary completion слова з банку мають підходити і за змістом, і граматично. *Half* — пастка (це про непродуктивний час), *conflicts* — схоже за змістом, але в тексті *misunderstandings*.

> [!quiz] IELTS Writing Task 2: яке речення найкраще перефразовує тему есе у вступі?
> level: B2 · id: en-b2-business-q14
>
> *Task:* **Some people believe that employees are more productive when they work from home.**
> - [ ] Some people believe that employees are more productive when they work from home.
> - [x] It is often argued that staff get more done when working remotely.
> - [ ] Working from home is always more productive than working in an office.
> - [ ] Few people think that remote work makes employees lazy.
>
> **Пояснення:** вступ має **перефразувати** тему своїми словами: *employees → staff*, *more productive → get more done*, *work from home → work remotely*. Скопійоване речення екзаменатор не зараховує до твоєї лексики. Варіант з *always* змінює зміст (узагальнення), а останній говорить про інше.

> [!quiz] Client чи customer? «Юридична фірма має понад 300 ___.»
> level: B2 · id: en-b2-business-q15
> - [x] clients
> - [ ] customers
> - [ ] buyers
> - [ ] consumers
>
> **Пояснення:** юрист, агенція, консультант чи IT-компанія надають **послуги** — у них ***clients***. *Customers* — покупці в магазині, кафе, банку. *Consumers* — споживачі як економічна група.

> [!quiz] Склади відповідь на переговорах: «Якщо ви підпишете контракт на два роки, ми зможемо знизити ціну».
> level: B2 · type: order · id: en-b2-business-q16
>
> ```text order
> If you sign
> a two-year contract,
> we could
> lower the price.
> will sign ✗
> ```
>
> **Пояснення:** умова в переговорах: *If + Present Simple / Past Simple, … could / would…* Після *if* не ставлять *will*: «if you will sign» — помилка.

## Фішки

> [!reel] 📝 Minutes — не про час
> *The minutes* (протокол) не повʼязані з хвилинами годинника. Слово йде від латинського *minuta scriptura* — «дрібне письмо»: секретар швидко записував усе чорновим дрібним почерком, а потім переписував начисто. Обидва значення мають один корінь — *minutus*, «маленький»: хвилина — це «маленька частина» години.

> [!reel] 🪑 Chair — людина-стілець
> Чому голову зборів називають «стільцем»? У середньовічних залах стілець зі спинкою мав лише головний — решта сиділи на лавах. Тож *the chair* — це і місце влади, і людина на ньому. Сьогодні замість *chairman* усе частіше кажуть *chair* або *chairperson*: *Who's in the chair today?*

> [!reel] ⚾ A ballpark figure
> *Can you give me a ballpark figure?* — «Назвіть хоча б приблизну суму». *Ballpark* — бейсбольний стадіон: відповідь має бути «в межах стадіону», не точно в ціль. Американський вираз давно став міжнародним діловим: *in the right ballpark* — «приблизно правильно».

## Джерела та що почитати

- 🟢 [British Council LearnEnglish — Business English](https://learnenglish.britishcouncil.org/business-english) — зустрічі, переговори, листи з аудіо.
- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — UK / US вимова: *leverage, headquarters, draft*; позначки *formal / informal*.
- 🟡 [BBC Learning English — English at Work](https://www.bbc.co.uk/learningenglish/english/features/english-at-work) — серіал про офіс: зустрічі, переговори, ділова ввічливість.
- 🟡 B. Mascull — *Business Vocabulary in Use: Intermediate* (Cambridge): розділи «Meetings», «Negotiations», «Business communication».
- 🟡 [IELTS — офіційний сайт](https://ielts.org) (Academic Reading format) — типи завдань True / False / Not Given і summary completion.

> [!important] Підсумок
> - Зустріч: *chair, agenda, item, take the minutes, action points, bring forward / overrun, wrap up, follow up*.
> - Переговори: *proposal → counter-offer → concession → compromise → deal*; знай свій *bottom line*; мʼякшай умовними: *If you could…, we would…*
> - Листи: формально — *Further to…, Please find attached…, at your earliest convenience, I look forward to hearing from you*; розмовно — *heads-up, touch base, loop in*.
> - IELTS: *boost productivity, job security, a skilled workforce, entrepreneurs, outsource jobs*; у вступі есе — парафраз, а не копія теми.
> - Пастки: *actual* ≠ актуальний (*relevant*), *perspective* ≠ перспективний (*promising*), *discuss* без *about*, *at the meeting*.
