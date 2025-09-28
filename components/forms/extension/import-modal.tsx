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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function ExtensionImportModalForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mx-2" >Importer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importer le fichier</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form action="">
            <div className="w-full mb-3">
              <Input id="picture" type="file" className="col-span-3" />
            </div>
          </form>
        </div>
        <DialogFooter>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
