import "../styles/style.scss";
import { useState, useEffect } from "react";

// Next
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Router from "next/router";

// Redux
import { store } from "../app/store";
import { Provider } from "react-redux";

// Components
import Navbar from "../components/Navbar/navbar";
import Header from "../components/Header";
import { MousePosition } from "../types";
import SeatPopup from "../components/Book/SeatPopup";
import { useRouter } from "next/router";

// Animation
import { AnimatePresence } from "framer-motion";
import Spinner from "../components/Ui/Spinner";
import Layout from "../components/Layout";

const excludeSidebar = [
	"/login",
	"/forgot-password",
	"/change-password/[token]",
];

export default function App({ Component, pageProps }: AppProps) {
	const [appIsLoading, setAppIsLoading] = useState<boolean>(false);
	const [hitNotification, setHitNotification] = useState<boolean>(false);
	const [cursorPos, setCursorPos] = useState<MousePosition>({ x: 0, y: 0 });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Used for page transition
		const start = () => {
			setLoading(true);
			// console.log("LOADING TRUE");
		};
		const end = () => {
			setLoading(false);
		};
		Router.events.on("routeChangeStart", start);
		Router.events.on("routeChangeComplete", end);
		Router.events.on("routeChangeError", end);
		return () => {
			Router.events.off("routeChangeStart", start);
			Router.events.off("routeChangeComplete", end);
			Router.events.off("routeChangeError", end);
		};
	}, []);

	const router = useRouter();

	const containsLogin = excludeSidebar.includes(router.pathname);

	return (
		<SessionProvider session={pageProps.session}>
			<Provider store={store}>
				<AnimatePresence mode="wait" initial={false}>
					{!containsLogin ? (
						<div>
							{router.pathname.includes("prenota") && (
								<SeatPopup cursorPos={cursorPos} />
							)}
							<Header setAppIsLoading={setAppIsLoading} />
							<div className="main-container">
								{appIsLoading ? (
									"Loading ..."
								) : (
									<>
										<Navbar
											hitNotification={hitNotification}
											setHitNotification={
												setHitNotification
											}
										/>
										{loading ? (
											<div className="main-loading">
												<Spinner />
											</div>
										) : (
											<div className="main-wrapper">
												<Component
													key={router.asPath}
													hitNotification={
														hitNotification
													}
													setHitNotification={
														setHitNotification
													}
													{...pageProps}
												/>
											</div>
										)}
									</>
								)}
							</div>
						</div>
					) : (
						<Component {...pageProps} key={router.asPath} />
					)}
				</AnimatePresence>
			</Provider>
		</SessionProvider>
	);
}
