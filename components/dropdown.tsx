import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function Dropdown({
  children,
  trigger,
  contentClassName,
  align = "end",
  modal,
}: {
  contentClassName?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "center" | "end" | "start",
  modal?: boolean;
}) {
  return (
    <DropdownMenu modal={modal}>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={contentClassName}>
        <DropdownMenuGroup>
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}