import {useEffect, useState,FC, useCallback} from "react";
import "./TimeTable.css";
import { useTranslation } from "react-i18next";
import { Select } from "antd";
import { TimeTableProp2, Shifts, DAYS_JP, DAYS_VI } from "../../types/TimeTableProp";

const TimeTables2: FC<any> = (props: TimeTableProp2) => {
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
        setShowWeekend,
        schedulers
    } = props
    
    const checkIds = (list:Array<Array<number>>, shiftID:number, dayID:number) => {
        if (shiftID < list.length) {
            let find = list[shiftID].find((value) => value == dayID)
            if (find == 0) return true
            else return find
        }
        else {
            return false
        }
    }

    useEffect(() => {
        let newTimes:any = []
        Shifts.forEach(() => {
            newTimes.push([])
        })
        let newTable = [false, false, false, false, false, false, false, false]
        schedulers.forEach((schedule:any) => {
            newTimes[schedule.shiftID].push(schedule.weekdayID)
            if (chooseShift == schedule.shiftID) {
                newTable[schedule.weekdayID] = true
            } 
        })
        setTimes(newTimes)
        setTable(newTable)
    }, [schedulers])

    const handleChoose = (dayID:number) => {
        let ids:Array<number> = []
        let newTimes:any = []
        let newTable = [false, false, false, false, false, false, false, false]
        table.forEach((value: any, index:any) => {
            if (dayID == index) {
                newTable[index] = !value
            } else {
                newTable[index] = value
            }
        })
        newTable.forEach((value:any, index:any) => {
            if (value) ids.push(index)
        })
        times.forEach((value:any, index:any) => {
            if (index == chooseShift) {
                newTimes[chooseShift] = ids
            } else {
                newTimes[index] = value
            }
        })
        setTable(newTable)
        setTimes(newTimes)
    }

    useEffect(() => {
        if (times.length > 0) {
            let newTable = [false, false, false, false, false, false, false, false]
            times[chooseShift].forEach((value:any, index:any) => {
                newTable[value] = true
            })
            setTable(newTable)
        }
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
                        value={chooseShift}
                        options={ 
                            Shifts.map((shift, shiftID) => ({ 
                                value: shiftID, 
                                label: shift 
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
                                            checkIds(times,chooseShift, dayID) && <div>O</div>
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
export default TimeTables2;