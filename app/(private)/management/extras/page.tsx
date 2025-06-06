'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProfileQuery } from '@/lib/services/auth';
import { useCreatePatientMutation } from '@/lib/services/patients';
import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { Building, House, Shield, Users, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('tab-1');
  const [activeReport, setActiveReport] = useState(null);

  return (
    <>
      <Header title={'Reportes'}>
        <div className="flex justify-end gap-2 ml-auto"></div>
      </Header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-64 ">
        <Link
          className="hover:underline cursor-pointer"
          href="/accounting/extras/currencies"
        >
          Monedas
        </Link>
        <Link
          className="hover:underline cursor-pointer"
          href="/accounting/extras/taxes"
        >
          Impuestos
        </Link>
        <Link
          className="hover:underline cursor-pointer"
          href="/accounting/extras/payment-terms"
        >
          Términos de pago
        </Link>
        <Link
          className="hover:underline cursor-pointer"
          href="/accounting/extras/installment-plans"
        >
          Métodos de pago
        </Link>
      </div>
    </>
  );
}
