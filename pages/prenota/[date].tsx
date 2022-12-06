import { GetStaticPaths, GetStaticProps } from "next"
import FirstOffice from "../../components/first-office"
import prisma from '../../lib/prisma'

function PrenotaDate({ seats }: any) {
  return (
    <FirstOffice seatsData={seats}/>
  )
}

export default PrenotaDate

export const getStaticProps: GetStaticProps = async () => {
  const seats = await prisma.seat.findMany()
  return {
    props: { seats }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}