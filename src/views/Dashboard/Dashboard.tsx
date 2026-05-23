import Roact from "@rbxts/roact";
import { hooked, useMemo } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import { ScaleContext } from "context/scale-context";
import { useAppSelector } from "hooks/common/rodux-hooks";
import { useSpring } from "hooks/common/use-spring";
import { useViewportSize } from "hooks/common/use-viewport-size";
import { hex } from "utils/color3";
import { map } from "utils/number-util";
import { scale } from "utils/udim2";
import Hint from "views/Hint";
import Clock from "../Clock";
import Navbar from "../Navbar";
import Pages from "../Pages";

// Minimum/maximum screen height that will cause the padding to decrease. Avoids
// rescaling the UI for as long as possible.
const PADDING_MIN_HEIGHT = 980;
const PADDING_MAX_HEIGHT = 1080;

// Minimum/maximum padding to apply to the UI.
const MIN_PADDING_Y = 14;
const MAX_PADDING_Y = 48;

function getPaddingY(height: number) {
	if (height < PADDING_MAX_HEIGHT && height >= PADDING_MIN_HEIGHT) {
		return map(height, PADDING_MIN_HEIGHT, PADDING_MAX_HEIGHT, MIN_PADDING_Y, MAX_PADDING_Y);
	} else if (height < PADDING_MIN_HEIGHT) {
		return MIN_PADDING_Y;
	} else {
		return MAX_PADDING_Y;
	}
}

function getScale(height: number) {
	if (height < PADDING_MIN_HEIGHT) {
		return map(height, PADDING_MIN_HEIGHT, 130, 1, 0);
	} else {
		return 1;
	}
}

function Dashboard() {
	const viewportSize = useViewportSize();
	const isOpen = useAppSelector((state) => state.dashboard.isOpen);
	const openTransparency = useSpring(isOpen ? 0 : 1, {});

	const [scaleFactor, padding] = useMemo(() => {
		return [viewportSize.map((s) => getScale(s.Y)), viewportSize.map((s) => getPaddingY(s.Y))];
	}, [viewportSize]);

	return (
		<ScaleContext.Provider value={scaleFactor}>
			{/* Shading */}
			<frame
				Size={scale(1, 1)}
				BackgroundColor3={hex("#07080D")}
				BackgroundTransparency={openTransparency}
				BorderSizePixel={0}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, hex("#07080D")),
							new ColorSequenceKeypoint(0.45, hex("#101726")),
							new ColorSequenceKeypoint(1, hex("#07080D")),
						])
					}
					Transparency={new NumberSequence(0.08, 0.32)}
					Rotation={90}
				/>
			</frame>

			<imagelabel
				Image="rbxassetid://8992238178"
				ImageColor3={hex("#56F0C2")}
				ImageTransparency={useSpring(isOpen ? 0.78 : 1, {})}
				Size={new UDim2(0, 620, 0, 360)}
				Position={new UDim2(0, -170, 0, -120)}
				BackgroundTransparency={1}
			/>
			<imagelabel
				Image="rbxassetid://8992238178"
				ImageColor3={hex("#8F6BFF")}
				ImageTransparency={useSpring(isOpen ? 0.82 : 1, {})}
				Size={new UDim2(0, 720, 0, 420)}
				Position={new UDim2(1, -460, 1, -290)}
				BackgroundTransparency={1}
			/>
			<frame
				Size={scale(1, 1)}
				BackgroundColor3={hex("#FFFFFF")}
				BackgroundTransparency={useSpring(isOpen ? 0.96 : 1, {})}
				BorderSizePixel={0}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, hex("#FFFFFF")),
							new ColorSequenceKeypoint(1, hex("#FFFFFF")),
						])
					}
					Transparency={new NumberSequence(0.86, 1)}
					Rotation={12}
				/>
			</frame>

			{/* Body */}
			<Canvas
				padding={{
					top: 48,
					bottom: padding,
					left: 48,
					right: 48,
				}}
			>
				<Canvas
					padding={{
						bottom: padding.map((p) => 56 + p), // Navbar height + padding
					}}
				>
					<Pages />
					<Hint />
				</Canvas>
				<Navbar />
				<Clock />
			</Canvas>
		</ScaleContext.Provider>
	);
}

export default hooked(Dashboard);
