// Framer motion
import { AnimatePresence, motion } from "framer-motion"

// Redux
import { useSelector } from "react-redux"
import { getUserOnSeat } from "../../features/reserveSlice"
import { MousePosition } from "../../types"
import { useAuthHook } from "../../hooks/useAuthHook"
import { USER } from "../../_shared"

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
            scale:0
        },
        animate: {
            opacity:1,
            scale:1,
        },
        exit: {
            opacity:0,
            scale:0,
        }
    }

    const popup = userOnSeat && role !== USER
        ? (
            <motion.div
                variants={popupVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`seat-popup__container ${userOnSeat === currentUser ? 'is-you' : 'is-other'}`}
                style={{
                    left: cursorPos.x,
                    top: cursorPos.y
                }}
            >
                <div className="seat-popup__arrow" />
                <p
                    className="seat-popup__name"
                >
                    {userOnSeat}
                </p>
            </motion.div>
        ) : null

    return (
    <AnimatePresence>
        {popup}
    </AnimatePresence>
    )
}

export default SeatPopup