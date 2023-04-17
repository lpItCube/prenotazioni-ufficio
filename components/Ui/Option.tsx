type OptionProps = {
	onClick: () => any,
	label: string,
	className: string
}

const Option: React.FC<OptionProps> = (props) => {

	const { onClick, label, className } = props

	return (
		<div
			className={`option__wrapper${className}`}
			onClick={() => onClick()}
		>
			{label}
		</div>
	)
}

export default Option