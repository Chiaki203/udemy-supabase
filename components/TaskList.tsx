import {FC} from 'react'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { Spinner } from './Spinner'
import { TaskItem } from './TaskItem'

export const TaskList:FC = () => {
  const tasksResult = useQueryTasks()
  console.log('useQueryTasks result', tasksResult)
  if (tasksResult.status === 'loading') return <Spinner/>
  if (tasksResult.status === 'error') return <p>{'error'}</p>
  return (
    <ul className='my-2'>
      {tasksResult.data?.map(task => (
        <TaskItem key={task.id} id={task.id} title={task.title}/>
      ))}
    </ul>
  )
}
