import type { Metadata } from 'next'
import Link from 'next/link'
import { LEVEL_LABEL } from '@/content/model'
import { levelInfo, RANKS } from '@/progress/levels'
import { getContent } from '@/server/content'
import { profileData, type Accuracy } from '@/server/services/stats'
import { MAIN_TRACK } from '@/server/services/mission'
import { trackPath } from '@/server/services/path'
import { count, duration, percent, relative } from '@/ui/format'
import { Heatmap } from '@/ui/profile/Heatmap'
import { chapterHref, guideHref } from '@/ui/routes'

export const metadata: Metadata = { title: 'Профіль' }

function AccCell({ a }: { a: Accuracy }) {
  if (a.total === 0) return <span className="muted">—</span>
  return (
    <span className="acc">
      <span className="bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${a.rate ?? 0})` }} data-weak={a.rate !== null && a.rate < 0.6 ? '' : undefined} />
      </span>
      <span className="tabular">{percent(a.rate)}</span>
      <span className="cell-sub tabular">{a.correct}/{a.total}</span>
    </span>
  )
}

export default async function ProfilePage() {
  const snapshot = await getContent()
  const [data, course] = await Promise.all([profileData(snapshot), trackPath(snapshot, MAIN_TRACK)])
  const perfectLessons = course.stages.flatMap((st) => st.nodes.flatMap((n) => n.lessons)).filter((l) => l.perfect).length
  const info = levelInfo(data.xp)
  const toNext = info.ceiling - data.xp
  const unlocked = data.achievements.filter((a) => a.unlockedAt !== null)
  const locked = data.achievements.filter((a) => a.unlockedAt === null).sort((a, b) => b.progress - a.progress)

  return (
    <div className="page profile">
      <header className="profile-head">
        <div className="profile-level">
          <span className="profile-level-num num-margin tabular">{info.level}</span>
          <div>
            <span className="eyebrow">Рівень · ранг</span>
            <h1 className="page-title">{info.rank.title}</h1>
            <div className="profile-progress">
              <span className="bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${info.progress})` }} />
              </span>
              <span className="tabular">
                {data.xp - info.floor} / {info.ceiling - info.floor} XP · до рівня {info.level + 1} ще {toNext}
              </span>
            </div>
            <p className="unit-meta">
              Усього {data.xp} XP
              {info.nextRank ? ` · ранг ${info.nextRank.title} з рівня ${info.nextRank.fromLevel}` : ' · найвищий ранг'}
            </p>
          </div>
        </div>
        <ol className="ranks" aria-label="Ранги">
          {RANKS.map((r) => (
            <li key={r.id} data-state={r.id === info.rank.id ? 'current' : info.level >= r.fromLevel ? 'done' : 'next'}>
              <span>{r.title}</span>
              <span className="tabular">з {r.fromLevel}</span>
            </li>
          ))}
        </ol>
      </header>

      <section className="course-stats" aria-label="Курс">
        <Link href={`/path?track=${MAIN_TRACK.id}`} className="course-stat" data-tone="green">
          <span className="course-stat-emoji" aria-hidden="true">
            🎓
          </span>
          <span className="course-stat-value tabular">
            {course.lessonsDone}
            <small>/{course.lessonsTotal}</small>
          </span>
          <span className="course-stat-label">уроків {MAIN_TRACK.title}</span>
        </Link>
        <div className="course-stat" data-tone="yellow">
          <span className="course-stat-emoji" aria-hidden="true">
            ⭐
          </span>
          <span className="course-stat-value tabular">{perfectLessons}</span>
          <span className="course-stat-label">бездоганних уроків</span>
        </div>
        <div className="course-stat" data-tone="orange">
          <span className="course-stat-emoji" aria-hidden="true">
            👑
          </span>
          <span className="course-stat-value tabular">
            {course.crowns}
            <small>/{course.maxCrowns}</small>
          </span>
          <span className="course-stat-label">корон майстерності</span>
        </div>
        <div className="course-stat" data-tone="blue">
          <span className="course-stat-emoji" aria-hidden="true">
            🎯
          </span>
          <span className="course-stat-value tabular">{percent(data.accuracy.rate)}</span>
          <span className="course-stat-label">точність відповідей</span>
        </div>
        <div className="course-stat" data-tone="red">
          <span className="course-stat-emoji" aria-hidden="true">
            🔥
          </span>
          <span className="course-stat-value tabular">{data.streak.current}</span>
          <span className="course-stat-label">днів поспіль · рекорд {data.streak.best}</span>
        </div>
        <div className="course-stat" data-tone="purple">
          <span className="course-stat-emoji" aria-hidden="true">
            ⏱️
          </span>
          <span className="course-stat-value tabular">{duration(data.studyMs + data.readingMs)}</span>
          <span className="course-stat-label">у навчанні</span>
        </div>
      </section>

      <section className="figures" aria-label="Підсумки">
        <div>
          <span className="figure-num tabular">{data.streak.current}</span>
          <span className="figure-label">серія днів · найдовша {data.streak.best}</span>
        </div>
        <div>
          <span className="figure-num tabular">{percent(data.accuracy.rate)}</span>
          <span className="figure-label">точність · {count(data.answered, 'відповідь', 'відповіді', 'відповідей')}</span>
        </div>
        <div>
          <span className="figure-num">{duration(data.studyMs)}</span>
          <span className="figure-label">час навчання · з них читання {duration(data.readingMs)}</span>
        </div>
        <div>
          <span className="figure-num tabular">
            {data.today}
            <span className="today-of">/{data.goal}</span>
          </span>
          <span className="figure-label">сьогодні з денної мети</span>
        </div>
      </section>

      <section aria-labelledby="activity">
        <h2 id="activity" className="section-title rule-title">
          Активність
        </h2>
        <Heatmap days={data.heat} goal={data.goal} />
      </section>

      <div className="profile-cols">
        <section aria-labelledby="by-guide">
          <h2 id="by-guide" className="section-title rule-title">
            Точність по посібниках
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Посібник</th>
                <th scope="col">Вивчено</th>
                <th scope="col">Точність</th>
              </tr>
            </thead>
            <tbody>
              {data.byGuide.map((g) => (
                <tr key={g.guide.id}>
                  <td>
                    <Link className="ui-link" href={guideHref(g.guide.id)}>
                      {g.guide.title}
                    </Link>
                  </td>
                  <td className="tabular muted">
                    {g.studied}/{g.chapters}
                  </td>
                  <td>
                    <AccCell a={g.accuracy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section aria-labelledby="by-level">
          <h2 id="by-level" className="section-title rule-title">
            Точність за складністю
          </h2>
          <table className="data-table">
            <tbody>
              {data.byLevel.map((l) => (
                <tr key={l.level}>
                  <td data-level={l.level} className="level-cell">
                    {LEVEL_LABEL[l.level]}
                  </td>
                  <td>
                    <AccCell a={l.accuracy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="section-title rule-title">Найслабші теми</h2>
          {data.weak.length === 0 ? (
            <p className="empty-note">Слабких тем поки не видно — потрібно хоча б 3 відповіді в розділі.</p>
          ) : (
            <ol className="weak-list">
              {data.weak.map((w) => (
                <li key={w.chapter.id}>
                  <Link className="ui-link" href={chapterHref(snapshot, w.chapter)}>
                    {w.chapter.title}
                  </Link>
                  <span className="cell-sub">
                    {w.accuracy.total > 0 ? `точність ${percent(w.accuracy.rate)}` : 'ще без відповідей'}
                    {w.open > 0 ? ` · ${count(w.open, 'відкрита помилка', 'відкриті помилки', 'відкритих помилок')}` : ''}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section aria-labelledby="achievements">
        <h2 id="achievements" className="section-title rule-title">
          Ачівки · {unlocked.length} з {data.achievements.length}
        </h2>
        <ul className="achievements">
          {unlocked.map((a) => (
            <li key={a.def.id} data-tier={a.def.tier} data-state="unlocked">
              <span className="ach-title">{a.def.title}</span>
              <span className="ach-desc">{a.def.description}</span>
              <span className="cell-sub">отримано {relative(a.unlockedAt)}</span>
            </li>
          ))}
          {locked.map((a) => (
            <li key={a.def.id} data-tier={a.def.tier} data-state="locked">
              <span className="ach-title">{a.def.title}</span>
              <span className="ach-desc">{a.def.description}</span>
              <span className="bar" aria-label={`Прогрес ${Math.round(a.progress * 100)}%`}>
                <span style={{ transform: `scaleX(${a.progress})` }} />
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
