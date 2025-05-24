import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";
import { generatePDF } from "@/lib/templates/utils";
import { Ellipsis, FileTextIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function Actions() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt } = useGetPurchaseReceiptQuery(id);

  const handleGeneratePDF = async () => {
    if (!purchaseReceipt) throw new Error("No se ha encontrado la recepción de compra")
    try {
      const pdf = await generatePDF({
        templateName: 'reception',
        data: purchaseReceipt,
      });
      pdf.view();
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
      console.error('Error al generar el PDF:', error);
    }
  };

  return (
    <Dropdown
      trigger={
        <Button size="icon" variant="outline" className="h-8 w-8">
          <Ellipsis />
        </Button>
      }
    >
      <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
        <FileTextIcon />
        Previsualizar
      </DropdownMenuItem>
    </Dropdown>
  )
}