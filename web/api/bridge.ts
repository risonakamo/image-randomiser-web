// backend api funcs

export const {
    getTestSession,
    launchItem,
    getPrograms,
    absPathDirs,
    newSession,
    getSessions,
}=((window as any).electron as Bridge);