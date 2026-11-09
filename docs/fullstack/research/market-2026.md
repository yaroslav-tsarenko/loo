# Market 2026 — AI in interviews, stack demand, pay, contractor vs employee

> **Коротко українською.** ШІ на співбесідах — реальність, але не всюди. Підтверджено (як «reported»): Meta з жовтня 2025
> має 60-хвилинний AI-enabled раунд у CoderPad; Google з травня 2026 пілотує раунд «code comprehension» з Gemini, а в
> жовтні 2026 Business Insider повідомив про розширення (за словами Google, формати досі пілотні); Canva і DoorDash офіційно вимагають ШІ в окремих раундах; Amazon,
> Goldman Sachs і Anthropic забороняють сторонній ШІ на живих співбесідах (Amazon водночас вбудовує власного асистента в
> онлайн-тести). Karat (січень 2026, 400 керівників): 62% організацій забороняють ШІ; у США 38% дозволяють. Стек:
> TypeScript + React/Next + Node — базова комбінація; майже половина вакансій у розробці згадує ШІ. Ставки (дані ринку, не
> гарантія): senior у DOU — медіана $4 500 «на руки» (червень 2026), Arc — $75–150/год для senior (глобально);
> смуга $40–85/год для Східної Європи — це всі рівні разом, не senior. Нижче — таблиці з джерелами й датами та нотатки про ФОП / Дія Сіті / 1099 / IR35 / B2B.

Researched 2026-11-08. Claims about specific companies are **reported** unless the company itself published them.
Pay figures are dated market data with sources, never guarantees.

---

## 1. AI in interviews — seed claims checked

| Seed claim (§2) | Verdict | What the sources say | Sources (date) |
|---|---|---|---|
| Meta runs an "AI-enabled coding" round since Oct 2025, standard through 2026: 60 min, multi-file project in CoderPad with AI chat; graded on problem solving, code quality, verification, communication | **Confirmed, with nuance** (reported) | Pilot began Oct 2025 and replaces one of two onsite coding rounds; the other coding round stays no-AI (45 min). Reported: E6 and below get both rounds; E7+/M1 get only the AI-enabled one. Three-panel CoderPad (files, editor, AI chat), "run tests" available. Model menu differs between reports (GPT-4o mini/GPT-5/Claude/Gemini/Llama vs only lightweight models). Meta recruiting told CoderPad using the AI is "not cheating". "Standard through 2026" is stated by prep sites as "rolling out across SWE roles through 2026" — not confirmed as universal. | [interviewing.io](https://interviewing.io/blog/how-to-use-ai-in-meta-s-ai-assisted-coding-interview-with-real-prompts-and-examples); [aicodinginterview.com (2026-10-28, upd. 11-04)](https://aicodinginterview.com/blog/companies-that-allow-ai-in-coding-interviews/); [aicodinginterview — Meta reports](https://aicodinginterview.com/interviews/meta/); [techscreen.app](https://techscreen.app/articles/meta-technical-interview-process-2026) |
| Google began rolling out AI-assisted "code comprehension" rounds with Gemini (reported Oct 2026), grading AI fluency, prompt quality, output validation, debugging | **Confirmed, timeline extended; still pilot-phase** (reported) | Business Insider reported a pilot in **May 2026** (select US teams, junior/mid, Google Cloud and Platforms & Devices); Gemini is the only allowed assistant and only in that round. On **2026-10-20** BI reported internal documents showing wider rollout and AI fluency graded as a baseline expectation; a Google spokesperson said AI fluency is a requirement for SWE roles. Google says the AI-assisted formats **remain pilot-phase** and has not confirmed them as standard for all SWE interviews. Sources disagree whether the round replaces or adds to a classic coding round. A no-AI code-comprehension format (200+ lines of broken code) is reported for engineering managers. | [Yahoo Finance / Moneywise citing BI (May 2026)](https://finance.yahoo.com/sectors/technology/articles/asking-kid-math-test-without-151500986.html); [ByteHerald (Oct 2026)](https://www.byteherald.com/2026/10/google-changed-coding-interview-ai-is.html); [TechTimes UK](https://www.techtimes.co.uk/google-ai-fluency-software-engineering-interviews-1809326); [Tekedia](https://www.tekedia.com/google-expands-ai-powered-hiring-tests-making-ai-fluency-mandatory-for-software-engineers/) — original BI article not reachable |
| Canva, DoorDash and LinkedIn run AI-assisted rounds | **Canva and DoorDash confirmed (official); LinkedIn reported only** | Canva (engineering blog, June 2025): backend, ML and frontend candidates are *expected* to use Copilot/Cursor/Claude; "AI-Assisted Coding" replaces the CS-fundamentals screen. DoorDash (careers blog, Mar 2026): 60-min AI-assisted working sessions on your own machine and IDE, AI use required; other rounds still ban AI unless stated. LinkedIn: candidate reports of a "coding with AI" onsite round, no primary source found. | [Canva Engineering Blog](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/); [The Register (2025-06-11)](https://www.theregister.com/2025/06/11/canva_coding_assistant_job_interviews/); [DoorDash via daily.dev (Mar 2026)](https://daily.dev/posts/why-doordash-is-rebuilding-its-engineering-interviews-around-ai-7molfavfy); [DoorDash interview resources](https://careersatdoordash.com/blog/doordash-engineering-interview-resources/); [aicodinginterview.com](https://aicodinginterview.com/blog/companies-that-allow-ai-in-coding-interviews/) |
| Amazon, Goldman Sachs, Anthropic and many others prohibit AI | **Goldman and Anthropic confirmed; Amazon changed** | Goldman Sachs campus recruiting email: prohibits "any external sources, including ChatGPT or Google search", incl. HireVue (Fortune, 2025-06-11). Anthropic candidate guidance (Jul 2025): no AI in live interviews or take-homes unless told otherwise; AI allowed for preparing and polishing application materials (reversal reported by Fortune 2025-07-21). Amazon: 2025 internal guideline — candidates using unsanctioned AI "can be disqualified" (BI via Fortune/ITPro); but in 2026 candidates report an **Amazon-provided AI assistant inside the SDE online assessment** and a GenAI fluency behavioral question. So: Amazon bans *your* AI, not *its* AI. | [Fortune (2025-06-11)](https://www.fortune.com/2025/06/11/goldman-sachs-students-ai-chatgpt-interviews-amazon-anthropic); [Fortune (2025-07-21)](https://fortune.com/2025/07/21/billion-dollar-giant-anthropic-ai-ban-hiring-policy-change-job-seekers-interview-process); [The Decoder](https://the-decoder.com/anthropic-bans-ai-tools-during-job-interviews-to-see-how-candidates-actually-think/); [1point3acres Amazon 2026 Q4](https://www.1point3acres.com/interview/guides/amazon-interview-trend-2026q4) |
| Karat survey (Jan 2026): ~38% of US companies allow AI, ~62% prohibit | **Confirmed, but the two numbers have different bases** | Karat "Engineering Interviews in 2026" (page dated 01.07.2026, upload path 2026/01): 400 engineering leaders in the US, India and China. "Over half (62%) of organizations still prohibit AI use in technical interviews" — **all respondents**. Chart: "Allow AI Use" **US 38%**, China 68%. Also: 71% say AI makes skills harder to assess; only 30% prioritise updating assessments. A separate "~25% of US employers allow AI" figure is one New York recruiter's estimate (IEEE-USA), not Karat. | [Karat (Jan 2026)](https://karat.com/engineering-interview-trends-2026/); [GeekWire](https://www.geekwire.com/2025/engineering-leader-survey-ai-isnt-leading-to-massive-job-cuts-but-its-siphoning-off-weak-performers/); [IEEE-USA InSight](https://insight.ieeeusa.org/articles/three-ways-ai-is-reshaping-traditional-technical-interviews-in-2026/) |

**Other reported positions (candidate reports unless marked):** allow AI in at least one round — Datadog (official careers
page, some roles), Stripe (onsite "AI programming exercise"; but 2026 reports say no AI in Bug Bash / Integration),
Microsoft, Rippling, Atlassian (HackerRank repo extension), Databricks, Harvey; prohibit — Apple, Airbnb, Bloomberg,
Salesforce, Intuit, Eightfold (1–4 reports each, weak signal). Source:
[aicodinginterview.com (2026-11-04)](https://aicodinginterview.com/blog/companies-that-allow-ai-in-coding-interviews/).

**Ukrainian market (DOU, 2026-11-06).** Some product companies dropped take-homes because of AI (Universe — two years ago;
Uklon prefers technical interviews). Others keep or expand them and allow AI: ZONE3000 gives test tasks for ~80% of
vacancies (vs ~40% 1.5 years ago) and wants people "able to manage AI and critically evaluate its results"; Ciklum uses a
60-minute technical test; a team lead rejects candidates who generated the task with AI and then cannot answer
follow-ups. [DOU — «Чи вбив ШІ тестові»](https://dou.ua/lenta/articles/developer-test-tasks-ai/).

**Consequence for the program (unchanged, now evidenced):** train both modes — classic no-AI problem solving (still the
majority: 62% of organisations ban AI) and the AI-assisted round (verify, test and steer AI output in a multi-file
codebase; Meta, Google, Canva, DoorDash, Amazon OA). Every AI-assisted exercise should also be explainable without AI,
because Ukrainian and platform interviewers probe "explain your own solution".

---

## 2. Stack demand

| Signal | Figure | Source (date) |
|---|---|---|
| Languages, all respondents | JavaScript 62.0%, SQL 58.4%, HTML/CSS 58.2%, Python 58.0%, Bash 51.3%, **TypeScript 43.8%** | [Stack Overflow Developer Survey 2026 — technology](https://survey.stackoverflow.co/2026/technology) (fetched 2026-11-08) |
| Web frameworks (2026, secondary) | Node.js 46.4%, React 41.5%, Next.js 20.6%, ASP.NET Core 19.9%, Express 15.6% | SO 2026 data as quoted by [cadence.withremote.ai](https://cadence.withremote.ai/blog/stack-overflow-survey-2026) — not seen on the official page |
| 2025 baseline (secondary) | JS 66%, TS 43.6% (48.8% of professionals), Node.js 48.7%, React 44.7%, Next.js 20.8% (up from 17.9% in 2024) | SO 2025 as quoted by [colorlib](https://colorlib.com/wp/web-development-statistics/), [enstacked](https://enstacked.com/stack-overflow-developer-survey-insights/) |
| TypeScript on GitHub | Reported to have become the most-used language on GitHub in Aug 2025 (Octoverse 2025) | secondary only (same sources) — verify on github.blog |
| LLM use among developers | 71.8% used an LLM; provider use: Anthropic 74.6%, OpenAI 74.3%, Google 54.5% (share of LLM-question respondents) | [SO 2026](https://survey.stackoverflow.co/2026/technology) |
| AI in US job postings | Software-development postings +14% YoY (Apr 2026); "over 47%" of them mention AI (secondary); 71% of the May 2025→May 2026 increase came from senior roles, 37% from jobs with AI in the title; entry-level share 4.5%, senior 69.3% (Q1 2026); postings ≈27.5% below pre-pandemic | [Indeed Hiring Lab (2026-07-08)](https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/); 47% via [copilotinterview](https://copilotinterview.com/blog/tech-hiring-statistics-2026) (not verified on Hiring Lab) |
| Ukraine 2026 hiring plans | GlobalLogic: up to 1,000 hires, 210+ of 325 open roles senior; Intellias: steady demand for Fullstack, DevOps, JavaScript; ELEKS +5–10%, JS among focus roles; ZONE3000 focuses on full-stack + AI | [DOU — Найм у 2026 (2026-01-13)](https://dou.ua/lenta/articles/everything-about-hiring-2026/) |
| Senior Node.js in Ukraine | CI/CD is among top requirements; English required in ~60% of vacancies; seniors usually know 2+ Node frameworks | [DOU (2024-09-26)](https://dou.ua/lenta/articles/senior-node-js-developer-skills-2024/) |

**Seed claim "best-paid skills are LLM work, observability, system design, Next.js" — partly supported.** Arc's 2026 bands
put AI/ML engineering at $110–190/hr and AI infrastructure/MLOps at $120–200/hr vs general full-stack $60–130/hr;
DevOps/platform $90–170, cloud architecture $95–175, cybersecurity $100–180
([Arc, 2026-05-26](https://arc.dev/employer-blog/freelance-developers-cost/)). Lemon.io lists AI-integrated full-stack at
$50–75/hr vs a senior full-stack median of $35/hr
([Lemon.io](https://lemon.io/for-developers/full-stack-developer-jobs/)). Indeed: advertised pay in the most AI-exposed
occupations rose ~46% since 2021 vs 25% in the least exposed (Sep 2026, via search summary). **Not verified:** a specific
premium for Next.js or for observability as a standalone skill.

**Seed claim "employers test whether candidates can critically review AI-written code" — confirmed:** Google grades output
validation; Meta grades verification; Canva reports successful candidates "didn't just prompt AI and accept whatever it
generated"; DoorDash scores "validating outputs rigorously"; ZONE3000 (UA) says the same.

---

## 3. Pay ranges — senior full-stack, remote-relevant (market data, not guarantees)

All figures are as published, with their own definitions (gross/net, base/total). Convert carefully: monthly $5,000 at
160 h ≈ $31/h; contractor hours are not all billable.

### By region (employee salaries)

| Region | Figure | Definition / sample | Source (date) |
|---|---|---|---|
| US — all SWE | Median TC **$192,500** (US overall); Senior Engineer median TC **$312,587** | Levels.fyi submissions, total compensation, skewed to big tech | [Levels.fyi 2025 End of Year report (2025-12-20)](https://levels.fyi/2025/report.md) |
| US — metros | SF Bay Area SWE median $278,000; Seattle $250,000; NYC $193,000; Austin $185,000 | same | same |
| US — Senior Full Stack JS | Average $167,867 | Glassdoor, **only 5 salaries** (Apr 2026) | [Glassdoor](https://www.glassdoor.com/Salaries/united-states-senior-full-stack-javascript-developer-salary-SRCH_IL.0,13_IN1_KO14,52.htm) |
| Europe — all SWE | Median TC **$73,618** (−3.2% YoY); Switzerland $148,289 | Levels.fyi | [Levels.fyi 2025](https://levels.fyi/2025/report.md) |
| Germany | Software-Entwickler median **€65,250** gross/yr; Senior Full Stack avg €73,700 (83 reports, Oct 2026); SMB senior full-stack median €80,000 (p25 €68k, p75 €100k) | Stepstone Gehaltsreport 2026; Glassdoor; Join.com | [Stepstone PDF](https://www.stepstone.de/wp-content/uploads/2025/12/Stepstone_Gehaltsreport_2026.pdf); [Glassdoor DE](https://www.glassdoor.com/Salaries/germany-senior-full-stack-developer-salary-SRCH_IL.0,7_IN96_KO8,35.htm); [Join.com](https://join.com/en/job-guides/fullstack-engineer-senior/salary) |
| UK | Senior Full-Stack Developer, permanent: London median **£84,000**, England £70,000 (6 months to 2026-06-24) | ITJobsWatch, job-ad medians, small samples | [ITJobsWatch London](https://www.itjobswatch.co.uk/jobs/london/senior%20full%20stack%20developer.do) |
| Poland | Senior Fullstack: **PLN 24,300 net/month on B2B**, PLN 19,900 on employment contract | Bulldogjob survey | [Bulldogjob](https://bulldogjob.com/it-report/salaries/fullstack) |
| Ukraine — all devs | Median **$3,500** net/month (June 2026); Senior **$4,500**; Middle $2,500 | DOU survey, n = 4,541 (after tax) | [DOU summer 2026 (2026-07-13)](https://dou.ua/lenta/articles/salary-report-devs-summer-2026/) |
| Ukraine — by company type (Senior) | Product **$4,800**, outstaffing **$4,650**, startups **$4,600** (startups −$400 in 6 months) | same | same |
| Ukraine — TypeScript / Node | Senior TypeScript median $4,500 (was $5,000 in 2023); Senior TS Node.js: product $5,000, startups $6,600, others $4,550–4,700 (**n = 59**) | same (editor comment) | same |
| Ukrainians abroad | Senior $5,200, Middle $2,850 (n = 986) | same | same |
| Ukraine — Senior Full Stack | $4,500; Tech Lead $5,200 (winter 2026) | DOU winter 2026 as quoted by Mate.academy (secondary) | [DOU winter 2026](https://dou.ua/lenta/articles/salary-report-devs-winter-2026/); [Mate.academy](https://mate.academy/blog/it-career/full-stack-developer) |

### By platform (contractor hourly rates)

| Platform | Figure | Notes | Source (date) |
|---|---|---|---|
| Arc.dev | By region (avg, **all levels mixed — not senior figures**): US/CA $82–130, W. Europe $70–120, N. Europe $68–115, **E. Europe $40–85**, LatAm $35–75; by level: Senior (7–10 y) **$75–150**, Staff $120–220; general full-stack $60–130 | survey of 5,302 freelancers; Arc says printed bands are wider than survey results | [Arc (2026-05-26)](https://arc.dev/employer-blog/freelance-developers-cost/) |
| Lemon.io | Full-stack senior $20–73/h (**median $35**), strong senior $20–95/h (median $47); TS-first / AI-integrated full-stack $50–75/h | developer-side rates; requires 3+ y commercial full-stack, Upper-Intermediate English | [Lemon.io full-stack page](https://lemon.io/for-developers/full-stack-developer-jobs/) (accessed 2026-11-08) |
| Toptal | No public rate card; client-side $60–150+/h reported; full-stack developers self-report **$44–75/h, avg $54** (9 reports, Apr 2026); markup charged to the client, not deducted from the developer | | [Glassdoor Toptal hourly](https://www.glassdoor.com/Hourly-Pay/Toptal-Full-Stack-Developer-Hourly-Pay-E882070_D_KO7,27.htm); [TFC](https://www.thefrontendcompany.com/posts/toptal-pricing) |
| Gun.io | $60–200/h (review-site estimate) | no official figures | [hireinsouth](https://www.hireinsouth.com/post/gun-io-review) |
| UK contract | "Senior Full-Stack Software Engineer": £883/day in the 6 months to 2026-11-03 — **n = 1 quoted rate (2 ads), not a market median**; context: all UK IT contracts median £525/day, older senior full-stack medians £620–763/day from 12–29 ads (2025) | ITJobsWatch job ads | [ITJobsWatch](https://www.itjobswatch.co.uk/contracts/uk/senior%20full%20stack%20software%20engineer.do) |
| Poland B2B | Senior ≈ PLN 150–220/h; ≈ €50–75/h | aggregated from JustJoin.it, No Fluff Jobs, Bulldogjob | [Sprinx](https://www.sprinx.pl/en/blog/hire-developer-poland-cost); [HiddenJobs](https://hiddenjobs.eu/blog/polish-developer-cost-2026-foreign-employers-guide) |

**By company type (what the data supports):** in Ukraine product > outstaffing ≈ startups at senior level (DOU, above);
startups pay the most for senior TS/Node but with a tiny sample. Globally, big-tech TC (Levels.fyi) is far above
remote-contract rates; Lemon.io's senior full-stack medians are $35–47/h, Arc's Eastern Europe band ($40–85/h) mixes all levels, and
$75–150/h is Arc's global senior band (no Arc senior-by-region split is published). The $5,000+/month target is consistent with DOU's product-company senior median ($4,800) only at the
upper half of the distribution, or with $40+/h full-time contracting.

---

## 4. Contractor vs employee — high-level notes (not tax or legal advice)

| Jurisdiction | Key point | Source (date) |
|---|---|---|
| Ukraine — ФОП 3 група | 5% single tax (no VAT) + 1% military levy on income, plus ЄСВ 22% of minimum wage = **1,902.34 UAH/month** in 2026 (paid even with no income); annual income limit 10,091,049 UAH; tax on gross income, no expense deduction | [monobank](https://monobank.ua/en/knowledge-base/fop/fop-3-grupa-2026); [i-net](https://www.i-net.com.ua/iesv-fop-3-hrupa-2026/) |
| Ukraine — Дія Сіті | Gig contract or employment with a resident: 5% ПДФО + 5% military levy + ЄСВ (min 1,902.34 UAH); 5% rate only while the resident meets the regime criteria | [pidrahui.pro](https://pidrahui.pro/kalkuliator/diia-city/); [bip.net.ua](https://bip.net.ua/articles/gig-kontrakt-v-diya-city/) |
| US | IRS tests: behavioral control, financial control, type of relationship. Contractors (1099-NEC) pay 15.3% self-employment tax on 92.35% of net earnings (Social Security part capped at the 2026 wage base, reported as $184,500), half deductible; employees (W-2) pay 7.65% | [Patriot Software](https://www.patriotsoftware.com/blog/payroll/w2-employee-vs-1099-contractor/); [sdocpa](https://www.sdocpa.com/1099-vs-w2-comparison-guide/) — verify on irs.gov |
| UK | Off-payroll working (IR35) — since **6 April 2021** medium and large private-sector clients decide status and issue a Status Determination Statement; small clients leave it to the contractor | [ir35update](https://www.ir35update.co.uk/ir35-off-payroll-history/); [Gerald Edelman](https://www.geraldedelman.com/insights/ir35-your-complete-guide-to-off-payroll-working/) |
| Germany | Scheinselbständigkeit: DRV Clearingstelle status procedure (§7a SGB IV); reclassification can bring up to 4 years of back contributions; red flags: fixed hours, company e-mail, client's equipment, a single client; a 2026 BMAS draft on "Neue Selbstständigkeit" not yet law (mid-2026) | [Haufe](https://www.haufe.de/personal/entgelt/scheinselbststaendigkeit-wieder-auf-dem-vormarsch/statusfeststellung-durch-die-rentenversicherung_78_132818.html); [frelani](https://frelani.com/de/blog/scheinselbststaendigkeit-2026-drv-regeln-it-freelancer/) |
| Poland | B2B (JDG) is common; from **8 July 2026** the labour inspectorate (PIP) can reclassify B2B as employment by administrative decision (sources disagree on dates and look-back); EOR adds ≈20% employer ZUS | [Woźniak Legal](https://wozniaklegal.com/en/news-and-insight/510/poland-new-pip-powers-to-reclassify-b2b-contracts-from-8-july-2026.html); [Teamed](https://www.teamed.global/country-hiring-guides/poland/misclassification) |

**Economics to teach (arithmetic, not data):** a contractor rate must cover unpaid holidays and sick days, bench time
between contracts, equipment, accounting, own pension/health cover and currency risk. Compare offers as *annual net in
hand after all of that*, not hourly vs monthly headline numbers. Platform rates (Toptal, Lemon.io) are what the developer
receives; the client pays more.
