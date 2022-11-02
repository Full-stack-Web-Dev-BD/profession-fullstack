import { atom } from "recoil";

export const appState = atom({
    key: 'touchDBState', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
}); 
