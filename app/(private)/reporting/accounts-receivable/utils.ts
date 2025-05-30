import { AccountsReceivableList } from "./schemas/accounts-receivable";

export function groupByCustomer(accounts?: AccountsReceivableList[]): AccountsReceivableList[] {
  const groups: { [customer: string]: AccountsReceivableList[] } = {};
  accounts?.forEach((item) => {
    const customer = item.customer;
    if (!groups[customer]) {
      groups[customer] = [];
    }
    groups[customer].push(item);
  });

  const result: AccountsReceivableList[] = [];
  Object.keys(groups).forEach((customer) => {
    const items = groups[customer];

    items.forEach((item) => result.push(item));

    const totalInvoiced = items.reduce((sum, item) => sum + Number(item.invoiced_amount), 0);
    const totalPaid = items.reduce((sum, item) => sum + Number(item.paid_amount), 0);
    const totalOutstanding = items.reduce((sum, item) => sum + Number(item.outstanding_amount), 0);
    const total30Days = items.reduce((sum, item) => sum + Number(item["30_days"]), 0);
    const total60Days = items.reduce((sum, item) => sum + Number(item["60_days"]), 0);
    const total90Days = items.reduce((sum, item) => sum + Number(item["90_days"]), 0);
    const total120Days = items.reduce((sum, item) => sum + Number(item["120_days"]), 0);
    const total120PlusDays = items.reduce((sum, item) => sum + Number(item["120+_days"]), 0);

    const totalRow: AccountsReceivableList = {
      id: -1,
      date: "",
      customer,
      accounting_account: "",
      costs_center: "",
      voucher_type: "",
      voucher_number: "",
      due_date: "",
      invoiced_amount: parseFloat(totalInvoiced.toFixed(2)),
      paid_amount: parseFloat(totalPaid.toFixed(2)),
      outstanding_amount: parseFloat(totalOutstanding.toFixed(2)),
      currency: items[0].currency,
      "30_days": parseFloat(total30Days.toFixed(2)),
      "60_days": parseFloat(total60Days.toFixed(2)),
      "90_days": parseFloat(total90Days.toFixed(2)),
      "120_days": parseFloat(total120Days.toFixed(2)),
      "120+_days": parseFloat(total120PlusDays.toFixed(2)),
    };

    result.push(totalRow);

    const emptyRow: AccountsReceivableList = {
      id: -2,
      date: "",
      customer: "",
      accounting_account: "",
      costs_center: "",
      voucher_type: "",
      voucher_number: "",
      due_date: "",
      invoiced_amount: null,
      paid_amount: null,
      outstanding_amount: null,
      currency: "",
      "30_days": null,
      "60_days": null,
      "90_days": null,
      "120_days": null,
      "120+_days": null,
    };

    result.push(emptyRow);
  });

  return result;
}