import {useQueryClient, useMutation} from 'react-query'
import useStore from '../store'
import { supabase } from '../utils/supabase'
import {Task, EditedTask} from '../types/types'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const zustandStore = useStore()
  // console.log('zustandStore', zustandStore)
  const reset = useStore((state) => state.resetEditedTask)
  const createTaskMutation = useMutation(async(task:Omit<Task, 'id' | 'created_at'>) => {
    const {data, error} = await supabase
      .from('todos')
      .insert(task)
      .select()
    if (error) throw new Error(error.message)
    console.log('createTaskMutation data', data)
    return data
  }, {
    onSuccess: (res) => {
      const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
      console.log('createTaskMutation onSuccess res', res)
      console.log('previousTodos', previousTodos)
      if (previousTodos) {
        queryClient.setQueryData(['todos'], [...previousTodos, res[0]])
      }
      reset()
    }, 
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  const updateTaskMutation = useMutation(async(task:EditedTask) => {
    const {data, error} = await supabase
      .from('todos')
      .update({title: task.title})
      .eq('id', task.id)
      .select()
    if (error) throw new Error(error.message)
    console.log('updateTaskMutation data', data)
    return data
  }, {
    onSuccess: (res, variables) => {
      const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
      console.log('updateTaskMutation onSuccess res', res)
      console.log('updateTaskMutation onSuccess variables', variables)
      console.log('previousTodos', previousTodos)
      if (previousTodos) {
        queryClient.setQueryData(
          ['todos'], 
          previousTodos.map(task => (
            task.id === variables.id ? res[0] : task
          ))
        )
      }
      reset()
    },
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  const deleteTaskMutation = useMutation(async(id:string) => {
    const {data, error} = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    return data
  }, {
    onSuccess: (_, variables) => {
      console.log('deleteTaskMutation onSuccess variables', variables)
      const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
      console.log('previousTodos', previousTodos)
      if (previousTodos) {
        queryClient.setQueryData(
          ['todos'],
          previousTodos.filter(task => task.id !== variables)
        )
      }
      reset()
    },
    onError: (err:any) => {
      alert(err.message)
      reset()
    }
  })
  return {createTaskMutation, updateTaskMutation, deleteTaskMutation}
}