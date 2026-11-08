# Tricky questions, stress interviews, negotiation and legal limits

> **Коротко українською.** Що насправді перевіряють «незручні» питання рекрутера (зарплата, чому йдете, інші офери,
> слабкі сторони, «скільки вам років / чи є діти»), як поводитися на стрес-співбесіді (паузи, ворожість, перебивання),
> норми переговорів (не називати число першим, ділянка діапазону, усе письмово, вибухові офери) і де питання заборонені:
> США (заборона питати історію зарплати — ~18–20 штатів + DC, Вірджинія з 01.07.2026; ADA забороняє питати про здоров'я
> до оферу), ЄС (Директива 2023/970, ст. 5: заборона питати попередню зарплату, право знати діапазон; транспонована
> повністю лише в 5 країнах), Велика Британія (заборони ще немає; консультація 2026, EHRC радить заборонити), Україна
> (КЗпП ст. 2-1, 22, 25). «Метод PAUSE» у формулюванні з промпту як опублікована методика не знайдений — подавати як власний
> мнемонік Loo.

Researched 2026-11-08. Legal points are a summary for learners, not legal advice; always say which jurisdiction applies.

---

## 1. Tricky recruiter questions — what they test

Real wordings are in the field bank (topic "Recruiter/tricky"). Framework per question: **what they check → answer
frame → never say → typical follow-up.**

| Question (sourced examples) | What it really checks | Answer frame | Never say | Follow-ups |
|---|---|---|---|---|
| "What are your salary expectations?" / "How much will it take for you to join?" ([HN 2017](https://news.ycombinator.com/item?id=13701702)); «Скільки хочеш грошей?» ([DOU forum 2023](https://dou.ua/forums/topic/43242/)) | whether you anchor low, whether you are in band | ask for the band and level first; then a researched range; say base vs total; "flexible for the right scope" | a single low number; current salary (where banned, you need not answer) | "What's your current salary?", "Is that negotiable?" |
| "Why are you leaving?" / «Чому ви змінюєте місце роботи?» ([DOU EN article 2022](https://dou.ua/lenta/articles/it-interview-in-english/)) | flight risk, bitterness | lead with what you want next (scope, product, growth) | criticism of the employer or team | "What would make you stay?" |
| "Are you interviewing elsewhere? Other offers?" | urgency, competition, your value | honest and brief: "yes, at final stages with two, I'd like to align timelines" | bluffing an offer you don't have | "When do you need to decide?" |
| "What does the company have to offer for you to accept?" ([DOU 2022](https://dou.ua/lenta/articles/it-interview-in-english/)) | your decision criteria | 2–3 criteria in priority order | "just money" | "How would you choose between equal offers?" |
| "Greatest weakness?" ([HN 2019](https://news.ycombinator.com/item?id=19080895)); «Перерахуйте свої недоліки» (DOU 2023) | self-awareness, coachability | real, non-core weakness → trigger → what you do now (see [dev.to 2026-02-14](https://dev.to/konark_13/interview-playbook-what-worked-for-me-3ecf)) | humble-brag ("perfectionist"), a core skill of the role | "Give an example from last month" |
| "Where do you see yourself in 5 years?" ([HN 2014](https://news.ycombinator.com/item?id=8480432)) | retention, ambition fit | direction (depth/lead), tied to this role | "in your chair", "at another company" | "Why not management?" |
| "How long do you plan to stay?" ([HN 2014](https://news.ycombinator.com/item?id=8476546)) | retention | commitment framed by growth and scope | a number of months | — |
| "Why us?" / «Чому вибрали нашу компанію?» ([DOU 2023](https://dou.ua/forums/topic/43242/)) | preparation | 2 specifics about product/tech + how you fit | generic praise | "What do you know about our product?" |
| "How do you use AI in your work?" ([CoPilot Interview 2026-10-25](https://copilotinterview.com/blog/how-do-you-use-ai-at-work-interview-question)); Amazon GenAI question ([1point3acres 2026 Q4](https://www.1point3acres.com/interview/guides/amazon-interview-trend-2026q4)) | judgement, verification, data hygiene | concrete workflow → how you verify → where you don't use it → confidentiality | "I paste everything into ChatGPT" | "How do you verify AI-written code?" |
| "Rate yourself 1–10" / «Оціни минулу команду по 10-бальній шкалі» (DOU 2023) | calibration | number + evidence + what's missing for +1 | 10/10 | "What would make it 9?" |
| "You seem overqualified" | flight risk, salary mismatch | why this scope interests you; long-term fit | "I just need a job" | — |
| Lowball after all rounds: «А не погодились би ви на зарплату вдвічі меншу?» (DOU 2023) | your BATNA | thank, restate value and range, ask what changed | instant yes | — |
| "Is your side project going to interfere?" ([HN 2014](https://news.ycombinator.com/item?id=8471443)) | commitment | boundaries + what it brings to the job | defensiveness | — |
| "Prove a random number is truly random" ([HN 2019, Google FE](https://news.ycombinator.com/item?id=19082872)); "Why are manhole covers round?" ([HN 2014](https://news.ycombinator.com/item?id=8468509)); «Яка висота Empire State Building?» (DOU 2023) | handling vagueness, estimation, composure | clarify the goal → state assumptions → structure → estimate → sanity check | freezing silently | "What if X changes?" |
| Personal: "Do you have children?" ([HN](https://news.ycombinator.com/item?id=8471097)), «Скільки вам років, звідкіля родом?», «Живете з хлопцем? А якщо ви у декрет підете?» (SoftServe, 2018, reported on DOU) | (often illegal, see §4) | deflect to the job requirement: "Nothing in my personal life affects my availability for this role's hours" | lying; hostility | note it as a red flag about the company |
| "I don't know" situations — flagged as a bad signal by one 2026 interviewer ([dev.to 2026-08-28](https://dev.to/ale3oula/what-two-months-of-interviewing-taught-me-about-the-2026-tech-job-market-3d8n)) | honesty + reasoning | "I haven't used X; here's how I'd reason about it / find out" | bluffing | a simpler version of the question |

## 2. Stress interviews and interviewer pressure

**Tactics described in 2025–2026 practitioner sources:** silence after an answer (sometimes 30–60 s), visible
disinterest (checking the clock, phone calls), rapid-fire questions, direct challenges ("That doesn't sound very
impressive"), repeated questions, brain teasers.
Sources: [Testlify glossary](https://testlify.com/hr-glossary/stress-interview/), [Training Magazine](https://trainingmag.com/a-quick-guide-to-conducting-stress-interviews/),
[HiredKit (2026)](https://www.hiredkit.ai/blog/how-to-handle-a-stress-interview-2026). No peer-reviewed study was found in
this pass (gap). Testlify notes a legal risk: applying stress tactics only to one protected group can be disparate
treatment (EEOC).

**Responses supported by those sources:**
- Silence: finish, stop, hold eye contact; after a beat, ask "Would you like more detail on any part?" Do not fill
  silence with retractions.
- Pushback when you are right: acknowledge ("That's a fair challenge"), give evidence once, then stop. When you are wrong:
  say so plainly, fix, move on.
- No repeated apologies — each one signals you are rattled.
- Hostility: stay calm, respond with evidence, never mirror. If questions become personal or discriminatory, you may
  decline ("I don't see how that's relevant to the role") or end the interview.
- Name your structure ("Two parts — let me take them in order"): structure signals calm.
- Real reports to rehearse: interviewer refusing any hint ([HN, Google FE](https://news.ycombinator.com/item?id=19082872));
  coding while screen-shared with an observer causing anxiety ([HN 2020, Toptal](https://news.ycombinator.com/item?id=23857508));
  «А вы действительно так думаете или просто сказали, чтобы мы вас взяли?» ([DOU](https://dou.ua/forums/topic/43242/)).

**PAUSE method — verification result.** No published interview framework expanding PAUSE as *Pause, Acknowledge,
Understand, Structure, Execute* was found. Closest published acronyms: the **P.A.U.S.E.** implicit-bias method (Pay
attention, Acknowledge, Understand, Search, Execute) ([PDF](https://www.implicitbiascleanse.com/uploads/1/0/8/5/10851850/the_pause_method.pdf))
and a coaching "PAUSE model" ([GIOC](https://globalioc.com/the-pause-model-a-framework-for-interrupting-drama-and-leading-with-intention/)).
Recommendation: keep it in the course as **Loo's own mnemonic**, built from the supported practices above (deliberate
2–3 s pause, acknowledge, clarify, state structure, answer), and do not attribute it to an outside author.

## 3. Negotiation norms

| Norm | Source |
|---|---|
| Never give a number first; negotiate after the offer; "salary is only one component of total compensation" as a deflection script | Patrick McKenzie, [Salary Negotiation (2012)](https://www.kalzumeus.com/2012/01/23/salary-negotiation/); re-recorded on Complex Systems ([May 2025](https://www.complexsystemspodcast.com/episodes/how-to-negotiate-your-salary-package/)) |
| Ten rules: get everything in writing; keep the door open; information is power; be positive; don't be the decision maker; have alternatives (BATNA); give reasons; be motivated by more than money; understand what they value; be winnable. Treat exploding offers as non-offers unless the window is widened | Haseeb Qureshi, [Ten Rules for Negotiating a Job Offer](https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/) (2016) and [How Not to Bomb Your Offer Negotiation](https://haseebq.com/how-not-to-bomb-your-offer-negotiation/) |
| Pay transparency shifts the anchor: EU applicants have a right to the initial pay or range before the interview (Directive 2023/970 Art. 5(1)); many US states require ranges in postings; UK consults on pay in adverts | see §4 |
| Level matters more than title (band follows level) | Levels.fyi data; FAANG loop notes in [loops.md](loops.md) |
| Contractor rate negotiation: compare annual net after unpaid time, taxes and platform terms | [market-2026.md](market-2026.md) §4 |

Course practice: negotiation simulations with branches for "the budget is fixed", exploding offer, counter-offer from the
current employer, level-down offer, and the post-loop lowball reported on DOU.

## 4. Legal limits on salary-history and personal questions (as of 2026-11-08)

### United States
- **No federal salary-history ban.** State bans (private employers) per a list dated 2026-08-12: California, Colorado,
  Connecticut, Delaware, Hawaii, Illinois, Maine, Maryland, Massachusetts, Nevada, New Jersey, New York, Oregon, Rhode
  Island, Vermont, **Virginia (effective 2026-07-01)**, Washington, plus D.C.; some lists add Minnesota and Alabama
  (limited). Public-employer-only laws: North Carolina, Pennsylvania, Louisiana. City bans include Kansas City,
  Cleveland, Cincinnati, Columbus, Toledo, Philadelphia.
  Sources: [RevealBackground (2026-08-12)](https://www.revealbackground.com/salary-history-ban-states-list/),
  [Employsome](https://employsome.com/hire/united-states/salary-history-ban/), [GovDocs](https://www.govdocs.com/pay-transparency-laws/),
  HR Dive's running list (cited, not fetched): hrdive.com/news/salary-history-ban-states-list/516662/.
- **Disability/health:** before a job offer the ADA prohibits disability-related inquiries and medical exams, even if
  job-related ([EEOC — Job Applicants and the ADA](https://www.eeoc.gov/laws/guidance/job-applicants-and-ada)).
- **Age (40+), race, religion, national origin, sex:** federal law does not list forbidden questions, but such questions
  "may be used as evidence of an employer's intent to discriminate" unless justified
  ([EEOC — Prohibited practices](https://www.eeoc.gov/prohibited-employment-policiespractices)). Marital status and
  children are covered by some state/local laws.

### European Union
- **Directive (EU) 2023/970, Art. 5(2):** "An employer shall not ask applicants about their pay history during their
  current or previous employment relationships." Art. 5(1): applicants have a right to the initial pay or its range.
  ([EUR-Lex](https://eur-lex.europa.eu/eli/dir/2023/970/oj/eng))
- Transposition deadline **2026-06-07**; no EU-level delay. Fully transposed (Sep–Oct 2026 trackers): **Slovakia,
  Lithuania, Italy, Malta, Greece** (Greek obligations from 2026-11-01). Netherlands, Sweden, Czechia, Denmark:
  2027-01-01; Poland partial (hiring transparency); France bill in parliament (Sep 2026).
  Sources: [Morgan Lewis (2026-06)](https://www.morganlewis.com/pubs/2026/06/eu-pay-transparency-directive-the-deadline-for-transposition-has-passed-what-now),
  [Lewis Silkin (2026-07-01)](https://www.lewissilkin.com/insights/2026/07/01/eu-pay-transparency-directive-2026-employer-compliance),
  [Assessio tracker](https://assessio.com/resources/articles/pay-transparency-directive-country-tracker/).
  Where not yet transposed, the national rule applies; teach learners to check the country.

### United Kingdom
- **No salary-history ban** today. The government's equal-pay consultation (2026-07-15 → 2026-10-27) proposes pay
  information in job adverts or before interview; it does **not** propose a salary-history ban. On 2026-10-27 the EHRC
  recommended banning questions on salary history *and expectations*.
  Sources: [Personnel Today — EHRC](https://www.personneltoday.com/hr/ban-salary-expectations-questions-history-ehrc-equal-pay/),
  [Personnel Today — adverts](https://www.personneltoday.com/hr/pay-transparency-employers-to-publish-salaries-in-job-adverts-under-equal-pay-reforms/),
  [gov.uk consultation](https://www.gov.uk/government/consultations/equal-pay-and-pay-discrimination) (cited, not fetched).
  Protected characteristics under the Equality Act 2010 (age, marriage, pregnancy, religion, etc.) make such questions
  risky evidence of discrimination (general knowledge; verify on legislation.gov.uk).

### Ukraine (КЗпП, редакція від 23.10.2026, [zakon.rada.gov.ua](https://zakon.rada.gov.ua/laws/show/322-08))
- **Ст. 2-1** забороняє будь-яку дискримінацію у сфері праці, зокрема за віком, станом здоров'я, інвалідністю, статтю,
  сексуальною орієнтацією, «сімейного та майнового стану, сімейних обов'язків, місця проживання», мовними та іншими
  ознаками, не пов'язаними з характером роботи.
- **Ст. 22** (ред. Закону № 2253-IX від 12.05.2022): роботодавець вільно обирає кандидатів, але заборонена необґрунтована
  відмова «з підстав, що не стосуються кваліфікації чи професійних якостей»; на вимогу кандидата причину відмови мають
  повідомити письмово.
- **Ст. 25**: заборонено вимагати відомості про «партійну і національну приналежність, походження, реєстрацію місця
  проживання чи перебування» та документи, не передбачені законодавством.
- Salary history is **not** specifically banned in Ukraine; questions about children, pregnancy, age and family plans
  (see the DOU forum examples) conflict with ст. 2-1. Most Ukrainians work as ФОП/gig contractors, where the Labour Code
  protections at hiring are weaker in practice — teach graceful deflection rather than legal confrontation.

## 5. Culture notes for the course (to expand in Part IX)

- US: direct self-advocacy, numbers and impact, small talk short; EU/UK: more understatement, punctuality, written
  follow-ups. (No dated primary source in this pass — mark as practitioner consensus; research further.)
- Platform soft-skill rounds: Lemon.io role-plays client pressure and ambiguity; Arc grades explaining technical concepts
  simply and remote readiness; Toptal grades English and "passion and engagement"; Gun.io's group profile call grades
  self-presentation (see [loops.md](loops.md)).
