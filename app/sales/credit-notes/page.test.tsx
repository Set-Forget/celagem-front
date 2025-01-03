import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import CreditNotesPage from "./page";
import { SidebarProvider } from "@/components/ui/sidebar";

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/credit-notes'),
}));

test("Show the correct header title", () => {
  render(
    <SidebarProvider>
      <CreditNotesPage />
    </SidebarProvider>
  );
  expect(screen.getByText("Notas de crédito")).toBeDefined();
});

test("Show the correct columns", () => {
  render(
    <SidebarProvider>
      <CreditNotesPage />
    </SidebarProvider>
  );
  screen.debug();

  expect(screen.getAllByRole('columnheader', { name: "Número" })).toBeDefined();
  expect(screen.getAllByRole('columnheader', { name: "Proveedor" })).toBeDefined();
  expect(screen.getAllByRole('columnheader', { name: "Fecha de emisión" })).toBeDefined();
  expect(screen.getAllByRole('columnheader', { name: "Importe" })).toBeDefined();
});