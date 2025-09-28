import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function ExtensionRegistrationForm() {
  return (
    <form action="">
     {/*  <div className="grid grid-cols-4 items-center gap-4 mb-3">
        <Label htmlFor="label" className="text-right">
          Nom complet
        </Label>
        <Input id="picture" type="file" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4 mb-3">
        <Label htmlFor="description" className="text-right">
          Numéro interne
        </Label>
        <Input id="description" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4 mb-3">
        <Label htmlFor="description" className="text-right">
          Email
        </Label>
        <Input id="description" className="col-span-3" />
      </div> */}
      <div className="grid grid-cols-4 items-center gap-4 mb-3">
        <Label htmlFor="description" className="text-right">
          Service
        </Label>

        <div className="col-span-3">
          <Select >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner le service" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Services</SelectLabel>
                <SelectItem value="apple">Support IT</SelectItem>
                <SelectItem value="banana">Comptable</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4 mb-3">
        <Label htmlFor="description" className="text-right">
          Budget
        </Label>

        <div className="col-span-3">
          <Select >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner le budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Services</SelectLabel>
                <SelectItem value="apple">10.000 FCFA</SelectItem>
                <SelectItem value="banana">15.000 FCFA</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  )
}