import { ILayout, getLayout } from "./layout";

const Legenda: React.FC<{}> = (): JSX.Element => {
	const layout = getLayout();

	return (
		<div className="legenda-item">
			{layout.map((item: ILayout) => {
				const style = item.fill
					? {
							backgroundColor: item.fill,
					  }
					: {
							borderColor: item.border,
							borderWidth: "1px",
							borderStyle: "solid",
					  };

				return (
					<div key={item.id} className="legenda-item__container">
						<div style={style} className="legenda-item__selector" />
						<p>{item.title}</p>
					</div>
				);
			})}
		</div>
	);
};

export default Legenda;
