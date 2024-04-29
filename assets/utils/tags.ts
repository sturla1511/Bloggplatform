export const tags = ['tegning', 'trearbeid', 'glassblåsing', 'tekstil', 'keramikk', 'smykkeskaping', 'strikking', 'maling']

export const tagColor = (tag: string): string => {
	switch (tag) {
		case 'tekstil':
			return '#9EEB3C';
		case 'glassblåsing':
			return '#8C8ADD';
		case 'trearbeid':
			return '#C96F3C';
		case 'keramikk':
			return '#ED6464';
		case 'tegning':
			return '#EBCF3C';
		case 'smykkeskaping':
			return '#7BD5E9';
		case 'strikking':
			return '#E467EF';
		case 'maling':
			return '#54A2EB';
	}
};
