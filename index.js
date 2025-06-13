const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// Home
app.get('/', async (req, res) => {
    try {
        // https://api.hubapi.com/crm/v3/objects/contacts
        const response = await axios.get("https://api.hubapi.com/crm/v3/objects/2-169573748/?properties=color&properties=name&properties=age", {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });


        const data = response.data.results.map(result => result.properties);
        // const data = response.data;
        console.log('Data fetched successfully:', data);
        // res.json(data);
        res.render('homepage', { title: 'Homepage | HubSpot APIs', data });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/update-cobj', async (req, res) => {
    try {
        // Fetch the custom object data to populate the form
        const response = await axios.get("https://api.hubapi.com/crm/v3/objects/2-169573748/?properties=color&properties=name&properties=age", {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data.results.map(result => result.properties);
        res.render('update', { title: 'Update Custom Object | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/update-cobj', async (req, res) => {
    const formData = req.body;
    console.log('Form Data:', formData);

    try {
        const newPet = {
            properties: {
                "name": formData.name,
                "age": formData.age,
                "color": formData.color
            }
        };

        const createPetUrl = 'https://api.hubapi.com/crm/v3/objects/2-169573748';

        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(createPetUrl, newPet, { headers });

        // The ID of the new contact can be obtained from the response
        // const newContactId = response.data.id;

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.response ? error.response.data : 'Error creating new record in CRM');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));