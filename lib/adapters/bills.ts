import { BillDetail, BillList } from "@/app/(private)/purchases/bills/schemas/bills";
import { getBillStatus } from "@/app/(private)/purchases/bills/utils";

export function listBillsAdapter(data: BillList) {
  return {
    ...data,
    status: getBillStatus(data),
  }
}

export function getBillAdapter(data: BillDetail) {
  return {
    ...data,
    status: getBillStatus(data),
  }
}

export type AdaptedBillList = ReturnType<typeof listBillsAdapter>;
export type AdaptedBillDetail = ReturnType<typeof getBillAdapter>;
