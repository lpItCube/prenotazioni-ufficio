import ChangePwd from "../../components/ChangePwd/ChangePwd"
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

interface ChangePasswordProps {
  userId: string
}

const ChangePassword: React.FC<ChangePasswordProps> = (props) => { 

  const { userId } = props;

  return (
    <ChangePwd userId={userId} />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const userId = session?.user?.id
  return {
    props: { userId: userId}
  }
}

export default ChangePassword