import { darkTheme } from "themes/dark-theme";
import { Theme, ViewTheme } from "themes/theme.interface";
import { hex } from "utils/color3";

const ink = hex("#F8FBFF");
const panel = hex("#101722");
const panelDeep = hex("#0B1018");
const teal = hex("#56F0C2");
const blue = hex("#54A7FF");
const violet = hex("#8F6BFF");
const rose = hex("#FF6BA7");
const amber = hex("#FFD166");

const auroraGradient = new ColorSequence([
	new ColorSequenceKeypoint(0, teal),
	new ColorSequenceKeypoint(0.36, blue),
	new ColorSequenceKeypoint(0.72, violet),
	new ColorSequenceKeypoint(1, rose),
]);

const glassGradient = {
	color: new ColorSequence([
		new ColorSequenceKeypoint(0, hex("#182437")),
		new ColorSequenceKeypoint(0.52, panel),
		new ColorSequenceKeypoint(1, panelDeep),
	]),
	transparency: new NumberSequence(0, 0.08),
	rotation: 92,
};

const haloGradient = {
	color: auroraGradient,
	transparency: new NumberSequence(0.18, 0.86),
	rotation: 28,
};

const view: ViewTheme = {
	outlined: true,
	acrylic: true,
	foreground: ink,
	background: panel,
	backgroundGradient: glassGradient,
	transparency: 0.08,
	dropshadow: blue,
	dropshadowGradient: haloGradient,
	dropshadowTransparency: 0.22,
};

export const aurora: Theme = {
	...darkTheme,
	name: "Aurora",

	preview: {
		foreground: {
			color: new ColorSequence(ink),
		},
		background: {
			color: new ColorSequence([
				new ColorSequenceKeypoint(0, panelDeep),
				new ColorSequenceKeypoint(1, panel),
			]),
		},
		accent: {
			color: auroraGradient,
			rotation: 28,
		},
	},

	navbar: {
		...view,
		background: hex("#0E141F"),
		transparency: 0.03,
		dropshadow: teal,
		dropshadowTransparency: 0.12,
		accentGradient: {
			color: auroraGradient,
			rotation: 18,
		},
		glowTransparency: 0.04,
	},

	clock: {
		...view,
		dropshadow: violet,
		dropshadowTransparency: 0.18,
	},

	home: {
		title: {
			...view,
			backgroundGradient: {
				color: new ColorSequence([
					new ColorSequenceKeypoint(0, teal),
					new ColorSequenceKeypoint(0.45, blue),
					new ColorSequenceKeypoint(1, violet),
				]),
				transparency: new NumberSequence(0.16, 0.34),
				rotation: 24,
			},
			dropshadow: teal,
			dropshadowGradient: haloGradient,
			dropshadowTransparency: 0.06,
		},
		profile: {
			...view,
			avatar: {
				background: panelDeep,
				gradient: {
					color: auroraGradient,
					transparency: new NumberSequence(0.08, 0.36),
					rotation: 32,
				},
				transparency: 0.08,
			},
			button: {
				...darkTheme.home.profile.button,
				outlined: true,
				foreground: ink,
				foregroundTransparency: 0.18,
				background: hex("#172236"),
				backgroundHovered: hex("#203352"),
				foregroundAccent: ink,
				backgroundTransparency: 0.06,
			},
			slider: {
				...darkTheme.home.profile.slider,
				outlined: true,
				foreground: ink,
				foregroundTransparency: 0,
				background: hex("#172236"),
				backgroundTransparency: 0.04,
				indicatorTransparency: 0.08,
			},
			highlight: {
				flight: violet,
				walkSpeed: rose,
				jumpHeight: teal,
				refresh: blue,
				ghost: hex("#FF5C7A"),
				godmode: amber,
				freecam: teal,
			},
		},
		server: {
			...view,
			background: hex("#10271F"),
			backgroundGradient: {
				color: new ColorSequence([
					new ColorSequenceKeypoint(0, hex("#133D32")),
					new ColorSequenceKeypoint(1, hex("#0D171C")),
				]),
				rotation: 110,
			},
			dropshadow: teal,
			dropshadowTransparency: 0.12,
			rejoinButton: {
				...darkTheme.home.server.rejoinButton,
				outlined: true,
				foreground: ink,
				background: hex("#16362D"),
				backgroundHovered: hex("#1F4E40"),
				foregroundAccent: panelDeep,
				accent: teal,
				foregroundTransparency: 0.05,
				backgroundTransparency: 0.02,
			},
			switchButton: {
				...darkTheme.home.server.switchButton,
				outlined: true,
				foreground: ink,
				background: hex("#16362D"),
				backgroundHovered: hex("#1F4E40"),
				foregroundAccent: panelDeep,
				accent: blue,
				foregroundTransparency: 0.05,
				backgroundTransparency: 0.02,
			},
		},
		friendActivity: {
			...view,
			friendButton: {
				...darkTheme.home.friendActivity.friendButton,
				outlined: true,
				accent: teal,
				foreground: ink,
				foregroundTransparency: 0.14,
				background: hex("#172236"),
				backgroundTransparency: 0.06,
				dropshadow: blue,
				dropshadowTransparency: 0.42,
				glowTransparency: 0.28,
			},
		},
	},

	apps: {
		players: {
			...view,
			avatar: {
				background: panelDeep,
				gradient: {
					color: auroraGradient,
					transparency: new NumberSequence(0.08, 0.36),
					rotation: 28,
				},
				transparency: 0.08,
			},
			button: {
				...darkTheme.apps.players.button,
				outlined: true,
				foreground: ink,
				foregroundTransparency: 0.14,
				background: hex("#172236"),
				backgroundHovered: hex("#203352"),
				foregroundAccent: ink,
				backgroundTransparency: 0.06,
			},
			highlight: {
				teleport: teal,
				hide: amber,
				kill: rose,
				spectate: violet,
			},
			playerButton: {
				...darkTheme.apps.players.playerButton,
				outlined: true,
				accent: blue,
				foreground: ink,
				foregroundTransparency: 0.12,
				background: hex("#172236"),
				backgroundHovered: hex("#203352"),
				foregroundAccent: ink,
				backgroundTransparency: 0.06,
				dropshadow: violet,
				dropshadowTransparency: 0.45,
				glowTransparency: 0.2,
			},
		},
	},

	options: {
		themes: {
			...view,
			themeButton: {
				...darkTheme.options.themes.themeButton,
				outlined: true,
				accent: violet,
				foreground: ink,
				foregroundTransparency: 0.12,
				background: hex("#172236"),
				backgroundHovered: hex("#203352"),
				foregroundAccent: ink,
				backgroundTransparency: 0.06,
				dropshadow: violet,
				dropshadowTransparency: 0.45,
				glowTransparency: 0.18,
			},
		},
		shortcuts: {
			...view,
			shortcutButton: {
				...darkTheme.options.shortcuts.shortcutButton,
				outlined: true,
				accent: teal,
				foreground: ink,
				foregroundTransparency: 0.12,
				background: hex("#172236"),
				backgroundHovered: hex("#203352"),
				foregroundAccent: ink,
				backgroundTransparency: 0.06,
				dropshadow: teal,
				dropshadowTransparency: 0.45,
				glowTransparency: 0.18,
			},
		},
		config: {
			...view,
			configButton: {
				...darkTheme.options.config.configButton,
				outlined: true,
				accent: blue,
				foreground: ink,
				foregroundTransparency: 0.12,
				background: hex("#172236"),
				backgroundHovered: hex("#203352"),
				foregroundAccent: ink,
				backgroundTransparency: 0.06,
				dropshadow: blue,
				dropshadowTransparency: 0.45,
				glowTransparency: 0.18,
			},
		},
	},
};
