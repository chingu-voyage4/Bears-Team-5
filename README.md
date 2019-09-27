# Medium clone

A build-to-learn [medium](https://medium.com) fullstack clone project, built during the [4th chingu voyage](https://chingu-cohorts.github.io/chingu-directory/) by bears-team-5.

due to an unfortunate series of events, only the backend has been developed successfully, you can try it out at https://medium-clone-api.herokuapp.com using any API testing tool such as [Postman](https://www.getpostman.com/)

## Charter

read the [charcter document](https://github.com/chingu-voyage4/Bears-Team-5/wiki/Bears-Team-5-Charter) to know more about the MVP, standards, and the proccess followed during the project

## Documentation
the REST API documentation can be found [here](https://chingu-voyage4.github.io/Bears-Team-5/)

### Database ERD
![SQL ERD](/docs/sqlDiagram.png?raw=true)

### Activity diagram
![webiste activity diagram](/docs/flowchart.png?raw=true)

## Getting Started
These instructions will get you a copy of the REST API running on your local machine for development and testing purposes.

### Installing dependencies
run the following npm command in the project's folder in order to download and install all dependencies
```
git clone https://github.com/chingu-voyage4/Bears-Team-5.git
npm install
```

### Creating a local mySQL database

- download and install [MAMP](https://www.mamp.info/en/) or any other similar software to start a local mySQL server with InnoDB engine.
- create a new database with any name.
- run the SQL query provided in: `/model/schema.sql` file to populate the database with the required tables. if you're using MAMP, this can be simply done by:
  - open phpmyadmin which be default is at http://localhost/phpMyAdmin/
  - clicking `new` from the left menu to create a new database, name it `test`.
  - then click the newly created database name under the same list to access it.
  - now click the `SQL` button from the top menu and simply copy and paste all the contents of the `schema.sql` file to the query input, make sure to **disable foreign key checks** and then click `go`.
  - now your database is ready to be used.
  
###  Setting up env. variables

create a new file and name it `.env`, this file will hold all the environment variables required to properly connect the app to the local mySQL database we just created. the variables that must be provided can be found in the `.env.default` file.

example of a working `.env` file:
```
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=test
JWT_SECRET=foobarbaz

```

###  Running and testing the REST API

now run the following command to start the API

`
node server.js
`

the API is now running! you communicate with it using tools like [postman](https://www.getpostman.com/)


you can also run tests using:

`
npm run test
`

if everything is setup properly, all tests should pass without any issues.
## License
MIT, see the LICENSE.md file for details.
