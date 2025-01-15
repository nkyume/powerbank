# Power Bank
Advanced Banking Super Operating System
  
# How to run:

1. Make sure you have [postgressql](https://www.postgresql.org/download)  
2. Start postgres
3. Configure .env file  
4. Install dependencies
```
yarn 
```
5. Compile and run
```
yarn compile
yarn start
```

# Endpoints
tags:  
- [Auth](#auth).  
- [Users](#auth).
- [Balance](#auth).
   
I'm too silly to make swagger docs (>؂ •́)

### Auth
### POST /api/v1/signup
**create user account**
request body example:
```
{
  "username": "string",
  "password": "string"
}
```
response example:
```
201
```

### POST /api/v1/login
**log into account**  
request body example:
```
{
  "username": "string",
  "password": "string"
}
```
response example:
```
{
  "token": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Im1hZG9rYSIsImlhdCI6MTUxNjIzOTAyMn0.JjCjhHC4sZBVpcFUUtT5PVHXQQtIv1AC-2J4Hb1kmjc'
}
```
### Users
### GET /api/v1/users
**Returns array of users**
query params:  
  - **search**: string    
      will return only users whose usernames start with that string
      
  - **limit**: int  
      how many users will return  
      default value: 50
        
  - **page**: int   
      page number  
      default value: 50  
    
response example:  
```
{
  [
    {
      "username": "string"
    }
  ]
}
```

### GET /api/v1/user/{username}
**Returns one user**  
response example:  
```
{
  "username": "string"
}
```

## Balances
### GET /api/v1/balance  
**Returns balance of logged-in user**  
Auth: Bearer  
response example:  
```
{
  "cash": int,
  "non_cash": int,
}
```

### GET /api/v1/balance/transaction  
**Returns array of transactions of logged-in user**  
Auth: Bearer 

query params:  
  - **search**: string    
      will return only users whose usernames start with that string
      
  - **limit**: int  
      how many users will return  
      default value: 50
        
  - **page**: int   
      page number  
      default value: 50
    
response example:  
```
{
  [
    "sender": "string",
    "receiver": "string",
    "amount": int,
    "transactionType": "string",
    "date" timestamp
  ]
}
```

### POST /api/v1/balance/deposit
**Transfer money from logged-in user's wallet to bank account**  
Auth: Bearer  
request body example:  
```
{
  "amount": int
}
```
response example:  
```
204
```

### POST /api/v1/balance/withdraw
**Transfer money from logged-in user's bank account to wallet**  
Auth: Bearer  
request body:  
```
{
  "amount": int
}
```
response example:  
```
204
```

### POST /api/v1/balance/transfer
**Transfer money from logged-in user's bank account to another user's bank account**  
Auth: Bearer  
request body example: 
```
{
  "amount": int
}
```
response example:  
```
204
```

### POST /api/v1/balance/bablo
**Button "Bablo"... If only i had it irl...**  
Auth: Bearer  
request body example: 
```
{
  "amount": int
}
```
response example:  
```
204
``` 
    




  
