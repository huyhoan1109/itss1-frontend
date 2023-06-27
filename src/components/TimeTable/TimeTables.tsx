import {useEffect, useState,FC} from "react";
import "./TimeTable.css";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import {TimeTableProp, Shifts, DAYS_JP, DAYS_VI } from "../../types/TimeTableProp";

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