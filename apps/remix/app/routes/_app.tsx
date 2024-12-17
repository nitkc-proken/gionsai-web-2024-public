import { Outlet } from "@remix-run/react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import MobileBottombar from "~/components/mobileBottombar";

export default function App() {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
			{/* ボトムバーに被らないように */}
			<div className="h-20 lg:hidden" />
			<MobileBottombar
				onNotificationClick={() => {
					//TODO: Implement notification click
				}}
			/>
		</>
	);
}
