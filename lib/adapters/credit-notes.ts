import { CreditNoteDetail } from "@/app/(private)/(commercial)/[scope]/credit-notes/schemas/credit-notes";

export function getCreditNoteAdapter(data: CreditNoteDetail) {
  return {
    ...data,
    number: data.sequence_id,
  }
}

export type AdaptedCreditNoteDetail = ReturnType<typeof getCreditNoteAdapter>;
