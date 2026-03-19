import { useLoanRequests, useApproveLoanRequest, useRejectLoanRequest } from '@/hooks/useLoans'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoanRequestCard } from '@/components/loans/LoanRequestCard'

export function AdminLoanRequestsPage() {
  const { data, isLoading } = useLoanRequests({ page: 1, page_size: 50 })
  const approve = useApproveLoanRequest()
  const reject = useRejectLoanRequest()
  const requests = data?.requests ?? []

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Zahtevi za kredite</h1>

      {isLoading ? (
        <p>Učitavanje...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tip</TableHead>
              <TableHead>Iznos</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Broj računa</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <LoanRequestCard
                key={req.id}
                request={req}
                onApprove={(id) => approve.mutate(id)}
                onReject={(id) => reject.mutate(id)}
                approving={approve.isPending}
                rejecting={reject.isPending}
              />
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nema zahteva.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
