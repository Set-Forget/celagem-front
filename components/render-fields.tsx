import { cn, FieldDefinition, placeholder } from "@/lib/utils";

export default function RenderFields<T>({
  fields,
  loading,
  data,
  className,
}: {
  fields: FieldDefinition<T>[];
  loading?: boolean;
  data?: T;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {fields
        .filter((f) => (f.show ? f.show(data!) : true))
        .map((field) => {
          const itemClass =
            typeof field.className === "function"
              ? field.className(data!)
              : field.className;

          const label =
            typeof field.label === "function"
              ? field.label(data!)
              : field.label;

          const content = loading
            ? field.placeholder ?? placeholder(field.placeholderLength ?? 8)
            : field.render(data!);

          return (
            <div key={field.label.toString()} className={cn("flex flex-col gap-1", itemClass)}>
              <label className="text-muted-foreground text-sm">{label}</label>

              <span
                className={cn(
                  "text-sm transition-all duration-300",
                  loading && "blur-[4px]"
                )}
              >
                {content}
              </span>
            </div>
          );
        })}
    </div>
  );
}
