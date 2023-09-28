import { Colors } from "../Ui/Colors";

export interface ILayout {
	id: string;
	title: string;
	fill?: string;
	border?: string;
}

export const getLayout = (): ILayout[] => {
	return [
		{
			id: "postoLibero",
			title: "Posto libero",
			fill: Colors.green500,
		},
		{
			id: "postoPrenotato",
			title: "Posto prenotato",
			fill: Colors.buisy,
		},
		{
			id: "tuaPrenotazione",
			title: "La tua prenotazione",
			fill: Colors.yourSeat,
		},
		{
			id: "approvazioneNecessaria",
			title: "In approvazione",
			fill: Colors.pending,
		},
		{
			id: "nonDisponibile",
			title: "Posto non disponibile",
			border: Colors.green500,
		},
	];
};
