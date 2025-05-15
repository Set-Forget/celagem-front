'use client';

import Header from '@/components/header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('tab-1');
  const [activeReport, setActiveReport] = useState(null);

  return (
    <>
      <Header title={'Reportes'}>
        <div className="flex justify-end gap-2 ml-auto"></div>
      </Header>

      <div className="grid grid-cols-1 gap-4 p-64 ">
        <Link
          className="hover:underline cursor-pointer"
          href="/accounting/reports/balance"
        >
          Balance general
        </Link>
        <Link
          className="hover:underline cursor-pointer"
          href="/accounting/reports/profit-and-loss"
        >
          Estado de resultados
        </Link>
        <Link
          className="hover:underline cursor-pointer"
          href="/accounting/reports/cashflow"
        >
          Flujo de efectivo
        </Link>
      </div>
    </>
  );
}
