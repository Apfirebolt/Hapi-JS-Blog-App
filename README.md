# Back-end for the blog application written in Hapi Js

An elementary blogging application with some social networking features like adding other users as friends.

## Getting Started

This project uses light weight Hapi Js framework for implementing APIs in Node js environment. For the database, it uses postgres and PGAdmin graphical user interface. It uses Objection Js as the Object Relational Mapping library which makes writing queries and establishing relationships easier. It also uses Knex Js which is a SQL Query builder for node js.

* Start under Node environment, copy this project and install dependencies.
* Setup database by configuring env variables, this project uses postGres, but you can use mySQL or sqlite3.
* This uses Hapi Js ecosystem for creating API end points, validating data passed as params or payload.
* This project uses JSON web tokens for authentication.
* Features include user registration, login.
* People can add other users as their friends, create blogs by category.
* CRUD operations can be performed on blog categories and posts.
* Blogs can be shared with friends or can be shared publicly.


## Built With

* [Hapi JS](https://hapi.dev/)
* [Objection JS](https://vincit.github.io/objection.js/)
* [PostGreSQL](https://www.postgresql.org/)
* [Knex JS](http://knexjs.org/)

## Authors

* [Amit Prafulla (Apfirebolt)](https://github.com/Apfirebolt)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

