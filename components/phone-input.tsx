import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, Phone } from "lucide-react";
import React, { forwardRef } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

export const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn("-ms-px rounded-s-none shadow-none focus-visible:z-10", className)}
        ref={ref}
        {...props}
      />
    );
  },
);
PhoneInput.displayName = "PhoneInput";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
  className?: string;
};

export const CountrySelect = forwardRef<HTMLSelectElement, CountrySelectProps>(
  ({ disabled, value, onChange, options, className }, ref) => {
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value as RPNInput.Country);
    };

    return (
      <div
        className={cn(
          "relative inline-flex items-center self-stretch rounded-s-md border border-input bg-background py-2 pe-2 ps-3 text-muted-foreground transition-shadow focus-within:z-10 focus-within:border-ring/50 focus-within:outline-none hover:bg-accent hover:text-foreground",
          className
        )}
      >
        <div className="inline-flex items-center gap-1" aria-hidden="true">
          <FlagComponent country={value} countryName={value} aria-hidden="true" />
          <span className="text-muted-foreground/80">
            <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        </div>
        <select
          ref={ref}
          disabled={disabled}
          value={value}
          onChange={handleSelect}
          className="absolute inset-0 text-sm opacity-0"
          aria-label="Select country"
        >
          <option key="default" value="">
            Seleccione un país
          </option>
          {options
            .filter((x) => x.value)
            .map((option, i) => (
              <option key={option.value ?? `empty-${i}`} value={option.value}>
                {option.label}{" "}
                {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
              </option>
            ))}
        </select>
      </div>
    );
  }
);

CountrySelect.displayName = "CountrySelect";

export const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? <Flag title={countryName} /> : <Phone size={16} aria-hidden="true" />}
    </span>
  );
};