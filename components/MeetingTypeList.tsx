"use client"

import Image from "next/image";
import HomeCard from "./HomeCard";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import MeetingModel from "./MeetingModel";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";


const  MeetingTypeList = () => {
  const [meetingState, setMeetingState] = useState<'isScheduledMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefind >()
  const router = useRouter()

  const {user} = useUser()
  const client = useStreamVideoClient();
  const [value , setValue] = useState({
    dateTime:new Date(),
    description:'',
    link:''
  })
  
  const [callDetails, setCallDetails] = useState()
  const {toast } = useToast()
   const createMeeting = async () => {
     if(!client || !user) return
     
     try{
      if(!value.dateTime){
        toast({
          title:'Please select a date and time'
        })

      }
      const id =  crypto.randomUUID()
      const call = client.call('default', id)

      if(!call) throw new Error('Faild to create call')

      const startAt = value.dateTime.toString() || new Date(Date.now()).toISOString()
      const description = value.description || "Instant Meeting"
      
      await call.getOrCreate({
        date:{
          starts_at: startAt,
          custom:{
            description
          }
        }
      })

      setCallDetails(call)

      if(!value.description){
        router.push(`/meeting/${call.id}`)
      }

      toast({title:"Meeting Created"})

     }catch(error){
      console.log(error)
      toast({
        title:'Failed to create meet'
      })
     }



  }
  
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
       <HomeCard 
        img="/icons/add-meeting.svg"
        title="New Meeting"
        className="bg-orange-1"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      <MeetingModel 
        isOpen = { meetingState === 'isInstantMeeting'}
        onClose = { () => {setMeetingState(undefined)}}
        title="start an Instant Meeting"
        className ="text-center"
        buttonText='Start Meeting'
        handleClick = { createMeeting }
       />
 

    </section>
  );
};

export default MeetingTypeList;