import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PricingFreeRegistrationForm() {
  return (
    <form action="">
      <div className="grid grid-cols-4 items-center gap-4 mb-3">
        <Label htmlFor="label" className="text-right">
          Numéro
        </Label>
        <Input id="label" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Input id="description" className="col-span-3" />
      </div>
    </form>
  )
}