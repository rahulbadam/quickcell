import React, { useEffect, useState } from 'react';
import axios from 'axios';
import myImage from './Images/Exclamation.png';
import usr1 from './Images/usr-1.png';
import usr2 from './Images/usr-2.png';
import userIcon from './Images/user.png';
import SelectInput from './SelectInput';
import Todo from './Images/Todo.png';
import defaultStatusIcon from './Images/clipboard.png';
import DoneIcon from './Images/Done.png';

const statusImages = {
  "Todo": Todo,
  "Done": DoneIcon,
};

const userImages = {
  "usr-1": usr1,
  "usr-2": usr2,
};

const priorityLabels = {
  4: 'Urgent',
  3: 'High priority',
  2: 'Medium priority',
  1: 'Low priority',
  0: 'No priority'
};

const Card = ({ obj, showPrioirty = true, showUserIcon = true }) => (

  <div className="card">
    <div className='card-id'>
      <div style={{ marginBottom: '10px' }}>{obj.id}</div>
      {showPrioirty ?
        <div style={{ display: 'flex', fontSize: '14px' }}>
          {priorityLabels[obj.priority]}
        </div>
        : null
      }
      {showUserIcon ?
        <div className='card-profile'>
          <img src={userImages[obj.userId] || userIcon} alt="" className="image border profile" />
          <>{obj.userId}</>
        </div>
        : null
      }
    </div>
    <div className='card-heading'>{obj.title}</div>
    <div className="card-bottom">
      <img src={myImage} alt="" className="image border" />
      <div className='feature' >
        <div className='circle'></div>
        <div>{obj.tag[0]}</div>
      </div>
    </div>
  </div>
);

// const sortTickets = ({ tickets, selectedOrder }) => {
//   console.log("tickets32", tickets)
//   if (selectedOrder === 'priority') {
//     return tickets.sort((a, b) => a.priority - b.priority);
//   } else if (selectedOrder === 'title') {
//     return tickets.sort((a, b) => a.title.localeCompare(b.title));
//   }
// };

const ByUserUi = ({ user, tasks, selectedOrder }) => {
  const tickets = tasks.tickets.filter(ticket => ticket.userId === user.id);
  let filteredTickets;
  {
    if (selectedOrder === "Priority") {
      filteredTickets = tickets.sort((a, b) => a.priority - b.priority);
    } else {
      filteredTickets = tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  return (
    filteredTickets.map(ticket => (
      <Card key={ticket.id} obj={ticket} showUserIcon={false} />
    ))
  )
}

const ByUserGroup = ({ selectedOrder, tasks }) => {
  return (
    <div className='listClass'>
      {tasks.users.map(user => (
        < div >
          <div className="flex heading">
            <img src={userImages[user.id] || userIcon} alt="" className="image border profile" />
            {user.name}</div>
          <ByUserUi user={user} tasks={tasks} selectedOrder={selectedOrder} />
        </div>
      ))
      }
    </div >
  )
}

const ByStatusUi = ({ status, tasks, selectedOrder }) => {
  const tickets = tasks.tickets.filter(ticket => ticket.status === status);
  let filteredTickets;
  {
    if (selectedOrder === "Priority") {
      filteredTickets = tickets.sort((a, b) => a.priority - b.priority);
    } else {
      filteredTickets = tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
  }
  return (
    filteredTickets.map(ticket => (
      <Card key={ticket.id} obj={ticket} />
    ))
  )
}

const ByStatusGroup = ({ selectedOrder, tasks }) => {
  const uniqueStatuses = new Set();
  tasks.tickets.forEach(ticket => {
    uniqueStatuses.add(ticket.status);
  });
  const list = Array.from(uniqueStatuses)
  return (
    <div className='listClass'>
      {list.map(status => (
        <div>
          <div className="flex heading">
            <img src={statusImages[status] || defaultStatusIcon} alt="" className="image border profile" />
            {status}</div>
          <ByStatusUi status={status} tasks={tasks} selectedOrder={selectedOrder} />
        </div>
      ))}
    </div>
  )
}

const ByPriorityUi = ({ priority, tasks, selectedOrder }) => {
  const tickets = tasks.tickets.filter(ticket => ticket.priority === priority);
  let filteredTickets;
  {
    if (selectedOrder === "Priority") {
      filteredTickets = tickets.sort((a, b) => a.priority - b.priority);
    } else {
      filteredTickets = tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
  }
  return (
    filteredTickets.map(ticket => (
      <Card key={ticket.id} obj={ticket} showPrioirty={false} />
    ))
  )
}

const ByPriorityGroup = ({ selectedOrder, tasks }) => {
  const uniquePriorities = new Set();
  tasks.tickets.forEach(ticket => {
    uniquePriorities.add(ticket.priority);
  });
  const list = Array.from(uniquePriorities).sort((a, b) => a - b);

  return (
    <div className='listClass'>
      {list.map(priority => (
        <div>
          <div className="flex heading">{priorityLabels[priority]}</div>
          <ByPriorityUi priority={priority} tasks={tasks} selectedOrder={selectedOrder} />
        </div>
      ))}
    </div>
  )
}

function MainPage() {
  const [tasks, setTasks] = useState();
  const [loader, setLoader] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('User');
  const [selectedOrder, setSelectedOrder] = useState('Priority');

  useEffect(() => {
    const storedGroup = localStorage.getItem('selectedGroup');
    if (storedGroup) {
      setSelectedGroup(storedGroup);
    }
    const storedOrder = localStorage.getItem('selectedOrder');
    if (storedOrder) {
      setSelectedOrder(storedOrder);
    }
  }, []);

  useEffect(() => {
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => {
        setTasks(response.data);
        setLoader(false)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleGroupChange = (event) => {
    const value = event.target.value
    localStorage.setItem('selectedGroup', value);
    if (value === "Priority") {
      setSelectedOrder("Title");
      localStorage.setItem('selectedOrder', "Title");
    }
    setSelectedGroup(value);
  };

  const handleOrderChange = (event) => {
    localStorage.setItem('selectedOrder', event.target.value);
    setSelectedOrder(event.target.value);
  };

  let showUI;
  if (selectedGroup === "User") {
    showUI = <ByUserGroup selectedOrder={selectedOrder} tasks={tasks} />;
  } else if (selectedGroup === "Status") {
    showUI = <ByStatusGroup selectedOrder={selectedOrder} tasks={tasks} />;
  } else {
    showUI = <ByPriorityGroup selectedOrder={selectedOrder} tasks={tasks} />;
  }
  let orderOptions;
  if (selectedGroup === "Priority") { orderOptions = ["Title"] } else { orderOptions = ["Priority", "Title"] }
  return (
    <div className="">
      <div className="header-container">
        <SelectInput options={["Status", "User", "Priority"]} value={selectedGroup} onChange={handleGroupChange} />
        <SelectInput options={orderOptions} value={selectedOrder} onChange={handleOrderChange} />
      </div>
      <div className="card-container">
        {!loader ?
          <div style={{ overflow: 'scroll' }}>
            {showUI}
          </div>
          : (<p>Loading...</p>)
        }
      </div>
    </div>
  );

}

export default MainPage;