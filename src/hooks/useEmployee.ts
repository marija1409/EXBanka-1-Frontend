import { useQuery } from '@tanstack/react-query'
import { getEmployee } from '@/lib/api/employees'

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployee(id),
    enabled: id > 0,
  })
}
