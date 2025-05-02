import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  NumberField as AriaNumberField,
  Group,
  Label as AriaLabel,
} from "react-aria-components";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { Field } from "../(masters)/schemas/templates";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";

const buildImcSchema = (required: boolean) => {
  const num = required
    ? z.number({
      invalid_type_error: "Campo requerido",
      required_error: "Campo requerido",
    })
    : z.number().optional();

  return z
    .object({
      height: num,
      weight: num,
      imc: z.number().optional(),
    })
    .superRefine((val, ctx) => {
      if (!required && (val.height || val.weight)) {
        if (!val.height) ctx.addIssue({ path: ["height"], code: "custom", message: "Campo requerido" });
        if (!val.weight) ctx.addIssue({ path: ["weight"], code: "custom", message: "Campo requerido" });
      }
    });
}

export default function ImcField({ field }: {
  field: Field;
}) {
  const { setValue, control } = useFormContext();

  const imcSchema = useMemo(
    () => buildImcSchema(field.is_required),
    [field.is_required],
  );

  const form = useForm<z.infer<typeof imcSchema>>({
    resolver: zodResolver(imcSchema),
    defaultValues: {
      height: undefined,
      weight: undefined,
    },
  });

  const height = useWatch({ control: form.control, name: "height" });
  const weight = useWatch({ control: form.control, name: "weight" });
  const imc = height && weight ? (weight / (height / 100) ** 2).toFixed(2) : "";

  const imcState = useWatch({ control, name: field.code })

  const onSubmit = (data: z.infer<typeof imcSchema>) => {
    setValue(field.code, {
      height: data.height,
      weight: data.weight,
      imc: imc || undefined
    }, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    if (imc) {
      form.handleSubmit(onSubmit)();
    }
  }, [imc]);

  useEffect(() => {
    if (imcState && (!height && !weight)) {
      form.reset({
        height: imcState.height,
        weight: imcState.weight,
      });
    }
  }, [imcState])

  return (
    <Form {...form}>
      <div className="grid grid-cols-3 gap-2 w-full">
        <FormField
          control={form.control}
          name="height"
          render={({ field: formField }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel
                className={cn(
                  !field.is_required && "font-normal text-accent-foreground/75",
                  field.type.primitive_type === "title" && "font-semibold py-1"
                )}
              >
                Altura (cm)
              </FormLabel>
              <FormControl>
                <AriaNumberField
                  {...formField}
                  className="w-full"
                  value={typeof formField?.value === "number" ? formField?.value : NaN}
                >
                  <AriaLabel className="sr-only">
                    {field?.title}
                  </AriaLabel>
                  <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 data-[focus-within]:outline outline-1">
                    <AriaButton
                      slot="decrement"
                      className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-sm border border-input bg-background text-sm text-muted-foreground/50 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Minus size={16} strokeWidth={2} aria-hidden="true" />
                    </AriaButton>
                    <AriaInput className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus-visible:outline-none" />
                    <AriaButton
                      slot="increment"
                      className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-sm border border-input bg-background text-sm text-muted-foreground/50 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={16} strokeWidth={2} aria-hidden="true" />
                    </AriaButton>
                  </Group>
                </AriaNumberField>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field: formField }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel
                className={cn(
                  !field.is_required && "font-normal text-accent-foreground/75",
                  field.type.primitive_type === "title" && "font-semibold py-1"
                )}
              >
                Peso (kg)
              </FormLabel>
              <FormControl>
                <AriaNumberField
                  {...formField}
                  className="w-full"
                  value={typeof formField?.value === "number" ? formField?.value : NaN}
                >
                  <AriaLabel className="sr-only">
                    {field?.title}
                  </AriaLabel>
                  <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 data-[focus-within]:outline outline-1">
                    <AriaButton
                      slot="decrement"
                      className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-sm border border-input bg-background text-sm text-muted-foreground/50 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Minus size={16} strokeWidth={2} aria-hidden="true" />
                    </AriaButton>
                    <AriaInput className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus-visible:outline-none" />
                    <AriaButton
                      slot="increment"
                      className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-sm border border-input bg-background text-sm text-muted-foreground/50 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={16} strokeWidth={2} aria-hidden="true" />
                    </AriaButton>
                  </Group>
                </AriaNumberField>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-full gap-2">
          <Label
            className={cn(
              !field.is_required && "font-normal text-accent-foreground/75",
              field.type.primitive_type === "title" && "font-semibold py-1"
            )}
          >
            IMC
          </Label>
          <Input
            type="number"
            className="w-full"
            value={imc}
            readOnly
          />
        </div>
      </div>
    </Form>
  )
}