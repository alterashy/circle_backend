import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.send("Welcome to Circle API 😁!");
});

router.post("/", (req: Request, res: Response) => {
	const { fullName, email, address } = req.body;
	res.json({
		fullName,
		email,
		address,
	});
});

router.patch("/", (req: Request, res: Response) => {
	res.send("Welcome to PATCH!");
});

router.delete("/", (req: Request, res: Response) => {
	res.send("Welcome to DELETE!");
});

export default router;
