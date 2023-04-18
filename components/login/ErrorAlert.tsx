import React from 'react'

// Types
import { AlertProps } from '../../types'

const ErrorAlert: React.FC<AlertProps> = (props): JSX.Element => {

  const { title, text } = props

  return (
    <div className="invalidLogin">
        <p className="invalidLogin__title min">{title}</p>
        <p className="invalidLogin__text min">{text}</p>
    </div>
  )
}

export default ErrorAlert