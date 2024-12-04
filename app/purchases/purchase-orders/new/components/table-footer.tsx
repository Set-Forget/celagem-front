import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders";

export default function TableFooter() {
  const { control } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

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

  const total = subtotal

  return (
    <div>
      <div className="w-full flex justify-between bg-gray-50 text-sm font-medium h-9 items-center pr-5 pl-3 rounded-bl-sm rounded-br-sm">
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