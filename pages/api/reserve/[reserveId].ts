import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const reserveId = req.query.reserveId as string;

	if (req.method === "DELETE") {
		try {
			const findToDelete = await prisma.reserve.findUnique({
				where: { id: reserveId },
			});

			if (!findToDelete)
				return res.status(204).json({ message: "Ricarica la pagina." });

			const result = await prisma.reserve.delete({
				where: { id: reserveId },
			});

			const restReserve = await prisma.reserve.findMany();

			res.status(200).json(restReserve);
		} catch (e) {
			res.status(404);
		}
	}

	if (req.method === "GET") {
		try {
			const result = await prisma.reserve.findUnique({
				where: { id: reserveId },
				include: { seat: { include: { room: true } } },
			});
			res.status(200).json(result);
		} catch (e) {
			console.log(e);
			res.status(404);
		}
	}
}
