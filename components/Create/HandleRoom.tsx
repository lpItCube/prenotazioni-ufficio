import { useState, useEffect, useRef } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setActualRoom, setActualRoomName } from "../../features/roomSlice";
import {
	getDayReserves,
	setDayReserves,
	setReserves,
} from "../../features/reserveSlice";

// Axios
import axios, { AxiosResponse } from "axios";

// Types
import {
	Room,
	Reserve,
	GridPoint,
	FromToHour,
	Seat,
	OptionItem,
} from "../../types";

// Components
import Modal from "../modal";
import GridCreate from "./GridCreate";
import Grid from "./Grid";
import OptionsBar from "./OptionsBar";
import GridOptions from "./GridOptions";
import YourReserve from "../Rooms/YourReserve";

// Framer motion
import { AnimatePresence, motion } from "framer-motion";

// Utils
import { getOnlyDate } from "../../utils/datePharser";

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook";
import { ModalType, OPTION_CHAIR, PRISTINE } from "../../_shared";
import ModalComponent from "../Ui/ModalComponent";
import { setModalType, toggleModal } from "../../features/modalSlice";
import Input from "../Ui/Input";
import Textarea from "../Ui/Textarea";
import Button from "../Ui/Button";
import Spinner from "../Ui/Spinner";

interface HandleRoomProps {
	fromTo?: FromToHour;
	action: number;
	setAction: (action: number) => void;
	roomId: string;
	create: boolean;
	setSelectedRoom?: (item: any) => void;
}

const HandleRoom: React.FC<HandleRoomProps> = (props): JSX.Element => {
	const { fromTo, action, setAction, roomId, create, setSelectedRoom } =
		props;

	const variants = {
		initial: {
			opacity: 0,
			y: -8,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
			},
		},
		hidden: {
			opacity: 0,
			y: -8,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
			},
		},
	};

	const optionRef = useRef<any>(null);

	const dispatch = useDispatch();
	const reserveAllDay = useSelector(getDayReserves);
	const { userData } = useAuthHook();
	const userId: string = userData.id;

	const [room, setRoom] = useState<Room>();
	const [xCells, setXCells] = useState<number>(0);
	const [yCells, setYCells] = useState<number>(0);
	const [grid, setGrid] = useState<GridPoint[][]>([]);
	const [seatName, setSeatName] = useState<string>("none");
	const [seats, setSeats] = useState<Seat[]>([]);
	const [selectedCell, setSelectedCell] = useState<GridPoint>();
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [updateGrid, setUpdateGrid] = useState<GridPoint[]>([]);
	const [firstUpdate, setFirstUpdate] = useState<boolean>(false);
	const [roomName, setRoomName] = useState<string>("");
	const [roomDescription, setRoomDescription] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setFirstUpdate(true);
	}, []);

	useEffect(() => {
		console.log("HERE", seats);
	}, [seats]);

	useEffect(() => {
		setRoomName(room?.name ? room.name : "");
		setRoomDescription(room?.description ? room.description : "");
	}, [room]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (optionRef.current && optionRef.current.contains(event.target)) {
				setShowOptions(true);
			} else {
				setShowOptions(false);
			}
		};
		window.addEventListener("click", handleClickOutside, true);
		return () => {
			window.removeEventListener("click", handleClickOutside, true);
		};
	}, []);

	useEffect(() => {
		dispatch(setActualRoom(roomId));
		const getRoom = async () => {
			const response: AxiosResponse<Room> = await axios.get(
				`/api/room/${roomId}`
			);
			const room: Room = response.data;
			if (room) {
				setRoom(room);
				dispatch(setActualRoomName(room?.name));
				setXCells(room?.xSize);
				setYCells(room?.ySize);
			}
		};
		getRoom();
		const setReservess = async () => {
			// console.log('SET RES 3')
			if (fromTo) {
				const reserves: Reserve[] = await (
					await axios.get(`/api/reserve`)
				).data;
				const filteredRes = reserves.filter(
					(r: Reserve) =>
						fromTo.from &&
						fromTo.to &&
						r.to &&
						r.from &&
						((new Date(fromTo.from) <= new Date(r.from) &&
							new Date(fromTo.to) <= new Date(r.to) &&
							new Date(fromTo.to) > new Date(r.from)) ||
							(new Date(fromTo.from) >= new Date(r.from) &&
								new Date(fromTo.to) <= new Date(r.to)) ||
							(new Date(fromTo.from) <= new Date(r.from) &&
								new Date(fromTo.to) >= new Date(r.to)) ||
							(new Date(fromTo.from) >= new Date(r.from) &&
								new Date(fromTo.to) >= new Date(r.to) &&
								new Date(fromTo.from) < new Date(r.to))) &&
						r.seat?.roomId === roomId
				);
				const selectDate: string = fromTo.from
					? getOnlyDate(fromTo.from)
					: "";
				const allDayReserve = reserves.filter(
					(r: Reserve) =>
						selectDate === getOnlyDate(r.from) &&
						r.seat?.roomId === roomId
				);

				dispatch(
					setDayReserves({
						dayReserveData: allDayReserve.filter(
							(r: Reserve) => r.user.id === userId
						),
						dayAllReserveData: allDayReserve,
					})
				);

				// Setta le prenotazioni al cambio di orario
				dispatch(setReserves({ reserveData: filteredRes }));
			}
		};
		if (!create) setReservess();
	}, [roomId, fromTo, firstUpdate, create, dispatch, userId]);

	const handleSave = async () => {
		setIsLoading(true);
		const newRoom: Room = {
			...(room as Room),
			name: roomName,
			description: roomDescription,
			xSize: xCells,
			ySize: yCells,
			gridPoints: grid?.flat(),
		};

		setRoom(newRoom);
		try {
			await axios.put("/api/room/", { ...newRoom, id: roomId });
			handleCloseModal();
			setIsLoading(false);
		} catch (e) {
			console.log(e);
		}
		try {
			await axios.delete(`/api/seats/${roomId}`);
			if (seats.length > 0) {
				console.log("SEATS SAVE", seats);
				await axios.post("/api/seats/", { seats });
				setIsLoading(false);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleOptionChange = (element: string) => {
		if (!selectedCell && room) return;

		const newGrid: GridPoint[][] | [] = grid?.length
			? grid.map((row) =>
					row.map((cell) => {
						if (
							cell.x === selectedCell?.x &&
							cell.y === selectedCell.y
						) {
							var seatName: string = "";
							if (element === OPTION_CHAIR) {
								seatName = `${room?.name}-${cell.x}-${cell.y}`;
								const newSeat = {
									name: seatName,
									type: "",
									roomId: roomId,
								};
								if (
									seats &&
									!seats.find(
										(seat: Seat) => seat.name === seatName
									)
								) {
									setSeats([...seats, newSeat]);
									console.log("HERE NOT");
								}
							} else {
								const seatToDelete = `${room?.name}-${cell.x}-${cell.y}`;
								if (
									seats.find(
										(seat: Seat) =>
											seat.name === seatToDelete
									)
								) {
									setSeats(
										seats.filter(
											(seat: Seat) =>
												seat.name !== seatToDelete
										)
									);
									console.log("HERE NOT");
								}
							}
							return {
								...cell,
								info: element,
								seatName: seatName,
							};
						}
						return cell;
					})
			  )
			: [];
		setGrid(newGrid);
		setUpdateGrid(newGrid.flat());
	};

	const handleCloseModal = () => {
		dispatch(toggleModal(false));
		dispatch(setModalType(PRISTINE));
	};

	const handleSaveRoom = () => {
		setIsLoading(true);
		if (setSelectedRoom) {
			setSelectedRoom((prev: OptionItem) => ({
				label: roomName,
				value: prev.value,
			}));
		}
		handleSave();
	};

	return (
		<>
			{create ? (
				<>
					<GridOptions
						xCells={xCells}
						setXCells={setXCells}
						yCells={yCells}
						setYCells={setYCells}
						handleSave={handleSave}
						isLoading={isLoading}
					/>
					<div className="room-creation">
						<div className="room-grid">
							{selectedCell && (
								<AnimatePresence>
									{showOptions && (
										<motion.aside
											variants={variants}
											initial="hidden"
											animate="visible"
											exit="hidden"
											key="aside"
											className="creation-options__aside"
											ref={optionRef}
										>
											<div className="creation-options__box">
												<OptionsBar
													selectedCell={selectedCell}
													handleOptionChange={
														handleOptionChange
													}
												/>
											</div>
										</motion.aside>
									)}
								</AnimatePresence>
							)}
							<GridCreate
								setSeatName={setSeatName}
								setAction={setAction}
								roomId={roomId}
								setRoom={setRoom}
								room={room}
								xSize={xCells}
								ySize={yCells}
								grid={grid}
								setGrid={setGrid}
								setSeats={setSeats}
								setSelectedCell={setSelectedCell}
								selectedCell={selectedCell}
								setShowOptions={setShowOptions}
								optionRef={optionRef}
								updateGrid={updateGrid}
								setUpdateGrid={setUpdateGrid}
							/>
						</div>
					</div>
					<ModalComponent
						modalTitle={`Modifica stanza ${room?.name}`}
						subTitle={"Modifica"}
						refType={ModalType.EDIT}
						handleCloseModal={handleCloseModal}
					>
						{/* 
                        Al save della modale lanciare setSelectedRoom settando la label +
                        fare la put su la stanza con id room.id +
                        settare setRoom per il nome e la descrizione +
                        lanciare handleSave function
                        */}
						<Input
							label=""
							value={roomName}
							onChange={setRoomName}
							placeholder="Nome stanza"
						/>
						<Textarea
							label=""
							value={roomDescription}
							onChange={setRoomDescription}
							placeholder="Descrizione stanza"
						/>
						{isLoading ? (
							<Spinner />
						) : (
							<Button
								type="button"
								icon={false}
								text="Salva"
								className="cta cta--primary"
								onClick={() => handleSaveRoom()}
							/>
						)}
					</ModalComponent>
				</>
			) : (
				<>
					<div className="room-creation">
						<div className="room-grid">
							<div></div>
							{room && room.xSize && room.ySize && (
								<Grid
									setSeatName={setSeatName}
									setAction={setAction}
									room={room}
								/>
							)}
						</div>
						<YourReserve reserves={reserveAllDay} />
					</div>
					{room?.description && (
						<ModalComponent
							modalTitle={`Stanza ${room?.name}`}
							subTitle={"Informazioni"}
							refType={ModalType.READ}
							handleCloseModal={handleCloseModal}
						>
							{room?.description}
						</ModalComponent>
					)}
					{fromTo && (
						<Modal
							seatName={seatName}
							action={action}
							fromTo={fromTo}
						/>
					)}
				</>
			)}
		</>
	);
};

export default HandleRoom;
