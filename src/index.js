const express = require('express');
const { v4: uuidv4 } = require('uuid');
// const verifyUser = require('./middlewares/routes.middleware.js');
// const cors = require('cors'); comentado porque não conseguia efetuar reqs insomnia
const PORT = 3000
const app = express();

// app.use(cors);
app.use(express.json());

function verifyUser(request, response, next){
    const { username } = request.headers
    const findObj = users.find((users) => users.username === username);
    
    request.user = findObj
    
    return findObj ? next() : response.status(400).json({"error":"This username doesn't exist!"});
}

const users = []

app.post('/create', (request, response) => {
    const { username, name } = request.body
    const account = users.some((users) => users.username == username);
    const id = uuidv4();

    if(account) return response.status(404).json({"error":"username already exists"});

    users.push({
        id,
        name,
        username,
        todos: []
    });
    
    return response.status(201).send();
})

app.get('/todos', verifyUser, (request, response) => {
    const { user } = request

    return response.status(200).json(user.todos);
})

app.post('/todos', verifyUser, (request, response) => {
    const { user } = request
    const { title, deadline } = request.body

    let task = {
        id: uuidv4(),
        title,
        deadline: new Date(deadline),
        created_at: new Date(),
        done: false
    }

    user.todos.push(task)

    return response.status(201).send()
})

app.put('/update', verifyUser, (request, response) => {
    const { user } = request
    const { title, deadline } = request.body

    user.todos.title = title
    user.todos.deadline = deadline

    return response.status(200).json({"success":`Success! the title and the deadline was changed`})
})

app.put('/done', verifyUser, (request, response) => {
    const { user } = request

    user.todos.done = true

    return response.status(200).json({"success":`Task DONE`})
})

app.delete('/delete', verifyUser, (request, response) => {
    const { user } = request
    const { title } = request.body
    const findTodo = users.find((users)=>users.todos.title === title )

    user.todos.splice(findTodo, 1);

    return response.status(200).json({"success":`Your todo was successfully deleted`})
})

app.listen(PORT, ()=>console.log(`server running on port: ${PORT}`))