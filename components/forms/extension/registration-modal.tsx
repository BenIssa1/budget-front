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
import { ExtensionRegistrationForm } from "./registration-form"

export function ExtensionRegistrationModalForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         <ExtensionRegistrationForm />
        </div>
        <DialogFooter>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
