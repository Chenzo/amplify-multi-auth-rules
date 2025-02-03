'use client'
import { useEffect, useState, useRef } from "react";
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { generateClient } from 'aws-amplify/data';

import styles from "./page.module.css";

Amplify.configure(outputs);

export default function Home() {

  const [theToDos, setTheToDos] = useState([]);
  const [client, setNewClient] = useState(null);

  useEffect(() => {

    const initClient = async () => {
      /**
       * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
       */
      const client = generateClient();
      setNewClient(client);

      const fetchTodos = async () => {
        const { data: todos, errors } = await client.models.Todo.list();
        if (errors) {
          console.log("client.models.Todo.list() errors:")
          console.log(errors);
        }
        setTheToDos(todos);

      };
      fetchTodos();
    }

    initClient();

  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const { errors, data: newTodo } = await client.models.Todo.create({
      content: event.target.content.value,
    });
    if (errors) {
      console.log("client.models.Todo.create() errors:")
      console.log(errors);
    }

    document.querySelector('input[name="content"]').value = null;
    setTheToDos([...theToDos, newTodo]);
  }

  return (
    <div className={styles.page}>
      <section className={styles.toDosSection}>
        <h3>To Do List</h3>
        <div className={styles.toDos}>
          {theToDos.map((todo) => {
            return (
              <div key={todo.id}>
                <p>{todo.content}</p>
              </div>
            )
          })} 
        </div>
      </section>
      <section className={styles.addToDoSection}>
          <h3>Add To Do</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Content:
              <input
                type="text"
                name="content"
              />
            </label>
            <button type="submit">Add Todo</button>
          </form>
        </section>
    </div>
  );
}
