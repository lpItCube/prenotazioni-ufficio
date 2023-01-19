
export const getStringDate = (
    date
: Date) => {


    const allMonths = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]

    // console.log('DATE',new Date(date).getFullYear())
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
