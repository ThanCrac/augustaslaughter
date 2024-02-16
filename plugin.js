/**
 * @name AugustasLaughter
 * @version 1.0.0
 * @description Plays GAMBLECORE whenever AugustasLongNeck laughs at my jokes
 * @invite SsTkJAP3SE
 * @author ThanCrac
 * @authorId 557if you know you know
 * @authorLink https://github.com/ThanCrac/
 */
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
						{re: /DINGDINGDING/gmi, file: "DINGDINGDING.mp3", duration: 11520},
						{
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
										let audio = new Audio("https://github.com/Lonk12/BetterDiscordPlugins/raw/main/MemeSounds/Sounds/" + sound[1].file);
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
