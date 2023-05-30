import { useState, useEffect } from "react"

// Components
import Button from "../Ui/Button"
import Spinner from "../Ui/Spinner"

// Redux
import { useSelector } from "react-redux"
import { getActualRoomName } from "../../features/roomSlice"

// Costants
import { Actions, USER, WHOLE } from "../../_shared"

// Types
import { HitModalButton, Reserve } from "../../types"
import Textarea from "../Ui/Textarea"
import { getDayReserves } from "../../features/reserveSlice"

// Hooks
import { useAuthHook } from "../../hooks/useAuthHook"

interface ModalSingleReserveProps {
	action: number,
	seatName: string,
	otherReserveInPeriod: Reserve[],
	userReserve: Reserve[],
	handleSeat: () => void,
	hitModalButton: HitModalButton,
	motivation: string,
	setMotivation: (motivation: string) => void
}

const ModalSingleReserve: React.FC<ModalSingleReserveProps> = (props): JSX.Element => {

	const { action, seatName, handleSeat, hitModalButton, motivation, setMotivation, userReserve } = props

	const actualRoomName = useSelector(getActualRoomName)
	const reserveInDay = useSelector(getDayReserves)

	const { userData } = useAuthHook()
	const userId = userData.id
	const userRole = userData.role

	const [buttonType, setButtonType] = useState<string>("")
	const [isClickable, setIsClickable] = useState<boolean>(false)
	const [needMotivation, setNeedMotivation] = useState<boolean>(false)

	useEffect(() => {
		const myReserveInDay = reserveInDay.filter((r: Reserve) => r.user.id === userId && r.seat?.type !== WHOLE)
		if (userRole === USER && myReserveInDay.length > 0) {
			setNeedMotivation(true)
			setIsClickable(false)
		}
	}, [userReserve, reserveInDay, userId])


	useEffect(() => {
		if (action === Actions.ADD && !needMotivation) {
			setButtonType("cta cta--secondary-ok")
			setIsClickable(true)
		} else if ((action === Actions.ADDALL || action === Actions.REQUESTALL) || needMotivation) {
			let buttonClass: string = ""
			let clickable: boolean = false
			if (!motivation) {
				buttonClass = "cta cta--secondary-ok disabled"
				clickable = false
			} else {
				buttonClass = "cta cta--secondary-ok"
				clickable = true
			}
			setButtonType(buttonClass)
			setIsClickable(clickable)
		} else {
			setButtonType("cta cta--primary-delete")
			setIsClickable(true)
		}
	}, [action, motivation, needMotivation])


	return (
		<>
			{action === Actions.ADD &&
				<>
					<p className="modal__text txt-h6">
						Vuoi procedere con la prenotazione del posto
						<b>{' ' + seatName}</b>
						&apos;?
					</p>
					{needMotivation &&
						<Textarea
							label=""
							value={motivation}
							onChange={(e) => setMotivation(e)}
							placeholder="Motivazione della richiesta"
							message={!isClickable ? "Devi fornire una motivazione per poter prenotare." : ""}
						/>
					}
				</>
			}
			{(action === Actions.ADDALL || action === Actions.REQUESTALL) &&
				<>
					<p className="modal__text txt-h6">
						Vuoi prenotare l&apos;intera stanza
						<b>{' ' + actualRoomName}</b>
						?
					</p>
					<Textarea
						label=""
						value={motivation}
						onChange={(e) => setMotivation(e)}
						placeholder="Motivazione della richiesta"
						message={!isClickable ? "Devi fornire una motivazione per poter prenotare." : ""}
					/>
				</>
			}
			{!hitModalButton.loading
				? (
					<Button
						onClick={isClickable ? () => handleSeat() : () => { }}
						className={buttonType}
						type='button'
						icon={false}
						text={action === Actions.ADD || action === Actions.ADDALL || action === Actions.REQUESTALL ? 'Conferma' : 'Cancella'}
					/>
				)
				: <Spinner />
			}
		</>
	)
}

export default ModalSingleReserve