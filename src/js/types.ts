// Types shared between modules

export type Theme = 'light' | 'dark';

export interface Leader {
    // The leader's name, or its position among a troll draft's choices
    id: string | number;
    shortName: string;
    longName: string;
    civilization: string;
    image: string;
    dlc: string[];
    mod?: string[];
}

export interface PlayerSettings {
    name: string;
    enabledDlc: string[];
}

export interface DraftSettings {
    numPlayers: number;
    numChoices: number;
    bans: string[];
    // The leader attributes that may be duplicated
    duplications: string[];
    mods: string[];
    players: PlayerSettings[];
}

export interface DraftPlayer {
    name: string;
    choices: Leader[];
}

// A completed draft
export interface Draft {
    players: DraftPlayer[];
    // The leader that replaced every choice, when the draft trolls
    trollLeader?: Leader;
}

// What the results area shows: a completed draft, or only an error when no draft was possible
export type DraftResults = Draft | { error: string };
