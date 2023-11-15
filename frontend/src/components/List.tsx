import React from 'react'
import {  useTodoList } from '../store'

// interface Task {
//   id: number
//   name: string
// }

// interface ListData {
//   listName: string
//   tasks: Task[]
// }

const List: React.FC = () => {
  const { isLoading, error, data } = useTodoList()
  // const { todoList } = useList()

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message
  // console.log('todoList', todoList)

  return (
    <div className="mx-auto max-w-md border border-gray-300 p-4">
      <h1>ListTEST</h1>
      {data && (
        <>
          <h1 className="text-m mb-4 font-bold">{data.listName}</h1>
          <ul className="list-disc space-y-2">
            {data.tasks.map((task) => (
              <li key={task.id} className="text-sm text-gray-700">{task.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )

  //   const AddTask = async () => {
  //     try {
  //       const response = await axios.post('/api/list/1/tasks', {
  //         name: newTaskName,
  //       })
  //       setListData((prevList: ListData | null) => ({
  //         ...prevList!,
  //         tasks: [...(prevList?.tasks || []), response.data],
  //       }))
  //       setNewTaskName('')
  //     } catch (error) {
  //       console.error('Error adding task:', error)
  //     }
  //   }

  //   const DeleteTask = async (taskId: number) => {
  //     try {
  //       await axios.delete(`/api/list/1/tasks/${taskId}`)
  //       setListData((prevList: ListData | null) => ({
  //         ...prevList!,
  //         tasks: prevList?.tasks.filter((task) => task.id !== taskId) || [],
  //       }))
  //     } catch (error) {
  //       console.error('Error deleting task:', error)
  //     }
  //   }

  //   const EditTask = (taskId: number) => {
  //     const taskToEdit = listData?.tasks.find((task) => task.id === taskId)
  //     if (taskToEdit) {
  //       EditingTaskId(taskId)
  //       EditedTaskName(taskToEdit.name)
  //     }
  //   }

  //   const SaveEdit = async (taskId: number) => {
  //     if (!editedTaskName.trim()) {
  //       return
  //     }

  //     try {
  //       await axios.put(`/api/list/1/tasks/${taskId}`, {
  //         name: editedTaskName,
  //       })

  //       setListData((prevList: ListData | null) => ({
  //         ...prevList!,
  //         tasks:
  //           prevList?.tasks.map((task) =>
  //             task.id === taskId ? { ...task, name: editedTaskName } : task,
  //           ) || [],
  //       }))

  //       EditingTaskId(null)
  //       EditedTaskName('')
  //     } catch (error) {
  //       console.error('Error editing task:', error)
  //     }
  //   }

  //   const CancelEdit = () => {
  //     EditingTaskId(null)
  //     EditedTaskName('')
  //   }

  //   if (!listData) {
  //     return <div>Loading...</div>
  //   }

  //   if (listData.tasks.length === 0) {
  //     return <div>No tasks found for list: {listData.listName}</div>
  //   }

  //   return (
  //     <div className="mx-auto max-w-md border border-gray-300 p-4">
  //       <h1 className="text-m mb-4 font-bold">{listData.listName}</h1>
  //       <ul className="list-disc space-y-2">
  //         {listData.tasks.map((task) => (
  //           <li key={task.id} className="text-sm text-gray-700">
  //             {editingTaskId === task.id ? (
  //               <>
  //                 <input
  //                   type="text"
  //                   value={editedTaskName}
  //                   onChange={(e) => EditedTaskName(e.target.value)}
  //                   className="mr-2 border border-gray-400 p-1 text-sm"
  //                 />
  //                 <button
  //                   onClick={() => SaveEdit(task.id)}
  //                   className="pr-2 text-sm text-green-500 "
  //                 >
  //                   Save
  //                 </button>
  //                 <button
  //                   onClick={CancelEdit}
  //                   className=" pl-2 text-sm text-red-600 "
  //                 >
  //                   Cancel
  //                 </button>
  //               </>
  //             ) : (
  //               <>
  //                 {task.name}
  //                 <button
  //                   onClick={() => DeleteTask(task.id)}
  //                   className="ml-2 text-red-600"
  //                 >
  //                   Delete
  //                 </button>
  //                 <button
  //                   onClick={() => EditTask(task.id)}
  //                   className="ml-2 text-blue-500"
  //                 >
  //                   Edit
  //                 </button>
  //               </>
  //             )}
  //           </li>
  //         ))}
  //       </ul>
  //       <div className="mt-4">
  //         <input
  //           type="text"
  //           placeholder="Add task"
  //           value={newTaskName}
  //           onChange={(e) => setNewTaskName(e.target.value)}
  //           className="mr-2 border border-gray-400 p-1 text-sm"
  //         />
  //         <button
  //           onClick={AddTask}
  //           className="bg-blue-500 p-1 text-sm text-white"
  //         >
  //           +
  //         </button>
  //       </div>
  //     </div>
  //   )
}

export default List
