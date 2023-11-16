import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const reserveId = req.query.seatId as string;

	try {
		const reservesId: any = [];
		const findToDelete = await prisma.reserve.findMany({
			where: { seatId: reserveId },
		});

		findToDelete.map((el: any) => {
			reservesId.push(el.id);
		});

		if (!findToDelete)
			return res.status(204).json({ message: "Ricarica la pagina." });

		const toDelete = await prisma.reserve.deleteMany({
			where: {
				id: {
					in: reservesId,
				},
			},
		});

		const restReserve = await prisma.reserve.findMany();
		return res.status(200).json(restReserve);
	} catch (e: any) {
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
