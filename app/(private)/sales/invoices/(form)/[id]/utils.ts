interface UpdateStateMessageMap {
  [key: string]: {
    success: string;
    error: string;
  };
}

export const updateStateMessageMap: UpdateStateMessageMap = {
  purchase: {
    success: "Factura de venta confirmada",
    error: "Hubo un error al confirmar la factura de venta"
  },
  posted: {
    success: "Factura de venta confirmada",
    error: "Hubo un error al confirmar la factura de venta"
  },
  cancel: {
    success: "Factura de venta cancelada",
    error: "Hubo un error al cancelar la factura de venta"
  },
  draft: {
    success: "Factura de venta reabierta",
    error: "No se pudo reabrir la factura de venta"
  }
};