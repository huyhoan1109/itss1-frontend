export default interface TimeTableProp {
    chooseShift: string,
    setChooseShift: (value: string) => void,
    table: Array<boolean>,
    setTable: (value: Array<boolean>)  => void,
    weekdays: any, 
    setWeekDays: (value: any) => void,
    showWeekend: boolean,
    setShowWeekend: (value: boolean) => void,
    times: any, 
    setTimes: (value: any) => void
}