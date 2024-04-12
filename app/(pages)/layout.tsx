import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import clsx from "clsx";
import { SocketProvider } from "@/context";
import { AuthProvider } from "@/context/auth";
import {Toaster} from 'react-hot-toast';
import { CashflowProvider } from "@/context/cashflow";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<AuthProvider>
					<CashflowProvider>
						<SocketProvider>
							<Toaster
								toastOptions={{
								success: {
									style: {
									fontSize: '14px',
									background: '#c1eaba',
									},
								},
								error: {
									style: {
									fontSize: '14px',
									background: '#ffdfd4',
									},
								},
								}}
								position='top-right'
							/>
							<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
								<div className="relative flex flex-col h-screen">
									<main className="container mx-auto flex-grow">
										{children}
									</main>
								</div>
							</Providers>
						</SocketProvider>
					</CashflowProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
