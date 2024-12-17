import L, { LatLng, LatLngBounds } from "leaflet";
import { useEffect, useRef } from "react";
import { ImageOverlay, MapContainer, Marker, Tooltip } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import markerIconRetinaUrl from "../../node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "../../node_modules/leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "../../node_modules/leaflet/dist/images/marker-shadow.png";
// refs
// https://github.com/vitejs/vite-plugin-vue/discussions/104
// https://cescobaz.com/2023/06/14/setup-leaflet-with-svelte-and-vite/
L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = "";

const imgWidth = 1957;
const imgHeight = 1440;

export function SchoolMap(props: {
	buildings: { id: number; name: string; mapX: number; mapY: number }[];
	selectedBuildingId?: number;
	onSelectedBuildingChanged: (id: number) => void;
	className?: string;
}) {
	const mapRef = useRef<L.Map>(null);
	useEffect(() => {
		if (!mapRef.current) return;
		const building = props.buildings.find(
			(building) => building.id === props.selectedBuildingId,
		);
		if (!building) return;
		// 建物を中心に合わせズームする。
		mapRef.current.flyTo(new LatLng(building.mapY, building.mapX), -1);
	}, [props.selectedBuildingId, props.buildings]);
	return (
		<MapContainer
			center={new LatLng(imgHeight / 2, imgWidth / 2)}
			zoom={-2}
			minZoom={-2}
			crs={L.CRS.Simple}
			className={props.className}
			style={{
				zIndex: 0,
				aspectRatio: `${imgWidth / imgHeight}`,
			}}
			maxBounds={[
				[-imgHeight * 0.5, -imgWidth * 0.5],
				[imgHeight * 1.5, imgWidth * 1.5],
			]}
			ref={(ref) => {
				// 初期化前に建物が選択されていた場合、初期化後に処理を行う。
				const building = props.buildings.find(
					(building) => building.id === props.selectedBuildingId,
				);
				if (building) ref?.flyTo(new LatLng(building.mapY, building.mapX), -1);
				return mapRef;
			}}
		>
			<ImageOverlay
				url={"https://placehold.jp/1957x1440.png"}
				bounds={
					new LatLngBounds([
						[0, 0],
						[imgHeight, imgWidth],
					])
				}
			/>
			{props.buildings.map((building) => (
				<Marker
					key={building.id}
					position={[building.mapY, building.mapX]}
					eventHandlers={{
						click: () => {
							props.onSelectedBuildingChanged(building.id);
						},
					}}
				>
					<Tooltip permanent>
						<span
							className={
								props.selectedBuildingId === building.id
									? "text-red-500"
									: undefined
							}
						>
							{building.name}
						</span>
					</Tooltip>
				</Marker>
			))}
		</MapContainer>
	);
}
