import { HttpService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { hooked, useState } from "@rbxts/roact-hooked";
import Border from "components/Border";
import Card from "components/Card";
import Canvas from "components/Canvas";
import { useSpring } from "hooks/common/use-spring";
import { useScale } from "hooks/use-scale";
import { useTheme } from "hooks/use-theme";
import { DashboardPage } from "store/models/dashboard.model";
import * as http from "utils/http";
import { arrayToMap } from "utils/array-util";
import { hex } from "utils/color3";
import { px, scale } from "utils/udim2";

interface ScriptBloxScript {
	_id: string;
	title?: string;
	game?: {
		name?: string;
	};
	script?: string;
	verified?: boolean;
	key?: boolean;
}

interface ScriptBloxResponse {
	result?: {
		scripts?: ScriptBloxScript[];
	};
}

const PANEL_LIGHT = hex("#172236");
const TEXT = hex("#F8FBFF");
const MUTED = hex("#AAB8CF");
const ACCENT = hex("#56F0C2");
const DANGER = hex("#FF6BA7");

async function runScript(source: string | undefined, title: string) {
	if (source === undefined || source === "") {
		warn(`ScriptBlox result '${title}' has no script source.`);
		return;
	}

	const [fn, err] = loadstring(source, "@" + title);
	if (!fn) {
		warn(`Failed to load ScriptBlox result '${title}': ${err}`);
		return;
	}

	task.defer(fn);
}

function Scripts() {
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("Type something to search ScriptBlox");
	const [results, setResults] = useState<ScriptBloxScript[]>([]);
	const scaleFactor = useScale();
	const theme = useTheme("options").themes;

	async function search() {
		const trimmed = query.gsub("^%s*(.-)%s*$", "%1")[0];
		if (trimmed === "") {
			setStatus("Type a search first");
			setResults([]);
			return;
		}

		setStatus("Searching...");
		try {
			const url = `https://scriptblox.com/api/script/search?q=${HttpService.UrlEncode(trimmed)}`;
			const response = HttpService.JSONDecode(await http.get(url)) as ScriptBloxResponse;
			const scripts = response.result?.scripts ?? [];
			setResults(scripts);
			setStatus(scripts.size() === 0 ? "No results found" : `${scripts.size()} results found`);
		} catch (err) {
			setStatus(`Search failed: ${err}`);
			setResults([]);
		}
	}

	return (
		<Canvas position={scale(0, 1)} anchor={new Vector2(0, 1)}>
			<uiscale Scale={scaleFactor} />
			<Card
				index={1}
				page={DashboardPage.Scripts}
				theme={theme}
				size={px(700, 648)}
				position={new UDim2(0, 0, 1, 0)}
			>
				<Canvas padding={{ top: 26, left: 28, right: 28, bottom: 26 }}>
					<textlabel
						Text="ScriptBlox"
						Font="GothamBlack"
						TextSize={30}
						TextColor3={theme.foreground}
						TextXAlignment="Left"
						Size={px(260, 36)}
						BackgroundTransparency={1}
					/>
					<textlabel
						Text="Powered by ScriptBlox.com"
						Font="GothamBold"
						TextSize={14}
						TextColor3={theme.foreground}
						TextTransparency={0.38}
						TextXAlignment="Right"
						Size={new UDim2(1, -280, 0, 24)}
						Position={new UDim2(0, 280, 0, 8)}
						BackgroundTransparency={1}
					/>

					<SearchBox query={query} setQuery={setQuery} search={search} />

					<textlabel
						Text={status}
						Font="GothamBold"
						TextSize={15}
						TextColor3={MUTED}
						TextXAlignment="Left"
						Size={new UDim2(1, 0, 0, 24)}
						Position={px(0, 116)}
						BackgroundTransparency={1}
					/>

					<scrollingframe
						Size={new UDim2(1, 0, 1, -154)}
						Position={px(0, 154)}
						CanvasSize={px(0, math.max(results.size() * 86, 1))}
						ScrollBarThickness={4}
						ScrollBarImageColor3={ACCENT}
						BackgroundTransparency={1}
						BorderSizePixel={0}
					>
						{arrayToMap(results, (script, index) => [
							script._id,
							<ResultRow script={script} index={index} />,
						])}
					</scrollingframe>
				</Canvas>
			</Card>
		</Canvas>
	);
}

function SearchBox(props: { query: string; setQuery: (query: string) => void; search: () => void }) {
	return (
		<>
			<frame
				Size={new UDim2(1, -138, 0, 48)}
				Position={px(0, 58)}
				BackgroundColor3={PANEL_LIGHT}
				BackgroundTransparency={0.04}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
				<textbox
					Text={props.query}
					PlaceholderText="Search scripts, games, hubs..."
					PlaceholderColor3={MUTED}
					Font="GothamBold"
					TextSize={17}
					TextColor3={TEXT}
					TextXAlignment="Left"
					ClearTextOnFocus={false}
					Size={new UDim2(1, -28, 1, 0)}
					Position={px(14, 0)}
					BackgroundTransparency={1}
					Change={{ Text: (box) => props.setQuery(box.Text) }}
					Event={{
						FocusLost: (_, enterPressed) => {
							if (enterPressed) {
								props.search();
							}
						},
					}}
				/>
			</frame>
			<textbutton
				Text="Search"
				Font="GothamBlack"
				TextSize={16}
				TextColor3={hex("#07110E")}
				Size={px(118, 48)}
				Position={new UDim2(1, -118, 0, 58)}
				BackgroundColor3={ACCENT}
				BorderSizePixel={0}
				AutoButtonColor={false}
				Event={{ Activated: props.search }}
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
			</textbutton>
		</>
	);
}

function ResultRow({ script, index }: { script: ScriptBloxScript; index: number }) {
	const title = script.title ?? "Untitled script";
	const game = script.game?.name ?? "Universal";
	const details = `${game}${script.verified ? "  |  Verified" : ""}${script.key ? "  |  Key required" : ""}`;
	const rowPosition = useSpring(px(0, index * 86), { frequency: 2.6, dampingRatio: 0.82 });

	return (
		<frame
			Size={new UDim2(1, -8, 0, 72)}
			Position={rowPosition}
			BackgroundColor3={PANEL_LIGHT}
			BackgroundTransparency={0.05}
			BorderSizePixel={0}
		>
			<uicorner CornerRadius={new UDim(0, 10)} />
			<Border color={script.verified ? ACCENT : TEXT} radius={10} transparency={script.verified ? 0.62 : 0.88} />
			<textlabel
				Text={title}
				Font="GothamBlack"
				TextSize={19}
				TextColor3={TEXT}
				TextXAlignment="Left"
				TextTruncate="AtEnd"
				Size={new UDim2(1, -148, 0, 27)}
				Position={px(16, 11)}
				BackgroundTransparency={1}
			/>
			<textlabel
				Text={details}
				Font="GothamBold"
				TextSize={13}
				TextColor3={script.key ? DANGER : MUTED}
				TextXAlignment="Left"
				TextTruncate="AtEnd"
				Size={new UDim2(1, -148, 0, 20)}
				Position={px(16, 40)}
				BackgroundTransparency={1}
			/>
			<textbutton
				Text="Run"
				Font="GothamBlack"
				TextSize={15}
				TextColor3={hex("#07110E")}
				Size={px(86, 38)}
				Position={new UDim2(1, -104, 0, 17)}
				BackgroundColor3={ACCENT}
				BorderSizePixel={0}
				AutoButtonColor={false}
				Event={{ Activated: () => runScript(script.script, title) }}
			>
				<uicorner CornerRadius={new UDim(0, 8)} />
			</textbutton>
		</frame>
	);
}

export default hooked(Scripts);
