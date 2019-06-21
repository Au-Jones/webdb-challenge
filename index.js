const express = require('express');
const server = express();
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development)

server.use(express.json())

server.get('/api/projects', async(req, res) => {
    try{
        const projects = await db('projects');
        res.status(200).json(projects)
    }catch (error){
        res.status(500).json(error)
    }
})

server.get('/api/projects/:id', async(req, res) => {
    try{
        const project = await db('projects')
        .where({ id: req.params.id })
        .first()
        .then(project => {
            if (project) {
                db('action')
                .where({ project_id: req.params.id})
                .then(action => {
                    project.action = action
                    res.status(200).json(project)
                })
                .catch(error => {
                    res.status(500).json({ error })
                })
            }else{
                res.status(404).json ({ message: 'User not found'})
            }
        })
    } catch (error) {
        res.status(500).json({ error })
    }
})

server.post('/api/projects', async(req, res) => {
    try{
        const [id] = await db('projects').insert(req.body);
        const project = await db('projects')
        .where({ id })
        .first();
        res.status(201).json(project)
    }catch (error) {
        const message = errors[error.errno] || 'there is an error'
        res.status(500).json({ message, error})
    }
})

server.put('/api/projects/:id', async(req, res) => {
    try {
        const count = await db('projects')
        .where({ id: req.params.id })
        .update(req.body)
        if (count > 0) {
            const project = await db('projects')
            .where({ id: req.params.id })
            .first();
            res.status(200).json(project)
        }else{
            res.status(404).json({ message: 'Not Found'})
        }
    } catch (error) {}
})

server.delete('/api/projects/:id', async(req, res) => {
    try{
        const count = await db('projects')
        .where({ id: req.params.id })
        .del();
        res.status(200).json({ message: 'Deleted'})
        if (count > 0) {
            res.status(204).end();
        }else{
            res.status(404).json ({message: 'Not Found'})
        }
    }catch (error) {
        res.status(500).json({ message: 'not able to complete'})
    }
})



const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`\nRunning on port ${port}\n`))