interface UpdateStateMessageMap {
  [key: string]: {
    success: string;
    error: string;
  };
}

export const updateStateMessageMap: UpdateStateMessageMap = {
  purchase: {
    success: "Orden de compra confirmada",
    error: "Hubo un error al confirmar la orden de compra"
  },
  "to approve": {
    success: "Orden de compra enviada a aprobación",
    error: "Hubo un error al enviar la orden de compra a aprobación"
  },
  cancel: {
    success: "Orden de compra cancelada",
    error: "Hubo un error al cancelar la orden de compra"
  },
  draft: {
    success: "orden de compra reabierta",
    error: "No se pudo reabrir la orden de compra"
  }
};