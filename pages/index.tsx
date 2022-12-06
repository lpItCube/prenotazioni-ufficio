import { GetStaticProps } from "next"
import prisma from '../lib/prisma';

function Home() {
  return <h1>Home Page</h1>
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  await prisma.seat.deleteMany()
  await prisma.seat.createMany( 
    {
      data: [
        { name: "it-1", type: "it", busy: false },
        { name: "it-2", type: "it", busy: false },
        { name: "it-3", type: "it", busy: false },
        { name: "it-4", type: "it", busy: true },
        { name: "it-5", type: "it", busy: false },
        { name: "it-6", type: "it", busy: false },
        { name: "it-7", type: "it", busy: false },
        { name: "it-8", type: "it", busy: true },
        { name: "meet-1", type: "meet", busy: false },
        { name: "meet-2", type: "meet", busy: false },
        { name: "meet-3", type: "meet", busy: false },
        { name: "meet-4", type: "meet", busy: true },
        { name: "meet-5", type: "meet", busy: false },
        { name: "meet-6", type: "meet", busy: false },
        { name: "meet-7", type: "meet", busy: false },
        { name: "meet-8", type: "meet", busy: true }
      ]
    }
  )

  return {
    props: { }
  }
}