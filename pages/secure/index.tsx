import { getSession } from "next-auth/react"
import { requireAuth } from "../../utils/requireAuth"

function index() {
  return (
    <div>SECURE PAGE!</div>
  )
}

// export async function getServerSideProps(context:any) {
//     return requireAuth(context, (session:any) => {
        
//         return {
//             props: {}
//         }
//     })
    
// }

export default index