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
}=((window as any).electron as Bridge);