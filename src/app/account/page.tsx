import type { Metadata } from 'next'
import Link from 'next/link'
import { PiCheckBold } from 'react-icons/pi'
import { messages, t } from '@/i18n'
import { updateProfile } from '@/server/actions/account'
import { setCourseLevel } from '@/server/actions/courses'
import { shellData } from '@/server/shell'
import { Icon } from '@/ui/icons/Icon'
import { getProfile, isAdmin, requireUser } from '@/server/auth'
import { INTERESTS, LEVELS, MINUTES } from '@/server/services/preferences'
import { readSettings } from '@/server/settings'
import { param } from '@/ui/auth/AuthShell'
import { Choice, ChoiceGroup } from '@/ui/auth/Choices'
import { Avatar } from '@/ui/design/Avatar'
import { Pill } from '@/ui/design/Badge'
import { Button } from '@/ui/design/Button'

export const metadata: Metadata = { title: 'Профіль і акаунт' }

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser()
  const [params, profile, settings, admin, shell] = await Promise.all([searchParams, getProfile(), readSettings(), isAdmin(), shellData()])
  const library = shell?.library ?? []
  const m = messages()
  const name = profile?.displayName || user.name || user.email || 'Я'
  const chosen = new Set(profile?.preferences.interests ?? [])
  const level = profile?.preferences.level ?? 'noob'
  const deleteState = param(params, 'delete')
  return (
    <div className="page acct-page">
      <header className="acct-head">
        <Avatar name={name} src={profile?.avatarUrl ?? undefined} size={72} ring="green" />
        <div>
          <h1 className="page-title">{t('account.title')}</h1>
          <p className="page-lead">
            {user.email} {admin ? <Pill tone="purple">{t('account.admin')}</Pill> : null}
          </p>
        </div>
      </header>
      {param(params, 'saved') ? (
        <p className="acct-note" role="status">
          <PiCheckBold aria-hidden="true" /> {t('account.savedNote')}
        </p>
      ) : null}

      <form action={updateProfile} className="acct-form">
        <section className="lu-card acct-section" data-pad="lg" aria-labelledby="a-profile">
          <h2 id="a-profile" className="acct-h2">
            {t('account.profile')}
          </h2>
          <label className="auth-field">
            <span className="auth-label">{t('account.displayName')}</span>
            <input className="auth-input" name="displayName" defaultValue={name} required maxLength={60} autoComplete="nickname" placeholder={t('auth.placeholders.displayName')} />
          </label>
          <ChoiceGroup legend={t('account.avatar')} hint={t('account.avatarHint')}>
            {user.avatarUrl ? <Choice type="radio" name="avatar" value="oauth" defaultChecked={Boolean(profile?.avatarUrl)} title={<Avatar name={name} src={user.avatarUrl} size={40} />} /> : null}
            <Choice type="radio" name="avatar" value="initials" defaultChecked={!profile?.avatarUrl || !user.avatarUrl} title={<Avatar name={name} size={40} />} />
          </ChoiceGroup>
          <label className="auth-field">
            <span className="auth-label">{t('account.locale')}</span>
            <select className="auth-input" name="locale" defaultValue={profile?.locale ?? 'uk'}>
              <option value="uk">{t('account.localeUk')}</option>
            </select>
          </label>
        </section>

        <section className="lu-card acct-section" data-pad="lg" aria-labelledby="a-learning">
          <h2 id="a-learning" className="acct-h2">
            {t('account.learning')}
          </h2>
          <ChoiceGroup legend={t('account.dailyMinutes')}>
            {MINUTES.map((n) => (
              <Choice key={n} type="radio" name="minutes" value={String(n)} defaultChecked={n === settings.dailyMinutes} required title={t('onboarding.minutes.option', { n })} />
            ))}
          </ChoiceGroup>
          <ChoiceGroup legend={t('account.level')} wide>
            {LEVELS.map((l) => (
              <Choice key={l} type="radio" name="level" value={l} defaultChecked={l === level} required title={m.levels[l].title} sub={m.levels[l].body} />
            ))}
          </ChoiceGroup>
          <ChoiceGroup legend={t('account.interests')}>
            {INTERESTS.map((i) => (
              <Choice key={i} type="checkbox" name="interests" value={i} defaultChecked={chosen.has(i)} title={m.interests[i]} />
            ))}
          </ChoiceGroup>
        </section>

        <section className="lu-card acct-section" data-pad="lg" aria-labelledby="a-sound">
          <h2 id="a-sound" className="acct-h2">
            {t('account.soundHaptics')}
          </h2>
          <label className="acct-check">
            <input type="checkbox" name="sound" defaultChecked={settings.sound} /> {t('account.sound')}
          </label>
          <label className="acct-check">
            <input type="checkbox" name="haptics" defaultChecked={settings.haptics} /> {t('account.haptics')}
          </label>
          <p className="choice-hint">
            <Link href="/settings">{t('account.settingsLink')} →</Link>
          </p>
        </section>

        <div className="acct-save">
          <Button type="submit" size="lg">
            {t('account.saveProfile')}
          </Button>
        </div>
      </form>

      <section className="lu-card acct-section" data-pad="lg" aria-labelledby="a-courses">
        <h2 id="a-courses" className="acct-h2">
          {t('account.courses')}
        </h2>
        <p className="choice-hint">{t('account.coursesHint')}</p>
        {library.length === 0 ? (
          <p className="choice-hint">
            {t('account.coursesEmpty')} <Link href="/courses">{t('shell.catalog')} →</Link>
          </p>
        ) : null}
        {library.map((c) => (
          <form key={c.id} action={setCourseLevel} className="acct-course">
            <input type="hidden" name="course" value={c.id} />
            <input type="hidden" name="next" value="/account?saved=1" />
            <span className="acct-course-title">
              <Icon name={c.icon ?? 'px:book'} size={22} /> {c.title}
              {c.enrollment.active ? <Pill tone="green" size="sm">{t('courses.active')}</Pill> : null}
            </span>
            <label className="sr-only" htmlFor={`lvl-${c.id}`}>
              {t('courses.level.title')}
            </label>
            <select id={`lvl-${c.id}`} className="auth-input acct-course-level" name="level" defaultValue={c.enrollment.level}>
              {c.levels.map((l) => (
                <option key={l} value={l}>
                  {m.levels[l].title}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">
              {t('common.save')}
            </Button>
            <Link href={`/placement?course=${c.id}`} className="acct-course-link">
              <Icon name="px:testTube" size={18} /> {t('account.placementLink')}
            </Link>
          </form>
        ))}
      </section>

      <section className="lu-card acct-section" data-pad="lg" aria-labelledby="a-session">
        <h2 id="a-session" className="acct-h2">
          {t('account.session')}
        </h2>
        <div className="acct-row">
          <form action="/auth/sign-out" method="post">
            <Button type="submit" variant="secondary">
              {t('account.signOut')}
            </Button>
          </form>
          <form action="/auth/sign-out" method="post">
            <input type="hidden" name="scope" value="global" />
            <Button type="submit" variant="ghost">
              {t('account.signOutAll')}
            </Button>
          </form>
        </div>
      </section>

      <section className="lu-card acct-section" data-pad="lg" aria-labelledby="a-data">
        <h2 id="a-data" className="acct-h2">
          {t('account.data')}
        </h2>
        <p className="choice-hint">{t('account.exportHint')}</p>
        {/* Plain link: the route sets Content-Disposition: attachment. */}
        <a className="lu-btn" data-variant="secondary" data-size="md" href="/api/export" download>
          <span className="lu-btn-content">
            <span className="lu-btn-label">{t('account.export')}</span>
          </span>
        </a>
      </section>

      <section className="lu-card acct-section acct-danger" data-pad="lg" data-tone="red" aria-labelledby="a-delete">
        <h2 id="a-delete" className="acct-h2">
          {t('account.deleteTitle')}
        </h2>
        <p>{t('account.deleteBody')}</p>
        {deleteState === 'reauth' ? (
          <div className="auth-error" role="alert">
            {t('account.deleteReauth')}
            <form action="/auth/sign-out" method="post">
              <input type="hidden" name="relogin" value="1" />
              <Button type="submit" variant="secondary" size="sm">
                {t('auth.login.submit')}
              </Button>
            </form>
          </div>
        ) : deleteState === 'confirm' ? (
          <p className="auth-error" role="alert">
            {t('account.deleteWrong')}
          </p>
        ) : null}
        <form action="/auth/delete-account" method="post" className="acct-row">
          <label className="auth-field">
            <span className="auth-label">{t('account.deleteConfirm')}</span>
            <input className="auth-input" name="confirm" required autoComplete="off" pattern={t('account.deleteWord')} placeholder={t('auth.placeholders.confirmDelete', { word: t('account.deleteWord') })} />
          </label>
          <Button type="submit" variant="danger">
            {t('account.deleteSubmit')}
          </Button>
        </form>
      </section>
    </div>
  )
}
