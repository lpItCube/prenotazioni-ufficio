import { GetStaticPaths, GetStaticProps } from "next"
import FirstOffice from "../../components/first-office"
import prisma from '../../lib/prisma'

function PrenotaDate({ reserveData }: any) {
  return (
    <FirstOffice reserveData={reserveData}/>
  )
}

export default PrenotaDate

export const getStaticProps: GetStaticProps = async () => {
  const reserveData = await prisma.reserve.findMany({
    include: {
      seat: true
    },
    where: {
      reservedDays: {
        has: "2022-12-07"
      }
    }
  })
  return {
    props: { reserveData }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}