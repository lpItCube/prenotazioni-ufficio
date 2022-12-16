import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import FirstOffice from "../../components/first-office"
import prisma from '../../lib/prisma'

function PrenotaDate({ reserveData, date }: any) {
  const session = useSession()

  return (
    <FirstOffice reserveData={reserveData} date={date} />
  )
}

export default PrenotaDate

export const getStaticProps: GetStaticProps = async (context: any) => {
  const date = context.params.date
  const reserveData = await prisma.reserve.findMany({
    include: {
      seat: true,
      user: true
    },
    where: {
      reservedDays: {
        has: date
      }
    }
  })
  return {
    props: { reserveData, date }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}