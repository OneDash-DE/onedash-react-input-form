export const get = (path: string, obj: any) => {
	let value: any;
	const subPaths = path.split(".");
	const current = obj;
	subPaths.forEach((item, i) => {
		if (i === subPaths.length - 1) {
			return (value = current[item]);
		}
	});
	return value;
};

export const set = (path: string, obj: any, value: any) => {
	const subPaths = path.split(".");
	let currentObject = obj;
	subPaths.forEach((item, i) => {
		if (i === subPaths.length - 1) {
			currentObject[item] = value;
			return;
		}
		const itemName = item.indexOf("[]") !== -1 ? item.slice(0, item.length - 2) : item;

		if (!currentObject[itemName]) {
			if (item.indexOf("[]") === -1) {
				currentObject[item] = {};
			} else {
				currentObject[itemName] = [];
			}
		}
		currentObject = currentObject[itemName];
	});
};
