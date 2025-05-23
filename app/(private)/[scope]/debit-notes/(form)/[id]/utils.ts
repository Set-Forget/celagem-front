interface UpdateStateMessageMap {
  [key: string]: {
    success: string;
    error: string;
  };
}

export const updateStateMessageMap: UpdateStateMessageMap = {
  purchase: {
    success: "Nota de débito confirmada",
    error: "Hubo un error al confirmar la nota de débito"
  },
  posted: {
    success: "Nota de débito confirmada",
    error: "Hubo un error al confirmar la nota de débito"
  },
  cancel: {
    success: "Nota de débito cancelada",
    error: "Hubo un error al cancelar la nota de débito"
  },
  draft: {
    success: "Nota de débito reabierta",
    error: "No se pudo reabrir la nota de débito"
  }
};