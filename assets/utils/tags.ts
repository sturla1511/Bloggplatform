export const tags = ['Håndverk', 'Matlaging']

export const tagColor = (tag: string): string => {
	switch (tag) {
		case 'Håndverk':
			return '#F88E2C';
		case 'Matlaging':
			return '#9EEB3C';
	}
};
