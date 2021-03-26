# finfluencers

Finance, finally fun.

## Pre-requisites

### Couchbase

- Run `./couchbase/setup.sh`
- Navigate to `http://localhost:8091
- Set up a cluster with an Administrator login
- Click **Buckets** on the right side-bar
- Click **ADD BUCKET** on the top right
- Name the new bucket `finfluencers`
- Open the **Advanced bucket settings** options at the bottom of the popup
- Enable **Flush**
- Click **Add Bucket**
- Click **Security** from the right side-bar
- Click **ADD USER** on the top right
- Add an account with **Full Admin** rights
- Click **Query** from the right side-bar
- Open the `INDEXES` file in `./couchbase`
- Copy each index into the query editor and then press **Execute**


### ENV settings
- Go to `./runner` and copy `runner_env.example.js` to `runner_env.js`
- Modify the contents of that file to match your couchbase user/bucket settings


## Installation
There are many projects within this repository which need to be initialized.

- Backend (microservices)
- Frontend (vue)
- Smart Contracts (C++)

### Install dependencies

```
node rebuild_all
```


## Running finfluencers

#### Terminal 1 (Backend)
```
node runner/run
```

#### Terminal 2 (Frontend)
```
cd ./front-end
npm start
```

#### Terminal 3 (Blockchain)
```
// TODO:
```
