import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ILayoutProps {
	children: ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }): JSX.Element => (
	<motion.div
		className="layout-container"
		initial={{ x: 300, opacity: 0 }}
		animate={{ x: 0, opacity: 1 }}
		exit={{ x: 300, opacity: 0, background: "red" }}
		transition={{
			type: "spring",
			stiffness: 260,
			damping: 20,
		}}
	>
		{children}
	</motion.div>
);

export default Layout;
