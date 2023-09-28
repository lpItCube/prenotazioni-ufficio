import { setEndHour, setStartHour } from "../../features/timePickerSlice";
import { Reserve } from "../../types";
import { getStringHours } from "../../utils/datePharser";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Colors } from "../Ui/Colors";

import { motion, AnimatePresence } from "framer-motion";

// Icons
import { TbNotebook } from "react-icons/tb";
import { FiEye } from "react-icons/fi";

interface YourReserveProps {
	reserves: Reserve[];
}

const YourReserve: React.FC<YourReserveProps> = (props): JSX.Element => {
	const buttonVariants = {
		visible: {
			scale: 1,
		},
		hidden: {
			scale: 0,
		},
	};

	const reserveVariants = {
		visible: {
			top: 0,
			opacity: 1,
		},
		hidden: {
			top: 8,
			opacity: 0,
		},
	};

	const obscurerVariants = {
		visible: {
			opacity: 1,
		},
		hidden: {
			opacity: 0,
		},
	};

	const { reserves } = props;
	const reserveRef = useRef<any>(null);
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				reserveRef.current &&
				!reserveRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		window.addEventListener("click", handleClickOutside, true);
		return () => {
			window.removeEventListener("click", handleClickOutside, true);
		};
	}, []);

	const handleHours = (start: string, end: string) => {
		setIsOpen(false);
		dispatch(setStartHour(start.slice(0, 2)));
		dispatch(setEndHour(end.slice(0, 2)));
	};

	return (
		<>
			<AnimatePresence>
				{reserves.length > 0 && (
					<motion.div
						key="button"
						variants={buttonVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						className="your-reserve__button"
					>
						<TbNotebook
							size={48}
							color={Colors.white}
							onClick={() => setIsOpen((prev) => !prev)}
						/>
					</motion.div>
				)}
				{isOpen && (
					<motion.div
						variants={obscurerVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
						className="your-reserve__wrapper"
					>
						<motion.div
							variants={reserveVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
							className="your-reserve__container"
							ref={reserveRef}
						>
							<h5 className="your-reserve__title semiBold">
								L{reserves.length > 1 ? "e" : "a"} tu
								{reserves.length > 1 ? "e" : "a"} prenotazion
								{reserves.length > 1 ? "i" : "e"}
							</h5>
							<div className="your-reserve__label--container">
								<p className="your-reserve__label--room select__label label">
									Stanza
								</p>
								<p className="your-reserve__label--time select__label label">
									Orario
								</p>
							</div>
							<div className="your-reserve__list">
								{reserves.map((res: any) => {
									return (
										<div
											key={res.id}
											className={`your-reserve__book`}
										>
											<div className="your-reserve__book--name">
												{res.seat.name}
											</div>
											{res.from && (
												<div className="your-reserve__book--time">
													{
														getStringHours(
															res.from
														) as string
													}{" "}
													-{" "}
													{
														getStringHours(
															res.to
														) as string
													}
												</div>
											)}
											<FiEye
												size={32}
												color={Colors.white}
												className="your-reserve__view"
												onClick={() =>
													handleHours(
														getStringHours(
															res.from
														) as string,
														getStringHours(
															res.to
														) as string
													)
												}
											/>
										</div>
									);
								})}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default YourReserve;
