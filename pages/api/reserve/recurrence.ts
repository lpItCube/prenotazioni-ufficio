import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { Reserve } from "../../../types";

type Data = {
  seatId: string
  userId: string
  reservedDays: string[]
  from: Date
  to: Date
  recurrenceDay: string
}

type ReserveToAdd = {
  seatId: string
  userId: string
  reservedDays: []
  from: Date
  to: Date
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data : Data = req.body

  const dates = getDatesForDayOfWeek(data.recurrenceDay, new Date(data.from), new Date(data.to));

  const reservesToAdd: ReserveToAdd[] = dates.map(date => {
    var currentFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date(data.from).getHours())
    var currentTo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date(data.to).getHours())
    return {
      seatId: data.seatId,
      userId: data.userId,
      reservedDays: [],
      from: currentFrom,
      to: currentTo
    }
  })
  
  if (req.method === "POST") {
    try {
      const result = await prisma.reserve.createMany(
        {
          data: reservesToAdd
        }
      )
      res.status(200).json(result)
    } catch (e) {
      console.log(e)
      res.status(404)
    }
  }

}

function getDatesForDayOfWeek(recurrenceDay: string, recurrenceFrom: Date, recurrenceTo: Date) {
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDayOfWeek = daysOfWeek.indexOf(recurrenceDay.toLowerCase());

  let dates = [];
  let currentDate = new Date(recurrenceFrom.getTime());

  while (currentDate <= recurrenceTo) {
    if (currentDate.getDay() === targetDayOfWeek) {
      dates.push(new Date(currentDate.getTime()));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}