export const DAYS_JP = ["月", "火", "水", "木", "金", "土", "日"];
export const DAYS_VI = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
export const Shifts = [
    "6h : 6h45", 
    "6h45 : 7h30", 
    "7h30 : 8h15", 
    "8h15 : 9h", 
    "9h : 9h45", 
    "9h45 : 10h30",
    "10h30 : 11h15",
    "11h15 : 12h",
    "12h : 12h45",
    "12h45 : 13h30",
    "13h30 : 14h15",
    "14h15 : 15h",
    "15h : 15h45",
    "15h45 : 16h30",
    "16h30 : 17h15",
    "17h15 : 18h",
    "18h : 18h45",
    "18h45 : 19h30",
    "19h30 : 20h15",
    "20h15 : 21h",
    "21h : 21h45",
    "21h45 : 22h30",
    "22h30 : 23h15",
    "23h15 : 0h",
    "0h : 0h45",
    "0h45 : 1h30",
    "1h30 : 2h15",
    "2h15 : 3h",
    "3h : 3h45",
    "3h45 : 4h30",
    "4h30 : 5h15",
    "5h15 : 6h",
];


export interface TimeTableProp {
    chooseShift: any,
    setChooseShift: (value: any) => void,
    table: Array<boolean>,
    setTable: (value: Array<boolean>)  => void,
    weekdays: any, 
    setWeekDays: (value: any) => void,
    showWeekend: boolean,
    setShowWeekend: (value: boolean) => void,
    times: any, 
    setTimes: (value: any) => void
}

export interface TimeTableProp2 {
    chooseShift: any,
    setChooseShift: (value: any) => void,
    table: Array<boolean>,
    setTable: (value: Array<boolean>)  => void,
    weekdays: any, 
    setWeekDays: (value: any) => void,
    showWeekend: boolean,
    setShowWeekend: (value: boolean) => void,
    times: any, 
    setTimes: (value: any) => void,
    schedulers: any
}