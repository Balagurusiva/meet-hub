

import React from 'react'

const Meeting = ({params} : {params:{id:string}}) => {
  const {user, isLoaded } = useUser()
  const [isSetupCompleted, setIsSetupCompletee] = useState(false)
  return (
    <main className = 'h-screen w-full'>
      <StreamCall>
        <StreamTheme>
          {!isSetupCompleted ? (
            "Meeting setup"
          ):(
            "Meeting Room"
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting