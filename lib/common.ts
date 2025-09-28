import { format } from "date-fns"

export const formatDate = (dateStr: string, withTime = false) => {
  try {
    const date = new Date(dateStr)
    return format(date, withTime ? "dd/MM/yyyy 'à' HH:mm" : "dd/MM/yyyy")
  } catch {
    return "Date invalide"
  }
}
