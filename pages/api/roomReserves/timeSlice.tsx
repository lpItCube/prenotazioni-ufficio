import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const roomId = req.query.roomId as string;
		const from = req.query.from as string;
		const to = req.query.to as string;

		const reserves = await prisma.reserve.findMany({
			where: {
				seat: { roomId: roomId },
				OR: [
					{
						AND: [
							{ from: { lte: new Date(to) } },
							{ to: { lte: new Date(to) } },
							{ to: { gt: new Date(from) } },
						],
					},
					{
						AND: [
							{ from: { gte: new Date(from) } },
							{ to: { lte: new Date(to) } },
						],
					},
					{
						AND: [
							{ from: { lte: new Date(from) } },
							{ to: { gte: new Date(to) } },
						],
					},
					{
						AND: [
							{ from: { gte: new Date(from) } },
							{ to: { gte: new Date(to) } },
							{ from: { lt: new Date(to) } },
						],
					},
				],
			},
			include: { seat: true, user: true },
		});

		res.status(200).json(reserves);
	} catch (e) {
		console.log(e);
		res.status(404);
	}
}
