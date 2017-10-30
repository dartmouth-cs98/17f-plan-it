defmodule PlanIt.CardController do
  alias PlanIt.Repo
  alias PlanIt.Card
  alias PlanIt.Travel

  import Ecto.Query
  import Ecto.Changeset

  use PlanIt.Web, :controller

  # GET - get all cards on a specific day of a specific trip
  def index(conn, %{"trip_id" => trip_id, "day" => day_num}) do
    if trip_id == nil or day_num == nil do
      json conn, "this is bad"
    end

    cards = (from c in Card,
      left_join: t in Travel, on: c.travel_id == t.id,
      where: c.trip_id == ^trip_id and c.day_number == ^day_num,
      select: c,
      order_by: [asc: :start_time],
      preload: [:travel]
     ) |> Repo.all

    json conn, cards
  end

  # GET - get all cards on a specific trip
  def index(conn,%{"trip_id" => trip_id} = params) do
    if trip_id == nil do
      json conn, "this is bad"
    end

    cards = (from c in Card,
      left_join: t in Travel, on: c.travel_id == t.id,
      where: c.trip_id == ^trip_id,
      select: c,
      order_by: [asc: :start_time],
      preload: [:travel]
     ) |> Repo.all

    json conn, cards
  end

  def index(conn, _params) do
    error = "this is bad"
    json conn, error
  end

  # POST - insert new cards
  def create(conn, %{"_json" => cards } = params) do
    ecto_cards = Enum.map(cards, fn(c) ->
      %{
      type: Map.get(c, "type"),
      name: Map.get(c, "name"),
      city: Map.get(c, "city"),
      country: Map.get(c, "country"),
      address: Map.get(c, "address"),
      lat: Map.get(c, "lat"),
      long: Map.get(c, "long"),
      start_time: Map.get(c, "start-time") |> Ecto.DateTime.cast!,
      end_time: Map.get(c, "end-time") |> Ecto.DateTime.cast!,
      day_number: Map.get(c, "day-number"),
      travel_id: Map.get(c, "travel-id"),
      trip_id: Map.get(c, "trip-id"),
      inserted_at: Ecto.DateTime.utc,
      updated_at: Ecto.DateTime.utc
      }
      end)

    IO.inspect(ecto_cards)

    Repo.insert_all(Card, ecto_cards)

    json conn, []
  end

  # PUT - update an existing card
  def update(conn, %{"id" => card_id} = params) do
    card = Repo.get(Card, card_id)
    changeset = Card.changeset(card, params)

    {message, changeset} = Repo.update(changeset)

    if message == :ok do
      json conn, "ok"
    else
      json conn, "this is bad"
    end
  end
end
