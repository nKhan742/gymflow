import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface DatePickerProps {
  value?: string; // Format: 'YYYY-MM-DD'
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
  className?: string;
  showPresets?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a date...',
  label,
  disabled = false,
  minYear = 1940,
  maxYear = 2035,
  className,
  showPresets = true,
}) => {
  const [open, setOpen] = useState(false);

  // Parse initial selected date
  const parsedDate = value ? new Date(value) : null;
  const validDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

  const [currentYear, setCurrentYear] = useState<number>(
    validDate ? validDate.getFullYear() : new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    validDate ? validDate.getMonth() : new Date().getMonth()
  );

  useEffect(() => {
    if (validDate) {
      setCurrentYear(validDate.getFullYear());
      setCurrentMonth(validDate.getMonth());
    }
  }, [value]);

  // Compute days in current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formatted = `${currentYear}-${monthStr}-${dayStr}`;
    onChange?.(formatted);
    setOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    const formatted = today.toISOString().slice(0, 10);
    onChange?.(formatted);
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  const formattedDisplay = validDate
    ? validDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Generate Year Options
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth &&
    today.getFullYear() === currentYear;

  const isSelected = (day: number) =>
    validDate &&
    validDate.getDate() === day &&
    validDate.getMonth() === currentMonth &&
    validDate.getFullYear() === currentYear;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <label className="text-xs font-semibold text-foreground block">{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground shadow-xs ring-offset-background transition-all duration-150 group hover:border-border/80 hover:bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-left',
              !formattedDisplay && 'text-muted-foreground'
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="h-3.5 w-3.5 text-primary shrink-0 opacity-80 group-hover:opacity-100" />
              <span className="truncate">{formattedDisplay || placeholder}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {formattedDisplay && (
                <span
                  onClick={handleClear}
                  className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Clear date"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] p-3 space-y-3" align="start">
          {/* Header with Month & Year Selectors */}
          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="h-7 w-7 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="h-7 text-xs font-semibold bg-transparent text-foreground border-none rounded-md px-1 focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx} className="bg-popover text-foreground">
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="h-7 text-xs font-semibold bg-transparent text-foreground border-none rounded-md px-1 focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted font-mono"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-popover text-foreground">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="h-7 w-7 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-xs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-[10px] font-bold text-muted-foreground/80 uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous Month Fill Days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div
                key={`prev-${i}`}
                className="h-7 flex items-center justify-center text-[11px] text-muted-foreground/30 font-mono select-none"
              >
                {daysInPrevMonth - firstDayOfMonth + i + 1}
              </div>
            ))}

            {/* Current Month Active Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              const todayDay = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'h-7 w-7 mx-auto rounded-lg text-xs font-medium font-mono flex items-center justify-center transition-all duration-150',
                    selected
                      ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/25 scale-105'
                      : todayDay
                      ? 'bg-primary/15 text-primary font-bold border border-primary/40 hover:bg-primary/25'
                      : 'text-foreground hover:bg-muted/80 hover:text-foreground'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Presets & Quick Actions Footer */}
          {showPresets && (
            <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSetToday}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                <span>Today</span>
              </button>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

