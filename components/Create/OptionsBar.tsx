import { useEffect, useState } from "react";

// Costants
import {
	Actions,
	OPTION_B_TABLE_LEFT,
	OPTION_B_TABLE_RIGHT,
	OPTION_CHAIR,
	OPTION_H_LINE_LEFT,
	OPTION_H_LINE_RIGHT,
	OPTION_T_TABLE_LEFT,
	OPTION_T_TABLE_RIGHT,
	OPTION_V_LINE_BOTTOM,
	OPTION_V_LINE_TOP,
} from "../../_shared";

// Types
import { GridPoint, Reserve, StaticCreationOptions } from "../../types";

// Icons
import { RiDeleteBin3Line } from "react-icons/ri";
import { BsBookmarkXFill } from "react-icons/bs";

// Components
import { Colors } from "../Ui/Colors";

const staticCreationElement: StaticCreationOptions[] = [
	{
		elClass: "creation-options__element",
		value: OPTION_CHAIR,
		childClass: "creation-options__seat",
	},
	{
		elClass: "creation-options__element--vLine",
		value: OPTION_V_LINE_TOP,
		childClass: "creation-options__table--vertical",
	},
	{
		elClass: "creation-options__element--vLine bottom",
		value: OPTION_V_LINE_BOTTOM,
		childClass: "creation-options__table--vertical",
	},
	{
		elClass: "creation-options__element--hLine",
		value: OPTION_H_LINE_LEFT,
		childClass: "creation-options__table--horizontal",
	},
	{
		elClass: "creation-options__element--hLine right",
		value: OPTION_H_LINE_RIGHT,
		childClass: "creation-options__table--horizontal",
	},
	{
		elClass: "creation-options__element",
		value: OPTION_T_TABLE_RIGHT,
		childClass: "creation-options__table--angle-tr",
	},
	{
		elClass: "creation-options__element",
		value: OPTION_T_TABLE_LEFT,
		childClass: "creation-options__table--angle-tl",
	},
	{
		elClass: "creation-options__element",
		value: OPTION_B_TABLE_RIGHT,
		childClass: "creation-options__table--angle-br",
	},
	{
		elClass: "creation-options__element",
		value: OPTION_B_TABLE_LEFT,
		childClass: "creation-options__table--angle-bl",
	},
];

interface OptionsBarProps {
	currentSelected: string | undefined;
	handleOptionChange: (e: string) => void;
	handleClearSeat: (action: number) => void;
	currentlyBooked?: Reserve;
}

const OptionsBar: React.FC<OptionsBarProps> = (props): JSX.Element => {
	const {
		currentSelected,
		handleOptionChange,
		handleClearSeat,
		currentlyBooked,
	} = props;

	return (
		<div className="creation-options__wrapper">
			{!currentlyBooked ? (
				staticCreationElement.map((el: StaticCreationOptions) => {
					return (
						<button
							key={el.value}
							className={`${el.elClass}${
								currentSelected === el.value &&
								el.value !== "clear"
									? " selected"
									: ""
							}`}
							onClick={() => {
								handleOptionChange(el.value);
							}}
						>
							<div className={el.childClass}></div>
						</button>
					);
				})
			) : (
				<button
					className={`creation-options__element clean`}
					onClick={() => {
						handleClearSeat(Actions.CLEAN);
					}}
				>
					<BsBookmarkXFill color={Colors.white} size={24} />
				</button>
			)}

			{!currentlyBooked && (
				<button
					className={`creation-options__element clear${
						currentSelected === "" ? " disabled" : ""
					}`}
					onClick={() => {
						handleOptionChange("");
					}}
				>
					<RiDeleteBin3Line color={Colors.white} size={24} />
				</button>
			)}
		</div>
	);
};

export default OptionsBar;
