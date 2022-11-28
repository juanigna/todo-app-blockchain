import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import stylesTask from "./Task.module.css";


//Component that render every task

const Task = ({taskText, deleteTask}) => {
  return (
    <div id={taskText}>
          <List className={stylesTask.todo__list}> 
            <ListItem>
                <ListItemAvatar />
                    <ListItemText primary={taskText} />
            </ListItem>
            <button onClick={deleteTask}> X </button>
        </List> 
    </div>
  )
}

export default Task