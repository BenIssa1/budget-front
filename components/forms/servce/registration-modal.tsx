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
import { ServiceRegistrationForm } from "./registration-form"

export function ServiceRegistrationModalForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un service</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         <ServiceRegistrationForm />
        </div>
        <DialogFooter>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
