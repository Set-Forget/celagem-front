import { CreditNoteDetail } from "@/app/(private)/(commercial)/[scope]/credit-notes/schemas/credit-notes";
import { getCreditNoteStatus } from "@/app/(private)/(commercial)/[scope]/credit-notes/utils";

export function getCreditNoteAdapter(data: CreditNoteDetail) {
  return {
    ...data,
    status: getCreditNoteStatus(data),
    number: data.sequence_id,
  }
}

export type AdaptedCreditNoteDetail = ReturnType<typeof getCreditNoteAdapter>;
