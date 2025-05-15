import { AccountType } from "../schemas/account-types";

export const AccountTypes: AccountType[] = [
  {
    name: 'Por cobrar',
    report: 'Balance general',
    category: 'Activos',
  },
  {
    name: 'Banco y efectivo',
    report: 'Balance general',
    category: 'Activos',
  },
  {
    name: 'Activos corrientes',
    report: 'Balance general',
    category: 'Activos',
  },
  {
    name: 'Activos no corrientes',
    report: 'Balance general',
    category: 'Activos',
  },
  {
    name: 'Prepagos',
    report: 'Balance general',
    category: 'Activos',
  },
  {
    name: 'Activos fijos',
    report: 'Balance general',
    category: 'Activos',
  },
  {
    name: 'Por pagar',
    report: 'Balance general',
    category: 'Pasivos',
  },
  {
    name: 'Tarjeta de crédito',
    report: 'Balance general',
    category: 'Pasivos',
  },
  {
    name: 'Pasivos corrientes',
    report: 'Balance general',
    category: 'Pasivos',
  },
  {
    name: 'Pasivos no corrientes',
    report: 'Balance general',
    category: 'Pasivos',
  },
  {
    name: 'Capital',
    report: 'Balance general',
    category: 'Capital',
  },
  {
    name: 'Ganancias del año actual',
    report: 'Balance general',
    category: 'Capital',
  },
  {
    name: 'Ingreso',
    report: 'Pérdidas y ganancias',
    category: 'Ingreso',
  },
  {
    name: 'Otros ingresos',
    report: 'Pérdidas y ganancias',
    category: 'Ingreso',
  },
  {
    name: 'Gasto',
    report: 'Pérdidas y ganancias',
    category: 'Gasto',
  },
  {
    name: 'Depreciación',
    report: 'Pérdidas y ganancias',
    category: 'Gasto',
  },
  {
    name: 'Coste de ingresos',
    report: 'Pérdidas y ganancias',
    category: 'Gasto',
  },
  {
    name: 'Fuera del balance general',
    report: 'Otro',
    category: 'Otro',
  },
];