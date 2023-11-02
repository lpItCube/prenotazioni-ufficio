import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

enum Role {
	USER = "USER",
	ADMIN = "ADMIN",
	SUPERADMIN = "SUPERADMIN",
}

type Data = {
	seatId: string;
	userId: string;
	reservedDays: string[];
	from: Date;
	to: Date;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const data: Data = req.body;

	// const seat = await prisma.seat.findUnique({
	//   where: { id: data.seatId }
	// })

	// controlli
	// const reservations = await (await axios.get(`/api/reserve?from=${data.from}&to=${data.to}`)).data

	// const reservations = await prisma.reserve.findMany({
	//   include: {
	//     seat: true,
	//     user: true
	//   },
	//   where: {
	//     NOT: {
	//       OR: [
	//         {
	//           from: {
	//             gte: data.to
	//           }
	//         },
	//         {
	//           to: {
	//             lte: data.from
	//           }
	//         }
	//       ]
	//     }
	//   }
	// })

	// console.log('RESERVE',reservations)
	// const yourReserved = reservations.find((reserve: any) => reserve.user.id === data.userId)
	// const roomReserved = reservations.find((reserve: any) => reserve.seat.type === "meet-whole")
	let fromDate: any = "";
	let endDate: any = "";

	// if (yourReserved && seat?.type !== "whole" && yourReserved.user.role === Role.USER)
	//   res.status(403).json("Per questa data hai già prenotato un posto")
	// else if (roomReserved && seat?.type === "whole")
	//   res.status(403).json("Non puoi prenotare la stanza già occupata")
	// else

	fromDate = new Date(data.from);
	fromDate.setHours(fromDate.getHours() + 1);
	endDate = new Date(data.to);
	endDate.setHours(endDate.getHours() + 1);

	try {
		const result = await prisma.reserve.create({
			data: {
				...data,
				// from:fromDate,
				// to:endDate
			},
		});
		return res.status(200).json(result);
	} catch (e) {
		console.log(e);
		res.status(404);
	}
}
