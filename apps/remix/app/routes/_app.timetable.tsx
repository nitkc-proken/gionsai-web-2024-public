import _events from "~/assets/events.yaml";
import { Timetable } from "~/components/TimeTable/timetable";
import { Title } from "~/components/Title/title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/tabs";
import type { Events } from "~/generated/types/events.schema";
import { eventsToTimeTableEvents } from "~/lib/utils/timetableView";
const events = eventsToTimeTableEvents(_events as Events);
export default function TimetablePage() {
	return (
		<main>
			<div className="flex flex-col items-center container">
				<Title title="タイムテーブル" sub="timetable" variant="secondary" />
				<div className="w-full flex  ">
					<Tabs defaultValue="day-1" className="m-auto">
						<TabsList className="w-full space-x-10">
							<TabsTrigger value="day-1">1日目</TabsTrigger>
							<TabsTrigger value="day-2">2日目</TabsTrigger>
						</TabsList>
						<TabsContent value="day-1">
							<Timetable eventsOfDay={events.day1} className="max-w-[95vw]" />
						</TabsContent>
						<TabsContent value="day-2">
							<Timetable eventsOfDay={events.day2} className="max-w-[95vw]" />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</main>
	);
}
