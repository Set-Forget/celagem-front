import { Taxes } from '../schema/taxes.js';

export const taxesMock: Taxes[] = [
  {
    id: '1',
    name: 'IVA 21%',
    amount: 21,
    tax_group: 'Venta',
    active: true,
  },
  {
    id: '2',
    name: 'IVA 10.5%',
    amount: 10.5,
    tax_group: 'Venta',
    active: true,
  },
  {
    id: '3',
    name: 'Exento',
    amount: 0,
    tax_group: 'Venta',
    active: true,
  },
  {
    id: '4',
    name: 'IVA 21%',
    amount: 21,
    tax_group: 'Compra',
    active: true,
  },
  {
    id: '5',
    name: 'IVA 10.5%',
    amount: 10.5,
    tax_group: 'Compra',
    active: true,
  },
  {
    id: '6',
    name: 'Exento',
    amount: 0,
    tax_group: 'Compra',
    active: true,
  },
  {
    id: '7',
    name: 'IVA 21%',
    amount: 21,
    tax_group: 'Venta',
    active: true,
  },
  {
    id: '8',
    name: 'IVA 10.5%',
    amount: 10.5,
    tax_group: 'Venta',
    active: true,
  },
  {
    id: '9',
    name: 'Exento',
    amount: 0,
    tax_group: 'Venta',
    active: true,
  },
];
