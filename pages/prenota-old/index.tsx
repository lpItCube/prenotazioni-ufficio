import { GetStaticProps } from "next";
import FirstOffice from "../../components/first-office"
import prisma from '../../lib/prisma';

function Prenota({ seats }: any) {
	return (
		<>
			<h1>Prenota</h1>
			<FirstOffice seatsData={seats}/>
		</>
	)
}

export default Prenota

export const getStaticProps: GetStaticProps = async () => {
  const seats = await prisma.seat.findMany()
  return {
    props: { seats },
    revalidate: 10
  }
}