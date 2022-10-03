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
    "Authorization": "Bearer token",
    "role": "role"
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
