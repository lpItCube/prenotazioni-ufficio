
export const getStringDate = (
    date
: Date) => {


    const allMonths = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]

    const day = ("0" + new Date(date).getDate()).slice(-2)
    const month = allMonths[new Date(date).getMonth()]
    const year = new Date(date).getFullYear()
    

    return {
        day,
        month,
        year
    }
}


export const getStringHours = (
    date
: Date) => {

    const hours =  String(new Date(date).getHours()).padStart(2, '0') + ':00' 

    return {
        hours
    }
}


export const getOnlyDate = (date:any) => {
    return date.substring(0,date.indexOf('T'));
}

export const createNewDate = (hour: string) : string => {
	const currYear: number = new Date().getFullYear()
	const currMonth: string = ("0" + (new Date().getMonth() + 1)).slice(-2)
	const day: string = ("0" + new Date().getDate()).slice(-2)
	const textDate: string = currYear + "-" + currMonth + "-" + day + "T" + hour + ":00:00";
	return textDate
}