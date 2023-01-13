type UserProps = {
    session: any,
    icon: any
}

function User({
    session,
    icon
}: UserProps) {
    return (
        <div className="user__container">
            <div className="user__image">
                {icon}
            </div>
            <div className="user__name">
                <p className="user__label extra-min uppercase ls-1">
                    You are logged as:
                </p>
                <h2 
                    className="txt-h6"
                >
                    {(session.status === "authenticated") ? session?.data?.user?.name : ""}
                </h2>
            </div>
        </div>
    )
}

export default User