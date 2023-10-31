import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { hashPwd } from "../../../utils/hashPassword";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const { userId } = req.body;
	const { newPassword } = req.body;
	const pwdToChange = await hashPwd(newPassword);

	if (req.method === "POST") {
		try {
			const result = await prisma.user.update({
				where: { id: userId },
				data: { password: pwdToChange },
			});
			res.status(202).json(result);
		} catch (error) {
			console.log(error);
			res.status(404).json(error);
		}
	}
}
