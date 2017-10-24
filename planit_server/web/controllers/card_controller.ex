defmodule PlanIt.CardController do
  alias PlanIt.Repo
  alias PlanIt.Card
  alias PlanIt.Travel

  import Ecto.Query

  use PlanIt.Web, :controller

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


end
