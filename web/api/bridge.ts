// backend api funcs

export const {
    getTestSession,
    launchItem,
    getPrograms,
    absPathDirs,
    newSession,
    getSessions,
    deleteSession,
    duplicateSession,
    getItemCount,
    getSession,
    openFileExplorer,
    updateSessionPosition,
}=((window as any).electron as Bridge);