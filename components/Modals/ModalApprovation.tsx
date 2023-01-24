// Utils
import { getStringDate, getStringHours } from "../../utils/datePharser"

// Components
import Button from "../Ui/Button"

type ModalApprovationProps = {
    reserve: any,
    approvationAction: any,
    buttonIconDelete: any,
    buttonIconAccept:any,
    pendingControl: boolean,
    pendingReserve: any
}

function ModalApprovation({
    reserve,
    approvationAction,
    buttonIconDelete,
    buttonIconAccept,
    pendingControl,
    pendingReserve
}: ModalApprovationProps) {
    return (
        <>
            {pendingControl && pendingReserve.length > 0 &&
                <div className="approve__container">
                    {pendingReserve.map((res: any) => {
                        const status = res.status === 'accepted' ? 'accepted' : 'pending'
                        return (
                            <div className={`approve__reserve ${status}`}>
                                <div className="approve__row--info">
                                    <div className="approve__row--user">{res.user.username}</div>
                                    <div className="approve__row">{res.seat.name}</div>
                                    {res.from &&
                                        <div className="approve__row">{getStringHours(res.from).hours} - {getStringHours(res.to).hours}</div>
                                    }
                                </div>
                                <div className="approve__row--cta">
                                    <Button
                                        onClick={() => approvationAction('approved', res.id)}
                                        className={`cta cta--secondary-ok cta--approve`}
                                        type='button'
                                        icon={buttonIconAccept}
                                        text={''}
                                    />
                                    <Button
                                        onClick={() => approvationAction('disapproved', res.id)}
                                        className={`cta cta--secondary-delete`}
                                        type='button'
                                        icon={buttonIconDelete}
                                        text={''}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            <div className="approve__container">
                {
                    reserve.length > 0 && reserve.map((res: any) => {
                        const status = res.status === 'accepted' ? 'accepted' : 'pending'
                        return (
                            <div className={`approve__reserve ${status}`}>
                                <div className="approve__row--info">
                                    <div className="approve__row--user">{res.user.username}</div>
                                    <div className="approve__row">{res.seat.name}</div>
                                    {res.from &&
                                        <div className="approve__row">{getStringHours(res.from).hours} - {getStringHours(res.to).hours}</div>
                                    }
                                </div>
                                <div className="approve__row--cta">
                                    <Button
                                        onClick={() => approvationAction('disapproved', res.id)}
                                        className={`cta cta--secondary-delete`}
                                        type='button'
                                        icon={buttonIconDelete}
                                        text={''}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default ModalApprovation