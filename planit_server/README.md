# Planit Server

# Running the server

### Install elixir
```
brew install elixir
```

### Install hex
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

Note: if you set a password for your mysql server, then you must configure your database to by setting the "password" field in config/dev.exs.

### Setup database and dependencies
```
make drop
make setup
```

### Run server
```
make start
```

# Endpoints V1

General information:

* All information should be sent in JSON. Set header to application/json.
* For updates, only include the fields that should be updated.

## Users
#### Get a user by user id (GET)
```
/api/v1/users/:id
```

Returns a user object if get is successful.
Returns null if no users with the provided user id exist in the database.

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
Email and username must be unique. 

Returns user id if create is successful.
Returns 400 and an error message if email/username is taken or if fields are entered incorrectly. 


#### Update a user's information (PUT)
```
/api/v1/users/:id

payload = {
  email: "walshyjohn@example.com"
}
```

Returns "ok" if update is successful.
Returns 400 and an error message if the update is not successful.

## Trips
#### Get all trips created by a user (GET) 
```
/api/v1/trips?user_id=:id
```

Returns a list of trip objects if get is successful.
Returns an empty list if that user id isn't associated with any trips.

#### Get a trip by trip id (GET)
```
/api/v1/trips/:id
```

Returns a list containing one trip object if get is successful.
Returns an empty list if that trip id doesn't exist in the database.

#### Create a trip (POST)
```
/api/v1/trips

payload = {
  name: "Thailand Fun Adventure",
  user_id: 2
}
```

Returns trip id if create is successful.
Returns 400 and an error message if not successful.

#### Update a trip (PUT)
The only field that should be updated for a trip is its name.

```
/api/v1/trips/:id

payload = {
  name: "Korea fun adventure"
}
```

Returns "ok" if update is successful.
Returns 400 and an error message if the update is not successful.

## Cards
#### Get cards by trip id  (GET)
```
/api/v1/cards?trip_id=:id
```
Returns a list of card objects if get is successful.
Returns an empty list if that trip id isn't associated with any cards.

#### Get cards by trip id and day number (GET)
```
/api/v1/cards?trip_id=:trip_id&day=:day_number
```
Returns a list of card objects if get is successful.
Returns an empty list if that combination of trip id and day number isn't associated with any cards.

#### Create new cards (POST)

Must provide a list of cards, even if you are only trying to insert one card.

```
/api/v1/cards

package = [ 
{ type:"hotel",
  name:"Hanover Inn",
  city:"hanover",
  country:"USA",
  address:"3 Wheelock street",
  lat:123123.12,
  long:121231.12312,
  start_time:"2017-12-12 20:01:01",
  end_time:"2017-12-13 20:01:01",
  day_number:1,
  trip_id:1,
  travel_duration:"10:10:10",
  travel_type:"bike"
  },
{ type:"hotel",
  name:"Hanover Inn",
  city:"hanover",
  country:"USA",
  address:"3 Wheelock street",
  lat:123123.12,
  long:121231.12312,
  start_time:"2017-12-12 20:01:01",
  end_time:"2017-12-13 20:01:01",
  day_number:1,
  trip_id:1,
  travel_duration:"10:10:10",
  travel_type:"bike"
  }
]
```

Returns "ok" if create is successful.
Returns 400 and "BAD" if the create is not successful. Nothing will be inserted into the database if this error message is returned. We're still working on figuring out a more useful error message.

#### Delete a card (DELETE)
```
/api/v1/cards/:id
```

Returns "ok" if delete is successful. 
Returns 400 and an error message if the delete is not successful.

#### Update a card (PUT)
```
/api/v1/cards/:id

payload =  
{ 
  start_time:"2017-12-12 20:01:01",
  end_time:"2017-12-13 20:01:01",
  travel_duration:"10:10:10"
}
```

Returns "ok" if update is successful.
Returns 400 and an error message if not successful.

# TESTING

## Example curls 

### Create a user
curl -X POST -d '{"fname":"david","lname":"walsh","email":"davidwalsh@example.com","username":"davidwalsh2","birthday":"14"}' -H "Content-Type: application/json" http://localhost:4000/api/v1/users

### Update a user
curl -X PUT -d '{"fname":"john","email":"davidwalsh@example.com"}' -H "Content-Type: application/json" http://localhost:4000/api/v1/users/1

### Create a trip 
curl -X POST -d '{"name":"updated trip name","user_id":1}' -H "Content-Type: application/json" http://localhost:4000/api/v1/trips

### Update a trip
curl -X PUT -d '{"name":"updated trip name"}' -H "Content-Type: application/json" http://localhost:4000/api/v1/trips/1

### Create cards
curl -X POST -d '[
{"type":"hotel","name":"Hanover Inn","city":"hanover","country":"USA","address":"3 Wheelock street","lat":123123.12,"long":121231.12312,"start_time":"2017-12-12 20:01:01","end_time":"2017-12-13 20:01:01","day_number":1,"trip_id":1,"travel_duration":"10:10:10","travel_type":"bike"},
{"type":"attraction","name":"Baker Berry","city":"hanover","country":"USA","address":"1 Tuck street","lat":1231.12,"long":123.12,"start_time":"2017-12-14 20:01:01","end_time":"2017-12-15 20:01:01","day_number":2,"trip_id":1,"travel_duration":"10:10:10","travel_type":"bike"}]' -H "Content-Type: application/json" http://localhost:4000/api/v1/cards

### Update a card
curl -X PUT -d '{"lat":1123.123}' -H "Content-Type: application/json" http://localhost:4000/api/v1/cards/1
