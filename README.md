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
- Use ``node index.js --path path/to/pictures`` to index your image database.
When the indexer is complete, you'll have your database filled with rows that have searchable properties.

## Usage
You can either run queries right in PSQL to select the properties you want, or use ``node search.js`` for typical queries.

#### Last words
I hope that you'll enjoy this script, and that I'll be done with this in a foreseeable future.
