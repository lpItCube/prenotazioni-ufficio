export interface AlertProps {
    title:String,
    text:String
}

export interface InputLoginProps {
    icon:any,
    handleInfo:(target: HTMLInputElement) => void,
    type:string,
    placeholder:string,
    name:string,
    required:boolean
}