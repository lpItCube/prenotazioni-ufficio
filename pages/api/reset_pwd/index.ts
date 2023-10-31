import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utils/sendEmail";
import { generateToken } from "../../../utils/generateToken";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { email }: any = req.body;

	if (req.method === "POST") {
		try {
			const user = await prisma.user.findUnique({
				where: { username: email },
			});

			if (user == null) {
				throw new Error("user does not exists");
			}

			const token = generateToken(user.id, email);

			const protocol = req.headers["x-forwarded-proto"] ?? "http";
			const host = req.headers["host"];

			const baseUrl = `${protocol}://${host}`;

			const emailText =
				"Click here to reset your password: " +
				baseUrl +
				"/change-password/" +
				token;
			sendEmail(email, emailText);

			res.status(200).json({
				message: "Password reset link sent",
				token,
			});
		} catch (e) {
			res.status(404).json(e);
		}
	}
}
