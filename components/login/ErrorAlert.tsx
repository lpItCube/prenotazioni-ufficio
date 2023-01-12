import React from 'react'

type AlertProps = {
    title:String,
    text:String
}

function ErrorAlert({
    title,
    text
} : AlertProps ) {
  return (
    <div className="invalidLogin">
        <p className="invalidLogin__title min">{title}</p>
        <p className="invalidLogin__text min">{text}</p>
    </div>
  )
}

export default ErrorAlert