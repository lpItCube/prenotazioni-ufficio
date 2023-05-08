// Costants
import { APPROVE, DISAPPROVE } from "../../_shared"

// Types
import { HitModalButton, Reserve } from "../../types"

// Utils
import { getStringHours } from "../../utils/datePharser"

// Components
import Button from "../Ui/Button"
import Spinner from "../Ui/Spinner"

interface ModalApprovationProps {
    reserve: Reserve[],
    approvationAction: (approve:number, id:string) => void,
    buttonIconDelete: JSX.Element | boolean,
    buttonIconAccept: JSX.Element | boolean,
    pendingControl: boolean,
    pendingReserve: Reserve[],
    hitModalButton: HitModalButton
}

const ModalApprovation: React.FC<ModalApprovationProps> = (props): JSX.Element => {

    const { reserve, approvationAction, buttonIconDelete, buttonIconAccept, pendingControl, pendingReserve, hitModalButton } = props

    return (
        <>
            {pendingControl && pendingReserve.length > 0 &&
                <div className="approve__container">
                    {pendingReserve.map((res: Reserve) => {
                        const status = res.status === 'accepted' ? 'accepted' : 'pending'
                        return (
                            <div key={res.id} className={`approve__reserve ${status}`}>
                                <div className="approve__row--info">
                                    <div className="approve__row--user">{res.user.username}</div>
                                    <div className="approve__row">{res?.seat?.name}</div>
                                    {res.motivation &&
                                        <div className="approve__row--motivation">
                                            <p className="extra-min">
                                                {res.motivation}
                                            </p>
                                        </div>
                                    }
                                    {res.from && res.to &&
                                        <div className="approve__row">{getStringHours(res.from) as string} - {getStringHours(res.to) as string}</div>
                                    }
                                </div>
                                {hitModalButton.id === res.id && hitModalButton.loading
                                    ? <Spinner />
                                    : <div className="approve__row--cta">
                                        <Button
                                            onClick={() => approvationAction(APPROVE, res.id)}
                                            className={`cta cta--secondary-ok cta--approve`}
                                            type='button'
                                            icon={buttonIconAccept}
                                            text={''}
                                        />
                                        <Button
                                            onClick={() => approvationAction(DISAPPROVE, res.id)}
                                            className={`cta cta--secondary-delete`}
                                            type='button'
                                            icon={buttonIconDelete}
                                            text={''}
                                        />
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
            }
            <div className="approve__container">
                {
                    reserve.length > 0 && reserve.map((res: Reserve) => {
                        const status = res.status === 'accepted' ? 'accepted' : 'pending'
                        return (
                            <div key={res.id} className={`approve__reserve ${status}`}>
                                <div className="approve__row--info">
                                    <div className="approve__row--user">{res.user.username}</div>
                                    <div className="approve__row">{res?.seat?.name}</div>
                                    {res.motivation &&
                                        <div className="approve__row--motivation">
                                            <p className="extra-min">
                                                {res.motivation}
                                            </p>
                                        </div>
                                    }
                                    {res.from && res.to &&
                                        <div className="approve__row">{getStringHours(res.from) as string} - {getStringHours(res.to) as string}</div>
                                    }
                                </div>
                                {hitModalButton.id === res.id && hitModalButton.loading
                                    ? <Spinner />
                                    : <div className="approve__row--cta">
                                        <Button
                                            onClick={() => approvationAction(DISAPPROVE, res.id)}
                                            className={`cta cta--secondary-delete`}
                                            type='button'
                                            icon={buttonIconDelete}
                                            text={''}
                                        />
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default ModalApprovation