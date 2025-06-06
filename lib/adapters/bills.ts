import { BillDetail, BillList } from "@/app/(private)/(commercial)/purchases/bills/schemas/bills";
import { getBillStatus } from "@/app/(private)/(commercial)/purchases/bills/utils";

export function listBillsAdapter(data: BillList) {
  return {
    ...data,
    status: getBillStatus(data),
    number: data.sequence_id,
  }
}

export function getBillAdapter(data: BillDetail) {
  return {
    ...data,
    status: getBillStatus(data),
    number: data.sequence_id,
  }
}

export type AdaptedBillList = ReturnType<typeof listBillsAdapter>;
export type AdaptedBillDetail = ReturnType<typeof getBillAdapter>;
