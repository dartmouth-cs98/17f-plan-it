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
      json put_status(conn, 400), "bad parameters"
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
      json put_status(conn, 400), "bad parameters"
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
    error = "no resource available"
    json put_status(conn, 400), error
  end

  # POST - insert new cards
  def create(conn, %{"_json" => cards } = params) do
    changesets = Enum.map(cards, fn(c) ->
      Card.changeset(%Card{}, c)
    end)

    IO.inspect(changesets)

    Enum.each(changesets, fn(c) ->
      case Repo.insert(c) do
        {:ok, changeset } -> nil
        {:error, changeset} -> json put_status(conn, 400), "error: #{inspect changeset.errors}"
      end
    end)

    json conn, "ok"
  end

  # PUT - update an existing card
  def update(conn, %{"id" => card_id} = params) do
    card = Repo.get(Card, card_id)
    changeset = Card.changeset(card, params)

    {message, changeset} = Repo.update(changeset)

    if message == :error do
      error = "error: #{inspect changeset.errors}"
      json put_status(conn, 400), error
    end

    json conn, "ok"
  end
end
