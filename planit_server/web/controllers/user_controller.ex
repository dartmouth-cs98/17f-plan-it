defmodule PlanIt.UserController do
  alias PlanIt.Repo
  alias PlanIt.User
  alias PlanIt.Card
  alias PlanIt.Trip
  alias PlanIt.Travel

  use PlanIt.Web, :controller

  import Ecto.Changeset

  # GET - get all users in the database
  def index(conn, _params) do
    users = PlanIt.User |> Repo.all

    json conn, users
  end

  # GET - get a user by id
  def show(conn, %{"id" => user_id} = params) do
    user = (from u in User,
      where: u.id == ^user_id,
      select: u
    ) |> Repo.one

    json conn, user
  end

  # POST - insert a new user
  def create(conn, params) do
    changeset = User.changeset(%User{}, params)
    {message, changeset} = Repo.insert(changeset)

    if message == :error do
      error = "error: #{inspect changeset.errors}"
      json put_status(conn, 400), error
    end

    json conn, "ok"
  end

  # PUT - update an existing user
  def update(conn, %{"id" => user_id} = params) do
    user = Repo.get(User, user_id)
    changeset = User.changeset(user, params)

    {message, changeset} = Repo.update(changeset)

    if message == :error do
      error = "error: #{inspect changeset.errors}"
      json put_status(conn, 400), error
    end

    json conn, "ok"
  end

  # GET - inserts sample data
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
      lat: 17.00088,
      long: 149.0055,
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
      lat: 107.0268,
      long: 29.815,
      start_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"),
      end_time: DateTime.from_naive!(~N[2016-05-24 13:26:08.003], "Etc/UTC"),
      day_number: 1,
      trip_id: 1
    })



    json conn, []
  end
end
