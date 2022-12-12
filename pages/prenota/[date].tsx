import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import FirstOffice from "../../components/first-office"
import prisma from '../../lib/prisma'

function PrenotaDate({ reserveData, date }: any) {
  return (
    <FirstOffice reserveData={reserveData} date={date}/>
  )
}

export default PrenotaDate

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const date = context.params.date
  const reserveData = await prisma.reserve.findMany({
    include: {
      seat: true
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