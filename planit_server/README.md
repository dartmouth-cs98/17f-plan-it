# PlanIt Server

## Running the server
### Install elixir
```
brew install elixir
```

### Install Hex
```
mix local.hex
```
### Install phoenix
```
mix archive.install https://github.com/phoenixframework/archives/raw/master/phx_new.ez
```

### Make sure that mysql.server is running
```
mysql.server start
```

### Setup database and dependencies
```
make setup
```

### Run server
```
make start
```

# Endpoints V1

All information should be sent in JSON.
Set header to application/json

## Users
#### Get a user by user id(GET)
```
/api/v1/users/:id
```

#### Create a user (POST)
```
/api/v1/users

payload = {
  fname: "John",
  lname: "Walsh",
  email: "johnwalsh@example.com",
  username: "jwalshy",
  birthday: "1996-02-19"
}
```
Email and username are unique. 400 returned if username/email is taken. 

#### Update a user's information (PUT)
Only put fields that you wish to be updated
```
/api/v1/users/:id

payload = {
  email: "walshyjohn@example.com"
}
```

## Trips
#### Get all trips created by a user (GET) 
```
/api/v1/trips?user_id=:id
```
Returns back a list of trip objects. Else, empty list

#### Get a trip by trip id (GET)
```
/api/v1/trips/:id
```
Returns back a trip object. Else, null

#### Create a trip (POST)
```
/api/v1/trips

payload = {
  name: "Thailand Fun Adventure",
  user_id: 2
}
```
Will return 400 if user\_id doesn't exist. Else 200


#### Update a trip (PUT)
```
/api/v1/trips/:id

payload = {
  name: "Korea fun adventure"
}
```
Only editable field is name






# TESTING 
## Example curls 
## Creating cards
curl -X POST -d '[
{"type":"hotel","name":"Hanover Inn","city":"hanover","country":"USA","address":"3 Wheelock street","lat":123123.12,"long":121231.12312,"start_time":"2017-12-12 20:01:01","end_time":"2017-12-13 20:01:01","day_number":1,"trip_id":1},
{"type":"attraction","name":"Baker Berry","city":"hanover","country":"USA","address":"1 Tuck street","lat":1231.12,"long":123.12,"start_time":"2017-12-14 20:01:01","end_time":"2017-12-15 20:01:01","day_number":2,"trip_id":1}]' -H "Content-Type: application/json" http://localhost:4000/api/v1/cards

## Updating/Creating users
curl -X PUT -d '{"fname":"john","email":"davidwalsh@example.com"}' -H "Content-Type: application/json" http://localhost:4000/api/v1/users/1
curl -X POST -d '{"fname":"david","lname":"walsh","email":"davidwalsh@example.com","username":"davidwalsh2","birthday":"14"}' -H "Content-Type: application/json" http://localhost:4000/api/v1/users

## Updating Trip
curl -X PUT -d '{"name":"updated trip name"}' -H "Content-Type: application/json" http://localhost:4000/api/v1/trips/1
curl -X POST -d '{"name":"updated trip name","user_id":1}' -H "Content-Type: application/json" http://localhost:4000/api/v1/trips

## Updating card
curl -X PUT -d '{"lat":1123.123}' -H "Content-Type: application/json" http://localhost:4000/api/v1/cards/1
