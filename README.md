# Fempire

## Prerequisites

The following should be downloaded and installed before proceeding with setup:

MySQL Workbench: https://www.mysql.com/products/workbench/

node.js: https://nodejs.org/en/download/package-manager/

VSCode: https://code.visualstudio.com/

(Windows users only) Git bash: https://git-scm.com/downloads/win

(Windows users only): when opening VSCode terminal, navigate to the plus sign in the top right of the terminal window, select the dropdown next to it, and change to "Git Bash":

![Git Bash](git-bash.png)

## Setup

Run MySQL Workbench, create a password for your instance and keep it handy, as it will be used each time you connect to the db

Right click in the "Schemas" column to the left and select "Create Schema":

![Schema](schema.png)

For the name, enter `fempire_db` and select Apply near the bottom. A new window will pop up confirming the creation, click Apply again

Clone the repo:

`git clone https://github.com/lagamaite/Fempire.git`

`cd Fempire`

Create a `.env` file with the following contents:

```
DB_USER=root
DB_PASSWORD=testpass # or your unique db password you set 
DB_HOST=localhost
DB_NAME=fempire_db
```

We create this local file because we do not want to hard-code any sensitive passwords

Next, open the backend directory:

`cd backend`

Install dependencies: `pip install -r requirements.txt`

Run flask server: `python3 server.py`




