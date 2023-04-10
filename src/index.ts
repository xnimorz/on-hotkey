export * from "./codes";
export * from "./keys";

export const alt = 'altKey';
export const ctrl = 'ctrlKey';
export const meta = 'metaKey';
export const cmd = 'metaKey';
export const shift = 'shiftKey';


export type Mod = typeof alt | typeof ctrl | typeof meta | typeof shift

export type Options = SingleOption | MultipleOptions;

type SingleOption = {
    key: string,
    mods?: Mod[],
    scope?: HTMLElement | Window,
};

type MultipleOptions = {
    scope?: HTMLElement | Window
    keys: {
        key: string,
        mods?: Mod[]
    }[],
};

export type KeyboardEventHandler = (e: KeyboardEvent) => unknown;

export type Unsubscribe = () => void;

function matchOption(e: KeyboardEvent, option: { key: string, mods?: Mod[] }, type: 'key' | 'code'): boolean {
    if (type === 'key') {
        if (option.key.toUpperCase() !== e.key.toUpperCase()) {
            return false;
        }
    } else {
        if (option.key.toUpperCase() !== e.code.toUpperCase()) {
            return false;
        }
    }

    if (option.mods == null) {
        return true;
    }

    const mods: Mod[] = option.mods;
    for (const modifier of mods) {
        if (e[modifier] !== true) {
            return false;
        }
    }

    return true;
}

function match(event: KeyboardEvent, config: Options, type: 'key' | 'code'): boolean {
    if ('keys' in config) {
        return config.keys.some((key) => matchOption(event, key, type));
    }
    return matchOption(event, { key: config.key, mods: config.mods }, type)
}

function toConfig(key: string | Options): Options {
    if (typeof key === 'string') {
        return {
            key,
        }
    }
    return key;
}

function onKey(key: string | Options, event: 'keyup' | 'keydown', type: 'key' | 'code', handler: KeyboardEventHandler): Unsubscribe {
    const config = toConfig(key);

    const handleKeyEvent = (e) => {
        if (match(e, config, type)) {
            handler(e);
        }
    };

    (config.scope ? config.scope : window).addEventListener(event, handleKeyEvent);

    return () => {
        (config.scope ? config.scope : window).removeEventListener(event, handleKeyEvent);
    }
}

export function onKeyUp(key: string | Options, handler: KeyboardEventHandler): Unsubscribe {
    return onKey(key, 'keyup', 'key', handler)
}

export function onKeyDown(key: string | Options, handler: KeyboardEventHandler) {
    return onKey(key, 'keydown', 'key', handler)
}

export function onCodeUp(key: string | Options, handler: KeyboardEventHandler) {
    return onKey(key, 'keyup', 'code', handler)
}

export function onCodeDown(key: string | Options, handler: KeyboardEventHandler) {
    return onKey(key, 'keydown', 'code', handler)
}