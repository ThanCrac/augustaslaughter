/**
 * @name AugustasLaughter
 * @version 1.0.0
 * @description Plays GAMBLECORE whenever AugustasLongNeck laughs at my jokes
 * @invite SsTkJAP3SE
 * @author ThanCrac
 * @authorId 557if you know you know
 * @authorLink https://github.com/ThanCrac/
 */

module.exports = (() => {
	/* Configuration */
	const config = {
		info: {
			name: "Augustas Laughter",
			authors: [{
				name: "ThanCrac",
				discord_id: "557388558017495046"
			}],
			version: "1.0.0",
			description: "Plays DINGDINGDING when motiejus = laugh",
			github: "https://github.com/ThanCrac/augustaslaughter/main/plugin.js",
			github_raw: "https://raw.githubusercontent.com/ThanCrac/augustaslaughter/main/plugin.js"
		},
		/* Settings */
		defaultConfig: [{
			/* General Settings */
			id: "setting",
			name: "General Sound",
			type: "category",
			collapsible: true,
			shown: false,
			settings: [
				/* Limit Channel */
				{id: "LimitChan", name: "Limit To Current Channel", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true},
				/* Sound Delay */
				{id: "delay", name: "Sound Effect Delay", note: "The delay in milliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms" },
				/* Sound Volume */
				{ id: "volume", name: "Sound Effect Volume", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v * 100) + "%" }
			]
		},
		{
			/* Toggle Sounds */
			id: "toggle",
			name: "Toggle Sounds",
			type: "category",
			collapsible: true,
			shown: false,
			settings: [
				{ id: "HA", name: "HA", type: "switch", value: true }
				
			]
		}],
		/* Change Log */
		changelog: [{
			title: "New Sounds!?",
			items: [
				"Mmm-chezburger from Roblox credits to **0x00sec**.",
				"Mario saying `yippee` credits to **0x00sec**.",
				"The hamburger meme.",
				"Mario saying YAHOO!, okiedokie, and hello in Mario64.",
				"Ness saying 'ok' from super smash bros.",
				"The most iconic part of 'moonmen' from basically every vsauce video.",
				"**NOTE: this plays when someone says 'what if' and is currently DISABLED by default!**"
			]
		},
		{
			title: "Bugs Squashed",
			type: "fixed",
			items: [
				"**Got off my ass.**",
				"The plugin."
			]
		},
		{
            title: "Improvements",
            type: "improved",
            items: [
				"You can now toggle individual sounds on and off! Credits to **0x00sec** on discord.",
				"Modified some sound lengths and added sound file metadata.",
                "Code readability.",
                "The plugin."
            ]
        },
        {
            title: "On-Going",
            type: "progress",
            items: [
                "Stuff is *totally* going on over here.",
                "Graduating highschool.",
				"General life.",
                "The plugin."
            ]
        }]
	};

	/* Library Stuff */
	return !global.ZeresPluginLibrary
		? class {
			constructor() {
				this._config = config;
			}
			getName() {
				return config.info.name;
			}
			getAuthor() {
				return config.info.authors.map(a => a.name).join(", ");
			}
			getDescription() {
				return config.info.description;
			}
			getVersion() {
				return config.info.version;
			}
			load() {
				BdApi.showConfirmationModal("Library Missing!", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, { confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => { require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => { if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r)); }); } });
			}
			start() { }
			stop() { }
		}
		: (([Plugin, Api]) => {
			const plugin = (Plugin, Api) => {
				try {
					const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
					const sounds = [

						{re: /SOUNDS/gmi, file: "DINGDINGDING.mp3", duration: 111520}
					];

					let lastMessageID = null;

					return class MemeSounds extends Plugin {
						constructor() {
							super();
						}

						getSettingsPanel() {
							return this.buildSettingsPanel().getElement();
						}

						onStart() {
							Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
						}

						messageEvent = async ({ channelId, message, optimistic }) => {
							if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId()) return;

							if (!optimistic && lastMessageID != message.id) {
								lastMessageID = message.id;
								let queue = new Map();
								const allSounds = [...sounds];

								for (let sound of allSounds) {
									for (let match of message.content.matchAll(sound.re)) {
										queue.set(match.index, sound);
									}
								}

								for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
									if (this.settings.toggle[sound[1].file.replace(/\..+$/, "")]) {
										let audio = new Audio("https://github.com/ThanCrac/augustaslaughter/raw/main/SOUND" + sound[1].file);
										audio.volume = this.settings.setting.volume;
										audio.play();
										await new Promise(r => setTimeout(r, sound[1].duration + this.settings.setting.delay));
									}
								}
							}
						};
						onStop() {
							Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
						}
					};
				}
				catch (e) {
					console.error(e);
				}
			};
			return plugin(Plugin, Api);
		})(global.ZeresPluginLibrary.buildPlugin(config));
})();
