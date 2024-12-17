import { Title } from "~/components/Title/title";


export default function SponsorsPage() {
	return (
		<main className="flex flex-col items-center container gap-5">
			<Title title="協賛企業" sub="sponsors" variant="secondary" />
			<p className="text-lg">2024年度祇園祭にご協賛くださった皆様</p>
			<div className="flex flex-col lg:flex-row gap-10 items-center">
				<div>
					<img
						src={"https://placehold.jp/300x300.png"}
						alt="アート・グリーンセンター"
					/>
				</div>
				<div className="w-full h-[1px] bg-slate-700 lg:hidden" />
				<div>
					<img src={"https://placehold.jp/300x300.png"} alt="房総丼丸" />
					<p className="text-lg">
						冷めても美味しい 千葉県産コシヒカリ使用
						<br />
						学割大盛りサービス実施中
					</p>
					<p className="mt-5">〒290-0041 千葉県木更津市清見台東2-3-19</p>
				</div>
				<div className="w-full h-[1px] bg-slate-700 lg:hidden" />
				<div>
					<div className="text-5xl lg:text-4xl xl:text-5xl font-bold">
						スーパー富分
						<div className="text-right text-base my-2">清見台店</div>
					</div>
					<p className="mt-5">千葉県木更津市清見台南4丁目2ー3</p>
					<p>TEL 0438-38-4866</p>
				</div>
			</div>
		</main>
	);
}
