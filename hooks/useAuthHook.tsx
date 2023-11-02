import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";

type UserData = {
	role: string;
	name: string;
	id: string;
};

export const useAuthHook = () => {
	const session = useSession();
	const dispatch = useDispatch();

	const [roleLoading, setRoleLoading] = useState<Boolean>(false);
	const [userData, setUserData] = useState<UserData>({
		role: "",
		name: "",
		id: "",
	});
	const [errorRole] = useState<String>();

	useEffect(() => {
		const loadUserRole = () => {
			setRoleLoading(true);

			const role: any = session?.data?.user?.role;
			const username: any = session?.data?.user?.name;
			const userId: any = session?.data?.user?.id;

			// console.log("HOOK", userId);
			setUserData({ role: role, name: username, id: userId });
			dispatch(setUser({ role, username, userId }));

			setRoleLoading(false);
		};
		loadUserRole();
	}, [session]);

	return {
		roleLoading,
		userData,
		errorRole,
	};
};
