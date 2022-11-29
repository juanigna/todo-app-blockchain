import React, {useState, useEffect } from 'react';
import {TextField , Button } from '@mui/material';
import { TaskContractAddress } from '../config';
import {ethers} from 'ethers';
import TaskAbi from "../utils/TaskContract.json"
import Task from '../components/Task';
import styles from "../styles/Home.module.css"

function App() {

  //Initial state variables

  const [tasks,setTasks]=useState([]);
  const [input, setInput]=useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  
  //Function that returns all the tasks

  const getAllTasks = async() => {
  try {
    const {ethereum} = window;

    if(ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const TaskContract = new ethers.Contract(
        TaskContractAddress,
        TaskAbi,
        signer
      )

      let allTasks = await TaskContract.getMyTasks();
      setTasks(allTasks);
    } else {
      console.log("Ethereum object doesn't exist");
    }
  } catch(error) {
    console.log(error);
  }
}
  
//UseEffect that render the task of an address, and reload the page if the accounts is changed
  useEffect(() => {
      getAllTasks()
      window.ethereum.on("accountsChanged", handleChanges)
    },[currentAccount]);
    

    async function handleChanges(accounts){
      try {
        const { ethereum } = window
  
        if (!ethereum) {
          console.log('Metamask not detected')
          return
        }
        let chainId = await ethereum.request({ method: 'eth_chainId'})
        console.log('Connected to chain:' + chainId)
  
        const ganache = '0x1691'
  
        if (chainId !== ganache) {
          alert('You are not connected to the ganache LocalHost!')
          return
        } else {
          setCorrectNetwork(true);
        }
  
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  
        console.log('Found account', accounts[0])
        setCurrentAccount(accounts[0])
      } catch (error) {
        console.log('Error connecting to metamask', error)
      }
    }

    // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId)

      const hardhat = '0x1691'

      if (chainId !== hardhat) {
        alert('You are not connected to the Hardhat LocalHost!')
        return
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }  
  
  

  //Function that add a new task

  const addTask= async (e)=>{
    e.preventDefault();

    let task = {
      'taskText': input,
      'isDeleted': false
    };

    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi,
          signer
        )

        TaskContract.addTask(task.taskText, task.isDeleted)
        .then(response => {
          setTasks([...tasks, task]);
          console.log("Completed Task");
        })
        .catch(err => {
          console.log("Error occured while adding a new task");
        });
        ;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log("Error submitting new Tweet", error);
    }

    setInput('')
  };

  //Function that delete a task
  
  const deleteTask = key => async() => {
    console.log(key);

    // Now we got the key, let's delete our tweet
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi,
          signer
        )

        let deleteTaskTx = await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }

    } catch(error) {
      console.log(error);
    }
  }

  //If there is an account and its in the right networks, render the task, if not, show the button to connect
  return (
    <div>
      {currentAccount === '' ? (
      <button
      className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
      onClick={connectWallet}
      >
      Connect Wallet
      </button>
      ) : correctNetwork ? (
        <div className={styles.main}>
          <h2> Task Management App</h2>
          <form className={styles.card}>
            <TextField id="outlined-basic" label="Make Todo" variant="outlined" style={{margin:"0px 5px"}} size="small" value={input}
            onChange={e=>setInput(e.target.value)} />
            <Button variant="contained" color="primary" onClick={addTask}  >Add Task</Button>
          </form>
          <ul>
              {tasks.map(item=> 
                <Task 
                  key={item.id} 
                  taskText={item.taskText} 
                  deleteTask={deleteTask(item.id)}
                />)
              }
          </ul>
        </div>
      ) : (
      <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
        <div>Please connect to the Rinkeby Testnet</div>
        <div>and reload the page</div>
      </div>
    )}
</div>
  );
}

export default App;