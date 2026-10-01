export type RentStatusKind = 'PAID' | 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE';

export type RentStatus = {
  kind: RentStatusKind;
  label: string;
  dueDate: Date;
  daysUntilDue: number;
  daysOverdue: number;
};

const dayMs = 86_400_000;
export function monthKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; }
export function dueDateFor(month: Date, dueDay: number) { return new Date(month.getFullYear(), month.getMonth(), Math.min(28, Math.max(1, dueDay)), 12); }
function dateOnly(date: Date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); }

export function getRentStatus(input: { month: Date; dueDay: number; gracePeriodDays: number; paid: boolean; now?: Date }): RentStatus {
  const now = dateOnly(input.now ?? new Date());
  const dueDate = dueDateFor(input.month, input.dueDay);
  const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / dayMs);
  const daysOverdue = Math.max(0, Math.floor((now.getTime() - dueDate.getTime()) / dayMs) - input.gracePeriodDays);
  if (input.paid) return { kind: 'PAID', label: 'Paid', dueDate, daysUntilDue, daysOverdue: 0 };
  if (daysUntilDue === 0) return { kind: 'DUE_TODAY', label: 'Due today', dueDate, daysUntilDue, daysOverdue: 0 };
  if (daysOverdue > 0) return { kind: 'OVERDUE', label: `${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue`, dueDate, daysUntilDue, daysOverdue };
  return { kind: 'UPCOMING', label: daysUntilDue > 0 ? `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}` : 'In grace period', dueDate, daysUntilDue, daysOverdue: 0 };
}

export function rentStatusTone(kind: RentStatusKind) {
  return kind === 'PAID' ? 'green' : kind === 'OVERDUE' ? 'red' : kind === 'DUE_TODAY' ? 'amber' : 'blue';
}
