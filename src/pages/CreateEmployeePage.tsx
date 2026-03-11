import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { createEmployee } from '@/lib/api/employees'
import type { CreateEmployeeRequest } from '@/types/employee'

export function CreateEmployeePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeRequest) => createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/employees')
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Employee</h1>
      <EmployeeForm
        onSubmit={(data) => mutation.mutate(data as CreateEmployeeRequest)}
        isLoading={mutation.isPending}
      />
      {mutation.isError && <p className="text-destructive mt-2">Failed to create employee.</p>}
    </div>
  )
}
