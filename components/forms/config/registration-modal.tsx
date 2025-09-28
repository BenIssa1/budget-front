import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfigRegistrationForm } from "./registration-form"

export function ConfigRegistrationModalForm() {
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
         <ConfigRegistrationForm />
        </div>
        <DialogFooter>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
