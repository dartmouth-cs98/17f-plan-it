# PlanIt

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

### Install deps
```
mix deps.get
```

### Run server
```
mix phx.server
```


# Routes


#Example curl 

curl -X POST -d '[
{"type":"hotel","name":"Hanover Inn","city":"hanover","country":"USA","address":"3 Wheelock street","lat":123123.12,"long":121231.12312,"start-time":"2017-12-12 20:01:01","end-time":"2017-12-13 20:01:01","day-number":1,"trip-id":1},
{"type":"attraction","name":"Baker Berry","city":"hanover","country":"USA","address":"1 Tuck street","lat":1231.12,"long":123.12,"start-time":"2017-12-14 20:01:01","end-time":"2017-12-15 20:01:01","day-number":2,"trip-id":1}]' -H "Content-Type: application/json" http://localhost:4000/api/v1/cards
