import { NextResponse } from "next/server";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

type ApiHandler = (
  request: Request,
  context: unknown
) => Promise<NextResponse> | NextResponse;

export function apiWrapper(handler: ApiHandler): ApiHandler {
  return async (request: Request, context: unknown) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode },
        );
      }

      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
