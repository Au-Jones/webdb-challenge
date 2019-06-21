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


const port = process.env.PORT || 5500;
server.listen(port, () => console.log(`\nRunning on port ${port}\n`))