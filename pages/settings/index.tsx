import Layout from "../../components/Layout";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import ChangePwd from "../../components/ChangePwd/ChangePwd";
import { useState } from "react";
import Button from "../../components/Ui/Button";

interface SettingsProp {
	userId: string;
}

const Settings: React.FC<SettingsProp> = (props): JSX.Element => {
	const { userId } = props;

	const [success, setSuccess] = useState<boolean>(false);

	const handleSuccess = () => {
		console.log("success");
		setSuccess(true);
	};

	const handleNewReset = () => {
		setSuccess(false);
	};

	return (
		<Layout>
			<div className="prenotazioni__container">
				<div className="prenotazioni__wrapper">
					<div className="prenotazioni__header">
						<h2 className="table__title txt-h3">Settings</h2>
					</div>
					<h4>Reset password</h4>
					<div className="reset-password__login--container">
						{success ? (
							<div className="reset-password__login--success">
								<p className="reset-password__login--success-text">
									Password aggiornata correttamente!
								</p>
								<Button
									onClick={handleNewReset}
									className="cta cta--primary"
									type="button"
									icon={null}
									text="Cambia nuovamente"
								/>
							</div>
						) : (
							<ChangePwd
								userId={userId}
								theme="light"
								onSuccess={handleSuccess}
							/>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const userId = session?.user?.id;
	return {
		props: { userId: userId },
	};
};

export default Settings;
