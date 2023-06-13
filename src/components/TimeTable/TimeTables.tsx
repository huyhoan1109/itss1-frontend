import {useEffect, useState,FC} from "react";
import "./TimeTable.css";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import TimeTableProp from "./TimeTableProp";

const DAYS_JP = ["月", "火", "水", "木", "金", "土", "日"];
const DAYS_VI = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];
const Shifts = [
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

const TimeTables: FC<TimeTableProp> = (prop :TimeTableProp) => {
    const {i18n} = useTranslation()
    const { 
        chooseShift, 
        setChooseShift, 
        table, 
        setTable, 
        weekdays, 
        setWeekDays, 
        times, 
        setTimes, 
        showWeekend, 
        setShowWeekend
    } = prop

    const handleChoose = (dayID:number) => {
        let ids:Array<number> = []
        let newTable = [false,false,false,false,false,false,false]
        table.forEach((value, index) => {
            if(index == dayID) {
                newTable[index] = !value
            }
            else newTable[index] = value
        })
        newTable.forEach((value, index) => {
            if (value) ids.push(index)
        })
        console.log(ids)
        setTable(newTable)
        setTimes({shiftID: chooseShift, dayIDs: ids})
    }

    useEffect(() => {
        if (i18n.language == 'jp') setWeekDays(DAYS_JP)
        if (i18n.language == 'vi') setWeekDays(DAYS_VI)
    }, [i18n.language])

    useEffect(() => {
        setTable([false,false,false,false,false,false,false])
        setTimes({shiftID: chooseShift, dayIDs: []})
    }, [chooseShift])

    return (
        <div>
            <table className="TimeTable">
            <thead>
                <tr >
                    <th key={0}>
                        <div className="form-check form-check-inline ShowWeekend" 
                            onClick={
                                (e) => setShowWeekend(!showWeekend)}
                            >
                            {   i18n.language == 'jp' && 
                                (!showWeekend 
                                ? <button>週末を表示</button>
                                : <button>日常</button>)
                            }
                            {   i18n.language == 'vi' &&
                                (!showWeekend 
                                ? <button>Hiện lịch cuối tuần</button>
                                : <button>Lịch thường nhật</button>)
                            }
                        </div>
                    </th>
                    {
                        weekdays.map((day:any, dayID:any) => {                    
                            return (
                                (!showWeekend && dayID > 4) ? null
                                :  <th key={dayID + 1}>{day}</th>           
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr key={0}>
                    <th key={0}>
                    <Select 
                        className='w-full'
                        bordered={false}
                        options={ 
                            Shifts.map((shift, shiftID) => ({ 
                                value: `${shiftID}`, 
                                label: `${shift}` 
                            }))
                        }
                        onSelect={(value, option) => {
                            setChooseShift(option.value)
                        }}
                    />
                    </th>
                    {
                        weekdays.map((day:any, dayID:any) => {
                            return (() => {
                                if (!showWeekend && dayID > 4) return null;
                                return (
                                    <th 
                                        key={dayID+1}
                                        data-id={dayID+1}
                                        onClick={() => handleChoose(dayID)}
                                    >
                                        {
                                            table[dayID] && <div>O</div>
                                        }
                                    </th>
                                )
                        })()
                    })}
                </tr>
            </tbody>
            </table>
        </div>
        );
};
export default TimeTables;