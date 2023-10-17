import { useEffect } from "react";
import { GetStaticProps } from "next";
import prisma from "../lib/prisma";
import { useRouter } from "next/router";
import Spinner from "../components/Ui/Spinner";

function Home() {
	const router = useRouter();

	useEffect(() => {
		router.push("/prenota");
	}, [router]);

	return <Spinner />;
}

export default Home;

export const getStaticProps: GetStaticProps = async () => {
	await prisma.reserve.deleteMany();
	await prisma.seat.deleteMany();
	await prisma.room.deleteMany();
	await prisma.office.deleteMany();
	await prisma.user.deleteMany();
	await prisma.domain.deleteMany();

	await prisma.domain.createMany({
		data: [{ name: "ITCube" }],
	});

	const domain = await prisma.domain.findUnique({
		where: { name: "ITCube" },
	});

	await prisma.user.createMany({
		data: [
			{
				username: "admin",
				password:
					"$2b$10$cKtd0SQStcf/4DVV5lvg2O3dw3tn5m3eh7bkzx.BIGb3DLItDTWJ6",
				role: "SUPERADMIN",
				domainId: domain!.id,
			},
			{
				username: "admin2",
				password:
					"$2b$10$6dSfCi5ORAOVYJ.XwenIUe/lw/PNM2ykKPA7FCDNZgvU5bfvQvxH2",
				role: "ADMIN",
				domainId: domain!.id,
			},
			{
				username: "user1",
				password:
					"$2b$10$3nwhpZU6BIxjylX7hoJEm.zKg6L440F72yuCZiFpOrcOCGSnVkzxm",
				role: "USER",
				domainId: domain!.id,
			},
			{
				username: "user2",
				password:
					"$2b$10$sqVNi/tqj20z.B1Ss7Zz8O4lJJ/NYNkt55/hLXc6SSK0vEUk/khM2",
				role: "USER",
				domainId: domain!.id,
			},
		],
	});

	await prisma.office.createMany({
		data: [{ domainId: domain!.id, name: "San Vittore" }],
	});

	const office = await prisma.office.findUnique({
		where: { name: "San Vittore" },
	});

	await prisma.room.createMany({
		data: [{ name: "IT", officeId: office!.id }],
	});

	return {
		props: {},
	};
};
