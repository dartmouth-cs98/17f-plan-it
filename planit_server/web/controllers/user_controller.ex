defmodule PlanIt.UserController do
  alias PlanIt.Repo
  alias PlanIt.User
  alias PlanIt.Card
  alias PlanIt.Trip
  alias PlanIt.Travel

  use PlanIt.Web, :controller

  import Ecto.Changeset

  def index(conn, _params) do
    users = PlanIt.User |> Repo.all

    json conn, users
  end

  def show(conn, %{"id" => user_id} = params) do
    user = (from u in User,
      where: u.id == ^user_id,
      select: u
    ) |> Repo.one

    json conn, user
  end

  def create(conn, params) do
    changeset = User.changeset(%User{}, params)
    {message, changeset} = Repo.insert(changeset)
    IO.inspect(message)
    IO.inspect(changeset.errors)

    if message == :ok do
      json conn, "ok"
    else
      put_status(conn, 400)
      return_string = "error: #{inspect changeset.errors}"
      json conn, return_string
    end
  end

  def update(conn, %{"id" => user_id} = params) do
    user = Repo.get(User, user_id)
    changeset = User.changeset(user, params)

    {message, changeset} = Repo.update(changeset)

    if message == :ok do
      json conn, "ok"
    else
      json conn, "this is bad"
    end
  end

  def create_sample(conn, _params) do
    Repo.insert!(%User{
      fname: "Sam",
      lname: "Lee",
      email: "samlee@example.com",
      username: "slee",
      birthday: ~D[1996-12-31]})

    Repo.insert!(%Travel{type: "walking", duration: ~T[10:10:00]})

    Repo.insert!(%Trip{name: "test trip", user_id: 1})

    Repo.insert!(%Card{
      type: "restaurant",
      name: "Pine",
      city: "Hanover",
      country: "USA",
      address: "Corner of the Green",
      start_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"),
      end_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"),
      day_number: 1,
      travel_id: 1,
      trip_id: 1
    })

    Repo.insert!(%Card{
      type: "exercise",
      name: "Alumni Gym",
      city: "Hanover",
      country: "USA",
      address: "In front of East Wheelock",
      start_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"),
      end_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"),
      day_number: 1,
      trip_id: 1
    })



    json conn, []
  end
end
