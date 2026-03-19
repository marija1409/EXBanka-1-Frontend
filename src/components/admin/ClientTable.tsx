import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Client } from '@/types/client'

interface ClientTableProps {
  clients: Client[]
  onEdit: (clientId: number) => void
}

export function ClientTable({ clients, onEdit }: ClientTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ime</TableHead>
          <TableHead>Prezime</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Akcije</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.first_name}</TableCell>
            <TableCell>{client.last_name}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.phone ?? '—'}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline" onClick={() => onEdit(client.id)}>
                Izmeni
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {clients.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Nema klijenata.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
