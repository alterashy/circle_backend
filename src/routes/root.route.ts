import express, { Request, Response } from "express";
import { HttpStatus } from "../utils/httpStatus";
import { jsonResponse } from "../utils/jsonResppnse";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res
    .status(HttpStatus.OK)
    .json(
      jsonResponse("success", HttpStatus.OK, "CIRCLE API is working properly")
    );
});

router.post("/", (req: Request, res: Response) => {
  res
    .status(HttpStatus.OK)
    .json(
      jsonResponse("success", HttpStatus.OK, "POST API is working properly")
    );
});

router.patch("/", (req: Request, res: Response) => {
  res
    .status(HttpStatus.OK)
    .json(
      jsonResponse("success", HttpStatus.OK, "PATCH API is working properly")
    );
});

router.delete("/", (req: Request, res: Response) => {
  res
    .status(HttpStatus.OK)
    .json(
      jsonResponse("success", HttpStatus.OK, "DELETE API is working properly")
    );
});

export default router;
