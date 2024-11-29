import { useFormContext, useWatch } from "react-hook-form"
import { newInvoiceSchema } from "../schemas/invoices"
import { z } from "zod"

export default function TableFooter() {
  const { control } = useFormContext<z.infer<typeof newInvoiceSchema>>()

  const currency = useWatch({
    control: control,
    name: "currency"
  })

  const items = useWatch({
    control,
    name: `items`,
  });

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price))
  }, 0)

  const taxes = items.reduce((acc, item) => {
    return acc + (item.quantity * Number(item.price) * (Number(item.tax) / 100))
  }, 0)

  const total = subtotal + taxes

  return (
    <div>
      <div className="w-full flex justify-between text-xs font-medium h-6 items-center pr-5 pl-3 rounded-bl-sm rounded-br-sm border-t">
        <span>Subtotal</span>
        <div>
          {currency}{" "}
          <span>
            {subtotal.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-between text-xs font-medium h-6 items-center pr-5 pl-3 rounded-bl-sm rounded-br-sm border-t">
        <span>Impuestos</span>
        <div>
          {currency}{" "}
          <span>
            {taxes.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-between bg-gray-50 text-sm font-medium h-9 items-center pr-5 pl-3 rounded-bl-sm rounded-br-sm border-t">
        <span>Total</span>
        <div>
          {currency}{" "}
          <span>
            {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}