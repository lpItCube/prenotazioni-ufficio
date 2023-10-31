import axios from "axios";
import CustomLink from "./CustomLink";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Components
import { Colors } from "../Ui/Colors";
import Logout from "./Logout";

// Icons
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5";
import { BsJournalCheck } from "react-icons/bs";
import { TbDoorExit } from "react-icons/tb";
import { AiOutlineBuild } from "react-icons/ai";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getNavbarStatus } from "../../features/navigationSlice";
import {
	getPendingNotification,
	setPendingNotification,
} from "../../features/notificationSlice";

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";
import { AUTH_OK, USER } from "../../_shared";
import { Reserve } from "../../types";

interface NavigationProps {
	hitNotification: boolean;
	setHitNotification: (nots: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = (props) => {
	const { hitNotification, setHitNotification } = props;

	const session = useSession();

	const { userData } = useAuthHook();
	const userRole = userData.role;

	const dispatch = useDispatch();
	const navbarStatus = useSelector(getNavbarStatus);
	const pendingNotification = useSelector(getPendingNotification);

	const [pendingNotif, setPendingNotif] =
		useState<string>(pendingNotification);
	const [hitLogout, setHitLogout] = useState<boolean>(false);

	useEffect(() => {
		const getReserves = async () => {
			const response: Reserve[] = await (
				await axios.get(`/api/reserve/pending`)
			).data;
			dispatch(setPendingNotification({ pending: response.length }));
		};
		if (session.status === AUTH_OK) getReserves();
	}, [session, dispatch]);

	useEffect(() => {
		setPendingNotif(pendingNotification);
		if (hitNotification) {
			setPendingNotif(pendingNotification);
			setHitNotification(false);
		}
	}, [pendingNotification, session, hitNotification, setHitNotification]);

	const path = useRouter().pathname;

	const handleLogout = () => {
		setHitLogout(true);
		signOut({ callbackUrl: "/login" });
	};

	return (
		<nav
			className={`navigation__container${navbarStatus ? " active" : ""}`}
		>
			<div className="navigation__wrapper">
				<p className="navigation__label extra-min uppercase ls-1">
					Menu:
				</p>
				<ul>
					{userRole !== USER && (
						<CustomLink
							href="/create/room"
							notification={false}
							icon={
								<AiOutlineBuild
									size={18}
									color={
										path === "/create/room"
											? Colors.dark700
											: Colors.light500
									}
								/>
							}
							text="Crea stanza"
							isActive={path === "/create/room"}
						/>
					)}
					<CustomLink
						href="/prenota"
						notification={false}
						icon={
							<IoCalendarOutline
								size={18}
								color={
									path === "/prenota"
										? Colors.dark700
										: Colors.light500
								}
							/>
						}
						text="Prenota"
						isActive={path === "/prenota"}
					/>
					<CustomLink
						href="/prenotazioni"
						notification={false}
						icon={
							<BsJournalCheck
								size={18}
								color={
									path.includes("prenotazioni")
										? Colors.dark700
										: Colors.light500
								}
							/>
						}
						text="Prenotazioni"
						isActive={path.includes("prenotazioni")}
					/>
					{userRole !== USER && path.includes("prenotazioni") && (
						<ul className="navigation__children">
							<CustomLink
								href="/prenotazioni"
								text="Tutte le prenotazioni"
								isActive={path === "/prenotazioni"}
								notification={false}
								icon={false}
							/>
							<CustomLink
								href="/prenotazioni/pending"
								text="Da approvare"
								notification={pendingNotif}
								isActive={
									path.includes("prenotazioni") &&
									path.includes("pending")
								}
								icon={false}
							/>
						</ul>
					)}
					<CustomLink
						href="/settings"
						notification={false}
						icon={
							<IoSettingsOutline
								size={18}
								color={
									path === "/settings"
										? Colors.dark700
										: Colors.light500
								}
							/>
						}
						text="Settings"
						isActive={path === "/settings"}
					/>
				</ul>
			</div>
			<Logout
				handleLogout={handleLogout}
				hitLogout={hitLogout}
				icon={<TbDoorExit size={24} color={Colors.light500} />}
				text="Logout"
			/>
		</nav>
	);
};

export default Navigation;
