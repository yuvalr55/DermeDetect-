//LOGIC
const {Client} = require('pg');

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'DermeDetect',
    password: '147852369',
    port: 5432,
});

client.connect();

getUsers = (cd) => {
    const queryFromDB = `SELECT id_user, name, surname FROM user_management`

    client.query(queryFromDB, cd)
}





updateMisson = (id_mission, name_mission, status, id_user) => {
    const queryFromDB = `UPDATE public.task_management
 SET id_mission='${id_mission}', name_mission='${name_mission}', status='${status}', id_user='${id_user}'
 WHERE id_mission='${id_mission}'`
    client.query(queryFromDB, (err) => {
            if (err) {
                console.log(err.stack)

            } else {
                console.log('update!')
            }
        }
    )


}

deleteMisson = (id_mission) => {
    const queryFromDB = `DELETE FROM public.task_management WHERE id_mission = ${id_mission};`
    client.query(queryFromDB, (err) => {
            if (err) {
                console.log(err.stack)

            } else {
                console.log('delete!')
            }
        }
    )
}


insertMisson = (name_mission, status, id_user) => {
    // console.log(name_mission, status, id_user)
    const queryFromDB = `INSERT INTO public.task_management(
	id_mission, name_mission, status, id_user)
	VALUES (nextval('task_management_id_mission_seq'), '${name_mission}', '${status}', ${id_user});`
    client.query(queryFromDB, (err) => {
            if (err) {
                console.log(err.stack)

            } else {
                console.log('insert')
            }
        }
    )
}


queryForUser = (cd) => {

    const queryFromDB = `SELECT s1.id_mission,s1.name_mission, s1.status ,s2.*
    FROM task_management AS s1
    INNER JOIN user_management AS s2
    ON s1.id_user = s2.id_user`

    client.query(queryFromDB, cd)
}


//API
const express = require('express')
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json())

    app.get('/all_users', (req, response) => {

    getUsers((err, res) => {
        if (err) {
            console.log(err.stack)


        } else {
            const data = res.rows
            response.send(data)

        }

    })
});




app.get('/mission', (req, response) => {

    queryForUser((err, res) => {
        if (err) {
            console.log(err.stack)


        } else {
            const data = res.rows
            response.send(data)

        }

    })
});

app.post('/add', (req, response) => {
    const data = req.body;
    insertMisson(data.name_mission, data.status, parseInt(data.id_user));
    queryForUser((err, res) => {
        if (err) {
            console.log(err.stack)


        } else {
            const data = res.rows
            response.send(data)

        }

    })
});


app.post('/delete', (req, response) => {
    const data = req.body;
    deleteMisson(data.id_mission);
    queryForUser((err, res) => {
        if (err) {
            console.log(err.stack)


        } else {
            const data = res.rows
            response.send(data)

        }

    })
});

app.post('/update', (req, response) => {
    const data = req.body;
    updateMisson(data.id_mission, data.name_mission, data.status, data.id_user);
    queryForUser((err, res) => {
        if (err) {
            console.log(err.stack)


        } else {
            const data = res.rows
            response.send(data)

        }

    })
});


app.listen(port = 8001, () => {
    console.log('Example app listening on port 8001!')
});
