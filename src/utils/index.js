//#region src/utils.ts
const flag = ".__unocss_transfer__";
const cssMathFnRE = /^(?:calc|clamp|min|max)\s*\(.*\)/;
const numberWithUnitRE = /^-?[0-9.]+(px|rem|em|%|vw|vh|vmin|vmax|deg)$/;
function isNot(s) {
	return /\[&:not\(/.test(s);
}
function isCalc(s) {
	return cssMathFnRE.test(s);
}
function getFirstName(s) {
	return s.split("-")[0];
}
function getLastName(s) {
	const all = s.split("-");
	return all[all.length - 1];
}
function isUrl(s) {
	return s.startsWith("url(");
}
function isPercent(s) {
	return s.endsWith("%") && !s.includes(" ");
}
function isHex(hex) {
	return /^#[0-9A-F]{2,}$/i.test(hex);
}
function isRgb(s) {
	return s.startsWith("rgb");
}
function isHsl(s) {
	return s.startsWith("hsl");
}
function isCubicBezier(s) {
	return s.startsWith("cubic-bezier");
}
function isAttr(s) {
	return /^attr\(/i.test(s);
}
function isRepeatingLinearGradient(s) {
	return /^repeating-linear-gradient\(/i.test(s);
}
function isRepeatingRadialGradient(s) {
	return /^repeating-radial-gradient\(/i.test(s);
}
function isConstant(s) {
	return /^constant\(/.test(s);
}
function isEnv(s) {
	return /^env\(/.test(s);
}
function getVal(val, transform$1, inClass, prefix = "", dynamicFlag = false) {
	if (dynamicFlag || isCalc(val) || isUrl(val) || isHex(val) || isRgb(val) || isHsl(val) || isPercent(val) || isVar(val) || isCubicBezier(val) || isConstant(val) || isAttr(val) || isEnv(val) || isRepeatingLinearGradient(val) || isRepeatingRadialGradient(val)) return inClass ? `-[${prefix}${trim(transform$1 ? transform$1(val) : val, "all").replace(/['"]/g, "")}]` : `="[${prefix}${trim(transform$1 ? transform$1(val) : val, "all").replace(/['"]/g, "")}]"`;
	return prefix ? `-[${prefix}${transform$1 ? transform$1(val) : val}]` : `-${transform$1 ? transform$1(val) : val}`;
}
function getHundred(n) {
	if (typeof n === "string" && n.endsWith("%")) return +n.slice(0, -1);
	return Math.round(Number(n) * 100);
}
function joinWithLine(s) {
	return s.replace(/\s+/g, " ").split(/\s/g).join("-");
}
function joinWithUnderLine(s) {
	return s.replace(/\s+/g, " ").split(/\s/g).join("_");
}
const positionMap = [
	"top",
	"right",
	"bottom",
	"left",
	"center"
];
/**
* 删除空格
* @param { string } s 字符串
* @param { TrimType } type 所有 ｜ 前置 ｜ 前后 ｜ 后置 'all' | 'pre' | 'around' | 'post'
* @returns string
*/
function trim(s, type = "around") {
	if (type === "pre") return s.replace(/(^\s*)/g, "");
	if (type === "post") return s.replace(/(\s*$)/g, "");
	if (type === "all") return s.replace(/\s+/g, "");
	if (type === "around") return s.replace(/(^\s*)|(\s*$)/g, "");
	return s;
}
function transformImportant(v, trimSpace = true) {
	if (trimSpace) v = v.replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").replace(/\s*\/\s*/g, "/");
	if (/calc\([^)]+\)/.test(v)) v = v.replace(/calc\(([^)]+)\)/g, (all, k) => {
		return all.replace(k, k.replace(/\s/g, ""));
	});
	if (/rgb/.test(v)) v = v.replace(/rgba?\(([^)]+)\)/g, (all, k) => {
		const _k = k.trim().split(" ");
		return all.replace(k, _k.map((i, index) => i.endsWith(",") ? i : i + (_k.length - 1 === index ? "" : ",")).join(""));
	});
	if (/hsl/.test(v)) v = v.replace(/hsla?\(([^)]+)\)/g, (all, k) => {
		const _k = k.trim().split(" ");
		return all.replace(k, _k.map((i, index) => i.endsWith(",") ? i : i + (_k.length - 1 === index ? "" : ",")).join(""));
	});
	if (/var\([^)]+\)/.test(v)) v = v.replace(/var\(([^)]+)\)/g, (all, k) => {
		return all.replace(k, k.replace(/\s/g, "_"));
	});
	if (v.endsWith("!important")) return [v.replace(/\s*!important/, "").trim(), "!"];
	return [v.trim(), ""];
}
function diffTemplateStyle(before, after) {
	const s1 = before.match(/<style scoped>.*<\/style>/s);
	const s2 = after.match(/<style scoped>.*<\/style>/s);
	return s1[0] === s2[0];
}
function isEmptyStyle(code) {
	return /<style scoped>\s*<\/style>/.test(code);
}
function getStyleScoped(code) {
	const match = code.match(/<style scoped>(.*)<\/style>/s);
	if (!match) return "";
	return match[1];
}
function joinEmpty(str) {
	return str.replace(/\(\s*/g, "(").replace(/\s*\)/g, ")").replace(/\s*,\s*/g, ",");
}
function isVar(s) {
	return s.startsWith("var(--");
}
function isSize(s) {
	return cssMathFnRE.test(s) || numberWithUnitRE.test(s) || positionMap.includes(s);
}
function isColor(s) {
	return isHex(s) || isRgb(s) || isHsl(s);
}
const browserReg = /-webkit-|-moz-|-ms-|-o-/g;
const linearGradientReg = /linear-gradient\(\s*to([\w\s]+),?([\-\w()#%\s.]+)?,([\-\w()#%\s.]+)?,?([\-\w#%\s.]+)?\)$/;
const linearGradientReg1 = /linear-gradient\(\s*([^,]*),?([\-\w()#%\s.]+)?,([\-\w()#%\s.]+)?,?([\-\w#%\s.]+)?\)$/;
const otherGradientReg = /(radial|conic)-gradient\(([\-\w()#%\s.]+)?,([\-\w()#%\s.]+)?,?([\-\w#%\s.]+)?\)$/;
const commaReplacer = "__comma__";
function getGradient(s) {
	return s.startsWith("linear-gradient") ? "linear" : s.startsWith("radial-gradient") ? "radial" : s.startsWith("conic-gradient") ? "conic" : "";
}

//#endregion
//#region src/accent.ts
const accentMap = ["accent-color"];
function accent(key, val) {
	if (!accentMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `accent-[${joinWithUnderLine(value)}]${important}`;
}

//#endregion
//#region src/align.ts
const alignMap = [
	"align-content",
	"align-items",
	"align-self"
];
function align(key, val) {
	if (!alignMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getLastName(key)}-${value.split(" ").reverse().map(getLastName).join("-")}${important}`;
}

//#endregion
//#region src/animation.ts
const animationMap = [
	"animation",
	"animation-delay",
	"animation-direction",
	"animation-duration",
	"animation-fill-mode",
	"animation-iteration-count",
	"animation-name",
	"animation-play-state",
	"animation-timing-function"
];
function animation(key, val) {
	if (!animationMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "animation-delay") return `animate-delay${getVal(value)}${important}`;
	if (key === "animation-duration") return `animate-duration${getVal(value)}${important}`;
	if (key === "animation-name") return `animate-name-[${value}]${important}`;
	if (key === "animation-timing-function") return `animate-ease-[${value}]${important}`;
	if (key === "animation-iteration-count") return `animate-count${getVal(value)}${important}`;
	if (key === "animation-direction") return `animate-direction-${value}${important}`;
	if (key === "animation-fill-mode") return `animate-fill-${value}${important}`;
	const playStates = {
		running: "running",
		paused: "paused"
	};
	if (key === "animation-play-state") {
		if (value in playStates) return `animate-${playStates[value]}${important}`;
		return `animate-[${value}]${important}`;
	}
	if (key === "animation") {
		const parts = value.split(" ");
		const result = [];
		let timeValuesFound = 0;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (/^\d+(?:\.\d+)?s?$/.test(part)) {
				if (timeValuesFound === 0) result.push(`animate-duration${getVal(part)}`);
				else if (timeValuesFound === 1) result.push(`animate-delay${getVal(part)}`);
				else result.push(`animate-[${part}]`);
				timeValuesFound++;
			} else if (/^(?:linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/.test(part)) result.push(`animate-ease-[${part}]`);
			else if (part.startsWith("cubic-bezier") || part.startsWith("steps")) result.push(`animate-ease-[${part}]`);
			else if ([
				"alternate",
				"alternate-reverse",
				"normal",
				"reverse"
			].includes(part)) result.push(`animate-direction-${part}`);
			else if ([
				"forwards",
				"backwards",
				"both",
				"none"
			].includes(part)) result.push(`animate-fill-${part}`);
			else if (playStates[part]) result.push(`animate-${playStates[part]}`);
			else if (part === "infinite" || /^\d+$/.test(part)) result.push(`animate-count${getVal(part)}`);
			else if (part !== "normal") result.push(`animate-[${part}]`);
			else result.push(`animate-[${part}]`);
		}
		return result.length > 0 ? result.join(" ") + important : "";
	}
	return `animate-[${value}]${important}`;
}

//#endregion
//#region src/appearance.ts
const appearanceMap = ["appearance"];
function appearance(key, val) {
	if (!appearanceMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `appearance${getVal(value)}${important}`;
}

//#endregion
//#region src/aspect.ts
const aspectMap = ["aspect-ratio"];
function aspect(key, val) {
	if (!aspectMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value === "auto") return `${getFirstName(key)}-${value}${important}`;
	return `${getFirstName(key)}="[${value}]${important}"`;
}

//#endregion
//#region src/filter.ts
const percent = [
	"grayscale",
	"invert",
	"sepia"
];
const filterMap = ["filter", "backdrop-filter"];
function filter(key, val) {
	if (!filterMap.includes(key)) return;
	const [v, important] = transformImportant(val);
	const [_, name, value] = v.match(/([\w-]+)\((.*)\)/);
	if ([
		"contrast",
		"brightness",
		"saturate"
	].includes(name)) {
		const hundred = getHundred(value);
		if (Number.isNaN(hundred)) return `${name}${getVal(value)}${important}`;
		return `${name}-${hundred}${important}`;
	}
	if (name === "drop-shadow") return `drop-${dropShadow(value, important)}`;
	if (percent.includes(name)) {
		if (value.endsWith("%")) return `${name}-${value.slice(0, -1)}${important}`;
		const hundred = getHundred(value);
		if (Number.isNaN(hundred)) return `${name}${getVal(value)}${important}`;
		return `${name}-${hundred}${important}`;
	}
	if (name === "hue-rotate") {
		if (value.endsWith("deg")) return `${name}-${value.slice(0, -3)}${important}`;
		return `${name}${getVal(value)}${important}`;
	}
	return `${name}-${value}${important}`;
}
function dropShadow(val, important = "") {
	const [value] = transformImportant(val);
	return `shadow="[${value.split(" ").join("_")}]${important}"`;
}

//#endregion
//#region src/backdrop.ts
const backdropMap = ["backdrop-filter"];
function backdrop(key, val) {
	if (!backdropMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value.startsWith("var")) return;
	return `backdrop-${filter(key, value)}${important}`;
}

//#endregion
//#region src/backface.ts
const backfaceMap = ["backface-visibility"];
function backface(key, val) {
	if (!backfaceMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/background.ts
const backgroundMap = [
	"background",
	"background-attachment",
	"background-blend-mode",
	"background-clip",
	"background-color",
	"background-image",
	"background-origin",
	"background-position",
	"background-repeat",
	"background-size"
];
const lengthRe = "\\d*\\.?\\d+(?:px|em|rem|%|vw|vh)?";
const positionPair = `(${lengthRe})\\s+(${lengthRe})`;
const optimizedReg = new RegExp(`${positionPair}\\s*,\\s*${positionPair}`);
function background(key, val) {
	if (!backgroundMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "background-size") return `bg${getVal(value, /\d/.test(value) ? joinWithUnderLine : joinWithLine, false, "length:")}${important}`;
	if (["background-color", "background-attachment"].includes(key)) return `bg${getVal(value, joinWithLine)}${important}`;
	if (key === "background-position") {
		if (/\d/.test(value)) return `bg${getVal(value, joinWithUnderLine, false, "position:")}${important}`;
		return `bg${getVal(value, joinWithLine, false, "position:")}${important}`;
	}
	if (["background", "background-image"].includes(key)) {
		if (isSize(value)) return `bg${getVal(value, joinWithUnderLine, false, "position:")}${important}`;
		const temp = value.replace(/rgba?\([^)]+\)/g, "temp");
		if (/\)\s*,/.test(temp)) return `bg="[${matchMultipleBgAttrs(value)}]"`;
		if (value.startsWith("linear-gradient")) {
			const newValue = value.replace(/rgba?\(([^)]+)\)/g, (all, v) => all.replace(v, v.replace(/\s*,\s*/g, commaReplacer)));
			const matcher = newValue.match(linearGradientReg);
			if (matcher) {
				let [direction, from, via, to] = matcher.slice(1);
				direction = direction.split(" ").map((item) => item[0]).join("");
				return direction ? `bg-gradient-to-${direction}${getLinearGradientPosition$1(from, via, to)}` : getLinearGradientPosition$1(from, via, to);
			}
			const matcher1 = newValue.match(linearGradientReg1);
			if (!matcher1) return `bg="[${matchMultipleBgAttrs(value)}]"`;
			return `bg-gradient-linear bg-gradient-[${matcher1[1]}${matcher1[2] ? `,${matcher1[2].replace(/\s+/, "_").replaceAll(commaReplacer, ",")}` : ""},${matcher1[3].replace(/\s+/, "_").replaceAll(commaReplacer, ",")}]`;
		} else if (/^(?:radial|conic)-gradient/.test(value)) {
			const newValue = value.replace(/rgba?\(([^)]+)\)/g, (all, v) => all.replace(v, v.replace(/\s*,\s*/g, commaReplacer)));
			const matcher = newValue.match(otherGradientReg);
			if (!matcher) return `${important}[${key}:${joinWithUnderLine(value)}]`;
			const name = matcher[1];
			const [from, via, to] = matcher.slice(2);
			return `bg-gradient-${name}${getLinearGradientPosition$1(from, via, to)}${important}`;
		}
		const match = value.match(/^rgba?\([^)]+\)$/);
		if (match) {
			const rgb = match[0];
			return `bg="${value.replace(rgb, `[${rgb}]`)}${important}"`;
		}
		const urlMatch = value.match(/^url\(["'\s.\-\w/@]*\)$/);
		if (urlMatch) return `bg="${value.replace(urlMatch[0], `[${urlMatch[0].replace(/['"]/g, "")}]${important}`)}"`;
		const safeValueMap = new Map();
		let i = 0;
		const safeValue = value.replace(/url\([^)]+\)/g, (m) => {
			const key$1 = `__URL__${i++}`;
			safeValueMap.set(key$1, m);
			return key$1;
		}).replace(/rgba?\([^)]+\)/g, (m) => {
			const key$1 = `__RGBA__${i++}`;
			safeValueMap.set(key$1, m);
			return key$1;
		});
		if (safeValue.includes("/")) {
			const [positionRawSafe, afterSlashRawSafe] = safeValue.split("/").map((v) => v.trim());
			const afterSlashPartsSafe = afterSlashRawSafe.split(/\s+/);
			const sizeParts = afterSlashPartsSafe.slice(0, 2);
			const others = afterSlashPartsSafe.slice(2).map((v) => {
				const m = v.match(/__URL__(\d+)/);
				if (m) return safeValueMap.get(`__URL__${m[1]}`);
				const m1 = v.match(/__RGBA__(\d+)/);
				if (m1) return safeValueMap.get(`__RGBA__${m1[1]}`);
				return v;
			});
			const size$1 = sizeParts.join(" ");
			const posStr = background("background-position", `${positionRawSafe}${important ? " !important" : ""}`);
			const sizeStr = size$1 ? background("background-size", `${size$1}${important ? " !important" : ""}`) : "";
			let othersStr = "";
			if (others.length) othersStr = others.map((v) => background(key, `${v}${important ? " !important" : ""}`)).join(" ");
			return [
				posStr,
				sizeStr,
				othersStr
			].filter(Boolean).join(" ");
		} else if (safeValue.includes(" ")) {
			const m = safeValue.match(optimizedReg);
			if (m) {
				const others = safeValue.replace(m[0], "").trim().split(" ").map((v) => {
					const m$1 = v.match(/__URL__(\d+)/);
					if (m$1) return safeValueMap.get(`__URL__${m$1[1]}`);
					const m1 = v.match(/__RGBA__(\d+)/);
					if (m1) return safeValueMap.get(`__RGBA__${m1[1]}`);
					return v;
				});
				let othersStr = "";
				if (others.length) othersStr = others.map((v) => background(key, `${v}${important ? " !important" : ""}`)).join(" ");
				const posStr = background("background-position", `${m[0]}${important ? " !important" : ""}`);
				return [posStr, othersStr].filter(Boolean).join(" ");
			}
			const parts = safeValue.split(/\s+/).map((v) => {
				const m$1 = v.match(/__URL__(\d+)/);
				if (m$1) return safeValueMap.get(`__URL__${m$1[1]}`);
				const m1 = v.match(/__RGBA__(\d+)/);
				if (m1) return safeValueMap.get(`__RGBA__${m1[1]}`);
				return v;
			});
			let r = parts.map((v) => background(key, `${v}${important ? " !important" : ""}`)).join(" ");
			const bgPositionReg = /bg-\[position:([^\]]*)\]/g;
			const bgPosition = r.match(bgPositionReg);
			if (bgPosition && bgPosition.length > 1) {
				const t = `bg-[position:${bgPosition.map((item) => item.replace(bgPositionReg, "$1")).join("_")}]`;
				r = `${r.replace(bgPositionReg, "").replace(/\s+/g, " ").split(" ").filter(Boolean).concat([t]).join(" ")}`;
			}
			return r;
		}
		return `bg${getVal(value, joinWithLine)}${important}`;
	}
	if (key === "background-blend-mode") return `bg-blend-${value}${important}`;
	return `${replaceBackground(key, value)}-${transformBox(value)}${important}`;
}
function replaceBackground(s, val) {
	if (val.endsWith("repeat")) return "bg";
	return s.replace("background", "bg");
}
function transformBox(s) {
	const reg = /border|content|padding-box/;
	if (reg.test(s)) return s.replace("-box", "");
	if (s.startsWith("repeat-")) return s.replace("repeat-", "");
	return joinWithLine(s);
}
function getLinearGradientPosition$1(from, via, to) {
	let result = "";
	if (via && !to) {
		to = via;
		via = "";
	}
	if (from) {
		from = from.replaceAll(commaReplacer, ",");
		const [fromColor, fromPosition] = from.split(" ");
		if (fromPosition) result += ` from="${isRgb(fromColor) || isVar(fromColor) ? `[${fromColor}]` : fromColor} ${fromPosition}"`;
		else if (fromColor) result += ` from="${isRgb(fromColor) || isVar(fromColor) ? `[${fromColor}]` : fromColor}"`;
	}
	if (via) {
		via = via.replaceAll(commaReplacer, ",");
		const [viaColor, viaPosition] = via.split(" ");
		if (viaPosition) result += ` via="${isRgb(viaColor) || isVar(viaColor) ? `[${viaColor}]` : viaColor} ${viaPosition}"`;
		else if (viaColor) result += ` via="${isRgb(viaColor) || isVar(viaColor) ? `[${viaColor}]` : viaColor}"`;
	}
	if (to) {
		to = to.replaceAll(commaReplacer, ",");
		const [toColor, toPosition] = to.split(" ");
		if (toPosition) result += ` to="${isRgb(toColor) || isVar(toColor) ? `[${toColor}]` : toColor} ${toPosition}"`;
		else if (toColor) result += ` to="${isRgb(toColor) || isVar(toColor) ? `[${toColor}]` : toColor}"`;
	}
	return result;
}
const CONSTANTFLAG = "__transform_to_unocss__";
function matchMultipleBgAttrs(value) {
	const map$2 = {};
	let i = 0;
	value = value.replace(/(rgba?|hsla?|lab|lch|hwb|color)\(\)*\)/g, (_) => {
		map$2[i++] = _;
		return `${CONSTANTFLAG}${i}}`;
	});
	value = value.split(/\)\s*,/).map((item) => `${item.replace(/\s*,\s*/g, ",").replace(/\s+/g, "_")}`).join("),");
	Object.keys(map$2).forEach((key) => {
		value = value.replace(`${CONSTANTFLAG}${key}}`, map$2[key]);
	});
	return value;
}

//#endregion
//#region src/border.ts
const borderSize = [
	"border-top",
	"border-right",
	"border-bottom",
	"border-left"
];
const widthMatchMap = {
	"inline": "x",
	"block": "y",
	"inline-start": "s",
	"inline-end": "e",
	"top": "t",
	"right": "r",
	"bottom": "b",
	"left": "l"
};
const radiusMatchMap = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l",
	end: "e",
	start: "s"
};
function border(key, val) {
	let [value, important] = transformImportant(val);
	if (key === "border-spacing") return `${key}="[${joinWithUnderLine(value)}]${important}"`;
	if (key === "border-color") {
		if (value.includes(" ")) {
			const len = value.split(" ").length;
			const vs = value.split(" ").map((s) => isHex(s) || isRgb(s) || isHsl(s) ? `-[${s}]` : `-${s}`);
			const [top$1, right, bottom, left] = vs;
			switch (len) {
				case 2: return `border-y${top$1}${important} border-x${right}${important}`;
				case 3: return `border-t${top$1}${important} border-b${bottom}${important} border-x${right}${important}`;
				case 4: return `border-t${top$1}${important} border-b${bottom}${important} border-r${right}${important} border-l${left}${important}`;
			}
		}
		return `border${getVal(value)}${important}`;
	}
	const radiusMatch = key.match(/border(-start|-end|-top|-bottom)?(-start|-end|-left|-right)?-radius/);
	if (radiusMatch) {
		const [_, start, end] = radiusMatch;
		if (start && end) return `${important}rounded-${radiusMatchMap[start.slice(1)]}${radiusMatchMap[end.slice(1)]}${getVal(value, joinWithUnderLine)}`;
		if (start || end) return `${important}rounded-${radiusMatchMap[(start === null || start === void 0 ? void 0 : start.slice(1)) || (end === null || end === void 0 ? void 0 : end.slice(1))]}${getVal(value, joinWithUnderLine)}`;
		return `${important}rounded${getVal(value, joinWithUnderLine, false, "", true)}`;
	}
	const widthMatch = key.match(/border(-inline|-block|-inline-start|-inline-end|-top|-right|-bottom|-left)?-(width|color)/);
	if (widthMatch) {
		if (widthMatch[1]) {
			const widthType = widthMatchMap[widthMatch[1].slice(1)];
			return `${important}border-${widthType}${getVal(value, joinWithUnderLine, false, "length:")}`;
		}
		return `${important}border${getVal(value, joinWithUnderLine, false, "length:")}`;
	}
	if (borderSize.some((b) => key.startsWith(b))) {
		const keys = key.split("-");
		if (keys.slice(-1)[0] === "radius") return value.split(" ").map((v) => `border-rd-${keys.slice(1, -1).map((s) => s[0]).join("")}${getVal(v)}${important}`).join(" ");
		return value.split(" ").map((v) => `border-${key.split("-")[1][0]}${getVal(v)}${important}`).join(" ");
	}
	if (key.startsWith("border-image")) return "";
	if (key === "border-width" && value.includes(" ")) return value.split(" ").map((v, i) => `border-${borderSize[i].split("-")[1][0]}${getVal(v)}${important}`).join(" ");
	if (/^\d[%|(px)rem]$/.test(value) || key === "border-collapse") return `border-${value}${important}`;
	if (key === "border-width") return `border${getVal(value)}${important}`;
	if (key === "border-color") {
		if (value === "currentColor") return `border-current${important}`;
		return `border${getVal(value)}${important}`;
	}
	if (key === "border-style") {
		const styles = value.split(" ");
		if (styles.length === 4) return `border-t-${styles[0]} border-r-${styles[1]} border-b-${styles[2]} border-l-${styles[3]}`;
		if (styles.length === 3) return `border-t-${styles[0]} border-x-${styles[1]} border-b-${styles[2]}`;
		if (styles.length === 2) return `border-y-${styles[0]} border-x-${styles[1]}`;
		return `border${getVal(value)}${important}`;
	}
	return value.split(" ").map((v) => {
		if (value === "currentColor") return `border-current${important}`;
		return `border${getVal(v)}${important}`;
	}).join(" ");
}

//#endregion
//#region src/box.ts
const boxMap = [
	"box-sizing",
	"box-decoration-break",
	"box-shadow"
];
function box(key, val) {
	if (!boxMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key.startsWith("box-decoration-break")) return `box-decoration-${value}${important}`;
	if (key === "box-sizing") return `box-${getFirstName(value)}${important}`;
	if (key === "box-shadow") return `shadow="[${value.split(" ").join("_")}]${important}"`;
}

//#endregion
//#region src/break.ts
const breakMap = [
	"break-inside",
	"break-before",
	"break-after"
];
function transformBreak(key, val) {
	if (!breakMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}-${value}${important}`;
}

//#endregion
//#region src/caption.ts
const captionMap = ["caption-side"];
function caption(key, val) {
	if (!captionMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/caret.ts
const caretMap = ["caret-color"];
function caret(key, val) {
	if (!caretMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/clear.ts
const clearMap = ["clear"];
function clear(key, val) {
	if (!clearMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}-${value}${important}`;
}

//#endregion
//#region src/color.ts
const colorMap = ["color"];
function color(key, val) {
	if (!colorMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `text${getVal(value)}${important}`;
}

//#endregion
//#region src/column.ts
const columnMap = ["column-gap"];
function column(key, val) {
	if (!columnMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "column-gap") return `gap-x-${value}${important}`;
}

//#endregion
//#region src/columns.ts
const columnsMap = ["columns"];
function columns(key, val) {
	if (!columnsMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}-${value}${important}`;
}

//#endregion
//#region src/content.ts
const contentMap = ["content", "content-visibility"];
function content(key, val) {
	if (!contentMap.includes(key)) return;
	const [value, important] = transformImportant(val, false);
	if (key === "content-visibility") return `content-visibility-${value}${important}`;
	const match = value.match(/^(["'])(.*?)\1$/);
	if (match) return `content-['${match[2].replace(/\s/g, "_")}']${important}`;
	return `content-[${value}]${important}`;
}

//#endregion
//#region src/cursor.ts
const cursorMap = ["cursor"];
function cursor(key, val) {
	if (!cursorMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}${getVal(value)}${important}`;
}

//#endregion
//#region src/display.ts
const displayMap = ["display"];
function display(key, val) {
	if (!displayMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value === "none") return `hidden${important}`;
	if (value === "hidden") return `invisible${important}`;
	return `${value}${important}`;
}

//#endregion
//#region src/empty.ts
const emptyKey = {
	show: "visible",
	hide: "hidden"
};
const emptyMap = ["empty-cells"];
function empty(key, val) {
	if (!emptyMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (emptyKey[value]) return `table-empty-cells-${emptyKey[value]}${important}`;
}

//#endregion
//#region src/fill.ts
const fillMap = ["fill"];
function fill(key, val) {
	if (!fillMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}-${value}${important}`;
}

//#endregion
//#region src/flex.ts
const lastMaps = [
	"flex-basis",
	"flex-grow",
	"flex-shrink"
];
const flexMap = [
	"flex",
	"flex-grow",
	"flex-shrink",
	"flex-basis",
	"flex-wrap",
	"flex-direction"
];
function flex(key, val) {
	if (!flexMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (lastMaps.includes(key)) return `${getLastName(key)}${getVal(value)}${important}`;
	if (value === "1") return `flex-1${important}`;
	if (/^\d+$/.test(value)) return `flex-[${value}]${important}`;
	const firstVal = value[0];
	if (key === "flex" && (firstVal === "0" || firstVal === "1")) return `flex="[${joinWithUnderLine(value)}]${important}"`;
	return `${getFirstName(key)}-${value.replace("column", "col")}${important}`;
}

//#endregion
//#region src/float.ts
const floatMap = ["float"];
function float(key, val) {
	if (!floatMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}-${getLastName(value)}${important}`;
}

//#endregion
//#region src/font.ts
const fontMap = [
	"font",
	"font-size",
	"font-weight",
	"font-family",
	"font-style",
	"font-variant-numeric"
];
function font(key, val) {
	if (!fontMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "font-size") {
		if ([
			"inherit",
			"initial",
			"revert",
			"unset",
			"revert-layer"
		].includes(value)) return `font-size-${value}${important}`;
		return `text-${value}${important}`;
	}
	if (key === "font-weight") return `font${getVal(value)}${important}`;
	if (key === "font-family") {
		const match = value.match(/ui-(\w{0,4})/);
		if (!match) return `font-[${joinWithUnderLine(val)}]${important}`;
		const [_, family] = match;
		return `font-${family}${important}`;
	}
	if (key === "font-style") {
		if (value === "normal") return `font-not-italic${important}`;
		return `font-${value}${important}`;
	}
	if (key === "font-variant-numeric") {
		if (value === "normal") return `normal-nums${important}`;
		return `${value}${important}`;
	}
	return `font="${transformFont(value)}${important}"`;
}
function transformFont(v) {
	return v.split(" ").map((item) => /^\d/.test(item) ? `text-${item}` : item).join(" ");
}

//#endregion
//#region src/gap.ts
const gapMap = [
	"gap",
	"gap-x",
	"gap-y"
];
function gap(key, val) {
	if (!gapMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key.startsWith("column")) return `gap-x${getVal(value)}${important}`;
	if (key.startsWith("row")) return `gap-y${getVal(value)}${important}`;
	return `gap${getVal(value)}${important}`;
}

//#endregion
//#region src/grid.ts
const gridMap = [
	"grid",
	"grid-row",
	"grid-column",
	"grid-template-columns",
	"grid-template-rows",
	"grid-auto-flow",
	"grid-auto-columns",
	"grid-auto-rows",
	"grid-column-start",
	"grid-column-end",
	"grid-row-start",
	"grid-row-end"
];
function grid(key, val) {
	if (!gridMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key.startsWith("grid-template")) {
		const matcher$1 = value.match(/^repeat\s*\(\s*(\d+)/);
		if (matcher$1) return `grid-${getLastName(key) === "rows" ? "rows" : "cols"}-${matcher$1[1]}${important}`;
		if (value.startsWith("repeat(")) return;
		return `grid-${getLastName(key) === "rows" ? "rows" : "cols"}${value.includes(" ") ? `-[${joinWithUnderLine(value)}]` : getVal(value)}${important}`;
	}
	if (key === "grid-auto-flow") return `grid-flow-${joinWithLine(value).replace("column", "col")}${important}`;
	if (key.startsWith("grid-auto")) {
		if (/\d/.test(value)) return `auto-${getLastName(key) === "rows" ? "rows" : "cols"}-[${joinWithUnderLine(value)}]${important}`;
		return `auto-${getLastName(key) === "rows" ? "rows" : "cols"}-${getFirstName(value)}${important}`;
	}
	const matcher = value.match(/span\s+([^/]+)\/\s*span\s+(.*)/);
	if (matcher) {
		if (matcher[1] !== matcher[2]) return;
		return `${key.slice(5).replace("column", "col")}-span${getVal(matcher[1])}${important}`;
	}
	if (value === "1/-1") return `${key.slice(5).replace("column", "col")}-span-full${important}`;
	return `${key.slice(5).replace("column", "col")}${getVal(value)}${important}`;
}

//#endregion
//#region src/hyphens.ts
const hyphensMap = ["hyphens"];
function hyphens(key, val) {
	if (!hyphensMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}${getVal(value)}${important}`;
}

//#endregion
//#region src/inset.ts
const insetMap = ["inset-inline-start", "inset-inline-end"];
function inset(key, val) {
	if (!insetMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "inset-inline-start") return `start${getVal(value)}${important}`;
	if (key === "inset-inline-end") return `end${getVal(value)}${important}`;
}

//#endregion
//#region src/isolation.ts
const isolationMap = ["isolation"];
function isolation(key, val) {
	if (!isolationMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (val === "isolate") return `${value}${important}`;
	return `${key}-${value}${important}`;
}

//#endregion
//#region src/justify.ts
const justifyMap = [
	"justify",
	"justify-content",
	"justify-items",
	"justify-self"
];
function justify(key, val) {
	if (!justifyMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value.includes(" ")) return;
	if (key === "justify-content") return `justify-${getLastName(value)}${important}`;
	return `${key}-${getLastName(value)}${important}`;
}

//#endregion
//#region src/letter.ts
const letterMap = ["letter-spacing"];
function letter(key, val) {
	if (!letterMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `tracking${getVal(value)}${important}`;
}

//#endregion
//#region src/line.ts
const lineKey = {
	1: "none",
	1.25: "tight",
	1.375: "snug",
	1.5: "normal",
	1.625: "relaxed",
	2: "loose"
};
const lineMap = ["line-height"];
function line(key, val) {
	if (!lineMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value in lineKey) return `lh-${lineKey[value]}${important}`;
	return `lh${getVal(value, (v) => /\d$/.test(v) ? `[${v}]` : v)}${important}`;
}

//#endregion
//#region src/list.ts
const listMap = [
	"list-style",
	"list-style-type",
	"list-style-position",
	"list-style-image"
];
function list(key, val) {
	if (!listMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "list-style-image") {
		if (value === "none") return `${getFirstName(key)}-none${important}`;
		return `${getFirstName(key)}${getVal(value)}${important}`;
	}
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/margin.ts
const map$1 = {
	"margin-left": "ml",
	"margin-right": "mr",
	"margin-top": "mt",
	"margin-bottom": "mb",
	"margin-inline-start": "ms",
	"margin-inline-end": "me",
	"padding-left": "pl",
	"padding-right": "pr",
	"padding-top": "pt",
	"padding-bottom": "pb",
	"padding-inline-start": "ps",
	"padding-inline-end": "pe"
};
function transformMargin(key, val) {
	const [value, important] = transformImportant(val);
	const specail = map$1[key];
	if (specail) return `${specail}${getVal(value)}${important}`;
	const values = value.split(" ");
	const len = values.length;
	if (len === 1) return `${key[0]}${getVal(values[0])}${important}`;
	if (len === 2) return `${key[0]}x${getVal(values[1])}${important} ${key[0]}y${getVal(values[0])}${important}`;
	if (len === 3) return `${key[0]}x${getVal(values[1])}${important} ${key[0]}t${getVal(values[0])}${important} ${key[0]}b${getVal(values[2])}${important}`;
	return `${key[0]}t${getVal(values[0])}${important} ${key[0]}b${getVal(values[2])}${important} ${key[0]}l${getVal(values[3])}${important} ${key[0]}r${getVal(values[1])}${important}`;
}

//#endregion
//#region src/mask.ts
const maskMap = [
	"mask-position",
	"mask-origin",
	"mask-repeat",
	"mask-size",
	"mask-type",
	"mask-image",
	"mask-mode",
	"mask-composite",
	"mask-clip",
	"mask-type"
];
function mask(key, val) {
	if (!maskMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if ([
		"mask-clip",
		"mask-origin",
		"mask-type"
	].includes(key)) return `${key}-${getFirstName(value)}${important}`;
	if (["mask-mode", "mask-composite"].includes(key)) return `${getFirstName(key)}-${getFirstName(value)}${important}`;
	if (["mask-position", "mask-size"].includes(key)) {
		if (isCalc(value) || isUrl(value) || isHex(value) || isRgb(value) || isHsl(value) || isPercent(value) || isVar(value) || isCubicBezier(value)) return `${important}${key}${getVal(value)}`;
		if (/\d/.test(value)) return `${important}[${key}:${joinWithUnderLine(value)}]`;
		return `${important}${getFirstName(key)}-${joinWithLine(value)}`;
	}
	if (key === "mask-repeat") {
		if (value.includes("-")) return `mask-${value}${important}`;
		return `${key}-${value}${important}`;
	}
	if (key === "mask-image") {
		const type = getGradient(value);
		if (type) {
			const newValue = value.replace(/rgba?\(([^)]+)\)/g, (all, v) => all.replace(v, v.replace(/\s*,\s*/g, commaReplacer)));
			const matcher = newValue.match(linearGradientReg);
			if (!matcher) return `[${key}:${joinWithUnderLine(value)}]${important}`;
			let [direction, from, via, to] = matcher.slice(1);
			direction = direction.split(" ").map((item) => item[0]).join("");
			return direction ? `${getLinearGradientPosition(`mask-${direction}`, from, via, to).trim()}` : getLinearGradientPosition(`mask-${type}`, from, via, to).trim();
		}
		return `mask${getVal(value)}${important}`;
	}
	return `${key}${getVal(value)}${important}`;
}
function getLinearGradientPosition(prefix, from, via, to) {
	let result = "";
	if (via && !to) {
		to = via;
		via = "";
	}
	if (from) {
		from = from.replaceAll(commaReplacer, ",");
		const [fromColor, fromPosition] = from.split(" ");
		if (fromPosition) result += ` ${prefix}-from="${isRgb(fromColor) || isVar(fromColor) ? `[${fromColor}]` : fromColor} ${fromPosition}"`;
		else if (fromColor) result += ` ${prefix}-from-${isRgb(fromColor) || isVar(fromColor) ? `[${fromColor}]` : fromColor}`;
	}
	if (via) {
		via = via.replaceAll(commaReplacer, ",");
		const [viaColor, viaPosition] = via.split(" ");
		if (viaPosition) result += ` ${prefix}-via="${isRgb(viaColor) || isVar(viaColor) ? `[${viaColor}]` : viaColor} ${viaPosition}"`;
		else if (viaColor) result += ` ${prefix}-via${isRgb(viaColor) || isVar(viaColor) ? `[${viaColor}]` : viaColor}`;
	}
	if (to) {
		to = to.replaceAll(commaReplacer, ",");
		const [toColor, toPosition] = to.split(" ");
		if (toPosition) result += ` ${prefix}-to="${isRgb(toColor) || isVar(toColor) ? `[${toColor}]` : toColor} ${toPosition}"`;
		else if (toColor) result += ` ${prefix}-to-${isRgb(toColor) || isVar(toColor) ? `[${toColor}]` : toColor}`;
	}
	return result;
}

//#endregion
//#region src/max.ts
const maxMap = [
	"max-height",
	"max-width",
	"max-block-size",
	"max-inline-size",
	"min-height",
	"min-width",
	"min-block-size",
	"min-inline-size"
];
function max(key, val) {
	if (!maxMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (/(?:max|min)-(?:inline|block)-size/.test(key)) {
		const fixedKey = key.split("-").slice(0, 2).join("-");
		if (/\d/.test(value) || isVar(value) || isCalc(value)) return `${fixedKey}${getVal(value)}${important}`;
		return `${fixedKey}-${getFirstName(value)}${important}`;
	}
	const all = key.split("-");
	const attributeValue = isCalc(value) || isVar(value) ? getVal(value) : getVal(getFirstName(value));
	return `${all[0]}-${all[1][0]}${attributeValue}${important}`;
}

//#endregion
//#region src/mix.ts
const mixMap = ["mix-blend-mode"];
function mix(key, val) {
	if (!mixMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `mix-blend-${value}${important}`;
}

//#endregion
//#region src/object.ts
const objectMap = ["object-fit", "object-position"];
function object(key, val) {
	if (!objectMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "object-position") {
		if (isVar(value)) return `${getFirstName(key)}${getVal(value)}${important}`;
		return `${getFirstName(key)}-${joinWithLine(value)}${important}`;
	}
	return `${getFirstName(key)}-${value}${important}`;
}

//#endregion
//#region src/opacity.ts
const opacityMap = ["opacity"];
function opacity(key, val) {
	if (!opacityMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	const hundred = getHundred(value);
	if (Number.isNaN(hundred)) return `${key}${getVal(value)}${important}`;
	return `op-${hundred}${important}`;
}

//#endregion
//#region src/order.ts
const orderMap = ["order"];
function order(key, val) {
	if (!orderMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}${getVal(value)}${important}`;
}

//#endregion
//#region src/outline.ts
const outlineMap = [
	"outline-width",
	"outline-style",
	"outline-offset",
	"outline",
	"outline-color"
];
function outline(key, val) {
	if (!outlineMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "outline-offset") return `${key}${getVal(value)}${important}`;
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/word.ts
const wordMap = [
	"word-break",
	"word-spacing",
	"word-wrap",
	"overflow-wrap"
];
function word(key, val) {
	if (!wordMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key.startsWith("word-spacing")) return `word-spacing${getVal(val)}${important}`;
	if (value === "keep-all") return `break-keep${important}`;
	if (value === "break-word") return `break-words${important}`;
	return `break-${getLastName(value)}${important}`;
}

//#endregion
//#region src/overflow.ts.ts
const overflowMap = [
	"overflow",
	"overflow-x",
	"overflow-y",
	"overflow-wrap"
];
function overflow(key, val) {
	if (!overflowMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "overflow-wrap") return word(key, val);
	return `${key}-${value}${important}`;
}

//#endregion
//#region src/overscroll.ts
const overscrollMap = [
	"overscroll-behavior",
	"overscroll-behavior-x",
	"overscroll-behavior-y"
];
function overscroll(key, val) {
	if (!overscrollMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	const [prefix, _, suffix] = key.split("-");
	if (suffix) return `${prefix}-${suffix}-${value}${important}`;
	return `${prefix}-${value}${important}`;
}

//#endregion
//#region src/perspective.ts
const perspectiveMap = ["perspective", "perspective-origin"];
function perspective(key, val) {
	if (!perspectiveMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}${getVal(value, joinWithLine)}${important}`;
}

//#endregion
//#region src/place.ts
const placeMap = [
	"place-content",
	"place-items",
	"place-self"
];
function place(key, val) {
	if (!placeMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value.includes(" ")) return;
	return `${key}-${getLastName(value)}${important}`;
}

//#endregion
//#region src/pointer.ts
const pointerMap = ["pointer-events"];
function pointer(key, val) {
	if (!pointerMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}-${getLastName(value)}${important}`;
}

//#endregion
//#region src/position.ts
const positionMap$1 = ["position"];
function position(key, val) {
	if (!positionMap$1.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value === "none") return `hidden${important}`;
	if (value === "hidden") return `invisible${important}`;
	return `${value}${important}`;
}

//#endregion
//#region src/resize.ts
const map = {
	vertical: "y",
	horizontal: "x"
};
const resizeMap = ["resize"];
function resize(key, val) {
	if (!resizeMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value === "both") return `${key}${important}`;
	return `${key}-${map[value] || value}${important}`;
}

//#endregion
//#region src/rotate.ts
const rotateMap = ["rotate"];
function rotate(key, val) {
	if (!rotateMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value.includes(" ")) return `rotate-[${joinWithUnderLine(value)}]${important}`;
	return `rotate${getVal(value)}${important}`;
}

//#endregion
//#region src/row.ts
const rowMap = ["row-gap"];
function row(key, val) {
	if (!rowMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `gap-y${getVal(value)}${important}`;
}

//#endregion
//#region src/scroll.ts
const scrollMap = [
	"scroll-snap-type",
	"scroll-snap-stop",
	"scroll-snap-align",
	"scroll-padding",
	"scroll-padding-inline",
	"scroll-padding-block",
	"scroll-padding-inline-start",
	"scroll-padding-inline-end",
	"scroll-padding-block-start",
	"scroll-padding-block-end",
	"scroll-padding-top",
	"scroll-padding-right",
	"scroll-padding-bottom",
	"scroll-padding-left",
	"scroll-margin",
	"scroll-margin-inline",
	"scroll-margin-block",
	"scroll-margin-inline-start",
	"scroll-margin-inline-end",
	"scroll-margin-block-start",
	"scroll-margin-block-end",
	"scroll-margin-top",
	"scroll-margin-right",
	"scroll-margin-bottom",
	"scroll-margin-left",
	"scroll-behavior"
];
function scroll(key, val) {
	if (!scrollMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key.startsWith("scroll-snap")) {
		if (value.includes(" ")) {
			const [pre, after] = value.split(" ");
			return `snap-${pre}${getVal(after)}${important}`;
		}
		return `snap-${value}${important}`;
	}
	if (key === "scroll-behavior") return `scroll-${value}${important}`;
	const [_, prefix, suffix, way] = key.match(/scroll-(margin|padding)-?(\w+)?-?(\w+)?/);
	if (suffix === "inline" && way) return `scroll-${prefix[0]}${way[0]}${getVal(value)}${important}`;
	if (suffix) return `scroll-${prefix[0]}${suffix[0]}${getVal(value)}${important}`;
	return `scroll-${prefix[0]}${getVal(value)}${important}`;
}

//#endregion
//#region src/size.ts
const sizeMap = [
	"z-index",
	"width",
	"height"
];
function size(key, val) {
	if (!sizeMap.includes(key)) return;
	let [value, important] = transformImportant(val);
	let prefix = "";
	if (value.startsWith("-")) {
		prefix = "-";
		value = value.slice(1);
	}
	if (isCalc(value) || isVar(value) || /\d/.test(value)) return `${prefix}${key[0]}${getVal(value)}${important}`;
	return `${key[0]}-${getFirstName(value)}${important}`;
}

//#endregion
//#region src/stroke.ts
const strokeMap = ["stroke", "stroke-width"];
function stroke(key, val) {
	if (!strokeMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/table.ts
const tableMap = ["table-layout"];
function table(key, val) {
	if (!tableMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/text.ts
const textMap = [
	"text-align",
	"text-align-last",
	"text-decoration-line",
	"text-decoration-style",
	"text-decoration-color",
	"text-decoration-thickness",
	"text-indent",
	"text-underline-offset",
	"text-transform",
	"text-wrap",
	"text-overflow",
	"text-justify",
	"text-shadow"
];
function text(key, val) {
	if (!textMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "text-decoration-line") {
		if (value === "none") return `no-underline${important}`;
		return `${value}${important}`;
	}
	if (key === "text-transform") {
		if (value === "none") return `normal-case${important}`;
		return `${value}${important}`;
	}
	if (key.startsWith("text-decoration") || key === "text-indent") return `${key.split("-")[1]}${getVal(value)}${important}`;
	if (key === "text-underline-offset") return `underline-offset${getVal(value)}${important}`;
	if (key === "text-align-last") return `${important}[${key}:${value}]`;
	if ([
		"inherit",
		"initial",
		"revert",
		"unset",
		"revert-layer"
	].includes(value)) return `${important}text-align-${value}`;
	return `text${getVal(value)}${important}`;
}

//#endregion
//#region src/top.ts
const topMap = [
	"top",
	"right",
	"bottom",
	"left"
];
function top(key, val) {
	if (!topMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${key}${getVal(value)}${important}`;
}

//#endregion
//#region src/touch.ts
const touchMap = ["touch-action"];
function touch(key, val) {
	if (!touchMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getFirstName(key)}${getVal(value)}${important}`;
}

//#endregion
//#region src/transform.ts
const transformMap = [
	"transform",
	"transform-origin",
	"transform-style"
];
function transform(key, val) {
	if (!transformMap.includes(key)) return;
	const [v, important] = transformImportant(val);
	if (key === "transform-origin") {
		if (isVar(v) || isCalc(v)) return `origin${getVal(v)}${important}`;
		return `origin-${/\d/.test(v) && v.includes(" ") ? `[${joinWithUnderLine(v)}]` : joinWithLine(v)}${important}`;
	}
	if (key === "transform-style") return `transform-${v}${important}`;
	if (val === "none") return `${key}-none${important}`;
	return joinEmpty(v).split(" ").map((v$1) => {
		const matcher = v$1.match(/([a-z]+)(3d)?([A-Z])?\((.*)\)/);
		if (!matcher) return void 0;
		const [_, namePrefix, is3d, nameSuffix, value] = matcher;
		if (nameSuffix) {
			const values = value.replace(/,(?![^()]*\))/g, " ").split(" ");
			if (values.length > 1) return `${namePrefix}-${nameSuffix.toLowerCase()}="${values.map((v$2) => isVar(v$2) ? `[${v$2}]` : namePrefix === "scale" ? getHundred(v$2) : transformVal(v$2)).join(" ")}${important}"`;
			return `${namePrefix}="${nameSuffix.toLowerCase()}-${isVar(values[0]) ? `[${values[0]}]` : namePrefix === "scale" ? getHundred(values[0]) : transformVal(values[0])}${important}"`;
		} else {
			let values = value.replace(/,(?![^()]*\))/g, " ").split(" ");
			if (values.length > 1) {
				if (namePrefix === "translate") return `${namePrefix}="[${values.join(",")}]"`;
				if (values.some((v$2) => (isCalc(v$2) || isVar(v$2)) && !v$2.endsWith(")"))) values = [value];
				return `${namePrefix}="${values.map((v$2) => {
					const _v = isVar(v$2) || isCalc(v$2) ? `[${v$2}]` : namePrefix === "scale" ? getHundred(v$2) : transformVal(v$2);
					return _v;
				}).join(" ")}${important}"`;
			}
			return `${namePrefix}="${isVar(values[0]) ? `[${values[0]}]` : namePrefix === "scale" ? getHundred(values[0]) : transformVal(values[0])}${important}"`;
		}
	}).filter(Boolean).join(" ");
}
function transformVal(val) {
	if (val.endsWith("deg")) return val.slice(0, -3);
	return val;
}

//#endregion
//#region src/transition.ts
const times = ["transition-delay", "transition-duration"];
const transitionMap = [
	"transition",
	"transition-property",
	"transition-duration",
	"transition-delay",
	"transition-timing-function",
	"transition-behavior"
];
function transition(key, val) {
	if (!transitionMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (key === "transition-timing-function") {
		if (value === "linear") return `ease-${value}${important}`;
		return `ease="[${value}]${important}"`;
	}
	if (key === "transition") return `transition="${transformTransition(value, important)}"`;
	if (key === "transition-property") {
		if (value.includes("color")) return `transition-color${important}`;
		if (value === "box-shadow") return `transition-shadow${important}`;
		return `transition-${value}${important}`;
	}
	if (key === "transition-behavior") return `transition-${getLastName(value)}${important}`;
	const _val = getVal(value);
	if (_val === `-${value}` && times.includes(key)) {
		let num = value.trim();
		if (num.endsWith("ms")) num = num.replace(/ms$/, "");
		else if (num.endsWith("s")) num = (Number.parseFloat(num.replace(/s$/, "")) * 1e3).toString();
		return `${key.split("-")[1]}-${num}${important}`;
	}
	return `${key.split("-")[1]}${_val}${important}`;
}
function transformTransition(v, important) {
	let hasDuration = false;
	return v.split(" ").map((item) => {
		if (/^\d/.test(item) || /^\.\d/.test(item)) {
			if (hasDuration) return `delay${getVal(item, void 0, true)}${important}`;
			hasDuration = true;
			return `duration${getVal(item, void 0, true)}${important}`;
		}
		if (item === "background-color") return `colors${important}`;
		if (/^(?:linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/.test(item)) return `ease-[${item}]${important}`;
		else if (item.startsWith("cubic-bezier") || item.startsWith("steps")) return `ease-[${item}]${important}`;
		return `${item}${important}`;
	}).join(" ");
}

//#endregion
//#region src/user.ts
const userMap = ["user-select"];
function user(key, val) {
	if (!userMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `${getLastName(key)}-${value}${important}`;
}

//#endregion
//#region src/vertical.ts
const verticalMap = [
	"vertical-align",
	"vertical-text-align",
	"vertical-text-align-last",
	"vertical-align-last",
	"vertical-justify",
	"vertical-justify-content",
	"vertical-justify-items",
	"vertical-justify-self"
];
function vertical(key, val) {
	if (!verticalMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `v${getVal(value)}${important}`;
}

//#endregion
//#region src/visibility.ts
const visibilityMap = ["visibility"];
function visibility(key, val) {
	if (!visibilityMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value === "none") return `hidden${important}`;
	if (value === "hidden") return `invisible${important}`;
	return `${value}${important}`;
}

//#endregion
//#region src/white.ts
const whiteMap$1 = ["white-space"];
function white(key, val) {
	if (!whiteMap$1.includes(key)) return;
	const [value, important] = transformImportant(val);
	return `whitespace-${value}${important}`;
}

//#endregion
//#region src/will.ts
const willMap = ["will-change"];
const willChangeKeys = {
	"auto": "auto",
	"scroll-position": "scroll",
	"contents": "contents",
	"transform": "transform"
};
function will(key, val) {
	if (!willMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (value in willChangeKeys) return `will-change-${willChangeKeys[value]}${important}`;
	return `${key}-[${joinWithUnderLine(value)}]${important}`;
}

//#endregion
//#region src/writing.ts
const whiteMap = ["writing-mode"];
function writing(key, val) {
	if (!whiteMap.includes(key)) return;
	const [value, important] = transformImportant(val);
	if (val === "horizontal-tb") return `write-normal${important}`;
	return `write-${value.replace("-rl", "-right").replace("-lr", "-left")}${important}`;
}

//#endregion
//#region src/toUnocss.ts
const typeMap = {
	animation,
	aspect,
	backface,
	caption,
	column,
	columns,
	break: transformBreak,
	empty,
	box,
	writing,
	display,
	float,
	clear,
	isolation,
	object,
	overflow,
	overscroll,
	position,
	top,
	left: top,
	right: top,
	bottom: top,
	visibility,
	z: size,
	flex,
	order,
	grid,
	gap,
	justify,
	align,
	place,
	padding: transformMargin,
	perspective,
	margin: transformMargin,
	width: size,
	min: max,
	max,
	height: size,
	font,
	letter,
	line,
	list,
	text,
	mask,
	hyphens,
	vertical,
	white,
	word,
	content,
	background,
	rotate,
	border,
	outline,
	opacity,
	mix,
	filter,
	backdrop,
	table,
	transition,
	transform,
	accent,
	appearance,
	cursor,
	caret,
	pointer,
	resize,
	scroll,
	inset,
	touch,
	user,
	will,
	fill,
	stroke,
	color,
	row
};
const splitReg = /([\w-]+)\s*:\s*([^;]+)/;
function toUnocss(css, isRem = false) {
	var _typeMap$first;
	css = css.replace(browserReg, "");
	const match = css.match(splitReg);
	if (!match) return;
	const [_, key, val] = match;
	const first = getFirstName(key);
	const result = (_typeMap$first = typeMap[first]) === null || _typeMap$first === void 0 ? void 0 : _typeMap$first.call(typeMap, key, val);
	if (result && isRem) return result.replace(/-([0-9.]+)px/g, (_$1, v) => `-${+v / 4}`).replace(/\[[^\]]+\]/g, (match$1) => match$1.replace(/([0-9.]+)px/g, (_$1, v) => `${+v / 16}rem`));
	return result;
}

//#endregion
//#region src/transformer.ts
function createRuleProcessor(config) {
	return (v) => {
		const anyMatch = config.anyMatch || [];
		const priority = config.priority || [];
		let matchedAnyRule = null;
		if (anyMatch.length > 0) {
			matchedAnyRule = anyMatch.find((rule) => v[rule.key] && (rule.pattern instanceof RegExp ? rule.pattern.test(v[rule.key]) : v[rule.key] === rule.pattern));
			if (!matchedAnyRule) return {
				transformedResult: "",
				deleteKeys: []
			};
		}
		let valueToUse = "";
		if (anyMatch.length > 0 && priority.length > 0) for (const key of priority) {
			const rule = anyMatch.find((r) => r.key === key);
			if (rule && v[key] && (rule.pattern instanceof RegExp ? rule.pattern.test(v[key]) : v[key] === rule.pattern)) {
				valueToUse = v[key];
				break;
			}
		}
		const allMatchRules = { ...config.allMatch };
		const allMatchKeys = Object.keys(allMatchRules);
		for (const key of allMatchKeys) {
			const expectedValue = allMatchRules[key];
			if (!(expectedValue instanceof RegExp ? expectedValue.test(v[key]) : v[key] === expectedValue)) return {
				transformedResult: "",
				deleteKeys: []
			};
		}
		const deleteKeys = [...allMatchKeys, ...anyMatch.map((rule) => rule.key)];
		const transformedResult = typeof config.outputTemplate === "function" ? config.outputTemplate(valueToUse) : config.outputTemplate.replace("${value}", valueToUse);
		return {
			transformedResult,
			deleteKeys
		};
	};
}
const transformer = {
	"line-clamp-${number}": createRuleProcessor({
		allMatch: {
			"overflow": "hidden",
			"display": "-webkit-box",
			"-webkit-box-orient": "vertical"
		},
		anyMatch: [{
			key: "-webkit-line-clamp",
			pattern: /\d/
		}, {
			key: "line-clamp",
			pattern: /\d/
		}],
		priority: ["line-clamp", "-webkit-line-clamp"],
		outputTemplate: (value) => `line-clamp-${value}`
	}),
	"line-clamp-${prop}": createRuleProcessor({
		allMatch: {
			"overflow": "visible",
			"display": "block",
			"-webkit-box-orient": "horizontal"
		},
		anyMatch: [{
			key: "-webkit-line-clamp",
			pattern: /inherit|initial|revert|unset/
		}, {
			key: "line-clamp",
			pattern: /inherit|initial|revert|unset/
		}],
		priority: ["line-clamp", "-webkit-line-clamp"],
		outputTemplate: (value) => `line-clamp-${value}`
	}),
	"truncate": createRuleProcessor({
		allMatch: {
			"overflow": "hidden",
			"text-overflow": "ellipsis",
			"white-space": "nowrap"
		},
		outputTemplate: () => "truncate"
	})
};
function transformStyleToUnocssPre(styles) {
	const preTransformedList = [];
	const styleToObj = styles.split(";").filter(Boolean).reduce((r, item) => {
		const [key, value] = item.split(":");
		if (key.trim() && (value === null || value === void 0 ? void 0 : value.trim())) r[key.trim()] = value.trim();
		return r;
	}, {});
	for (const key in transformer) {
		const { transformedResult, deleteKeys } = transformer[key](styleToObj);
		if (transformedResult && deleteKeys.length) {
			preTransformedList.push(transformedResult);
			deleteKeys.forEach((deleteKey) => {
				delete styleToObj[deleteKey];
			});
		}
	}
	return {
		transformedResult: preTransformedList.join(" "),
		newStyle: Object.entries(styleToObj).map(([key, value]) => `${key}: ${value}`).join("; ")
	};
}

//#endregion
//#region src/transformStyleToUnocss.ts
function transformStyleToUnocss(styles, isRem, debug) {
	if (debug) {
		console.log("🚀 [transformStyleToUnocss] Input styles:", styles);
		console.log("🚀 [transformStyleToUnocss] isRem:", isRem);
	}
	const noTransfer = [];
	const cache = new Set();
	const { newStyle, transformedResult } = transformStyleToUnocssPre(styles);
	if (debug) console.log("🔄 [transformStyleToUnocss] Pre-transformed:", {
		newStyle,
		transformedResult
	});
	if (transformedResult) {
		const result$1 = [transformedResult, newStyle.split(";").filter(Boolean).reduce((result$2, cur) => {
			const key = cur.replaceAll(browserReg, "").trim();
			if (debug) console.log("🔍 [transformStyleToUnocss] Processing style:", cur, "-> key:", key);
			if (cache.has(key)) {
				if (debug) console.log("⏭️  [transformStyleToUnocss] Skipping cached key:", key);
				return result$2;
			}
			cache.add(key);
			const val = toUnocss(cur, isRem) || "";
			if (debug) console.log("🎯 [transformStyleToUnocss] Converted:", cur, "->", val || "FAILED");
			if (!val) {
				noTransfer.push(cur);
				if (debug) console.log("❌ [transformStyleToUnocss] Failed to convert:", cur);
			}
			return result$2 += `${val} `;
		}, "").trim().replace(/\s+/g, " ")].filter(Boolean).join(" ");
		if (debug) {
			console.log("✅ [transformStyleToUnocss] Final result (with pre-transform):", result$1);
			console.log("❌ [transformStyleToUnocss] Failed conversions:", noTransfer);
		}
		return [result$1, noTransfer];
	}
	const result = styles.split(";").filter(Boolean).reduce((result$1, cur) => {
		const key = cur.replaceAll(browserReg, "").trim();
		if (debug) console.log("🔍 [transformStyleToUnocss] Processing style (no pre-transform):", cur, "-> key:", key);
		if (cache.has(key)) {
			if (debug) console.log("⏭️  [transformStyleToUnocss] Skipping cached key:", key);
			return result$1;
		}
		cache.add(key);
		const val = toUnocss(key, isRem) || "";
		if (debug) console.log("🎯 [transformStyleToUnocss] Converted:", key, "->", val || "FAILED");
		if (!val) {
			noTransfer.push(cur);
			if (debug) console.log("❌ [transformStyleToUnocss] Failed to convert:", cur);
		}
		return result$1 += `${val} `;
	}, "").trim().replace(/\s+/g, " ");
	if (debug) {
		console.log("✅ [transformStyleToUnocss] Final result (no pre-transform):", result);
		console.log("❌ [transformStyleToUnocss] Failed conversions:", noTransfer);
	}
	return [result, noTransfer];
}

//#endregion
//#region src/toUnocssClass.ts
function toUnocssClass(css, isRem = false, debug, isRemoveRpx, isRemovePx) {
	const [transferred, noTransferred] = transformStyleToUnocss(css, isRem, debug);
	let result = transferred;
	function removePx(css$1) {
		return css$1.replace(/[[\]]/g, "").replace(/px/g, "");
	}
	function removeRpx(css$1) {
		return css$1.replace(/[[\]]/g, "").replace(/rpx/g, "");
	}
	if (isRemoveRpx) result = removeRpx(result);
	if (isRemovePx) result = removePx(result);
	return [result ? result.replace(/([^\s=]+)="([^"]+)"/g, (_, v1, v2) => v2.split(" ").map((v) => `${v1}-${v}`).join(" ")) : "", noTransferred];
}

//#endregion
export { browserReg, commaReplacer, cssMathFnRE, diffTemplateStyle, flag, getFirstName, getGradient, getHundred, getLastName, getStyleScoped, getVal, isAttr, isCalc, isColor, isConstant, isCubicBezier, isEmptyStyle, isEnv, isHex, isHsl, isNot, isPercent, isRepeatingLinearGradient, isRepeatingRadialGradient, isRgb, isSize, isUrl, isVar, joinEmpty, joinWithLine, joinWithUnderLine, linearGradientReg, linearGradientReg1, numberWithUnitRE, otherGradientReg, positionMap, toUnocss, toUnocssClass, transformImportant, transformStyleToUnocss, transformStyleToUnocssPre, trim };