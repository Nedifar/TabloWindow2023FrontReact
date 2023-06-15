export type Update = {
    timeNow: string,
    toEndPara: string,
    progressBarPara: number,
    lv: Array<Para>|null,
    grLineHeight: number,
    colorLineHeight: number,
    tbNumberPara: string,
    paraNow: string
}

export type Para = {
    toEndTimeInProcent : number,
    fontSize : number,
    totalTime : number,
    outGraphicNewTablo : string,
    typeInterval : TypeInterval,
    beginEnd : string
}

export type TypeInterval = {
    name : string
}