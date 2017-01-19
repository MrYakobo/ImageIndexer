# ImageIndexer

## Setup

- Install PostGreSQL on your system and setup a user.
- Clone this repo and run ``npm install``.
- Make a new file, ``credentials.json`` and place it in /setup. The file should look along the lines of this:
```
{
    "db": "postgres",
    "username":"postgres",
    "password": "abc123"
}
```
- Run setup/setup.sql
- Use ``node index.js`` to index your image database. This is stored in PostGres for later use.

## Usage (after indexation)
Use ``node search.js`` to get options for how to search your database. When search is done, the results are outputted to the console.
