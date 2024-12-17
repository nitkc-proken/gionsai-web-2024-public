import { ExternalLink } from "lucide-react";
import type { FC } from "react";
import xLogo from "../assets/images/x-logo-black.webp";
import { Separator } from "./ui/separator";

export const Footer: FC = () => {
	return (
		<>
			<footer className="flex flex-col justify-center items-center gap-3 mt-5 mb-2">
				<Separator />
				<div>
					<img src={xLogo} alt="X logo" className="inline h-5 w-5 mr-3" />
					<a href="https://x.com/gion_festival" className="hover:underline">
						祇園祭公式 X
					</a>
					<ExternalLink className="inline align-text-bottom ml-1 h-5 w-5" />
				</div>
				<div className="">
					<a href="https://www.kisarazu.ac.jp/" className="hover:underline">
						木更津高専ホームページ
					</a>
					<ExternalLink className="inline align-text-bottom ml-1 h-5 w-5" />
				</div>
				<div className="text-center">
					<p className="text-sm">
						&copy;2024 木更津工業高等専門学校 学園祭実行委員会
					</p>
					<small className="text-xs text-gray-500">
						<span>powered by </span>
						<a href="https://x.com/NITKiC_pro" className="hover:underline">
							木更津高専プログラミング研究同好会
							<ExternalLink className="inline align-text-bottom ml-1 h-4 w-4" />
						</a>
					</small>
				</div>
			</footer>
		</>
	);
};
