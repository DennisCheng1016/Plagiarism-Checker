# User
### get user information from token

- [x] completed

**url**        ```/user/getUser/```

**Parameter**

| Parameter | body/headers/query/params | explain  | Value type |
|--------|---------|-------- | ---------- |
| Authorization| headers   | adminName   | String     |


e.g.
```json
{
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJ4aWVAZ21haWwuY29tIiwiaWF0IjoxNjY0MTkyNjI5LCJleHAiOjE2NjQyNzkwMjl9.7mK0izFzPlEfvlfssJgO2JUNLCredmLm792Ym02pmN4"
}
```

**Response**

status code: 200
```json
{
  "username": "username",
  "email": "email",
  "role": "role",
  "subjects": [],
  "accountStatus": "active/disabled"
}
```
