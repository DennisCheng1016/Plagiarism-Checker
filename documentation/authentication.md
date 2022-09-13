## Authentication

#### Register

- [x] completed

**url** 	```/auth/register/```

**Parameter**

| Parameter | Value type |
| --------- | ---------- |
| username  | String     |
| email     | String     |
| password  | String     |
| role  | enum: ["student", "teacher"]     |

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

| Parameter | explain  | Value type |
| --------- | -------- | ---------- |
| email     | email    | String     |
| password  | password | String     |

**Response**

status code: 200
```json
{
    "token": "token",
    "role": "role"
}
```

***

#### get user information from token

- [x] completed

**url**        ```/auth/get_user/```

**Parameter**

| Parameter | explain  | Value type |
| --------- | -------- | ---------- |

**Response**

status code: 200
```json
{
    "username": "username",
    "email": "email",
    "role": "role",
    "subjects": "subjects"
}
```