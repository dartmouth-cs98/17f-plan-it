defmodule PlanIt.UserController do
  use PlanIt.Web, :controller

  def index(conn, _params) do
    users = []
    json conn, users
  end
end
