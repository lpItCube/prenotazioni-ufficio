type RoomsNavigatorProps = {
    nextName:string,
    onClick:any
}

// Components
import { GrLinkNext } from 'react-icons/gr'
import { Colors } from '../Ui/Colors'

function RoomsNavigator({
    nextName,
    onClick
}: RoomsNavigatorProps) {
  return (
    <div 
        className='rooms__navigator'
    >
        <div 
            className='rooms__navigator--container'
            onClick={() => onClick()}
        >
            <p className='rooms__navigator--text txt-h5'>
                {nextName}
            </p>
            <GrLinkNext size={32}/>
        </div>
    </div>
  )
}

export default RoomsNavigator