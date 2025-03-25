interface UpdateStateMessageMap {
  [key: string]: {
    success: string;
    error: string;
  };
}

export const updateStateMessageMap: UpdateStateMessageMap = {
  purchase: {
    success: "Factura de compra confirmada",
    error: "Hubo un error al confirmar la factura de compra"
  },
  "to approve": {
    success: "Factura de compra enviada a aprobación",
    error: "Hubo un error al enviar la factura de compra a aprobación"
  },
  cancel: {
    success: "Factura de compra cancelada",
    error: "Hubo un error al cancelar la factura de compra"
  },
  draft: {
    success: "Factura de compra reabierta",
    error: "No se pudo reabrir la factura de compra"
  }
};