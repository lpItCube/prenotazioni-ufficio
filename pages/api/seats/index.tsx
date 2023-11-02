import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	type Seat = {
		id: string;
		name: string;
		type: string;
		roomId: string;
	};

	if (req.method === "GET") {
		try {
			const seats = await prisma.seat.findMany({});
			res.status(200).json(seats);
		} catch (e) {
			console.log(e);
			res.status(404);
		}
	}
	// console.log('REQ MET',req.body)
	if (req.method === "POST") {
		// console.log('POST',[...req.body.seats])
		const body: Seat[] = req.body.seats;
		try {
			const seats = await prisma.seat.createMany({
				data: [...body],
			});
			res.status(200).json(seats);
		} catch (e) {
			console.log(e);
			res.status(404);
		}
	}

	if (req.method === "DELETE") {
		const seatName = req.query.seatName as string;

		try {
			// console.log("roomId -> ", roomId)
			const deletedSeat = await prisma.seat.delete({
				where: {
					name: seatName,
				},
			});
			res.status(200).json(deletedSeat);
		} catch (e) {
			// console.log("ciao")
			console.log(e);
			res.status(404);
		}
	}
}
