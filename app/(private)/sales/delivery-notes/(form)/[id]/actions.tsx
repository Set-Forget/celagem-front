import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useGetDeliveryQuery } from "@/lib/services/deliveries";
import { generatePDF } from "@/lib/templates/utils.client";
import { Ellipsis, FileTextIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function Actions() {
  const { id } = useParams<{ id: string }>();

  const { data: deliveryNote } = useGetDeliveryQuery(id, { skip: !id });

  const handleGeneratePDF = async () => {
    if (!deliveryNote) throw Error("No se ha encontrado la nota de entrega")
    try {
      const pdf = await generatePDF({
        templateName: 'deliveryNote',
        data: deliveryNote,
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
      <DropdownMenuItem onClick={handleGeneratePDF}>
        <FileTextIcon />
        Previsualizar
      </DropdownMenuItem>
    </Dropdown>
  )
}