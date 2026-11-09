# Security standards (versions verified) and security interview formats

> **Коротко українською.** Перевірено на сайтах OWASP 2026-11-08: актуальна **OWASP Top 10:2025** (A01 Broken Access
> Control … A10 Mishandling of Exceptional Conditions; SSRF злито в A01; A03 — Software Supply Chain Failures; оголошено як
> release candidate 6.11.2025, фінал за вторинними джерелами — січень 2026). **API Security Top 10** — остання версія
> **2023** (нової редакції на сайті не анонсовано). **ASVS 5.0.0** — стабільний реліз від 30.05.2025, наступна ціль —
> патч 5.0.1. Для LLM: **OWASP Top 10 for LLM Applications 2025** (офіційна поточна), **Agentic Top 10 (2026)** оголошено
> 9.12.2025. Формати безпекових співбесід: secure code review (живий, у CoderPad), threat modeling (STRIDE на діаграмі),
> перевірка IAM-політик, інцидент «злиті ключі», безпека всередині system design.

Verified 2026-11-08. Always cite the version a source uses — many articles still teach Top 10:2021.

---

## 1. Current OWASP versions

| Standard | Current version | Status / date | Verified on |
|---|---|---|---|
| OWASP Top 10 | **2025** ("8th installment") | Announced as release candidate at Global AppSec DC on **2025-11-06**; site now presents "the OWASP Top 10:2025 Release" without a date; secondary sources say finalised **January 2026** (not confirmed on owasp.org) | [top10.owasp.org/2025](https://top10.owasp.org/2025) (owasp.org/Top10/2025 redirects there); [introduction](https://top10.owasp.org/2025/0x00_2025-Introduction/); [Fastly](https://www.fastly.com/blog/new-2025-owasp-top-10-list-what-changed-what-you-need-to-know); [Parasoft](https://www.parasoft.com/blog/owasp-top-10/) |
| OWASP API Security Top 10 | **2023** | "Latest Version: 2023"; no newer edition announced on the project page | [owasp.org/www-project-api-security](https://owasp.org/www-project-api-security/) |
| OWASP ASVS | **5.0.0** | "Stable release", **2025-05-30**; GitHub: next target is patch **5.0.1**; no 5.1 mentioned | [asvs.owasp.org](https://asvs.owasp.org/); [github.com/OWASP/ASVS](https://github.com/OWASP/ASVS) |
| OWASP Top 10 for LLM Applications | **2025** (v2.0) | official page lists only 2025 entries; third-party blogs describing a "2026 edition" could not be confirmed on genai.owasp.org | [genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10/) |
| OWASP Top 10 for Agentic Applications | **2026** (ASI01–ASI10) | announced **2025-12-09** by the OWASP GenAI Security Project (secondary sources) | [Teleport](https://goteleport.com/blog/owasp-top-10-agentic-applications/); [Auth0](https://auth0.com/blog/owasp-top-10-agentic-applications-lessons/) |

### Top 10:2025 list and changes vs 2021 (from the official introduction)

| 2025 | Category | Change vs 2021 |
|---|---|---|
| A01 | Broken Access Control | stays #1; **SSRF merged in** (was A10:2021) |
| A02 | Security Misconfiguration | up from #5 |
| A03 | Software Supply Chain Failures | **new**, expands A06:2021 Vulnerable and Outdated Components to build systems and distribution |
| A04 | Cryptographic Failures | down from #2 |
| A05 | Injection | down from #3 |
| A06 | Insecure Design | down from #4 (still its own category) |
| A07 | Authentication Failures | renamed from "Identification and Authentication Failures" |
| A08 | Software or Data Integrity Failures | same position |
| A09 | Security Logging and Alerting Failures | renamed from "…Logging and Monitoring Failures" |
| A10 | Mishandling of Exceptional Conditions | **entirely new** (fail-open, error handling) |

Data basis: contributions covering 2.8M+ applications, 589 CWEs analysed, 248 CWEs mapped into the ten categories; two
categories chosen by community survey. → The §4 claims in the task prompt ("Broken Access Control is #1", "Insecure Design
is its own category", "Mishandling of Exceptional Conditions is new") are **confirmed**.

### API Security Top 10:2023
API1 Broken Object Level Authorization · API2 Broken Authentication · API3 Broken Object Property Level Authorization ·
API4 Unrestricted Resource Consumption · API5 Broken Function Level Authorization · API6 Unrestricted Access to Sensitive
Business Flows · API7 Server Side Request Forgery · API8 Security Misconfiguration · API9 Improper Inventory Management ·
API10 Unsafe Consumption of APIs.

### LLM Top 10:2025 and Agentic Top 10 (2026)
LLM01 Prompt Injection · LLM02 Sensitive Information Disclosure · LLM03 Supply Chain · LLM04 Data and Model Poisoning ·
LLM05 Improper Output Handling · LLM06 Excessive Agency · LLM07 System Prompt Leakage · LLM08 Vector and Embedding
Weaknesses · LLM09 Misinformation · LLM10 Unbounded Consumption.
Agentic (secondary sources): ASI01 Agent Goal Hijack · ASI02 Tool Misuse and Exploitation · ASI03 Identity and Privilege
Abuse · ASI04 Agentic Supply Chain Vulnerabilities · ASI05 Unexpected Code Execution · ASI06 Memory and Context Poisoning ·
ASI07 Insecure Inter-Agent Communication · ASI08 Cascading Failures · ASI09 Human-Agent Trust Exploitation · ASI10 Rogue
Agents.

**Not verified in this pass:** ASVS 5.0 chapter and requirement counts and level definitions (pages fetched did not state
them) — read the ASVS 5.0.0 PDF before writing the course chapter.

---

## 2. Security interview formats

| Format | How it runs (evidence) | What is graded | Course exercise |
|---|---|---|---|
| **Secure code review** | Amazon lists it as a phone-screen and loop competency ([amazon.jobs](https://amazon.jobs/content/en/how-we-hire/security-engineer-interview-prep)); Apple runs it live in CoderPad on a C/C++ snippet (reported, [Dataford](https://dataford.io/interview-guides/apple/security-engineer)); candidates look for logic flaws, insecure deserialization, hard-coded secrets ([Interview Kickstart](https://interviewkickstart.com/interview-questions/companies/amazon/security-engineer)) | finding real issues, ranking severity ("critical flaw vs low-risk operational issue"), fix quality | 200-line Node/TS service with planted bugs (IDOR, SQLi, JWT `alg`/expiry, prototype pollution, ReDoS, SSRF, fail-open catch) |
| **Bug bash / debugging an unfamiliar codebase** (general SWE, not security-only) | Stripe: 3–5 planted bugs, 45–60 min (reported) | orientation in unfamiliar code, diagnosis method | combine with security bugs |
| **Threat modeling on a diagram** | STRIDE is the usual framework; list assets first (customer data, credentials, API keys, logs, infra); do not jump to isolated vulnerabilities; sample prompt: secure file upload (validation, malware scan, storage, retrieval) ([Aced/Exponent](https://www.aced.io/blog/security-engineer-interview-prep); [Dataford — AWS](https://dataford.io/interview-guides/amazon-web-services/security-engineer)) | questions to the product owner first, data-flow, ranked risks, accepted risks | ≥ 20 diagrams with a rubric that penalises a filled STRIDE grid with no questions |
| **IAM / policy review** | Apple (reported): analyse a JSON document with AWS STS permissions and ARNs for permission flaws | least privilege, wildcard and trust-policy mistakes | policy-review drills (S3, STS AssumeRole, `*` actions) |
| **"Leaked credentials — your first steps"** | no first-hand report of the exact prompt found; AWS guidance: prefer temporary credentials, never keep keys in app files, monitor key use with CloudTrail and alarm on denied calls ([AWS IAM docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)) | order of actions: revoke/rotate → audit usage (CloudTrail) → hunt persistence (new users, roles, keys, compute) → purge from history → root cause (secret scanning, short-lived creds) | incident drill with a timeline and a git-history step |
| **Security inside system design** | appsec loops emphasise Top 10, code review, threat modeling; cloud-security loops emphasise shared responsibility, misconfigurations, IaC ([Aced](https://www.aced.io/blog/security-engineer-interview-prep)) | authN/authZ placement, secrets, rate limits, tenant isolation, audit logs | add a security pass to every system-design exercise |
| **Security Q&A in full-stack interviews** | field bank: "Where do you store private keys?" (Gun.io, Glassdoor); JWT, REST and optimisation questions (Turing, Glassdoor); Server Actions as public endpoints (Next.js prep guides); DOU lists (XSS, CSRF, SQLi, SAST/DAST, secrets management, K8s scanning) | breadth + "how would you prevent it in our stack" | ≥ 300 Q&A, tagged by OWASP 2025 / API 2023 / ASVS 5.0 IDs |

**Legal and ethical rule for the offensive-basics part:** practise only in sandboxed lab apps shipped with the course;
never against real systems without written authorisation.
