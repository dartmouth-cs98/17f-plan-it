defmodule PlanIt.UserController do
  alias PlanIt.Repo
  alias PlanIt.User

  use PlanIt.Web, :controller

  def index(conn, _params) do
    #users = Repo.all(PlanIt.User)
    users = Repo.all(PlanIt.User)

    json conn, users
  end

  def create_sample(conn, _params) do
    Repo.insert!(%User{fname: "Sam", lname: "Lee", email: "samlee@example.com", username: "slee", birthday: 02171996 })

    json conn, []
  end
end
