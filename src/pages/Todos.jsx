import React, { useState, useEffect } from 'react';
import api from '../api';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [todoId, setTodoId] = useState('');
  const [filterId, setFilterId] = useState('');

  useEffect(() => {
    api.get('/todos?userId=1').then(response => {
      setTodos(response.data);
    });
  }, []);

  const handleCreateTodo = () => {
    const newTodoId = parseInt(todoId);
    const todoExists = todos.some(todo => todo.id === newTodoId);

    if (!isNaN(newTodoId) && !todoExists) {
      const newTodo = {
        id: newTodoId,
        title,
        completed: false,
        userId: 1,
      };
      setTodos([newTodo, ...todos]);
      localStorage.setItem('todos', JSON.stringify([newTodo, ...todos]));
      api.post('/todos', newTodo);
      setTitle('');
      setTodoId('');
    } else {
      alert('ID must be a unique number.');
    }
  };

  const handleUpdateTodo = () => {
    const newTodoId = parseInt(todoId);
    if (!isNaN(newTodoId)) {
      const updatedTodos = todos.map(todo =>
        todo.id === newTodoId ? { ...todo, title } : todo
      );
      setTodos(updatedTodos);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      api.put(`/todos/${newTodoId}`, { title, completed: false });
      setTitle('');
      setTodoId('');
    } else {
      alert('ID must be a number.');
    }
  };

  const handleDeleteTodo = (id) => {
    const remainingTodos = todos.filter(todo => todo.id !== id);
    setTodos(remainingTodos);
    localStorage.setItem('todos', JSON.stringify(remainingTodos));
    api.delete(`/todos/${id}`);
  };

  const handleMarkComplete = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: true } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    api.patch(`/todos/${id}`, { completed: true });
  };

  const handleFilterTodo = () => {
    const filteredTodos = todos.filter(todo => todo.id === parseInt(filterId));
    const remainingTodos = todos.filter(todo => todo.id !== parseInt(filterId));
    setTodos([...filteredTodos, ...remainingTodos]);
  };

  return (
    <div>
      <h2>Todos</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={todoId}
          onChange={(e) => setTodoId(e.target.value)}
          placeholder="Todo ID (for update/delete)"
          className="form-control"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="form-control"
        />
        <button onClick={handleCreateTodo} className="btn btn-primary mt-2">Create Todo</button>
        <button onClick={handleUpdateTodo} className="btn btn-warning mt-2">Update Todo</button>
      </form>
      <form onSubmit={(e) => e.preventDefault()} className="mt-3">
        <input
          type="text"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          placeholder="Filter by ID"
          className="form-control"
        />
        <button onClick={handleFilterTodo} className="btn btn-info mt-2">Filter Todo</button>
      </form>
      <ul className="list-group mt-3">
        {todos.map(todo => (
          <li key={todo.id} className="list-group-item">
            <div>
              <h5>{todo.title}</h5>
              <p>{todo.completed ? 'Completed' : 'Incomplete'}</p>
              <small>ID: {todo.id}</small>
              <button onClick={() => handleDeleteTodo(todo.id)} className="btn btn-danger btn-sm mt-2">Delete</button>
              <button onClick={() => handleMarkComplete(todo.id)} className="btn btn-success btn-sm mt-2">Mark Complete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
