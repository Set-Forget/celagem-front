import { DebitNoteDetail } from "@/app/(private)/(commercial)/[scope]/debit-notes/schemas/debit-notes";
import { getDebitNoteStatus } from "@/app/(private)/(commercial)/[scope]/debit-notes/utils";

export function getDebitNoteAdapter(data: DebitNoteDetail) {
  return {
    ...data,
    status: getDebitNoteStatus(data),
  }
}

export type AdaptedDebitNoteDetail = ReturnType<typeof getDebitNoteAdapter>;
