import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Search, Tag } from "lucide-react";

const filtersConfig: Record<string, FilterConfig> = {
  status: {
    type: "multiple",
    options: [
      { label: "Particular", value: "particular" },
      { label: "Cotizante", value: "cotizante" },
      { label: "Beneficiario", value: "beneficiario" },
      { label: "Subsidiado", value: "subsidiado" },
      { label: "Adicional", value: "adicional" },],
    label: "Tipo de usuario",
    key: "user_type",
    icon: Tag
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Número de documento", value: "id_number" },
      { label: "Nombre", value: "name" },
    ],
    key: "search",
    icon: Search
  },
};

export default function Toolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <FilterSelector filtersConfig={filtersConfig} />
      </div>
    </div>
  )
}