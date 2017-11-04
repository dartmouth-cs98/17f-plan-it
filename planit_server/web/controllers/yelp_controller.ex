defmodule PlanIt.YelpController do


  @id = Application.get_env(:yelp, :id)
  @secret = Application.get_env(:yelp, :secret)

	def 15_places(conn, params) do
		url = "https://api.yelp.com/oauth2/token"
		client = OAuth2.Client.new([
			strategy: OAuth2.Strategy.AuthCode, #default
			client_id: @id,
			client_secret: @secret,
			site: url
		])

		# Generate the authorization URL and redirect the user to the provider.
		OAuth2.Client.authorize_url!(client)
		# => "https://auth.example.com/oauth/authorize?client_id=client_id&redirect_uri=https%3A%2F%2Fexample.com%2Fauth%2Fcallback&response_type=code"

		# Use the authorization code returned from the provider to obtain an access token.
		client = OAuth2.Client.get_token!(client, code: "someauthcode")

		# Use the access token to make a request for resources
		resource = OAuth2.Client.get!(client, "/api/resource").body

	end


def get_collection(id) do
  consumer_key = "YOUR_CONSUMER_KEY"
  consumer_secret = "YOUR_CONSUMER_SECRET"
  method = "get"

  url = "http://api.thenounproject.com/collection/#{id}"

  credentials = OAuther.credentials(consumer_key: consumer_key,
                                    consumer_secret: consumer_secret)
  params = OAuther.sign(method, url, [], credentials)

  # we deconstruct the output here and don't care about the
  # request params
  {header, _req_params} = OAuther.header(params)

  # HTTPoison expect a lists of headers as second argument.
  # We only have one, therefore we pass a list
  # with header as only item
  response = HTTPoison.get!(url, [header])
  Poison.decode!(response.body)
end


end
