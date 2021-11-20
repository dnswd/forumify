export interface Meta {
    type: string,
    isMod: boolean | undefined,
    fromGuild: boolean,
    command?: string,
    commandArgs?: string[],
}