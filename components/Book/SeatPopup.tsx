// Framer motion
import { AnimatePresence, motion } from "framer-motion"

// Redux
import { useSelector } from "react-redux"
import { getUserOnSeat } from "../../features/reserveSlice"
import { MousePosition, Reserve } from "../../types"
import { useAuthHook } from "../../hooks/useAuthHook"
import { PENDING, USER, WHOLE } from "../../_shared"
import { getStringHours } from "../../utils/datePharser"

interface SeatPopupProps {
    cursorPos: MousePosition
}

const SeatPopup: React.FC<SeatPopupProps> = (props): JSX.Element | null => {

    const { cursorPos } = props
    const { userData } = useAuthHook()
    const userOnSeat = useSelector(getUserOnSeat)
    const currentUser = userData.name
    const role = userData.role

    const popupVariants = {
        initial: {
            opacity:0,
            scale: 0,
            y: '-50%'
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: '-50%'
        },
        exit: {
            opacity:0,
            scale: 0,
            y: '-50%'
        }
    }

console.log('userOnSeat',userOnSeat)
    const popup = userOnSeat.length > 0 && role !== USER
        ? (
            <motion.div
                variants={popupVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`seat-popup__container`}
                // style={{
                //     left: cursorPos.x,
                //     top: cursorPos.y
                // }}
            >
                {/* <div className="seat-popup__arrow" /> */}
                <div className="seat-popup__data--wrapper">
                    {userOnSeat.map((r: Reserve) => {
                        const from = getStringHours(r.from)
                        const to = getStringHours(r.to as string)
                        return (
                            <div
                                key={r.id}
                                className="seat-popup__data--container"
                            >
                                <div className={`seat-popup__indicator ${r.status === PENDING
                                    ? 'is-pending'
                                    : r.user.username === currentUser
                                        ? 'is-you'
                                        : 'is-other'}`}
                                />
                                <p
                                    className={`seat-popup__name`}
                                >
                                    {r.user.username} | {from as string} - {to as string} {r.seat?.type === WHOLE && 'WHOLE'}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </motion.div>
        ) : null

    return (
        <>
            <AnimatePresence>
                {popup}
            </AnimatePresence>
        </>
    )
}

export default SeatPopup