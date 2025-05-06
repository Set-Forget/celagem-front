interface UpdateStateMessageMap {
  [key: string]: {
    success: string;
    error: string;
  };
}

export const updateStateMessageMap: UpdateStateMessageMap = {
  purchase: {
    success: "Nota de crédito confirmada",
    error: "Hubo un error al confirmar la nota de crédito"
  },
  posted: {
    success: "Nota de crédito confirmada",
    error: "Hubo un error al confirmar la nota de crédito"
  },
  cancel: {
    success: "Nota de crédito cancelada",
    error: "Hubo un error al cancelar la nota de crédito"
  },
  draft: {
    success: "Nota de crédito reabierta",
    error: "No se pudo reabrir la nota de crédito"
  }
};