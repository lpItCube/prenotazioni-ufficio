
export const getStringDate = (date: string) => {


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


export const getStringHours = (date: string | null): void | string => {

    if(!date) return
    const hours =  String(new Date(date).getHours()).padStart(2, '0') + ':00' 

    return hours

}


export const getOnlyDate = (date:string): string => {
    return date.substring(0,date.indexOf('T'));
}

export const createNewDate = (hour: string, selectedDate?:Date) : string => {
    let currYear: number
    if(selectedDate) {
        currYear = selectedDate.getFullYear()
    } else {
        currYear = new Date().getFullYear()
    }
	const currMonth: string = ("0" + (new Date().getMonth() + 1)).slice(-2)
	const day: string = ("0" + new Date().getDate()).slice(-2)
	const textDate: string = currYear + "-" + currMonth + "-" + day + "T" + hour + ":00:00";

	return textDate
}

export const transformDate = (hour: string, selectedDate?:Date) : string => {
    let currYear: number
    let currMonth: any
    let day: any
    if(selectedDate) {
        currYear = selectedDate.getFullYear()
        currMonth = ("0" + (selectedDate.getMonth() + 1)).slice(-2)
        day = ("0" + selectedDate.getDate()).slice(-2)
    } else {
        currYear = new Date().getFullYear()
    }
	const textDate: string = currYear + "-" + currMonth + "-" + day + "T" + hour + ":00:00";

	return textDate
}