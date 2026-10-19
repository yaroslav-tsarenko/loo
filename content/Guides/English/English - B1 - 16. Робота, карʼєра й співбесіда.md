---
title: Робота, карʼєра й співбесіда
order: 316
id: en-b1-career
level: B1
icon: px:hardHat
tags: [english, b1, vocabulary, work, career, job-interview, cv, ielts]
prerequisites: ["[[English - A2 - 12. Робота, професії й навчання]]", "[[English - A2 - 14. Present Perfect — досвід, ever, never]]"]
estimatedMinutes: 45
---

# Робота, карʼєра й співбесіда

> [!success] Після цієї теми ти зможеш
> - пройти шлях пошуку роботи англійською: **vacancy → apply → CV → interview → job offer**;
> - відповісти на типові питання співбесіди: *Tell me about yourself. What are your strengths? Why do you want this job?*;
> - розповісти про досвід через Present Perfect: *I've worked as a sales manager for three years*;
> - описати себе на роботі: **motivated, organised, flexible, a team player**;
> - розуміти оголошення про вакансію — тип тексту з IELTS General Training Reading, Section 2.

## Передбач

> [!quiz] «Я працюю в цій компанії три роки». Як сказати правильно?
> level: B1 · id: en-b1-career-q01
> - [ ] I work in this company three years.
> - [ ] I am working for this company since three years.
> - [x] I've worked for this company for three years.
> - [ ] I worked for this company three years ago.
>
> **Пояснення:** дія почалася в минулому й **триває досі** → Present Perfect + **for** (тривалість): *I've worked / I've been working here for three years.* Перекладати українське «працюю три роки» через Present Simple — найчастіша помилка на співбесіді. *For* — тривалість (*for three years*), *since* — точка старту (*since 2023*).

## Пояснення

### Шлях до роботи

> [!diagram] Від вакансії до пропозиції
> ```yaml
> layout: flow
> nodes:
>   - { id: ad, label: "vacancy", text: "Job advert", note: "Marketing Assistant", tone: gray, icon: "px:clipboard" }
>   - { id: apply, label: "apply for", text: "CV + cover letter", note: "заявка", tone: blue, icon: "px:envelope" }
>   - { id: short, label: "shortlist", text: "5 of 80 candidates", note: "короткий список", tone: violet }
>   - { id: int, label: "job interview", text: "Tell me about yourself…", note: "співбесіда", tone: orange, icon: "px:chat" }
>   - { id: offer, label: "job offer", text: "Contract", note: "пропозиція роботи", tone: green, icon: "px:trophy" }
> steps:
>   - { focus: ad, note: "Компанія публікує вакансію — a vacancy або job advert (US job ad / posting)." }
>   - { move: { from: ad, to: apply, value: "apply" }, note: "Ти подаєшся — apply FOR the job: надсилаєш CV (US résumé) і супровідний лист — cover letter." }
>   - { move: { from: apply, to: short, value: "80 → 5" }, note: "Роботодавець (employer) відбирає кандидатів — you are shortlisted." }
>   - { move: { from: short, to: int, value: "invite" }, note: "Тебе запрошують на співбесіду — job interview. Інтервʼюер (interviewer) ставить питання." }
>   - { move: { from: int, to: offer, value: "Congratulations!" }, note: "Успіх: тобі роблять пропозицію — a job offer. Ти підписуєш контракт (sign a contract)." }
> ```

### Слова-пари: хто є хто

| Хто наймає | Кого наймають | Дія |
|---|---|---|
| **employer** — роботодавець | **employee** — працівник | **hire** — наймати |
| **interviewer** — інтервʼюер | **candidate / applicant** — кандидат | **interview** — проводити співбесіду |
| — | — | **fire** (розм.) — звільнити; **resign / quit** — звільнитися самому |

Суфікс **-er** — той, хто робить дію (*employer*, *interviewer*), **-ee** — той, з ким її роблять (*employee*, *interviewee*, *trainee*). Наголос часто падає саме на *-ee*: *employ**EE***.

### Співбесіда: топ-6 питань

| Питання | Що хочуть почути | Початок відповіді |
|---|---|---|
| *Tell me about yourself.* | 3–4 речення: освіта → досвід → чому ти тут | *I'm a… with three years of experience in…* |
| *What are your strengths?* | 2 сильні сторони + приклад | *I'm very organised. For example, …* |
| *What's your biggest weakness?* | чесна слабкість + що з нею робиш | *I sometimes… , so I've started…* |
| *Why do you want this job?* | що знаєш про компанію | *I've always been interested in… and your company…* |
| *Where do you see yourself in five years?* | амбіції, але реалістичні | *I'd like to take on more responsibility…* |
| *Do you have any questions for us?* | **завжди** «так» | *What does a typical day look like?* |

### Метод STAR: як розповісти про досягнення

Коли питають *Tell me about a time when you…* («Розкажіть про випадок, коли ви…»), відповідай за схемою **STAR**. Зверни увагу на часи: розповідь — у **Past Simple**.

> [!diagram] Відповідь за схемою STAR
> ```yaml
> layout: flow
> nodes:
>   - { id: s, label: "S — Situation", text: "Our biggest client was unhappy.", note: "що відбувалося", tone: blue }
>   - { id: t, label: "T — Task", text: "I had to keep the client.", note: "твоє завдання", tone: violet }
>   - { id: a, label: "A — Action", text: "I called him and organised a meeting.", note: "що ти зробив", tone: orange }
>   - { id: r, label: "R — Result", text: "He signed a new contract.", note: "результат + цифра", tone: green, icon: "px:medal" }
> steps:
>   - { focus: s, note: "Situation — коротко контекст: де, коли, що сталося. Past Simple або Past Continuous." }
>   - { focus: t, note: "Task — яке завдання стояло саме перед тобою: I had to… / My job was to…" }
>   - { focus: a, note: "Action — найважливіша частина. Говори «I», а не «we»: інтервʼюер оцінює тебе." }
>   - { focus: r, note: "Result — чим закінчилося, бажано з цифрою: He signed a two-year contract worth €50,000." }
> ```

### Граматика в контексті

- **Досвід до сьогодні** — Present Perfect (тема A2-14) і Present Perfect Continuous (B1-06): *I've worked in sales for five years. I've been learning Python since January.*
- **Закінчений період** — Past Simple: *I **worked** at Nova Poshta from 2019 to 2022.*
- **Плани й бажання** — *I'd like to…, I'm hoping to…*: *I'd like to develop my leadership skills.*

> [!example] Відповідь на «Tell me about yourself» (рівень IELTS Speaking Band 6–7)
> *I'm a marketing specialist from Lviv. I graduated in economics in 2020, and since then I've worked for two IT companies. In my current position, I'm in charge of our social media, and last year I helped to double our number of followers. I'm very organised and I enjoy working in a team. Now I'm looking for a new challenge, and I'd love to work for an international company like yours.*
>
> Структура: хто я → освіта → досвід (Present Perfect) → досягнення з цифрою (Past Simple) → якості → чому ця компанія.

## Приклади

- *I'd like to **apply for** the position of sales manager.* — Я хотів би подати заявку на посаду менеджера з продажу.
- *Please send your **CV** and a **cover letter** by 15 May.* — Надішліть, будь ласка, резюме й супровідний лист до 15 травня.
- *There are three **vacancies** in our team.* — У нашій команді три вакансії.
- *She **got promoted** after only a year.* — Її підвищили лише через рік.
- *I asked my boss for a **pay rise**.* — Я попросив у начальника підвищення зарплати.
- *My biggest **strength** is that I'm very **organised**.* — Моя головна сильна сторона — я дуже організований.
- *He **resigned** because he wanted a better **work-life balance**.* — Він звільнився, бо хотів кращого балансу між роботою й життям.
- *We're looking for someone who can work to tight **deadlines**.* — Ми шукаємо людину, яка може працювати в стислі терміни.
- *I did a three-month **internship** at a law firm.* — Я пройшов тримісячне стажування в юридичній фірмі.
- *The company offers great **benefits**, including health insurance.* — Компанія пропонує чудовий соцпакет, зокрема медичне страхування.

## Слова

### Пошук роботи

> [!word] career
> ipa: /kəˈrɪə/ · ipa-us: /kəˈrɪr/ · pos: noun · level: B1 · id: en-b1-career-w01
> uk: карʼєра; професійний шлях
> example: She started her **career** as a teacher. — Вона почала карʼєру вчителькою.
> note: наголос на другому складі: [ке-РІЕ]. Не плутай з *carrier* /ˈkæriə/ — перевізник.

> [!word] vacancy
> ipa: /ˈveɪkənsi/ · pos: noun · level: B1 · id: en-b1-career-w02
> uk: вакансія; вільне місце
> example: We have a **vacancy** for a web designer. — У нас є вакансія вебдизайнера.
> note: на табличці готелю *No vacancies* — «Вільних номерів немає».

> [!word] position
> ipa: /pəˈzɪʃən/ · pos: noun · level: B1 · id: en-b1-career-w03
> uk: посада
> example: I'm applying for the **position** of project manager. — Я подаюся на посаду проєктного менеджера.

> [!word] apply for
> ipa: /əˈplaɪ fə/ · ipa-us: /əˈplaɪ fər/ · pos: phrase · level: B1 · id: en-b1-career-w04
> uk: подавати заявку на; претендувати на
> example: I've **applied for** three jobs this week. — Цього тижня я подався на три вакансії.
> forms: apply → applied → applied

> [!word] application
> ipa: /ˌæplɪˈkeɪʃən/ · pos: noun · level: B1 · id: en-b1-career-w05
> uk: заява; заявка (на роботу)
> example: Thank you for your **application**. — Дякуємо за вашу заявку.
> note: *application form* — анкета; в IT *application* — програма, застосунок (*app*).

> [!word] CV
> ipa: /ˌsiː ˈviː/ · pos: noun · level: B1 · id: en-b1-career-w06
> uk: резюме
> example: Please attach your **CV** to the email. — Будь ласка, додайте резюме до листа.
> note: UK *CV* (curriculum vitae), US *résumé* /ˈrezəmeɪ/.

> [!word] cover letter
> ipa: /ˈkʌvə ˌletə/ · ipa-us: /ˈkʌvər ˌlet̬ər/ · pos: noun · level: B1 · id: en-b1-career-w07
> uk: супровідний лист
> example: A good **cover letter** explains why you want the job. — Добрий супровідний лист пояснює, чому ти хочеш цю роботу.
> note: UK також *covering letter*.

> [!word] candidate
> ipa: /ˈkændɪdət/ · ipa-us: /ˈkændɪdeɪt/ · pos: noun · level: B1 · id: en-b1-career-w08
> uk: кандидат
> example: We interviewed five **candidates**. — Ми провели співбесіду з пʼятьма кандидатами.

> [!word] applicant
> ipa: /ˈæplɪkənt/ · pos: noun · level: B1 · id: en-b1-career-w09
> uk: претендент; заявник
> example: There were over 200 **applicants** for the job. — На цю посаду було понад 200 претендентів.

> [!word] shortlist
> ipa: /ˈʃɔːtlɪst/ · ipa-us: /ˈʃɔːrtlɪst/ · pos: noun · level: B1 · id: en-b1-career-w10
> uk: короткий список (кандидатів)
> example: I'm on the **shortlist**! — Я в короткому списку!
> note: дієслово: *I've been shortlisted.*

> [!word] job interview
> ipa: /ˈdʒɒb ˌɪntəvjuː/ · ipa-us: /ˈdʒɑːb ˌɪntərvjuː/ · pos: noun · level: B1 · id: en-b1-career-w11
> uk: співбесіда
> example: I've got a **job interview** tomorrow. — Завтра в мене співбесіда.
> note: *have / go for / attend an interview*.

> [!word] interviewer
> ipa: /ˈɪntəvjuːə/ · ipa-us: /ˈɪntərvjuːər/ · pos: noun · level: B1 · id: en-b1-career-w12
> uk: інтервʼюер; той, хто проводить співбесіду
> example: The **interviewer** asked about my experience. — Інтервʼюер запитав про мій досвід.

> [!word] qualifications
> ipa: /ˌkwɒlɪfɪˈkeɪʃənz/ · ipa-us: /ˌkwɑːləfəˈkeɪʃənz/ · pos: noun · level: B1 · id: en-b1-career-w13
> uk: кваліфікація; дипломи й сертифікати
> example: What **qualifications** do you need for this job? — Яка кваліфікація потрібна для цієї роботи?

> [!word] reference
> ipa: /ˈrefərəns/ · pos: noun · level: B1 · id: en-b1-career-w14
> uk: рекомендація (з попередньої роботи)
> example: My old boss wrote me a great **reference**. — Мій колишній начальник написав мені чудову рекомендацію.

> [!word] internship
> ipa: /ˈɪntɜːnʃɪp/ · ipa-us: /ˈɪntɜːrnʃɪp/ · pos: noun · level: B1 · id: en-b1-career-w15
> uk: стажування
> example: She did a summer **internship** at Google. — Вона пройшла літнє стажування в Google.
> note: стажист — *intern* або *trainee*. Не «practice»!

> [!word] job offer
> ipa: /ˈdʒɒb ˌɒfə/ · ipa-us: /ˈdʒɑːb ˌɔːfər/ · pos: noun · level: B1 · id: en-b1-career-w16
> uk: пропозиція роботи
> example: I got a **job offer** from a bank! — Я отримав пропозицію роботи від банку!
> note: *accept / turn down a job offer* — прийняти / відхилити.

> [!word] previous
> ipa: /ˈpriːviəs/ · pos: adj · level: B1 · id: en-b1-career-w17
> uk: попередній
> example: In my **previous** job, I worked with clients. — На попередній роботі я працював із клієнтами.

### Наймання й умови

> [!word] employer
> ipa: /ɪmˈplɔɪə/ · ipa-us: /ɪmˈplɔɪər/ · pos: noun · level: B1 · id: en-b1-career-w18
> uk: роботодавець
> example: My **employer** pays for my English lessons. — Мій роботодавець оплачує мені уроки англійської.

> [!word] employee
> ipa: /ɪmˈplɔɪiː/ · pos: noun · level: B1 · id: en-b1-career-w19
> uk: працівник
> example: The company has 300 **employees**. — У компанії 300 працівників.
> note: часто з наголосом у кінці: /ˌemplɔɪˈiː/.

> [!word] hire
> ipa: /ˈhaɪə/ · ipa-us: /ˈhaɪər/ · pos: verb · level: B1 · id: en-b1-career-w20
> uk: наймати (на роботу)
> example: We're **hiring** two new developers. — Ми наймаємо двох нових розробників.
> note: UK також *hire a car* — взяти авто напрокат (US *rent*).

> [!word] fire
> ipa: /ˈfaɪə/ · ipa-us: /ˈfaɪər/ · pos: verb · level: B1 · id: en-b1-career-w21
> uk: звільнити (розм.)
> example: He was **fired** for being late every day. — Його звільнили за щоденні запізнення.
> note: розмовне; формально — *dismiss*, UK розм. — *sack* (*get the sack*).

> [!word] contract
> ipa: /ˈkɒntrækt/ · ipa-us: /ˈkɑːntrækt/ · pos: noun · level: B1 · id: en-b1-career-w22
> uk: контракт; договір
> example: I signed a one-year **contract**. — Я підписав контракт на рік.

> [!word] benefits
> ipa: /ˈbenɪfɪts/ · pos: noun · level: B1 · id: en-b1-career-w23
> uk: пільги; соцпакет
> example: The **benefits** include free lunch and a gym. — До соцпакета входять безкоштовні обіди й спортзал.
> note: в однині *benefit* — ще й «користь, перевага».

> [!word] pay rise
> ipa: /ˈpeɪ ˌraɪz/ · pos: noun · level: B1 · id: en-b1-career-w24
> uk: підвищення зарплати
> example: I haven't had a **pay rise** for two years. — Мені вже два роки не підвищували зарплату.
> note: UK *pay rise*, US *raise*.

> [!word] promotion
> ipa: /prəˈməʊʃən/ · ipa-us: /prəˈmoʊʃən/ · pos: noun · level: B1 · id: en-b1-career-w25
> uk: підвищення (на посаді)
> example: She hopes to get a **promotion** this year. — Вона сподівається цього року отримати підвищення.

> [!word] get promoted
> ipa: /ˌɡet prəˈməʊtɪd/ · ipa-us: /ˌɡet prəˈmoʊt̬ɪd/ · pos: phrase · level: B1 · id: en-b1-career-w26
> uk: отримати підвищення
> example: He **got promoted** to team leader. — Його підвищили до тимліда.

> [!word] commute
> ipa: /kəˈmjuːt/ · pos: verb · level: B1 · id: en-b1-career-w27
> uk: їздити на роботу (щодня, з дому)
> example: I **commute** an hour each way. — Я добираюся на роботу годину в один бік.
> note: іменник — *commute*: *a long commute*.

> [!word] remote
> ipa: /rɪˈməʊt/ · ipa-us: /rɪˈmoʊt/ · pos: adj · level: B1 · id: en-b1-career-w28
> uk: віддалений; дистанційний
> example: It's a fully **remote** job. — Це повністю дистанційна робота.
> note: *work remotely* = *work from home* (A2).

> [!word] workplace
> ipa: /ˈwɜːkpleɪs/ · ipa-us: /ˈwɜːrkpleɪs/ · pos: noun · level: B1 · id: en-b1-career-w29
> uk: робоче місце; місце роботи
> example: We want a friendly **workplace**. — Ми хочемо дружню атмосферу на роботі.

> [!word] work-life balance
> ipa: /ˌwɜːk laɪf ˈbæləns/ · ipa-us: /ˌwɜːrk laɪf ˈbæləns/ · pos: noun · level: B1 · id: en-b1-career-w30
> uk: баланс між роботою й особистим життям
> example: Flexible hours help me keep a good **work-life balance**. — Гнучкий графік допомагає мені зберігати баланс між роботою й особистим життям.

> [!word] deadline
> ipa: /ˈdedlaɪn/ · pos: noun · level: B1 · id: en-b1-career-w31
> uk: дедлайн; кінцевий термін
> example: The **deadline** for applications is Friday. — Кінцевий термін подання заявок — пʼятниця.
> note: *meet a deadline* — вкластися в термін; *miss a deadline* — не встигнути.

> [!word] negotiate
> ipa: /nɪˈɡəʊʃieɪt/ · ipa-us: /nɪˈɡoʊʃieɪt/ · pos: verb · level: B1 · id: en-b1-career-w32
> uk: домовлятися; вести переговори
> example: Don't be afraid to **negotiate** your salary. — Не бійся торгуватися за зарплату.

> [!word] resign
> ipa: /rɪˈzaɪn/ · pos: verb · level: B1 · id: en-b1-career-w33
> uk: звільнитися (за власним бажанням)
> example: She **resigned** to start her own business. — Вона звільнилася, щоб почати власну справу.
> note: *s* читається як /z/, а *g* не вимовляється: [рі-ЗАЙН].

> [!word] quit
> ipa: /kwɪt/ · pos: verb · level: B1 · id: en-b1-career-w34
> uk: кинути (роботу, звичку); звільнитися (розм.)
> example: I **quit** my job and travelled for a year. — Я кинув роботу й рік подорожував.
> forms: quit → quit → quit

### Навички й якості

> [!word] skill
> ipa: /skɪl/ · pos: noun · level: B1 · id: en-b1-career-w35
> uk: навичка; уміння
> example: Good communication **skills** are important in every job. — Гарні комунікативні навички важливі на будь-якій роботі.

> [!word] strength
> ipa: /streŋθ/ · pos: noun · level: B1 · id: en-b1-career-w36
> uk: сильна сторона; сила
> example: My main **strength** is problem-solving. — Моя головна сильна сторона — вміння розвʼязувати проблеми.
> note: у кінці /ŋθ/: носове «н» як у *sing*, одразу язик між зубами — без «г» і без «с».

> [!word] weakness
> ipa: /ˈwiːknəs/ · pos: noun · level: B1 · id: en-b1-career-w37
> uk: слабка сторона; слабкість
> example: My **weakness** is that I find it hard to say no. — Моя слабкість у тому, що мені важко відмовляти.

> [!word] motivated
> ipa: /ˈməʊtɪveɪtɪd/ · ipa-us: /ˈmoʊt̬əveɪt̬ɪd/ · pos: adj · level: B1 · id: en-b1-career-w38
> uk: вмотивований
> example: We need **motivated** people who want to learn. — Нам потрібні вмотивовані люди, які хочуть учитися.

> [!word] organised
> ipa: /ˈɔːɡənaɪzd/ · ipa-us: /ˈɔːrɡənaɪzd/ · pos: adj · level: B1 · id: en-b1-career-w39
> uk: організований
> example: I'm very **organised** — I plan every week in advance. — Я дуже організований — планую кожен тиждень наперед.
> note: UK *organised*, US *organized*.

> [!word] flexible
> ipa: /ˈfleksəbəl/ · pos: adj · level: B1 · id: en-b1-career-w40
> uk: гнучкий
> example: The job has **flexible** hours. — На цій роботі гнучкий графік.

> [!word] team player
> ipa: /ˌtiːm ˈpleɪə/ · ipa-us: /ˌtiːm ˈpleɪər/ · pos: noun · level: B1 · id: en-b1-career-w41
> uk: командний гравець; людина, що добре працює в команді
> example: Our manager is a real **team player**. — Наш менеджер — справжній командний гравець.

> [!word] responsibility
> ipa: /rɪˌspɒnsəˈbɪləti/ · ipa-us: /rɪˌspɑːnsəˈbɪlət̬i/ · pos: noun · level: B1 · id: en-b1-career-w42
> uk: відповідальність; обовʼязок
> example: My main **responsibility** is customer service. — Мій головний обовʼязок — обслуговування клієнтів.
> note: *take on more responsibility* — брати на себе більше відповідальності.

> [!word] in charge of
> ipa: /ɪn ˈtʃɑːdʒ əv/ · ipa-us: /ɪn ˈtʃɑːrdʒ əv/ · pos: phrase · level: B1 · id: en-b1-career-w43
> uk: відповідальний за; керувати
> example: I'm **in charge of** a team of six. — Я керую командою з шести людей.

> [!word] achieve
> ipa: /əˈtʃiːv/ · pos: verb · level: B1 · id: en-b1-career-w44
> uk: досягати
> example: We **achieved** all our goals this year. — Цього року ми досягли всіх цілей.

> [!word] achievement
> ipa: /əˈtʃiːvmənt/ · pos: noun · level: B1 · id: en-b1-career-w45
> uk: досягнення
> example: What's your biggest **achievement**? — Яке ваше найбільше досягнення?

## Слухаємо

> [!listen] Чого шукає компанія?
> level: B1 · type: answer · id: en-b1-career-l01
> audio: We're looking for a motivated sales assistant to join our team in Kyiv. Previous experience is useful but not essential — we provide full training. The position is part-time, twenty hours a week, with flexible hours.
> - [ ] досвідченого менеджера на повний день
> - [x] вмотивованого продавця-консультанта на неповний день, досвід не обовʼязковий
> - [ ] стажиста без оплати
> - [ ] дистанційного працівника

> [!listen] Обери почуте
> level: B1 · type: choice · id: en-b1-career-l02
> audio: I've worked as a project manager for four years.
> - [x] I've worked as a project manager for four years.
> - [ ] I worked as a project manager four years ago.
> - [ ] I'm working as a project manager since four years.

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-career-l03
> audio: Please send your CV and a cover letter.

> [!listen] Чому Олег звільнився?
> level: B1 · type: answer · id: en-b1-career-l04
> audio: A: So why did you leave your previous job?
> audio: B: Well, I enjoyed the work, but the commute was two hours each way. I had no time for my family. I need a better work-life balance, so this remote position is perfect for me.
> - [ ] його звільнили
> - [ ] йому мало платили
> - [x] дорога на роботу забирала забагато часу
> - [ ] у нього був поганий начальник

> [!listen] Яке досягнення назвала кандидатка?
> level: B1 · type: answer · id: en-b1-career-l05
> audio: Last year our biggest client was unhappy with our service and wanted to leave. I was in charge of the account, so I organised a meeting and we changed the whole process. In the end, the client signed a new two-year contract.
> - [ ] її підвищили до директорки
> - [x] вона втримала великого клієнта, і той підписав новий контракт
> - [ ] вона знайшла нового клієнта
> - [ ] вона організувала конференцію

> [!listen] Напиши або скажи, що почув
> level: B1 · type: dictation · id: en-b1-career-l06
> audio: My biggest strength is that I'm very organised.

## Ситуація: співбесіда

> [!example] Співбесіда на посаду Marketing Assistant
> **Interviewer:** Thanks for coming in, Daria. So, tell me a bit about yourself.
> **Daria:** Sure. I graduated in journalism two years ago, and since then I've worked as a content writer for a small travel company. I'm **in charge of** our blog and social media.
> **Interviewer:** And why do you want to work for us?
> **Daria:** I'd like to grow my **career** in marketing, and I really like your campaigns — especially the one with local artists last spring.
> **Interviewer:** What would you say is your main **strength**?
> **Daria:** I'm very **organised**. For example, I plan all our posts a month ahead, so we've never **missed a deadline**.
> **Interviewer:** And your **weakness**?
> **Daria:** I used to find public speaking hard, so I joined a speaking club. It's getting much better.
> **Interviewer:** Great. Do you have any questions for us?
> **Daria:** Yes — what does a typical day look like in this **position**?
>
> Дарʼя відповідає за схемою: факт → приклад. Говорячи про слабкість, вона показує, **що вже з нею робить**, — це найкраща стратегія. І наприкінці в неї обовʼязково є питання.

## Вимова

> [!speak] Почни співбесіду
> level: B1 · id: en-b1-career-s01
> text: Thank you for inviting me to this interview.
> ipa: /ˈθæŋk ju fər ɪnˈvaɪtɪŋ mi tə ðɪs ˈɪntəvjuː/
> tip: thank — /θ/ язик між зубами; interview — наголос на першому: [ІН-те-вʼю].
> uk: Дякую, що запросили мене на співбесіду.

> [!speak] Розкажи про досвід
> level: B1 · id: en-b1-career-s02
> text: I've worked in sales for five years.
> ipa: /aɪv ˈwɜːkt ɪn ˈseɪlz fə ˈfaɪv ˈjɪəz/
> tip: I've — не ковтай /v/; worked — /t/ у кінці, один склад.
> uk: Я пʼять років працюю у сфері продажів.

> [!speak] Сильна сторона
> level: B1 · id: en-b1-career-s03
> text: My main strength is that I'm very organised.
> ipa: /maɪ ˈmeɪn ˈstreŋθ ɪz ðət aɪm ˈveri ˈɔːɡənaɪzd/
> tip: strength — у кінці /ŋθ/: носове «н», потім язик між зубами; organised — [ОО-ге-найзд].
> uk: Моя головна сильна сторона — я дуже організований.

> [!speak] Чому ця робота
> level: B1 · id: en-b1-career-s04
> text: I'd like to take on more responsibility.
> ipa: /aɪd ˈlaɪk tə ˌteɪk ɒn ˈmɔː rɪˌspɒnsəˈbɪləti/
> tip: responsibility — наголос на -BI-: [рі-спон-се-БІ-ле-ті]; take‿on зливаються.
> uk: Я хотів би брати на себе більше відповідальності.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-career-s05
> text: I'm in charge of a team of six people.
> ipa: /aɪm ɪn ˈtʃɑːdʒ əv ə ˈtiːm əv ˈsɪks ˈpiːpəl/
> tip: of — слабке [əv]; charge — довге [ааː], r не вимовляється (UK).
> uk: Я керую командою з шести людей.

> [!speak] Питання наприкінці
> level: B1 · id: en-b1-career-s06
> text: What does a typical day look like in this position?
> ipa: /ˈwɒt dəz ə ˈtɪpɪkəl ˈdeɪ ˈlʊk laɪk ɪn ðɪs pəˈzɪʃən/
> tip: typical — [ТІ-пі-кл], не «ті-пі-КАЛ»; does — слабке [dəz].
> uk: Як виглядає типовий день на цій посаді?

> [!speak] Скажи вголос
> level: B1 · id: en-b1-career-s07
> text: I resigned because I wanted a better work-life balance.
> ipa: /aɪ rɪˈzaɪnd bɪˈkɒz aɪ ˈwɒntɪd ə ˈbetə ˌwɜːk laɪf ˈbæləns/
> tip: resigned — [рі-ЗАЙНД], g не вимовляється; balance — [БЕ-ленс], /æ/.
> uk: Я звільнився, бо хотів кращого балансу між роботою й особистим життям.

> [!speak] Скажи вголос
> level: B1 · id: en-b1-career-s08
> text: I'd like to apply for the position of marketing assistant.
> ipa: /aɪd ˈlaɪk tu əˈplaɪ fə ðə pəˈzɪʃən əv ˈmɑːkɪtɪŋ əˈsɪstənt/
> tip: apply — [е-ПЛАЙ]; position — [пе-ЗІ-шн]; for — слабке [fə].
> uk: Я хотів би подати заявку на посаду асистента з маркетингу.

## Типові помилки українців

> [!pitfall] «I work here three years»
> Українське «працюю тут три роки» — теперішній час, але англійською дія, що **почалася в минулому й триває**, — Present Perfect: *I**'ve worked** / I**'ve been working** here **for** three years.* І не «since three years»: **for** + тривалість, **since** + момент (*since 2023*, *since March*).

> [!pitfall] «Practice» замість стажування, «profession» замість job
> «Проходив практику» — *I did an **internship*** (або *work placement*, UK). *Practice* — тренування (*piano practice*) або приватна практика лікаря чи юриста. А на питання «Ким ви працюєте?» — *What do you do?* — *I'm a nurse*, а не «My profession is nurse».

> [!pitfall] «My weak sides», «my strong sides»
> Калька з «мої сильні / слабкі сторони». Англійською — ***strengths*** і ***weaknesses***: *What are your **strengths**?* — *My main **strength** is…* А «з одного боку… з іншого» — *on the one hand… on the other hand*, і це вже про аргументи, не про якості.

> [!pitfall] «I want to work in your company because I need money»
> Технічно правильно, але занадто прямо. На співбесіді «I want» звучить по-дитячому — кажи ***I'd like to…*** або ***I'm keen to…***. І не «in your company», а ***for** your company* (працювати **на** компанію) або *at* (*I work at Google*).

## Практика

> [!quiz] Хто такий employee?
> level: B1 · id: en-b1-career-q02
> - [ ] той, хто наймає людей
> - [x] той, кого найняли; працівник
> - [ ] безробітний
> - [ ] кандидат на співбесіді
>
> **Пояснення:** *-er* — той, хто робить дію (*employer* — наймає), *-ee* — той, з ким її роблять (*employee* — найнятий). Так само *interviewer / interviewee*, *trainer / trainee*.

> [!quiz] Які якості — сильні сторони для співбесіди? Обери всі.
> level: B1 · type: multi · id: en-b1-career-q03
> - [x] organised
> - [x] motivated
> - [x] flexible
> - [ ] lazy
> - [x] a team player
>
> **Пояснення:** *organised, motivated, flexible, a team player* — класичні *strengths*. *Lazy* (лінивий) — точно не те, що варто казати.

> [!quiz] For чи since? Заповни.
> level: B1 · type: fill · id: en-b1-career-q04 · bank
>
> ```text fill
> I've worked here [[for]] three years.
> She's been a manager [[since]] 2022.
> We've known each other [[since]] university.
> He's been unemployed [[for]] six months.
> ```

> [!quiz] Заповни супровідний лист
> level: B1 · type: fill · id: en-b1-career-q05 · bank: apply on, practice
>
> ```text fill
> I am writing to [[apply for]] the position of Junior Designer.
> I have recently finished a six-month [[internship]] at a design studio.
> Please find my [[CV]] attached.
> ```

> [!quiz] Склади відповідь: «Я чотири роки працюю в маркетингу».
> level: B1 · type: order · id: en-b1-career-q06
>
> ```text order
> I've
> worked
> in marketing
> for four years.
> since ✗
> ```

> [!quiz] Склади питання до інтервʼюера: «Як виглядає типовий день?»
> level: B1 · type: order · id: en-b1-career-q07
>
> ```text order
> What
> does
> a typical day
> look like?
> how ✗
> ```

> [!quiz] Як найкраще відповісти на «What's your biggest weakness?»
> level: B1 · id: en-b1-career-q08
> - [ ] I don't have any weaknesses.
> - [ ] I'm often late and I don't like working.
> - [x] I sometimes take on too much work, so I've started using a planner and saying no more often.
> - [ ] My weak side is English.
>
> **Пояснення:** найкраща відповідь — **чесна слабкість + що ти вже з нею робиш**. «Немає слабкостей» звучить нещиро, а «часто запізнююся» знищує всі шанси. *Weak side* — калька, правильно *weakness*.

> [!quiz] «I got the sack.» Що сталося?
> level: B1 · id: en-b1-career-q09
> - [ ] Мене підвищили.
> - [x] Мене звільнили.
> - [ ] Я отримав мішок подарунків.
> - [ ] Я підписав контракт.
>
> **Пояснення:** *get the sack* (UK, розмовне) = *be fired* — бути звільненим. Звільнитися самому — *resign* або *quit*.

> [!quiz] IELTS Reading (General Training): True, False чи Not Given?
> level: B1 · id: en-b1-career-q10
>
> **Weekend Barista — Bean & Leaf Café, Odesa.** We are looking for a friendly barista to work Saturdays and Sundays (16 hours a week). No previous experience is needed, as all new staff complete a two-day training course before starting. Staff receive free meals during shifts and a 20% discount on all products. To apply, send your CV to jobs@beanleaf.ua by 30 June.
>
> *Statement:* **Applicants must have worked as a barista before.**
> - [ ] True
> - [x] False
> - [ ] Not Given
>
> **Пояснення:** *No previous experience is needed* — досвід **не потрібен**. Твердження каже протилежне → **False**.

> [!quiz] IELTS Reading (General Training): True, False чи Not Given? (те саме оголошення)
> level: B1 · id: en-b1-career-q11
>
> **Weekend Barista — Bean & Leaf Café, Odesa.** We are looking for a friendly barista to work Saturdays and Sundays (16 hours a week). No previous experience is needed, as all new staff complete a two-day training course before starting. Staff receive free meals during shifts and a 20% discount on all products. To apply, send your CV to jobs@beanleaf.ua by 30 June.
>
> *Statement:* **The training course is paid.**
> - [ ] True
> - [ ] False
> - [x] Not Given
>
> **Пояснення:** про курс сказано лише, що він **дводенний** і що його проходять усі. Чи платять за нього — у тексті немає → **Not Given**. Пастка: «зазвичай за навчання платять» — це твої знання про світ, а IELTS перевіряє лише текст.

> [!quiz] IELTS Short answer: відповідь — НЕ БІЛЬШЕ ДВОХ слів з оголошення
> level: B1 · type: fill · id: en-b1-career-q12
>
> ```text fill
> What do staff get during shifts? [[free meals]]
> What must applicants send? [[CV|their CV|a CV]]
> ```

> [!quiz] Яке слово? «Вона звільнилася, щоб почати власну справу».
> level: B1 · id: en-b1-career-q13
> - [ ] She was fired to start her own business.
> - [x] She resigned to start her own business.
> - [ ] She retired to start her own business.
> - [ ] She hired to start her own business.
>
> **Пояснення:** *resign* — піти з роботи **самому**. *Be fired* — тебе звільнили. *Retire* — вийти на пенсію. *Hire* — наймати.

## Фішки

> [!reel] 🧂 Salary — від солі
> *Salary* походить від латинського *salarium*, повʼязаного з *sal* — сіль. Найпопулярніша версія: римські солдати отримували гроші «на сіль» (історики досі сперечаються, чи це правда). Звідси й вираз *worth your salt* — «вартий своєї платні», тобто добрий працівник.

> [!reel] 📄 CV — це латина
> *CV* — *curriculum vitae*, «хід життя». В Америці кажуть *résumé* — французьке «підсумок». Британське CV часто довше, а американське résumé зазвичай займає одну сторінку. А фото в англомовному CV зазвичай не додають, щоб уникнути дискримінації.

> [!reel] 🕘 Nine-to-five
> *A nine-to-five job* — звичайна офісна робота з 9:00 до 17:00, з понеділка по пʼятницю. Вираз став ще популярнішим після хіта Доллі Партон «9 to 5» (1980). Сьогодні часто кажуть: *I quit my nine-to-five to work remotely.*

## Джерела та що почитати

- 🟢 [British Council LearnEnglish](https://learnenglish.britishcouncil.org/) — розділи Business English і Speaking: співбесіди, робоча лексика.
- 🟢 [Cambridge Dictionary](https://dictionary.cambridge.org/) — UK / US: *CV / résumé*, *pay rise / raise*, *hire*.
- 🟡 [BBC Learning English — The English We Speak](https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak) — розмовні вирази про роботу (*get the sack*, *learn the ropes*).
- 🟡 M. McCarthy, F. O'Dell — *English Vocabulary in Use: Pre-intermediate & Intermediate*: розділи «Work» і «Jobs».
- 🟡 [IELTS — General Training Reading format](https://ielts.org/take-a-test/test-types/ielts-general-training-test/ielts-general-training-format-reading) — Section 2: оголошення, умови праці, робочі документи.

> [!important] Підсумок
> - Шлях: *vacancy → **apply for** → CV + cover letter → shortlist → job interview → job offer → contract*.
> - Пари: *employer / employee*, *interviewer / candidate*; *hire / fire*; *resign / quit*; *promotion, pay rise (US raise)*.
> - Досвід — Present Perfect + **for / since**: *I've worked here for three years.*
> - Співбесіда: сильна сторона + приклад; слабкість + що з нею робиш; відповіді про досягнення — за STAR; завжди питання наприкінці.
> - *Internship*, не «practice»; *strengths / weaknesses*, не «strong / weak sides»; *I'd like to*, а не «I want».
