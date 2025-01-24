import { ColumnConfig } from "@/app/medical-management/scheduler/appointment/[id]/page";
import { Fragment } from "react";
import { Control } from "react-hook-form";
import RenderField from "./render-field";

export default function RenderColumn({
  column,
  control,
}: {
  column: ColumnConfig;
  control: Control;
}) {
  if ("rows" in column) {
    const columnsCount = Math.max(column.rows.length, 2);
    return (
      <div
        data-type="row"
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
      >
        {column.rows.map((field) => (
          <RenderColumn key={field.label} column={field} control={control} />
        ))}
      </div>
    );
  } else if ("columns" in column) {
    const columnsCount = Math.max(column.columns.length, 2);
    return (
      <div
        data-type="column"
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
      >
        {column.columns.map((subColumn, index) => (
          <Fragment key={index}>
            <RenderColumn column={subColumn} control={control} />
          </Fragment>
        ))}
      </div>
    );
  } else {
    return <RenderField field={column} control={control} />;
  }
}
