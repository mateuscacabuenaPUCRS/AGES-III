import { AxiosError } from "axios";

export function handleAxiosError(error: unknown) {
  if (error instanceof AxiosError) {
    const errorMessage = error.response?.data.message;
    return {
      isSuccess: false,
      errorMessage,
    };
  }
  return {
    isSuccess: false,
    errorMessage: "Por favor, tente novamente mais tarde",
  };
}
