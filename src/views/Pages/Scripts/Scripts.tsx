import { HttpService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { hooked, useState } from "@rbxts/roact-hooked";
import Canvas from "components/Canvas";
import Fill from "components/Fill";
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
	slug?: string;
	verified?: boolean;
	key?: boolean;
}

interface ScriptBloxResponse {
	result?: {
		scripts?: ScriptBloxScript[];
	};
}

const PANEL = hex("#101722");
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
	const [status, setStatus] = useState("Search ScriptBlox");
	const [results, setResults] = useState<ScriptBloxScript[]>([]);

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
			setStatus(scripts.size() === 0 ? "No results found" : `${scripts.size()} results`);
		} catch (err) {
			setStatus(`Search failed: ${err}`);
			setResults([]);
		}
	}

	return (
		<Canvas position={scale(0, 1)} anchor={new Vector2(0, 1)}>
			<Fill color={PANEL} transparency={0.06} radius={16}>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, hex("#172236")),
							new ColorSequenceKeypoint(1, hex("#0B1018")),
						])
					}
					Rotation={90}
				/>
			</Fill>

			<Canvas padding={{ top: 32, left: 32, right: 32, bottom: 32 }}>
				<textlabel
					Text="ScriptBlox Search"
					Font="GothamBlack"
					TextSize={32}
					TextColor3={TEXT}
					TextXAlignment="Left"
					Size={px(420, 40)}
					BackgroundTransparency={1}
				/>
				<textlabel
					Text="Powered by ScriptBlox.com"
					Font="GothamBold"
					TextSize={16}
					TextColor3={MUTED}
					TextXAlignment="Right"
					Size={new UDim2(1, -440, 0, 32)}
					Position={new UDim2(0, 440, 0, 6)}
					BackgroundTransparency={1}
				/>

				<frame Size={new UDim2(1, -150, 0, 52)} Position={px(0, 64)} BackgroundColor3={PANEL_LIGHT} BorderSizePixel={0}>
					<uicorner CornerRadius={new UDim(0, 10)} />
					<textbox
						Text={query}
						PlaceholderText="Search scripts, games, hubs..."
						PlaceholderColor3={MUTED}
						Font="GothamBold"
						TextSize={18}
						TextColor3={TEXT}
						TextXAlignment="Left"
						ClearTextOnFocus={false}
						Size={new UDim2(1, -28, 1, 0)}
						Position={px(14, 0)}
						BackgroundTransparency={1}
						Change={{
							Text: (box) => setQuery(box.Text),
						}}
						Event={{
							FocusLost: (_, enterPressed) => {
								if (enterPressed) {
									search();
								}
							},
						}}
					/>
				</frame>

				<textbutton
					Text="Search"
					Font="GothamBlack"
					TextSize={18}
					TextColor3={hex("#07110E")}
					Size={px(126, 52)}
					Position={new UDim2(1, -126, 0, 64)}
					BackgroundColor3={ACCENT}
					BorderSizePixel={0}
					AutoButtonColor={false}
					Event={{ Activated: search }}
				>
					<uicorner CornerRadius={new UDim(0, 10)} />
				</textbutton>

				<textlabel
					Text={status}
					Font="GothamBold"
					TextSize={15}
					TextColor3={MUTED}
					TextXAlignment="Left"
					Size={new UDim2(1, 0, 0, 28)}
					Position={px(0, 126)}
					BackgroundTransparency={1}
				/>

				<scrollingframe
					Size={new UDim2(1, 0, 1, -166)}
					Position={px(0, 166)}
					CanvasSize={px(0, math.max(results.size() * 94, 1))}
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
		</Canvas>
	);
}

function ResultRow({ script, index }: { script: ScriptBloxScript; index: number }) {
	const title = script.title ?? "Untitled script";
	const game = script.game?.name ?? "Universal";
	const details = `${game}${script.verified ? "  |  Verified" : ""}${script.key ? "  |  Key required" : ""}`;

	return (
		<frame
			Size={new UDim2(1, -8, 0, 78)}
			Position={px(0, index * 94)}
			BackgroundColor3={PANEL_LIGHT}
			BackgroundTransparency={0.04}
			BorderSizePixel={0}
		>
			<uicorner CornerRadius={new UDim(0, 10)} />
			<textlabel
				Text={title}
				Font="GothamBlack"
				TextSize={20}
				TextColor3={TEXT}
				TextXAlignment="Left"
				TextTruncate="AtEnd"
				Size={new UDim2(1, -150, 0, 28)}
				Position={px(18, 13)}
				BackgroundTransparency={1}
			/>
			<textlabel
				Text={details}
				Font="GothamBold"
				TextSize={14}
				TextColor3={script.key ? DANGER : MUTED}
				TextXAlignment="Left"
				TextTruncate="AtEnd"
				Size={new UDim2(1, -150, 0, 22)}
				Position={px(18, 43)}
				BackgroundTransparency={1}
			/>
			<textbutton
				Text="Run"
				Font="GothamBlack"
				TextSize={16}
				TextColor3={hex("#07110E")}
				Size={px(92, 42)}
				Position={new UDim2(1, -110, 0, 18)}
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
