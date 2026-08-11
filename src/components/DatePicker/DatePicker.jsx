/*
 *
 * DateRangePicker
 *
 * One shared calendar panel behind two triggers (start/end). Picking a
 * start date auto-advances to the end date on the same panel; hovering
 * previews the range before it's committed.
 */

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DAYS_SHORT, MONTHS, dateToIso, formatDateLong, isSameDay, isoToDate, getMonthGrid } from '@utils/date';
import { t } from '@utils/i18n';
import './DatePicker.scss';

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const DateRangePicker = ({ startLabel, endLabel, start, end, onChangeStart, onChangeEnd }) => {
  const [phase, setPhase] = useState(null); // null | 'start' | 'end'
  const [panelPos, setPanelPos] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [hoverIso, setHoverIso] = useState(null);
  const containerRef = useRef(null);
  const startTriggerRef = useRef(null);
  const endTriggerRef = useRef(null);

  const startDate = isoToDate(start);
  const endDate = isoToDate(end);

  useEffect(() => {
    if (!phase) return;
    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setPhase(null);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setPhase(null);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase]);

  function openPhase(nextPhase, forcedViewDate) {
    const anchor = nextPhase === 'start' ? startTriggerRef.current : endTriggerRef.current;
    const rect = anchor.getBoundingClientRect();
    setPanelPos({ top: rect.bottom + 6, left: rect.left });
    setViewDate(
      forcedViewDate || (nextPhase === 'start' ? startDate : endDate) || startDate || new Date(),
    );
    setPhase(nextPhase);
  }

  function selectDay(day) {
    const iso = dateToIso(day);
    if (phase === 'start') {
      onChangeStart(iso);
      if (end && day > stripTime(endDate)) onChangeEnd('');
      openPhase('end', day);
      return;
    }
    onChangeEnd(iso);
    setPhase(null);
  }

  function changeMonth(delta) {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
  }

  const grid = getMonthGrid(viewDate.getFullYear(), viewDate.getMonth());
  const today = new Date();
  const rangeEnd = phase === 'end' ? (endDate || isoToDate(hoverIso)) : endDate;

  return (
    <div className="date-range-picker" ref={containerRef}>
      <div className="date-picker">
        {startLabel && <span className="date-picker__label">{startLabel}</span>}
        <button
          type="button"
          ref={startTriggerRef}
          className="date-picker__trigger"
          onClick={() => openPhase('start')}
          aria-haspopup="dialog"
          aria-expanded={phase === 'start'}
        >
          <Calendar size={16} strokeWidth={2} aria-hidden="true" />
          <span className={start ? '' : 'date-picker__placeholder'}>
            {start ? formatDateLong(start) : t('datePicker.placeholder')}
          </span>
        </button>
      </div>

      <div className="date-picker">
        {endLabel && <span className="date-picker__label">{endLabel}</span>}
        <button
          type="button"
          ref={endTriggerRef}
          className="date-picker__trigger"
          onClick={() => openPhase('end')}
          aria-haspopup="dialog"
          aria-expanded={phase === 'end'}
        >
          <Calendar size={16} strokeWidth={2} aria-hidden="true" />
          <span className={end ? '' : 'date-picker__placeholder'}>
            {end ? formatDateLong(end) : t('datePicker.placeholder')}
          </span>
        </button>
      </div>

      {phase && panelPos && (
        <div
          className="date-picker__panel"
          role="dialog"
          aria-label={phase === 'start' ? startLabel : endLabel}
          style={{ top: panelPos.top, left: panelPos.left }}
          onMouseLeave={() => setHoverIso(null)}
        >
          <div className="date-picker__nav">
            <button type="button" onClick={() => changeMonth(-1)} aria-label={t('datePicker.prevMonth')}>
              <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
            </button>
            <span className="date-picker__month">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button type="button" onClick={() => changeMonth(1)} aria-label={t('datePicker.nextMonth')}>
              <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="date-picker__weekdays">
            {DAYS_SHORT.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="date-picker__grid">
            {grid.map((day) => {
              const outsideMonth = day.getMonth() !== viewDate.getMonth();
              const disabled = phase === 'end' && startDate ? day < stripTime(startDate) : false;
              const isStart = startDate && isSameDay(day, startDate);
              const isEnd = phase !== 'end' && endDate && isSameDay(day, endDate);
              const isRangeEdge = phase === 'end' && rangeEnd && isSameDay(day, rangeEnd);
              const inRange =
                phase === 'end' &&
                startDate &&
                rangeEnd &&
                day > stripTime(startDate) &&
                day < stripTime(rangeEnd);
              const isToday = isSameDay(day, today);

              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  className={[
                    'date-picker__day',
                    outsideMonth && 'date-picker__day--outside',
                    inRange && 'date-picker__day--in-range',
                    (isStart || isEnd || isRangeEdge) && 'date-picker__day--selected',
                    isToday && !isStart && !isEnd && !isRangeEdge && 'date-picker__day--today',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  onMouseEnter={() => setHoverIso(dateToIso(day))}
                  aria-pressed={isStart || isEnd || isRangeEdge}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

DateRangePicker.propTypes = {
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  onChangeStart: PropTypes.func.isRequired,
  onChangeEnd: PropTypes.func.isRequired,
};

export default DateRangePicker;
