defmodule PlanIt.YelpController do

  use PlanIt.Web, :controller
  use HTTPoison.Base
  alias OAuth2

  def index(conn, _params) do
    json conn, "ok"
  end

  @api_url "https://api.yelp.com/v3/"

  @default_client OAuth2.Client.new([
      strategy: OAuth2.Strategy.ClientCredentials,
      client_id: System.get_env("CLIENT_ID"),
      client_secret: System.get_env("CLIENT_SECRET"),
      site: "https://api.yelp.com",
      token_url: "/oauth2/token"
  ])

  @spec create_client(String.t, String.t, Keyword.t) :: OAuth2.Client.t
  defp create_client(client_id, client_secret, options \\ []) do
    OAuth2.Client.new([
      strategy: OAuth2.Strategy.ClientCredentials,
      client_id: client_id,
      client_secret: client_secret,
      site: "https://api.yelp.com",
      token_url: "/oauth2/token"
    ])
  end

  @doc """
  Get a Yelp Fusion API access token.
  Uses Yelp API credentials stored as environment variables to authenticate.
  Returns an `OAuth2.AccessToken` struct.
  ## Options
  * See [`OAuth2.Client.get_token/4`](https://hexdocs.pm/oauth2/0.8.0/OAuth2.Client.html#get_token/4)
  """
  @spec get_token(Keyword.t) :: {:ok, OAuth2.AccessToken.t} | {:error, HTTPoison.Error.t}
  def get_token(client \\ nil, options \\ []) do
    oauth_client = case client do
      nil -> @default_client
      _ -> client
    end

    params = [
      grant_type: "client_credentials",
      client_id: oauth_client.client_id,
      client_secret: oauth_client.client_secret
    ]

    case OAuth2.Client.get_token(oauth_client, params, options) do
      {:ok, response} -> {:ok, response.token}
      {:error, error} -> {:error, error}
    end
  end

  @doc """
  Same as `get_token/2`, but raises `HTTPoison.Error`
  if an error occurs during the request.
  """
  @spec get_token!(OAuth2.Client.t, Keyword.t) :: OAuth2.Client.t
  def get_token!(client \\ @client, options \\ []) do
    case get_token(client) do
      {:ok, token} -> token
      {:error, error} -> raise error
    end
  end

  @doc false
  def refresh_token do
    :not_implemented
  end

  @doc """
  Issues an HTTP request.
  """
  @spec request(atom, String.t, body, headers, Keyword.t) :: {:ok, HTTPoison.Response.t} | {:error, HTTPoison.Error.t}
  def request(method, endpoint, body \\ "", headers, options \\ []) do
    url = @api_url <> endpoint <> "?"

    super(method, url, "", headers, options)
  end

  @doc """
  Same as `request/5`, but returns `HTTPoison.Response` or raises an error.
  """
  @spec request!(atom, String.t, body, headers, Keyword.t) :: HTTPoison.Response.t
  def request!(method, url, body \\ "", headers \\ [], options \\ []) do
    case request(method, url, body, headers, options) do
      {:ok, response} -> response
      {:error, error} -> raise error
    end
  end


	def topplaces(conn, params) do

    # id = Application.get_env(:yelp, :id)
    # secret = Application.get_env(:yelp, :secret)

    id = "CYQN92eKQPcAzMpfGvDknA"
    secret = "sJ3mr4cd3TGZmJ9x1icWJdxpgPqELci5pRDDeYHJME9S4SBiKy16XtB2hJo7iXvu"

		client = create_client(id, secret)

    {message, token} = get_token(client)

    json conn, token

		# # Generate the authorization URL and redirect the user to the provider.
		# OAuth2.Client.authorize_url!(client)
		# # => "https://auth.example.com/oauth/authorize?client_id=client_id&redirect_uri=https%3A%2F%2Fexample.com%2Fauth%2Fcallback&response_type=code"

    # params = [grant_type: "client_credentials", client_id: id, client_secret: secret]

		# # Use the authorization code returned from the provider to obtain an access token.
		# client = OAuth2.Client.get_token!(client, params, code: "someauthcode")

		# Use the access token to make a request for resources
		# resource = OAuth2.Client.get!(client, @api_url).body

	end
end
