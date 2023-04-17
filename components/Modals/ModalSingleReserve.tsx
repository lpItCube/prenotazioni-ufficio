// Components
import Button from "../Ui/Button"
import Spinner from "../Ui/Spinner"

// Utils
import { getStringHours } from "../../utils/datePharser"

// Redux
import { useSelector } from "react-redux"
import { getReserves } from "../../features/reserveSlice"
import { getActualRoomName } from "../../features/roomSlice"

// Costants
import { Actions, MEET, MEET_ROOM } from "../../_shared"

// Types
import { HitModalButton, Reserve } from "../../types"

interface ModalSingleReserveProps {
	action: number,
	seatName: string,
	otherReserveInPeriod: Reserve[],
	userReserve: Reserve[],
	handleSeat: () => void,
	hitModalButton: HitModalButton
}

const ModalSingleReserve: React.FC<ModalSingleReserveProps> = (props): JSX.Element => {

	const { action, seatName, otherReserveInPeriod, userReserve, handleSeat, hitModalButton } = props 

	const reserveData = useSelector(getReserves)
	const actualRoomName = useSelector(getActualRoomName)


	return (
		<>
			<p className="modal__text txt-h6">
				{action === Actions.ADD &&
					<>
						Vuoi procedere con la prenotazione del posto
						<b>{' ' + seatName}</b>
					</>
				}
				{(action === Actions.ADDALL || action === Actions.REQUESTALL) &&
					<>
						Vuoi prenotare l'intera stanza <b>{' ' + actualRoomName}</b>
					</>
				}
				?</p>
			{reserveData
				&& seatName === MEET_ROOM
				&& otherReserveInPeriod
				&& otherReserveInPeriod.length > 0
				&&
				<>
					<br />
					<p
						className="modal__text modal__text--warning txt-h6"
					>Attenzione! Sono già presenti prenotazioni per questi orari, procedendo verranno cancellate.</p>
					<div className="approve__container">
						{
							userReserve.length > 0 && userReserve.filter((res: Reserve) => res?.seat?.type === MEET).map((res: Reserve) => {
								const status = res.status === 'accepted' ? 'accepted' : 'pending'
								return (
									<div key={res.id} className={`approve__reserve ${status}`}>
										<div className="approve__row--info">
											<div className="approve__row--user">{res.user.username}</div>
											<div className="approve__row">{res?.seat?.name}</div>
											{res.from && res.to &&
												<div className="approve__row">{getStringHours(res.from) as string} - {getStringHours(res.to) as string}</div>
											}
										</div>
									</div>
								)
							})
						}
					</div>
				</>
			}
			{/* {console.log(hitModalButton.loading)} */}
			{!hitModalButton.loading
				? <Button
					onClick={() => handleSeat()}
					className={`cta ${action === Actions.ADD || action === Actions.ADDALL || action === Actions.REQUESTALL ? 'cta--secondary-ok' : 'cta--primary-delete'}`}
					type='button'
					icon={false}
					text={action === Actions.ADD || action === Actions.ADDALL || action === Actions.REQUESTALL ? 'Conferma' : 'Cancella'} />
				: <Spinner />
			}
		</>
	)
}

export default ModalSingleReserve