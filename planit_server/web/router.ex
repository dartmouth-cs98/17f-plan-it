defmodule PlanIt.Router do
  use PlanIt.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PlanIt do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  scope "/api/v1", PlanIt do
    pipe_through :api
    get "/users", UserController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", PlanIt do
  #   pipe_through :api
  # end
end
