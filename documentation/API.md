# API

## ListUserGroupsHttpLambda
- get a list of groups for a specific user

POST: 
`https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com/listUserGroups`

raw/json:
```json
{
    "userName": "piskdvzrxkglrtskft@kvhrw.com",
    "userPoolId": "eu-central-1_bAc9VMMys"
}
```

## CreateGroup
- creates a group and adds the provided username to the group and set the attribute `custom:admin_of_group` with the given username. 

POST: 
`https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com/createGroup`

raw/json:
```json
{
    "groupName": "Testgruppe71",
    "userName": "piskdvzrxkglrtskft@kvhrw.com",
    "userPoolId": "eu-central-1_bAc9VMMys",
    "roleType": "Free"
}
```


## AddUserToGroupHttpLambda
- adds a user to a group by calling `AddUserToGroupLambda` 

POST: 
`https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com/addUserToGroup`

raw/json:
```json
{
    "userName": "piskdvzrxkglrtskft@kvhrw.com",
    "userPoolId": "eu-central-1_bAc9VMMys",
    "groupName": "Testgruppe18"
}
```
