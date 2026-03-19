import type { LoanRequest } from '@/types/loan'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { LOAN_TYPES } from '@/lib/constants/banking'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Na čekanju',
  APPROVED: 'Odobren',
  REJECTED: 'Odbijen',
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
}

interface LoanRequestCardProps {
  request: LoanRequest
  onApprove: (id: number) => void
  onReject: (id: number) => void
  approving: boolean
  rejecting: boolean
}

export function LoanRequestCard({
  request,
  onApprove,
  onReject,
  approving,
  rejecting,
}: LoanRequestCardProps) {
  const loanTypeLabel =
    LOAN_TYPES.find((t) => t.value === request.loan_type)?.label ?? request.loan_type
  const isPending = request.status === 'PENDING'
  const isDisabled = approving || rejecting

  return (
    <tr>
      <td className="p-4">{loanTypeLabel}</td>
      <td className="p-4">{formatCurrency(request.amount, 'RSD')}</td>
      <td className="p-4">{request.period} mes.</td>
      <td className="p-4">{request.account_number}</td>
      <td className="p-4">{formatDate(request.created_at)}</td>
      <td className="p-4">
        <Badge variant={STATUS_VARIANT[request.status] ?? 'secondary'}>
          {STATUS_LABELS[request.status] ?? request.status}
        </Badge>
      </td>
      <td className="p-4">
        {isPending && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onApprove(request.id)} disabled={isDisabled}>
              Odobri
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(request.id)}
              disabled={isDisabled}
            >
              Odbij
            </Button>
          </div>
        )}
      </td>
    </tr>
  )
}
