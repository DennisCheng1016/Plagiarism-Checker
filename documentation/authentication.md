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
    "Authorization": "Bearer token",
    "role": "role"
}
```

