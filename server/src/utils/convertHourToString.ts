//"2:24" --> ["2", "24"] --> [2, 24]

export function convertHourToMinute(hourString: String){

    const [hours, minutes] = hourString.split(':').map(Number);

    const minutesAmount = (hours * 60) + minutes

    return minutesAmount;
}