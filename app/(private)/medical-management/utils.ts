import DateField from "./elements/date-field";
import DatetimeField from "./elements/datetime-field";
import FileField from "./elements/file-field";
import ImcField from "./elements/imc-field";
import MultiSelectField from "./elements/multi-select-field";
import NumberField from "./elements/number-field";
import SelectField from "./elements/select-field";
import TextField from "./elements/text-field";
import TextAreaField from "./elements/textarea-field";
import TimeField from "./elements/time-field";

export const templateFields = {
  'textarea': TextAreaField,
  'text': TextField,
  'number': NumberField,
  'select': SelectField,
  'multiselect': MultiSelectField,
  'file': FileField,
  'time': TimeField,
  'date': DateField,
  'datetime': DatetimeField,
  'imc': ImcField
}