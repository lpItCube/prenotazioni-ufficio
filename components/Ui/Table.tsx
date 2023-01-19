type TableProps = {
    title: string,
    children: any
}

export function Table({
    title,
    children
}: TableProps) {
    return (
        <>
            {title &&
                <h2
                    className="table__title"
                >
                    {title}
                </h2>
            }
            <div className="table">
                {children}
            </div>
        </>
    )
}


type TableBodyProps = {
    children: any
}

export function TableBody({
    children
} : TableBodyProps) {
  return (
    <div className="table__body">
        {children}
    </div>
  )
}


type TableColProps = {
    children:any,
    className: string
}

export function TableCol({
    children,
    className
} : TableColProps) {
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
            {headerColumns.map((header: String, index:number) => {
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
    children: any
}

export function TableRow({
    children
}: TableRowProps) {
    return (
        <div
            className='table__row'
        >
            {children}
        </div>
    )
}