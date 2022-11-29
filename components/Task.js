import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import stylesTask from "./Task.module.css";


//Component that render every task

const Task = ({taskText, deleteTask,id}) => {
  return (
         <div key={id} className={stylesTask.todo__list}>
            <ListItem >
                <ListItemText primary={taskText}/>
                <button onClick={() => deleteTask(id)}> X </button>
            </ListItem>
        </div>
  )
}

export default Task