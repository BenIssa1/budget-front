import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BudgetRegistrationForm } from "./registration-form"

export function BudgetRegistrationModalForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un budget</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un budget</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         <BudgetRegistrationForm />
        </div>
        <DialogFooter>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
