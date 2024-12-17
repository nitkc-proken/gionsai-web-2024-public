import { useEffect, useState } from "react";
import busTimetableYaml from "~/assets/bus.yaml";
import { BusTimetable } from "~/components/BusTimetable/busTimetable";
import { Title } from "~/components/Title/title";
import type { BusTimetable as BusTimetabelSchema } from "~/generated/types/bus.schema";
import { groupingBusTimetableData } from "~/lib/utils/busTimetable";
import { getCurrentDate } from "~/lib/utils/date";

const typedBusTimetableYaml = busTimetableYaml as BusTimetabelSchema;

const fromKosenTimetableData = groupingBusTimetableData(
	typedBusTimetableYaml.fromKosen,
);
const toKosenTimetableData = groupingBusTimetableData(
	typedBusTimetableYaml.toKosen,
);

export default function Access() {
	const [currentDate, setCurrentDate] = useState(getCurrentDate());
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentDate(getCurrentDate());
		}, 1000 * 60);
		return () => clearInterval(interval);
	}, []);
	return (
		<main className="container">
			<Title title="アクセス" sub="access" variant="secondary" />
			<div className="flex flex-col md:flex-row gap-5 lg:gap-20 lg:mx-10">
				<div className="w-full md:w-1/2">
					<div
						className="relative w-full h-0 pt-[75%] [&>iframe]:absolute [&>iframe]:top-0 [&>iframe]:left-0 [&>iframe]:w-full [&>iframe]:h-full"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: GoogleMyMap のiframe埋め込みを使用したいため使用
						dangerouslySetInnerHTML={{
							__html: `<iframe src="https://www.google.com/maps/d/embed?mid=1_bHoZ5I3ionTcPIkg2_JtMC7mFsE8YI&ehbc=2E312F&noprof=1" width="640" height="480"></iframe>`,
						}}
					/>
				</div>
				<div className="md:w-1/2 space-y-4">
					<ul className="list-disc list-outside text-lg ml-5">
						<li>
							木更津駅からバス（バス乗り場西口2番、東口6番）で15分（清見台団地行き／高専前下車）徒歩2分
						</li>
						<li>祗園駅から徒歩20分</li>
					</ul>
					<div>
						<h2 className="text-xl font-bold ">最寄りのバス停について</h2>
						<ul className="list-disc list-outside ml-5">
							<li>
								<h3 className="text-lg">木更津駅(東口) → 木更津高専</h3>
								<p>
									<u>畳ヶ池経由</u> 清見台団地行き : <u>高専前</u> 下車
								</p>
								<p>
									<u>太田・祇園小経由</u> 清見台団地行き : <u>高専裏</u> 下車
								</p>
							</li>
							<li>
								<h3 className="text-lg">木更津駅(西口) → 木更津高専</h3>
								<p>
									清見台団地行き : <u>高専前</u> 下車
								</p>
							</li>
						</ul>
					</div>
					<div>
						<h2 className="text-xl font-bold">車でお越しの方へ</h2>
						<p className="text-lg">
							駐車場の台数が限られていますので、可能な限り公共交通機関で乗り合いの上お越しください。
							構内では誘導係の指示に従ってください。構内での事故などについて責任を負いかねます。
						</p>
					</div>
				</div>
			</div>
			<h2 className="text-center text-3xl font-bold mt-5">バス時刻表</h2>

			<div className="w-full grid grid-cols-1 sm:grid-cols-2 sm:gap-5 lg:gap-10">
				<BusTimetable
					direction="木更津駅 → 木更津高専"
					timetableDescription="土・日 東口・西口 共通"
					data={toKosenTimetableData}
					currentDate={currentDate}
				/>
				<BusTimetable
					direction="木更津高専 → 木更津駅"
					timetableDescription="土・日 高専前・高専裏 共通"
					data={fromKosenTimetableData}
					currentDate={currentDate}
				/>
			</div>
		</main>
	);
}
