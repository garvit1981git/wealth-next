import React from 'react'
import GoalCard from './GoalCard'


const GoalList = ({goals}) => {
  return (
    <div className='overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cardBorder scrollbar-track-transparent h-[350px]'>
      {goals.map((goal)=>{
return <GoalCard  key={goal._id} goal={goal}></GoalCard>

      })}
    </div>
  )
}

export default GoalList
