## Authentication

#### Register

- [x] completed

**url** 	```/auth/register/```

**Parameter**

| Parameter | body/headers | Value type                   |
| --------- |--------------|------------------------------|
| username  | body         |  String                      |
| email     | body         | String                       |
| password  | body         | String                       |
| role  | body         | enum: ["student", "teacher"] |

**Response**

status code: 200
```json
{
    "msg": "registration successful"
}
```

***

#### Login

- [x] completed

**url** 	```/auth/login/```

**Parameter**

| Parameter | body/headers | explain | Value type |
| --------- |--------------|----------| ---------- |
| email     | body         |email    | String     |
| password  | body         |password | String     |

**Response**

status code: 200
```json
{
  "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNhOGRlNDRiZjE0MDEzMmVlMmIxOWEiLCJ1c2VybmFtZSI6InJ1aW1pbmciLCJlbWFpbCI6Im5lZ3Jvbml4aWVAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwic3ViamVjdHMiOltdLCJhY2NvdW50U3RhdHVzIjoiYWN0aXZlIiwiaWF0IjoxNjY0ODc1OTIxLCJleHAiOjE2NjQ5NjIzMjF9.AwGtQahVhiGpnAkwcNhLhBzvxWlNlO2XMi7qw7zpQ4w",
  "role": "admin",
  "_id": "633a8de44bf140132ee2b19a",
  "username": "ruiming",
  "email": "negronixie@gmail.com",
  "subjects": [],
  "accountStatus": "active"
}
```



***

#### Send authentication email

- [x] completed

**url** 	```/auth/recoverEmail```

**Parameter**

| Parameter | body/headers | explain  | Value type |
|----------|--------------|----------| ---------- |
| authorization | headers      | token    | String  |
| password | body         | password | String  |

**Response**

status code: 200
```json
{
    "msg": "Success"
}
```

***

#### reset password

- [x] completed

**url** 	```/user/resetPassword```

**Parameter**

| Parameter | body/headers | explain  | Value type |
|----------|--------------|----------| ---------- |
| authorization | headers      | token    | String  |
| password | body         | password | String  |

**Response**

status code: 200
```json
{
    "msg": "Success"
}
```
