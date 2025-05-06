interface UpdateStateMessageMap {
  [key: string]: {
    success: string;
    error: string;
  };
}

export const updateStateMessageMap: UpdateStateMessageMap = {
  approved: {
    success: "Solicitud de pedido confirmada",
    error: "Hubo un error al confirmar la solicitud de pedido"
  },
  cancelled: {
    success: "Solicitud de pedido cancelada",
    error: "Hubo un error al cancelar la solicitud de pedido"
  },
  draft: {
    success: "Solicitud de pedido reabierta",
    error: "No se pudo reabrir la solicitud de pedido"
  }
};