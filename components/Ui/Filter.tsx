type FilterWrapperProps = {
    children: any
}

export function FiltersWrapper({
    children
}: FilterWrapperProps) {
    return (
        <div className="filters__wrapper">
            {children}
        </div>
    )
}


type FilterContainerProps = {
    children: any,
    title:string
}

export function FilterContainer({
    children,
    title
}: FilterContainerProps) {
    return (
        <div className="filters__box">
            <p className="label">{title}</p>
            <div
                className="filters__container"
            >
                {children}
            </div>
        </div>
    )
}



type FilterProps = {
    onClick: any,
    isActive: any,
    text: string
}

export function Filter({
    onClick,
    isActive,
    text
}: FilterProps) {
    return (
        <button
            className={`cta cta__filter${isActive ? ' active' : ''}`}
            onClick={() => onClick()}
        >
            <div className="filter__indicator">
                <div className="filter__selector"></div>
            </div>
            <p className="min filter__text">{text}</p>
        </button>
    )
}
