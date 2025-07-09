type JsonResponseStatus = "success" | "error";

interface JsonResponse {
  status: JsonResponseStatus;
  code: number;
  message: string;
  data?: unknown;
}

export const jsonResponse = (
  status: JsonResponseStatus,
  code: number,
  message: string,
  data: unknown = null
): JsonResponse => {
  return {
    status,
    code,
    message,
    ...(data !== null && { data }),
  };
};
