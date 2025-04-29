// backend api funcs

export const {
    getTestSession,
    launchItem,
    getPrograms,
    absPath,
}=((window as any).electron as Bridge);