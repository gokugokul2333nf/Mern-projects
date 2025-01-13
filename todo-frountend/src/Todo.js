import React, { useState, useEffect } from "react";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null); // Track the todo being edited

  const apiUrl = "http://localhost:8000/todos";

  // Inline CSS
  const styles = {
    container: {
      width: "50%",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      fontSize: "24px",
      marginBottom: "20px",
    },
    form: {
      marginBottom: "20px",
    },
    input: {
      width: "calc(100% - 22px)",
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    todoItem: {
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "4px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    todoText: {
      margin: 0,
    },
    actionButtons: {
      display: "flex",
      gap: "10px",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    editButton: {
      backgroundColor: "#ffc107",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  // Fetch todos from API
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add or Edit a todo
  const handleSubmit = async () => {
    if (!title || !desc) {
      alert("Both title and description are required!");
      return;
    }

    if (editingTodo) {
      // Editing existing todo
      try {
        const response = await fetch(`${apiUrl}/${editingTodo._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, desc }),
        });
        const updatedTodo = await response.json();
        setTodos(
          todos.map((todo) =>
            todo._id === updatedTodo._id ? updatedTodo : todo
          )
        );
        setEditingTodo(null); // Reset editing mode
        setTitle("");
        setDesc("");
      } catch (error) {
        console.error("Failed to update todo:", error);
      }
    } else {
      // Adding new todo
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, desc }),
        });
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        setTitle("");
        setDesc("");
      } catch (error) {
        console.error("Failed to add todo:", error);
      }
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Edit a todo
  const editTodo = (todo) => {
    setTitle(todo.title);
    setDesc(todo.desc);
    setEditingTodo(todo);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{editingTodo ? "Edit Todo" : "Todo List"}</h1>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter title"
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter description"
          style={styles.input}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button style={styles.button} onClick={handleSubmit}>
          {editingTodo ? "Update Todo" : "Add Todo"}
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading todos...</p>
      ) : todos.length > 0 ? (
        todos.map((todo) => (
          <div key={todo._id} style={styles.todoItem}>
            <div>
              <p style={styles.todoText}>
                <strong>{todo.title}</strong>: {todo.desc}
              </p>
            </div>
            <div style={styles.actionButtons}>
              <button
                style={styles.editButton}
                onClick={() => editTodo(todo)}
              >
                Edit
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No todos available. Add some!</p>
      )}
    </div>
  );
};

export default Todo;
