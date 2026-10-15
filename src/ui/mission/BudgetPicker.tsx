'use client'

import { useState, useTransition } from 'react'
import { updateSetting } from '@/server/actions/settings'
import { BUDGETS } from '@/progress/mission'

export function BudgetPicker({ value, locked }: { value: number; locked: boolean }) {
  const [current, setCurrent] = useState(value)
  const [pending, start] = useTransition()
  const active = BUDGETS.find((b) => b.minutes === current) ?? BUDGETS[1]!
  return (
    <div className="budget">
      <div className="budget-chips" role="radiogroup" aria-label="Скільки часу сьогодні">
        {BUDGETS.map((b) => (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={b.minutes === current}
            className="budget-chip"
            data-active={b.minutes === current ? '' : undefined}
            disabled={pending}
            onClick={() => {
              setCurrent(b.minutes)
              start(async () => {
                await updateSetting('dailyMinutes', b.minutes)
              })
            }}
          >
            <span aria-hidden="true">{b.emoji}</span>
            <span className="tabular">{b.minutes}</span>
            <span className="budget-unit">хв</span>
          </button>
        ))}
      </div>
      <p className="budget-hint">
        <strong>{active.title}.</strong> {active.hint}
        {locked ? ' · план на сьогодні вже в роботі — новий бюджет діятиме з завтра' : null}
      </p>
    </div>
  )
}
