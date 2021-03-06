import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { DEL_TODO, TOG_TODO, GET_USER } from '../../gqlDefs';
import './Todo.css';

const Todo = ( { id, title, isComplete, user } ) => {
	const opResTog = {
		...user,
		__typename: "User",
		todos: user.todos.map((todo) => {
			if(todo.id === id){
				return {
					...todo,
					isComplete: !isComplete
				}
			}
			return todo
		})
	}
	const opResDel = {
		...user,
		__typename: "User",
		todos: user.todos.filter(todo => todo.id !== id)
	}
	const [toggleTodo] = useMutation(TOG_TODO, {
		update: (cache, { data: { toggleTodo } }) => {
			cache.writeQuery({
				query: GET_USER,
				data: {
					me: toggleTodo.user
				}
			});
		},
		optimisticResponse: {
			toggleTodo: {
				__typename: "toggleTodo",
				code: "200",
				success: true,
				message: "todo successfully toggled",
				user: opResTog
			}
		}
	});
	const [removeTodo] = useMutation(DEL_TODO, {
		update: (cache, { data: { removeTodo } }) => {
			cache.writeQuery({
				query: GET_USER,
				data: {
					me: removeTodo.user
				}
			});
		},
		optimisticResponse: {
			removeTodo: {
				__typename: "removeTodo",
				code: "200",
				success: true,
				message: "todo successfully removed",
				user: opResDel
			}
		}
	})
	return (
		<div className='todoDiv'>
			<p className={isComplete?`todoComplete`:`todoPending`} onClick={ () => toggleTodo({ variables: { todoId: id } }) } >{title}</p>
			<button className='todoDelete' onClick={ () => removeTodo({ variables: { todoId: id } }) } >X</button>
		</div>
	);
}

export default Todo;