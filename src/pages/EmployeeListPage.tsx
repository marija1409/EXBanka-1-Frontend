import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmployeeTable } from '@/components/employees/EmployeeTable'
import { EmployeeFilters } from '@/components/employees/EmployeeFilters'
import { useEmployees } from '@/hooks/useEmployees'
import { useEmployee } from '@/hooks/useEmployee'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectCurrentUser } from '@/store/selectors/authSelectors'
import type { EmployeeFilters as Filters } from '@/types/employee'

function MeTab() {
  const currentUser = useAppSelector(selectCurrentUser)
  const { data: employee, isLoading } = useEmployee(currentUser?.id ?? 0)

  if (!currentUser) return <p className="text-muted-foreground">Not logged in.</p>
  if (isLoading) return <p>Loading...</p>
  if (!employee) return <p className="text-muted-foreground">Could not load your profile.</p>

  const formatDate = (ts: number) => {
    if (!ts) return '—'
    return new Date(ts * 1000).toLocaleDateString()
  }

  const rows: { label: string; value: string | boolean | undefined }[] = [
    { label: 'First Name', value: employee.first_name },
    { label: 'Last Name', value: employee.last_name },
    { label: 'Email', value: employee.email },
    { label: 'Username', value: employee.username },
    { label: 'Date of Birth', value: formatDate(employee.date_of_birth) },
    { label: 'Gender', value: employee.gender },
    { label: 'Phone', value: employee.phone },
    { label: 'Address', value: employee.address },
    { label: 'Position', value: employee.position },
    { label: 'Department', value: employee.department },
    { label: 'Role', value: employee.role },
    { label: 'Status', value: employee.active ? 'Active' : 'Inactive' },
    { label: 'JMBG', value: employee.jmbg },
  ]

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-semibold mb-4">My Profile</h2>
      <dl className="divide-y divide-border rounded-lg border overflow-hidden">
        {rows.map(({ label, value }) =>
          value !== undefined && value !== '' && value !== null ? (
            <div key={label} className="flex px-4 py-2.5 gap-4">
              <dt className="w-36 shrink-0 text-sm text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium">{String(value)}</dd>
            </div>
          ) : null
        )}
      </dl>
    </div>
  )
}

export function EmployeeListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>({ page: 1, page_size: 20 })
  const { data, isLoading } = useEmployees(filters)

  const handleFilter = (newFilters: Filters) => {
    setFilters({ ...newFilters, page: 1, page_size: 20 })
  }

  const handleRowClick = (id: number) => {
    navigate(`/employees/${id}`)
  }

  const totalPages = Math.ceil((data?.total_count ?? 0) / (filters.page_size ?? 20))
  const currentPage = filters.page ?? 1

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Link
          to="/employees/new"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Create Employee
        </Link>
      </div>

      <Tabs defaultValue="employees">
        <TabsList className="mb-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="me">Me</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <EmployeeFilters onFilter={handleFilter} />

          {isLoading ? (
            <p>Loading...</p>
          ) : data?.employees.length ? (
            <>
              <EmployeeTable employees={data.employees} onRowClick={handleRowClick} />
              <p className="text-sm text-muted-foreground mt-2">Total: {data.total_count}</p>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setFilters({ ...filters, page: currentPage - 1 })}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setFilters({ ...filters, page: currentPage + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p>No employees found.</p>
          )}
        </TabsContent>

        <TabsContent value="me">
          <MeTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
