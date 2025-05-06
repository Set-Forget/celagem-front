interface UpdateStateMessageMap {
  [key: string]: {
    success: string;
    error: string;
  };
}

export const updateStateMessageMap: UpdateStateMessageMap = {
  posted: {
    success: "Asiento confirmado correctamente",
    error: "Hubo un error al confirmar el asiento",
  },
};