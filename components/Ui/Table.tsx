type TableProps = {
    children: any
}

export function Table({
    children
}: TableProps) {
    return (
        <div className="table__outer">
            <div className="table">
                {children}
            </div>
        </div>
    )
}


type TableBodyProps = {
    children: any
}

export function TableBody({
    children
}: TableBodyProps) {
    return (
        <div className="table__body">
            {children}
        </div>
    )
}


type TableColProps = {
    children: any,
    className: string
}

export function TableCol({
    children,
    className
}: TableColProps) {
    return (
        <div className={`table__col ${className}`}>
            {children}
        </div>
    )
}


type TableHeaderProps = {
    headerColumns: String[]
}

export function TableHeader({
    headerColumns
}: TableHeaderProps) {
    return (
        <div className="table__header">
            {headerColumns.map((header: String, index: number) => {
                return (
                    <h6
                        key={index}
                        className="table__single-header"
                    >
                        {header}
                    </h6>
                )
            })}
        </div>
    )
}


type TableRowProps = {
    children: any,
    className: string
}

export function TableRow({
    children,
    className
}: TableRowProps) {
    return (
        <div
            className={`table__row${className}`}
        >
            {children}
        </div>
    )
}