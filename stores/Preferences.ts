import { defineStore } from "pinia";

interface State {
	tagPreferences: Array<string>;
	likedBlogs: Array<string>;
	isUserNew: boolean;
}

// @ts-ignore
export const usePreferenceStore = defineStore("Preferences", {
	state: (): State => ({ tagPreferences: [], likedBlogs: [], isUserNew: true }),
	actions: {
		setUser() {
			this.isUserNew = false
		},
		getTags(tag: string): Promise<Array<string>> {
			return this.tagPreferences
		},
		addOrRemoveTag(tag: string) {
			if (this.tagPreferences.includes(tag)) {
				let index = this.tagPreferences.findIndex((tagPreference: string) => tagPreference === tag)
				this.tagPreferences.splice(index, 1)
			} else {
				this.tagPreferences.push(tag)
			}
		},
		likeBlog(blog: string) {
			if (this.likedBlogs.includes(blog)) {
				let index = this.likedBlogs.findIndex((tagPreference: string) => tagPreference === blog)
				this.likedBlogs.splice(index, 1)
			} else {
				this.likedBlogs.push(blog)
			}
		}
	},
	persist: {
		storage: persistedState.cookiesWithOptions({
			sameSite: 'strict',
		}),
	},
});
