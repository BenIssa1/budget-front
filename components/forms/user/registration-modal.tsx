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
import { UserRegistrationForm } from "./registration-form"

export function UserRegistrationModalForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un utilisateur</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         <UserRegistrationForm />
        </div>
        <DialogFooter>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
