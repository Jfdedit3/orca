import Roact from "@rbxts/roact";
import { pure } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import * as http from "utils/http";
import { scale } from "utils/udim2";
import { BASE_PADDING, BASE_WINDOW_HEIGHT } from "views/Pages/Scripts/constants";
import Content from "views/Pages/Scripts/Content";
import ScriptCard from "views/Pages/Scripts/ScriptCard";

async function runScriptFromUrl(url: string, src: string) {
	try {
		const content = await http.get(url);
		const [fn, err] = loadstring(content, "@" + src);
		assert(fn, `Failed to call loadstring on Lua script from '${url}': ${err}`);
		task.defer(fn);
	} catch (e) {
		warn(`Failed to run Lua script from '${url}': ${e}`);
		return "";
	}
}

function Scripts() {
	return (
		<Canvas position={scale(0, 1)} anchor={new Vector2(0, 1)}>
			{/* CMD-X */}
			<ScriptCard
				onActivate={() =>
					runScriptFromUrl("https://raw.githubusercontent.com/CMD-X/CMD-X/master/Source", "CMD-X")
				}
				index={5}
				backgroundImage="rbxassetid://8992291779"
				backgroundImageSize={new Vector2(818, 1023)}
				dropshadow="rbxassetid://8992291581"
				dropshadowSize={new Vector2(1.15, 1.4)}
				dropshadowPosition={new Vector2(0.5, 0.6)}
				anchorPoint={new Vector2(0.5, 0)}
				size={
					new UDim2(
						1 / 3,
						-BASE_PADDING * (2 / 3),
						(242 + BASE_PADDING / 2) / BASE_WINDOW_HEIGHT,
						-BASE_PADDING / 2,
					)
				}
				position={scale(0.5, 0)}
			>
				<Content header="CMD-X" footer="github.com/CMD-X" />
			</ScriptCard>

			{/* Infinite Yield */}
			<ScriptCard
				onActivate={() =>
					runScriptFromUrl(
						"https://raw.githubusercontent.com/EdgeIY/infiniteyield/master/source",
						"Infinite Yield",
					)
				}
				index={3}
				backgroundImage="rbxassetid://8992291444"
				backgroundImageSize={new Vector2(1023, 682)}
				dropshadow="rbxassetid://8992291268"
				dropshadowSize={new Vector2(1.15, 1.4)}
				dropshadowPosition={new Vector2(0.5, 0.6)}
				anchorPoint={new Vector2(0.5, 0)}
				size={
					new UDim2(1 / 3, -BASE_PADDING * (2 / 3), (242 + BASE_PADDING) / BASE_WINDOW_HEIGHT, -BASE_PADDING)
				}
				position={new UDim2(0.5, 0, 1 - (590 + BASE_PADDING / 2) / BASE_WINDOW_HEIGHT, BASE_PADDING / 2)}
			>
				<Content header="Infinite Yield" footer="github.com/EdgeIY" />
			</ScriptCard>
		</Canvas>
	);
}

export default pure(Scripts);
