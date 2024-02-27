import { writable } from 'svelte/store';

export const username = writable('');
export const currentPage = writable(1);