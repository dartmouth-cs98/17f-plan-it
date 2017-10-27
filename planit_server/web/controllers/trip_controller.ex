defmodule PlanIt.TripController do
  alias PlanIt.Repo
  alias PlanIt.Card
  alias PlanIt.Trip
  import Ecto.Query

  use PlanIt.Web, :controller

  def index(conn, %{"user_id" => user_id } = params) do
    if user_id == nil do
      json conn, "this is bad"
    end

    trips = (from t in PlanIt.Trip,
      where: t.user_id == ^user_id,
      select: t)
      |> Repo.all

    json conn, trips
  end



  def index(conn, %{"trip_id" => trip_id } = params) do
    if trip_id == nil do
      json conn, "this is bad"
    end

    card_query = from c in Card,
      order_by: c.start_time,
      preload: [:travel]

    trips = (from t in PlanIt.Trip,
      where: t.id == ^trip_id,

      select: t,
      preload: [card: ^card_query])
      |> Repo.all

      json conn, trips
  end

  def index(conn, _params) do
    error = "this is bad"
    json conn, error
  end


  def create(conn, params) do
      name = Map.get(params, "name")
      user_id = Map.get(params, "user_id")

      Repo.insert(%Trip{
        name: name,
        user_id: user_id
      })

      json conn, []
  end

  def update(conn, %{"id" => trip_id} = params) do
    trip = Repo.get(Trip, trip_id)
    changeset = Trip.changeset(trip, params)

    {message, changeset} = Repo.update(changeset)

    if message == :ok do
      json conn, "ok"
    else
      json conn, "this is bad"
    end
  end
end
